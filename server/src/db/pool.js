import pg from "pg";
import { env } from "../config/env.js";

// Return NUMERIC and BIGINT columns as JS numbers (prices and counts fit safely).
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (v) => (v === null ? null : Number(v)));
pg.types.setTypeParser(pg.types.builtins.INT8, (v) => (v === null ? null : Number(v)));

// An sslmode in the URL decides TLS itself (require/verify-full = encrypted + certificate verified).
// Otherwise TLS is on for Neon hosts or when DB_SSL=true.
const urlSetsSsl = /[?&]sslmode=/i.test(env.databaseUrl);
const needsSsl = env.dbSsl ?? /neon\.tech/i.test(env.databaseUrl);

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: urlSetsSsl ? undefined : needsSsl ? { rejectUnauthorized: true } : undefined,
  // Neon supports SCRAM channel binding; honour channel_binding=require from the URL.
  enableChannelBinding: /[?&]channel_binding=require/i.test(env.databaseUrl),
  max: env.dbPoolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 15_000,
});

pool.on("error", (err) => {
  console.error("[db] idle client error:", err.message);
});

export const query = (text, params) => pool.query(text, params);

export async function one(text, params, client = pool) {
  const { rows } = await client.query(text, params);
  return rows[0] ?? null;
}

export async function many(text, params, client = pool) {
  const { rows } = await client.query(text, params);
  return rows;
}

/** Runs fn(client) inside BEGIN/COMMIT, rolling back on any error. */
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}
