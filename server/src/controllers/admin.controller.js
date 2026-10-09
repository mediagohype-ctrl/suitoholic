import { many, one, query } from "../db/pool.js";
import { signToken } from "../middleware/auth.js";
import { getDashboard } from "../services/dashboard.service.js";
import * as users from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { paginate } from "../utils/format.js";

// ------------------------------------------------------------------- auth

export async function login(req, res) {
  const user = await users.authenticate(req.body.email, req.body.password);
  res.json({ token: signToken(user), user });
}

export async function me(req, res) {
  res.json(req.admin);
}

export async function changePassword(req, res) {
  await users.changePassword(req.admin.id, req.body.currentPassword, req.body.newPassword);
  res.status(204).end();
}

// -------------------------------------------------------------- dashboard

export async function dashboard(req, res) {
  res.json(await getDashboard());
}

// ------------------------------------------------------------------ users

export async function listUsers(req, res) {
  res.json(await users.listUsers());
}

export async function createUser(req, res) {
  res.status(201).json(await users.createUser(req.body));
}

export async function updateUser(req, res) {
  res.json(await users.updateUser(Number(req.params.id), req.body, req.admin.id));
}

export async function deleteUser(req, res) {
  await users.deleteUser(Number(req.params.id), req.admin.id);
  res.status(204).end();
}

// ------------------------------------------------------------- newsletter

export async function subscribe(req, res) {
  await query("INSERT INTO subscribers (email, source) VALUES (lower($1), $2) ON CONFLICT (email) DO NOTHING", [
    req.body.email,
    req.body.source,
  ]);
  res.status(201).json({ ok: true });
}

export async function listSubscribers(req, res) {
  const q = req.validQuery;
  const { page, limit, offset } = paginate(q, { defaultLimit: 50, maxLimit: 500 });
  const params = [];
  let where = "";
  if (q.search) {
    params.push(`%${q.search}%`);
    where = "WHERE email ILIKE $1";
  }
  const { count: total } = await one(`SELECT count(*) FROM subscribers ${where}`, params);
  params.push(limit, offset);
  const items = await many(
    `SELECT id, email, source, created_at AS "createdAt" FROM subscribers ${where}
     ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  res.json({ items, total, page, limit });
}

export async function exportSubscribers(req, res) {
  const rows = await many("SELECT email, source, created_at FROM subscribers ORDER BY created_at");
  const csv = ["email,source,subscribed_at", ...rows.map((r) => `${r.email},${r.source},${r.created_at.toISOString()}`)].join("\n");
  res.set({ "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="subscribers.csv"' }).send(csv);
}

export async function deleteSubscriber(req, res) {
  const { rowCount } = await query("DELETE FROM subscribers WHERE id = $1", [Number(req.params.id)]);
  if (!rowCount) throw ApiError.notFound("Subscriber not found");
  res.status(204).end();
}
