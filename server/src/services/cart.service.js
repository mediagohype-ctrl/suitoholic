import { many, one, query } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";
import { formatPrice, roundMoney } from "../utils/format.js";
import { getSettings } from "./settings.service.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Prices a list of { quantity, unit_price, customization } lines with the store settings.
 * Used by both the bag and checkout so the two can never disagree.
 */
export function priceLines(lines, settings) {
  let subtotal = 0;
  let customizationTotal = 0;
  const priced = lines.map((l) => {
    const customizationFee = l.customization ? Number(settings.customizationFee) || 0 : 0;
    const lineTotal = roundMoney((Number(l.unit_price) + customizationFee) * l.quantity);
    subtotal += Number(l.unit_price) * l.quantity;
    customizationTotal += customizationFee * l.quantity;
    return { ...l, customizationFee, lineTotal };
  });
  subtotal = roundMoney(subtotal);
  customizationTotal = roundMoney(customizationTotal);
  const merchandise = subtotal + customizationTotal;
  const threshold = Number(settings.freeShippingThreshold) || 0;
  const shippingFee =
    priced.length === 0 || (threshold > 0 && merchandise >= threshold) ? 0 : Number(settings.shippingFee) || 0;
  const total = roundMoney(merchandise + shippingFee);
  return { lines: priced, subtotal, customizationTotal, shippingFee, total };
}

function assertCartId(cartId) {
  if (!UUID_RE.test(cartId)) throw ApiError.notFound("Bag not found");
}

async function loadCartRow(cartId, client) {
  assertCartId(cartId);
  const cart = await one("SELECT * FROM carts WHERE id = $1", [cartId], client);
  if (!cart) throw ApiError.notFound("Bag not found");
  return cart;
}

async function requireActiveCart(cartId) {
  const cart = await loadCartRow(cartId);
  if (cart.status !== "active") throw ApiError.conflict("This bag has already been checked out");
  return cart;
}

/** Full bag with live product prices and computed totals. */
export async function getCart(cartId, client) {
  const cart = await loadCartRow(cartId, client);
  const rows = await many(
    `SELECT ci.id, ci.product_id, ci.quantity, ci.size, ci.customization, ci.created_at,
            p.slug, p.name, p.image, p.category_key, p.price AS unit_price, p.active, p.stock
     FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.cart_id = $1 ORDER BY ci.id`,
    [cartId],
    client,
  );
  const settings = await getSettings();
  const priced = priceLines(rows, settings);
  const sym = settings.currencySymbol;

  return {
    id: cart.id,
    status: cart.status,
    email: cart.email,
    createdAt: cart.created_at,
    updatedAt: cart.updated_at,
    items: priced.lines.map((l) => ({
      id: l.id,
      productId: l.product_id,
      slug: l.slug,
      name: l.name,
      image: l.image,
      category: l.category_key,
      quantity: l.quantity,
      size: l.size,
      customization: l.customization,
      unitPrice: l.unit_price,
      customizationFee: l.customizationFee,
      lineTotal: l.lineTotal,
      lineTotalLabel: formatPrice(l.lineTotal, sym),
      available: l.active && (l.stock === null || l.stock >= l.quantity),
    })),
    itemCount: priced.lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: priced.subtotal,
    customizationTotal: priced.customizationTotal,
    shippingFee: priced.shippingFee,
    total: priced.total,
    totalLabel: formatPrice(priced.total, sym),
    currencySymbol: sym,
  };
}

export async function createCart() {
  const { id } = await one("INSERT INTO carts DEFAULT VALUES RETURNING id");
  return getCart(id);
}

async function findProduct({ productId, slug }) {
  const row = productId
    ? await one("SELECT * FROM products WHERE id = $1", [productId])
    : await one("SELECT * FROM products WHERE slug = $1", [slug]);
  if (!row || !row.active) throw ApiError.notFound("This product is no longer available");
  return row;
}

function assertStock(product, quantity) {
  if (product.stock !== null && product.stock < quantity) {
    throw ApiError.conflict(
      product.stock === 0 ? `${product.name} is out of stock` : `Only ${product.stock} of ${product.name} left in stock`,
    );
  }
}

export async function addItem(cartId, { productId, slug, quantity, size, customization }) {
  await requireActiveCart(cartId);
  const product = await findProduct({ productId, slug });
  if (customization && !product.customizable) throw ApiError.badRequest("This product cannot be customised");

  // Standard-size lines of the same product and size are merged; bespoke lines are always separate.
  const existing = customization
    ? null
    : await one(
        "SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2 AND size = $3 AND customization IS NULL",
        [cartId, product.id, size],
      );

  const nextQty = Math.min(20, (existing?.quantity ?? 0) + quantity);
  assertStock(product, nextQty);

  if (existing) {
    await query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [nextQty, existing.id]);
  } else {
    await query(
      "INSERT INTO cart_items (cart_id, product_id, quantity, size, customization) VALUES ($1, $2, $3, $4, $5)",
      [cartId, product.id, quantity, size, customization ? JSON.stringify(customization) : null],
    );
  }
  await query("UPDATE carts SET updated_at = now() WHERE id = $1", [cartId]);
  return getCart(cartId);
}

export async function updateItem(cartId, itemId, { quantity }) {
  await requireActiveCart(cartId);
  const item = await one(
    `SELECT ci.id, p.name, p.stock FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.id = $1 AND ci.cart_id = $2`,
    [itemId, cartId],
  );
  if (!item) throw ApiError.notFound("Item not found in bag");
  assertStock(item, quantity);
  await query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [quantity, itemId]);
  await query("UPDATE carts SET updated_at = now() WHERE id = $1", [cartId]);
  return getCart(cartId);
}

export async function removeItem(cartId, itemId) {
  await requireActiveCart(cartId);
  const { rowCount } = await query("DELETE FROM cart_items WHERE id = $1 AND cart_id = $2", [itemId, cartId]);
  if (!rowCount) throw ApiError.notFound("Item not found in bag");
  await query("UPDATE carts SET updated_at = now() WHERE id = $1", [cartId]);
  return getCart(cartId);
}

export async function clearCart(cartId) {
  await requireActiveCart(cartId);
  await query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
  await query("UPDATE carts SET updated_at = now() WHERE id = $1", [cartId]);
  return getCart(cartId);
}

// ------------------------------------------------------------------- admin

export async function listCartsAdmin({ status, onlyWithItems = true, limit, offset }) {
  const settings = await getSettings();
  const hours = Math.max(1, Math.floor(Number(settings.abandonedCartHours) || 24));
  const stale = `c.updated_at < now() - interval '${hours} hours'`;
  const fee = Math.max(0, Number(settings.customizationFee) || 0);
  const where = [];
  if (status === "abandoned") {
    where.push(`c.status = 'active' AND ${stale}`);
  } else if (status === "active") {
    where.push(`c.status = 'active' AND NOT (${stale})`);
  } else if (status === "converted") {
    where.push(`c.status = 'converted'`);
  }
  if (onlyWithItems) where.push("t.item_count > 0");
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const base = `
    FROM carts c
    LEFT JOIN LATERAL (
      SELECT coalesce(sum(ci.quantity), 0) AS item_count,
             coalesce(sum(ci.quantity * (p.price + CASE WHEN ci.customization IS NOT NULL THEN ${fee} ELSE 0 END)), 0) AS value,
             count(*) FILTER (WHERE ci.customization IS NOT NULL) AS bespoke_lines
      FROM cart_items ci JOIN products p ON p.id = ci.product_id WHERE ci.cart_id = c.id
    ) t ON true
    ${whereSql}`;

  const { count: total } = await one(`SELECT count(*) ${base}`);
  const rows = await many(
    `SELECT c.id, c.status, c.email, c.created_at, c.updated_at, t.item_count, t.value, t.bespoke_lines,
            (c.status = 'active' AND ${stale}) AS abandoned,
            (SELECT order_number FROM orders o WHERE o.cart_id = c.id LIMIT 1) AS order_number
     ${base} ORDER BY c.updated_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
  return {
    total,
    items: rows.map((r) => ({
      id: r.id,
      status: r.abandoned ? "abandoned" : r.status,
      email: r.email,
      itemCount: r.item_count,
      bespokeLines: r.bespoke_lines,
      value: r.value,
      orderNumber: r.order_number,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    })),
  };
}

export async function deleteCart(cartId) {
  assertCartId(cartId);
  const { rowCount } = await query("DELETE FROM carts WHERE id = $1 AND status <> 'converted'", [cartId]);
  if (!rowCount) throw ApiError.notFound("Bag not found, or it was already converted to an order");
}

/** Removes empty bags older than a day — they are created for every visitor. */
export async function pruneEmptyCarts() {
  const { rowCount } = await query(
    `DELETE FROM carts c WHERE c.status = 'active' AND c.updated_at < now() - interval '1 day'
     AND NOT EXISTS (SELECT 1 FROM cart_items ci WHERE ci.cart_id = c.id)`,
  );
  return rowCount;
}
