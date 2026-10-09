import * as media from "../services/media.service.js";
import { ApiError } from "../utils/ApiError.js";
import { paginate } from "../utils/format.js";

export async function serveFile(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) throw ApiError.notFound("File not found");
  const file = await media.getMediaFile(id);
  res.set({
    "Content-Type": file.mime_type,
    "Content-Length": file.size,
    // Uploads are immutable (a new upload gets a new id), so cache aggressively.
    "Cache-Control": "public, max-age=31536000, immutable",
    "Last-Modified": new Date(file.created_at).toUTCString(),
    "Cross-Origin-Resource-Policy": "cross-origin",
  });
  if (file.mime_type === "image/svg+xml") res.set("Content-Security-Policy", "script-src 'none'; sandbox");
  res.send(file.data);
}

export async function adminList(req, res) {
  const q = req.validQuery;
  const { page, limit, offset } = paginate(q, { defaultLimit: 48, maxLimit: 200 });
  const { items, total } = await media.listMedia({ limit, offset, search: q.search });
  res.json({ items, total, page, limit });
}

export async function adminUpload(req, res) {
  if (!req.files?.length) throw ApiError.badRequest("Attach at least one file in the 'files' field");
  res.status(201).json(await media.saveFiles(req.files));
}

export async function adminDelete(req, res) {
  await media.deleteMedia(Number(req.params.id));
  res.status(204).end();
}
