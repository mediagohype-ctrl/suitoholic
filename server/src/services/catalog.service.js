import { many, one, query } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";
import { formatPrice, slugify } from "../utils/format.js";
import { getSettings } from "./settings.service.js";

// ------------------------------------------------------------------ mapping

export function toCategory(row) {
  return {
    id: row.key,
    dbId: row.id,
    title: row.title,
    shortTitle: row.short_title,
    mobileTitle: row.mobile_title,
    subtitle: row.subtitle,
    homeTitle: row.home_title,
    description: row.description,
    tag: row.tag,
    image: row.image,
    bgImage: row.bg_image,
    showOnHome: row.show_on_home,
    sortOrder: row.sort_order,
    active: row.active,
    productCount: row.product_count,
    updatedAt: row.updated_at,
  };
}

/** Shapes a product row like the storefront's ProductItem (price is the formatted label). */
export function toProduct(row, currencySymbol = "₹") {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_key,
    price: formatPrice(row.price, currencySymbol),
    rawPrice: row.price,
    compareAtPrice: row.compare_at_price,
    subtitle: row.subtitle,
    description: row.description,
    fabric: row.fabric,
    threadCount: row.thread_count,
    collar: row.collar || undefined,
    cuff: row.cuff || undefined,
    fit: row.fit || undefined,
    image: row.image,
    gallery: row.gallery,
    colorways: row.colorways,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    tag: row.tag || undefined,
    stock: row.stock,
    customizable: row.customizable,
    featured: row.featured,
    active: row.active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const CATEGORY_COLUMNS = {
  key: "key",
  title: "title",
  shortTitle: "short_title",
  mobileTitle: "mobile_title",
  subtitle: "subtitle",
  homeTitle: "home_title",
  description: "description",
  tag: "tag",
  image: "image",
  bgImage: "bg_image",
  showOnHome: "show_on_home",
  sortOrder: "sort_order",
  active: "active",
};

const PRODUCT_COLUMNS = {
  slug: "slug",
  name: "name",
  category: "category_key",
  price: "price",
  compareAtPrice: "compare_at_price",
  subtitle: "subtitle",
  description: "description",
  fabric: "fabric",
  threadCount: "thread_count",
  collar: "collar",
  cuff: "cuff",
  fit: "fit",
  image: "image",
  gallery: "gallery",
  colorways: "colorways",
  rating: "rating",
  reviewsCount: "reviews_count",
  tag: "tag",
  stock: "stock",
  customizable: "customizable",
  featured: "featured",
  active: "active",
  sortOrder: "sort_order",
};

const JSON_COLUMNS = new Set(["mobile_title", "gallery", "colorways"]);

/** Builds column/value lists from a camelCase input object for INSERT/UPDATE. */
function toColumns(input, map) {
  const cols = [];
  const vals = [];
  for (const [field, col] of Object.entries(map)) {
    if (input[field] === undefined) continue;
    cols.push(col);
    vals.push(JSON_COLUMNS.has(col) ? JSON.stringify(input[field]) : input[field]);
  }
  return { cols, vals };
}

async function insertRow(table, input, map, client) {
  const { cols, vals } = toColumns(input, map);
  const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
  return one(`INSERT INTO ${table} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`, vals, client);
}

async function updateRow(table, idColumn, id, input, map) {
  const { cols, vals } = toColumns(input, map);
  if (!cols.length) return one(`SELECT * FROM ${table} WHERE ${idColumn} = $1`, [id]);
  const sets = cols.map((c, i) => `${c} = $${i + 1}`).join(", ");
  return one(`UPDATE ${table} SET ${sets} WHERE ${idColumn} = $${cols.length + 1} RETURNING *`, [...vals, id]);
}

// --------------------------------------------------------------- categories

export async function listCategories({ includeInactive = false } = {}) {
  const rows = await many(
    `SELECT c.*, (SELECT count(*) FROM products p WHERE p.category_key = c.key ${includeInactive ? "" : "AND p.active"}) AS product_count
     FROM categories c ${includeInactive ? "" : "WHERE c.active"}
     ORDER BY c.sort_order, c.id`,
  );
  return rows.map(toCategory);
}

export async function getCategory(key) {
  const row = await one("SELECT * FROM categories WHERE key = $1", [key]);
  if (!row) throw ApiError.notFound("Category not found");
  return toCategory(row);
}

export async function createCategory(input, client) {
  const data = { ...input, key: input.key || slugify(input.title).replace(/-/g, "_") };
  return toCategory(await insertRow("categories", data, CATEGORY_COLUMNS, client));
}

export async function updateCategory(key, input) {
  const row = await updateRow("categories", "key", key, input, CATEGORY_COLUMNS);
  if (!row) throw ApiError.notFound("Category not found");
  return toCategory(row);
}

export async function deleteCategory(key) {
  const { count } = await one("SELECT count(*) FROM products WHERE category_key = $1", [key]);
  if (count > 0) throw ApiError.conflict(`Move or delete the ${count} product(s) in this category first`);
  const { rowCount } = await query("DELETE FROM categories WHERE key = $1", [key]);
  if (!rowCount) throw ApiError.notFound("Category not found");
}

// ----------------------------------------------------------------- products

export async function listProducts({ category, featured, search, includeInactive = false, limit, offset } = {}) {
  const where = [];
  const params = [];
  if (!includeInactive) where.push("p.active", "c.active");
  if (category) {
    params.push(category);
    where.push(`p.category_key = $${params.length}`);
  }
  if (featured !== undefined) {
    params.push(featured);
    where.push(`p.featured = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    where.push(`(p.name ILIKE $${params.length} OR p.slug ILIKE $${params.length} OR p.fabric ILIKE $${params.length})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = (await one(`SELECT count(*) FROM products p JOIN categories c ON c.key = p.category_key ${whereSql}`, params)).count;

  let pageSql = "";
  if (limit) {
    params.push(limit, offset || 0);
    pageSql = `LIMIT $${params.length - 1} OFFSET $${params.length}`;
  }
  const rows = await many(
    `SELECT p.* FROM products p JOIN categories c ON c.key = p.category_key
     ${whereSql} ORDER BY c.sort_order, p.sort_order, p.id ${pageSql}`,
    params,
  );
  const { currencySymbol } = await getSettings();
  return { items: rows.map((r) => toProduct(r, currencySymbol)), total };
}

/** Finds a product by numeric id or slug. */
export async function getProduct(idOrSlug, { includeInactive = false } = {}) {
  const isId = /^\d+$/.test(String(idOrSlug));
  const row = await one(
    `SELECT * FROM products WHERE ${isId ? "id = $1" : "slug = $1"} ${includeInactive ? "" : "AND active"}`,
    [isId ? Number(idOrSlug) : idOrSlug],
  );
  if (!row) throw ApiError.notFound("Product not found");
  const { currencySymbol } = await getSettings();
  return toProduct(row, currencySymbol);
}

export async function createProduct(input, client) {
  const data = { ...input, slug: input.slug || slugify(input.name) };
  const row = await insertRow("products", data, PRODUCT_COLUMNS, client);
  const { currencySymbol } = await getSettings();
  return toProduct(row, currencySymbol);
}

export async function updateProduct(id, input) {
  const row = await updateRow("products", "id", id, input, PRODUCT_COLUMNS);
  if (!row) throw ApiError.notFound("Product not found");
  const { currencySymbol } = await getSettings();
  return toProduct(row, currencySymbol);
}

export async function deleteProduct(id) {
  const { rowCount } = await query("DELETE FROM products WHERE id = $1", [id]);
  if (!rowCount) throw ApiError.notFound("Product not found");
}

/** Everything the storefront needs to render the catalog in one call. */
export async function getCatalog() {
  const [categories, { items: products }] = await Promise.all([listCategories(), listProducts()]);
  return { categories, products };
}
