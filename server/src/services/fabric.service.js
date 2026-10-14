import { many, one, query } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";

export const FABRIC_COLUMNS = {
  code: "code",
  name: "name",
  category: "category",
  categoryLabel: "category_label",
  composition: "composition",
  yarnCount: "yarn_count",
  weave: "weave",
  weight: "weight",
  gsm: "gsm",
  origin: "origin",
  opacity: "opacity",
  breathability: "breathability",
  wrinkleResistance: "wrinkle_resistance",
  image: "image",
  description: "description",
  shortInfo: "short_info",
  price: "price",
  bestFor: "best_for",
  care: "care",
  accentColor: "accent_color",
  active: "active",
  sortOrder: "sort_order",
  rating: "rating",
  reviewsCount: "reviews_count",
  compareAtPrice: "compare_at_price",
};

export function toFabric(row) {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    category: row.category,
    categoryLabel: row.category_label,
    composition: row.composition,
    yarnCount: row.yarn_count,
    weave: row.weave,
    weight: row.weight,
    gsm: row.gsm,
    origin: row.origin,
    opacity: row.opacity,
    breathability: row.breathability,
    wrinkleResistance: row.wrinkle_resistance,
    image: row.image,
    description: row.description,
    shortInfo: row.short_info,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? "",
    rating: Number(row.rating ?? 5),
    reviewsCount: Number(row.reviews_count ?? 0),
    bestFor: row.best_for,
    care: row.care,
    accentColor: row.accent_color,
    active: row.active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toColumns(input, map) {
  const cols = [];
  const vals = [];
  for (const [field, col] of Object.entries(map)) {
    if (input[field] === undefined) continue;
    cols.push(col);
    vals.push(input[field]);
  }
  return { cols, vals };
}

/** Lists fabrics with pagination, category filter and search query. */
export async function listFabrics({ category, search, activeOnly = false, limit = 50, offset = 0 } = {}) {
  const where = [];
  const params = [];

  if (activeOnly) {
    where.push("active = true");
  }
  if (category && category !== "all") {
    params.push(category);
    where.push(`category = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    const idx = params.length;
    where.push(`(name ILIKE $${idx} OR code ILIKE $${idx} OR composition ILIKE $${idx} OR category_label ILIKE $${idx})`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const totalRes = await one(`SELECT count(*) FROM fabrics ${whereSql}`, params);
  const total = Number(totalRes?.count ?? 0);

  params.push(limit, offset);
  const rows = await many(
    `SELECT * FROM fabrics ${whereSql} ORDER BY sort_order ASC, id ASC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return { items: rows.map(toFabric), total };
}

/** Finds a fabric by numeric ID or code (SKU). */
export async function getFabric(idOrCode) {
  const isId = /^\d+$/.test(String(idOrCode));
  const row = await one(
    `SELECT * FROM fabrics WHERE ${isId ? "id = $1" : "code = $1"}`,
    [isId ? Number(idOrCode) : idOrCode],
  );
  if (!row) throw ApiError.notFound("Fabric not found");
  return toFabric(row);
}

/** Creates a new fabric. */
export async function createFabric(input) {
  const cleanCode = (input.code || "").trim().toUpperCase();
  if (!cleanCode) throw ApiError.badRequest("Fabric code is required");

  const existing = await one("SELECT id FROM fabrics WHERE code = $1", [cleanCode]);
  if (existing) throw ApiError.conflict(`Fabric code "${cleanCode}" already exists`);

  const { cols, vals } = toColumns({ ...input, code: cleanCode }, FABRIC_COLUMNS);
  if (!cols.length) throw ApiError.badRequest("No valid fields provided");

  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  const row = await one(
    `INSERT INTO fabrics (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    vals,
  );
  return toFabric(row);
}

/** Updates an existing fabric by ID. */
export async function updateFabric(id, input) {
  if (input.code) {
    input.code = input.code.trim().toUpperCase();
    const existing = await one("SELECT id FROM fabrics WHERE code = $1 AND id <> $2", [input.code, id]);
    if (existing) throw ApiError.conflict(`Fabric code "${input.code}" already exists on another fabric`);
  }

  const { cols, vals } = toColumns(input, FABRIC_COLUMNS);
  if (!cols.length) return getFabric(id);

  const assignments = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
  vals.push(id);
  const row = await one(
    `UPDATE fabrics SET ${assignments}, updated_at = now() WHERE id = $${vals.length} RETURNING *`,
    vals,
  );
  if (!row) throw ApiError.notFound("Fabric not found");
  return toFabric(row);
}

/** Deletes a fabric by ID. */
export async function deleteFabric(id) {
  const { rowCount } = await query("DELETE FROM fabrics WHERE id = $1", [id]);
  if (!rowCount) throw ApiError.notFound("Fabric not found");
}
