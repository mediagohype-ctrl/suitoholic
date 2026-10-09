import { many, one, query } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";
import { paginate } from "../utils/format.js";

const COLUMNS = `id, type, name, email, phone, address, message, subject, status,
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export async function create(req, res) {
  const b = req.body;
  if (!b.email && !b.phone) throw ApiError.badRequest("Please share an email or phone number so we can reach you");
  const row = await one(
    `INSERT INTO inquiries (type, name, email, phone, address, message, subject)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [b.type, b.name, b.email, b.phone, b.address, b.message, b.subject],
  );
  res.status(201).json({ ok: true, id: row.id });
}

export async function adminList(req, res) {
  const q = req.validQuery;
  const { page, limit, offset } = paginate(q);
  const where = [];
  const params = [];
  if (q.status) {
    params.push(q.status);
    where.push(`status = $${params.length}`);
  }
  if (q.category) {
    params.push(q.category);
    where.push(`type = $${params.length}`);
  }
  if (q.search) {
    params.push(`%${q.search}%`);
    const i = params.length;
    where.push(`(name ILIKE $${i} OR email ILIKE $${i} OR phone ILIKE $${i} OR subject ILIKE $${i} OR message ILIKE $${i})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { count: total } = await one(`SELECT count(*) FROM inquiries ${whereSql}`, params);
  params.push(limit, offset);
  const items = await many(
    `SELECT ${COLUMNS} FROM inquiries ${whereSql} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  res.json({ items, total, page, limit });
}

export async function adminUpdate(req, res) {
  const row = await one(`UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING ${COLUMNS}`, [req.body.status, Number(req.params.id)]);
  if (!row) throw ApiError.notFound("Inquiry not found");
  res.json(row);
}

export async function adminDelete(req, res) {
  const { rowCount } = await query("DELETE FROM inquiries WHERE id = $1", [Number(req.params.id)]);
  if (!rowCount) throw ApiError.notFound("Inquiry not found");
  res.status(204).end();
}
