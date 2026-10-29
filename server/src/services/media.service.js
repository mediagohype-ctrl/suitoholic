import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { many, one, query } from "../db/pool.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { slugify } from "../utils/format.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, "../../.media-cache");

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// In-memory cache for media files to avoid repeated round trips to Neon
const fileCache = new Map();

const MIME_MAP = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

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
  ensureCacheDir();
  const saved = [];
  for (const f of files) {
    const ext = path.extname(f.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "") || "";
    const base = slugify(path.basename(f.originalname, path.extname(f.originalname))) || "file";
    const row = await one(
      `INSERT INTO media (filename, original_name, mime_type, size, data) VALUES ($1, $2, $3, $4, $5)
       RETURNING id, filename, original_name, mime_type, size, alt, created_at`,
      [`${base}${ext}`, f.originalname, f.mimetype, f.size, f.buffer],
    );
    const diskPath = path.join(CACHE_DIR, `${row.id}-${row.filename}`);
    try {
      fs.writeFileSync(diskPath, f.buffer);
    } catch (e) {
      console.warn("Failed to write to media cache:", e.message);
    }
    fileCache.set(row.id, {
      mime_type: f.mimetype,
      data: f.buffer,
      size: f.size,
      created_at: row.created_at,
      filePath: diskPath,
    });
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
  if (fileCache.has(id)) {
    const cached = fileCache.get(id);
    if (cached.filePath && fs.existsSync(cached.filePath)) {
      return cached;
    }
    if (cached.data) {
      return cached;
    }
  }

  ensureCacheDir();
  // 1. Check if file is already cached on local disk
  try {
    const entries = fs.readdirSync(CACHE_DIR);
    const match = entries.find((f) => f.startsWith(`${id}-`));
    if (match) {
      const diskPath = path.join(CACHE_DIR, match);
      const ext = path.extname(match).toLowerCase();
      const stat = fs.statSync(diskPath);
      const item = {
        id,
        mime_type: MIME_MAP[ext] || "application/octet-stream",
        size: stat.size,
        created_at: stat.birthtime || stat.mtime,
        filePath: diskPath,
      };
      if (fileCache.size > 200) {
        const oldestKey = fileCache.keys().next().value;
        fileCache.delete(oldestKey);
      }
      fileCache.set(id, item);
      return item;
    }
  } catch (err) {
    console.warn("Disk cache check error:", err.message);
  }

  // 2. Fallback to database query if not in cache
  const row = await one("SELECT mime_type, data, size, created_at, filename FROM media WHERE id = $1", [id]);
  if (!row) throw ApiError.notFound("File not found");

  const diskPath = path.join(CACHE_DIR, `${id}-${row.filename}`);
  try {
    if (row.data) {
      fs.writeFileSync(diskPath, row.data);
      row.filePath = diskPath;
    }
  } catch (e) {
    console.warn("Failed to persist to media cache:", e.message);
  }

  if (fileCache.size > 200) {
    const oldestKey = fileCache.keys().next().value;
    fileCache.delete(oldestKey);
  }
  fileCache.set(id, row);
  return row;
}

export async function deleteMedia(id) {
  fileCache.delete(id);
  ensureCacheDir();
  try {
    const entries = fs.readdirSync(CACHE_DIR);
    const matches = entries.filter((f) => f.startsWith(`${id}-`));
    for (const m of matches) {
      fs.unlinkSync(path.join(CACHE_DIR, m));
    }
  } catch (err) {
    // ignore
  }
  const { rowCount } = await query("DELETE FROM media WHERE id = $1", [id]);
  if (!rowCount) throw ApiError.notFound("File not found");
}
