import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { migrate } from "./db/migrate.js";
import { pool } from "./db/pool.js";
import { ensureAdmin, seedCatalog } from "./seed/seed.js";
import { pruneEmptyCarts } from "./services/cart.service.js";

async function start() {
  if (env.autoMigrate) await migrate();
  if (env.autoSeed) {
    await ensureAdmin();
    await seedCatalog();
  }

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[api] Suitoholic API listening on ${env.publicUrl} (${env.nodeEnv})`);
  });

  const prune = setInterval(() => pruneEmptyCarts().catch((e) => console.error("[cart] prune failed:", e.message)), 6 * 3600_000);
  prune.unref();

  const shutdown = (signal) => {
    console.log(`[api] ${signal} received, shutting down`);
    clearInterval(prune);
    server.close(() => pool.end().finally(() => process.exit(0)));
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

start().catch((err) => {
  console.error("[api] failed to start:", err);
  process.exit(1);
});
