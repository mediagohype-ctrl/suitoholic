import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { Pool } from "pg";

const MIME_MAP: Record<string, string> = {
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

let pool: Pool | null = null;
function getPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

export async function handleMediaRequest(id: number, filename?: string) {
  if (!Number.isInteger(id) || id < 1) {
    return new NextResponse("File not found", { status: 404 });
  }

  // 1. Check if the static file is already in public/api/media
  const publicDir = path.resolve(process.cwd(), "public/api/media", String(id));
  if (fs.existsSync(publicDir)) {
    try {
      const files = fs.readdirSync(publicDir);
      const matched = filename ? files.find((f) => f === filename) : files[0];
      if (matched) {
        const filePath = path.join(publicDir, matched);
        const data = fs.readFileSync(filePath);
        const ext = path.extname(matched).toLowerCase();
        return new NextResponse(data, {
          status: 200,
          headers: {
            "Content-Type": MIME_MAP[ext] || "image/jpeg",
            "Content-Length": String(data.length),
            "Cache-Control": "public, max-age=31536000, immutable",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch {}
  }

  // 2. Check if file is in server/.media-cache
  const cacheDir = path.resolve(process.cwd(), "server/.media-cache");
  if (fs.existsSync(cacheDir)) {
    try {
      const files = fs.readdirSync(cacheDir);
      const matched = files.find((f) => f.startsWith(`${id}-`));
      if (matched) {
        const filePath = path.join(cacheDir, matched);
        const data = fs.readFileSync(filePath);
        const ext = path.extname(matched).toLowerCase();
        return new NextResponse(data, {
          status: 200,
          headers: {
            "Content-Type": MIME_MAP[ext] || "image/jpeg",
            "Content-Length": String(data.length),
            "Cache-Control": "public, max-age=31536000, immutable",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch {}
  }

  // 3. Fallback: Query Neon PostgreSQL database
  const db = getPool();
  if (db) {
    try {
      const res = await db.query(
        "SELECT mime_type, data, size, filename FROM media WHERE id = $1",
        [id]
      );
      if (res.rows.length > 0) {
        const row = res.rows[0];
        try {
          fs.mkdirSync(publicDir, { recursive: true });
          fs.writeFileSync(path.join(publicDir, row.filename), row.data);
        } catch {}

        return new NextResponse(row.data, {
          status: 200,
          headers: {
            "Content-Type": row.mime_type || "image/jpeg",
            "Content-Length": String(row.size),
            "Cache-Control": "public, max-age=31536000, immutable",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    } catch (e: unknown) {
      console.error("[api/media] DB error:", (e as Error).message);
    }
  }

  return new NextResponse("File not found", { status: 404 });
}

