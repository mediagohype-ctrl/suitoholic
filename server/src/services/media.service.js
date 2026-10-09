import path from "node:path";
import { many, one, query } from "../db/pool.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/format.js";

const toMedia = (r) => ({
  id: r.id,
  filename: r.filename,
  originalName: r.original_name,
  mimeType: r.mime_type,
  size: r.size,
  alt: r.alt,
  url: `${env.publicUrl}/api/media/${r.id}/${r.filename}`,
  createdAt: r.created_at,
});

export async function saveFiles(files) {
  const saved = [];
  for (const f of files) {
    const ext = path.extname(f.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "") || "";
    const base = slugify(path.basename(f.originalname, path.extname(f.originalname))) || "file";
    const row = await one(
      `INSERT INTO media (filename, original_name, mime_type, size, data) VALUES ($1, $2, $3, $4, $5)
       RETURNING id, filename, original_name, mime_type, size, alt, created_at`,
      [`${base}${ext}`, f.originalname, f.mimetype, f.size, f.buffer],
    );
    saved.push(toMedia(row));
  }
  return saved;
}

export async function listMedia({ limit, offset, search }) {
  const params = [];
  let where = "";
  if (search) {
    params.push(`%${search}%`);
    where = "WHERE original_name ILIKE $1 OR filename ILIKE $1";
  }
  const { count: total } = await one(`SELECT count(*) FROM media ${where}`, params);
  params.push(limit, offset);
  const rows = await many(
    `SELECT id, filename, original_name, mime_type, size, alt, created_at FROM media ${where}
     ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  return { total, items: rows.map(toMedia) };
}

export async function getMediaFile(id) {
  const row = await one("SELECT mime_type, data, size, created_at FROM media WHERE id = $1", [id]);
  if (!row) throw ApiError.notFound("File not found");
  return row;
}

export async function deleteMedia(id) {
  const { rowCount } = await query("DELETE FROM media WHERE id = $1", [id]);
  if (!rowCount) throw ApiError.notFound("File not found");
}
