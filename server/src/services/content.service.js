import { many, one, query } from "../db/pool.js";

/** All CMS sections as { [key]: data }. Missing keys fall back to defaults on the frontend. */
export async function getAllContent() {
  const rows = await many("SELECT key, data FROM content_sections ORDER BY key");
  return Object.fromEntries(rows.map((r) => [r.key, r.data]));
}

export async function listContentMeta() {
  return many(
    `SELECT c.key, c.updated_at AS "updatedAt", u.name AS "updatedBy"
     FROM content_sections c LEFT JOIN admin_users u ON u.id = c.updated_by ORDER BY c.key`,
  );
}

export async function getContent(key) {
  const row = await one("SELECT key, data, updated_at FROM content_sections WHERE key = $1", [key]);
  // data: null means the section has never been customised and uses the site's built-in defaults.
  if (!row) return { key, data: null, updatedAt: null };
  return { key: row.key, data: row.data, updatedAt: row.updated_at };
}

export async function saveContent(key, data, adminId) {
  const row = await one(
    `INSERT INTO content_sections (key, data, updated_by) VALUES ($1, $2, $3)
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_by = EXCLUDED.updated_by, updated_at = now()
     RETURNING key, data, updated_at`,
    [key, JSON.stringify(data), adminId ?? null],
  );
  return { key: row.key, data: row.data, updatedAt: row.updated_at };
}

/** Deletes the stored override so the section reverts to the site's built-in defaults. */
export async function resetContent(key) {
  await query("DELETE FROM content_sections WHERE key = $1", [key]);
}
