import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { one } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/** Requires a valid "Authorization: Bearer <jwt>" for an active admin user; sets req.admin. */
export async function requireAuth(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized("Session expired, please sign in again");
  }

  const user = await one("SELECT id, name, email, role, active FROM admin_users WHERE id = $1", [payload.sub]);
  if (!user || !user.active) throw ApiError.unauthorized("Account is disabled");
  req.admin = user;
  next();
}

/** Restricts a route to the given roles. Use after requireAuth. */
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.admin?.role)) throw ApiError.forbidden();
    next();
  };
