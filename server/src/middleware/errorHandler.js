import { ZodError } from "zod";
import multer from "multer";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Postgres error codes we translate into client errors.
const PG_ERRORS = {
  23505: [409, "A record with this value already exists"],
  23503: [409, "This record is referenced by other data"],
  23514: [400, "A value is outside the allowed range"],
  "22P02": [400, "Invalid input value"],
};

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.code === "LIMIT_FILE_SIZE" ? `File too large (max ${env.maxUploadMb}MB)` : err.message });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON body" });
  }
  if (err?.code && PG_ERRORS[err.code]) {
    const [status, message] = PG_ERRORS[err.code];
    return res.status(status).json({ error: message, details: env.isProd ? undefined : err.detail });
  }

  console.error("[error]", req.method, req.originalUrl, err);
  res.status(500).json({ error: "Internal server error", details: env.isProd ? undefined : err?.message });
}
