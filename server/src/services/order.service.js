import { many, one, withTransaction } from "../db/pool.js";
import { ApiError } from "../utils/ApiError.js";
import { formatPrice } from "../utils/format.js";
import { priceLines } from "./cart.service.js";
import { getSettings } from "./settings.service.js";

export const ORDER_STATUSES = ["pending", "confirmed", "in_tailoring", "shipped", "delivered", "cancelled"];
export const PAYMENT_STATUSES = ["pending", "paid", "refunded", "failed"];

function toOrder(row, sym = "₹") {
  return {
    id: row.id,
    orderNumber: row.order_number,
    cartId: row.cart_id,
    customer: { name: row.customer_name, email: row.email, phone: row.phone },
    shippingAddress: row.shipping_address,
    subtotal: row.subtotal,
    customizationTotal: row.customization_total,
    shippingFee: row.shipping_fee,
    discount: row.discount,
    total: row.total,
    totalLabel: formatPrice(row.total, sym),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    status: row.status,
    notes: row.notes,
    adminNotes: row.admin_notes,
    itemCount: row.item_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toOrderItem(r) {
  return {
    id: r.id,
    productId: r.product_id,
    slug: r.product_slug,
    name: r.product_name,
    image: r.image,
    quantity: r.quantity,
    size: r.size,
    customization: r.customization,
    unitPrice: r.unit_price,
    customizationFee: r.customization_fee,
    lineTotal: r.line_total,
  };
}

async function loadOrder(where, params, { withAdminFields = true } = {}) {
  const row = await one(`SELECT * FROM orders WHERE ${where}`, params);
  if (!row) throw ApiError.notFound("Order not found");
  const [items, history, settings] = await Promise.all([
    many("SELECT * FROM order_items WHERE order_id = $1 ORDER BY id", [row.id]),
    many("SELECT status, note, changed_by, created_at FROM order_status_history WHERE order_id = $1 ORDER BY created_at, id", [row.id]),
    getSettings(),
  ]);
  const order = toOrder(row, settings.currencySymbol);
  order.items = items.map(toOrderItem);
  order.history = history.map((h) => ({ status: h.status, note: h.note, changedBy: h.changed_by, createdAt: h.created_at }));
  if (!withAdminFields) {
    delete order.adminNotes;
    delete order.cartId;
    order.history = order.history.map(({ changedBy, ...h }) => h);
  }
  return order;
}

/** Converts an active bag into an order. Prices and stock are re-checked under row locks. */
export async function checkout({ cartId, customer, shippingAddress, paymentMethod, notes }) {
  const settings = await getSettings();
  const allowed = [settings.codEnabled && "cod", settings.upiEnabled && "upi"].filter(Boolean);
  if (!allowed.includes(paymentMethod)) throw ApiError.badRequest("This payment method is not available");

  const orderId = await withTransaction(async (client) => {
    const cart = await one("SELECT * FROM carts WHERE id = $1 FOR UPDATE", [cartId], client);
    if (!cart) throw ApiError.notFound("Bag not found");
    if (cart.status !== "active") throw ApiError.conflict("This bag has already been checked out");

    const lines = await many(
      `SELECT ci.id, ci.product_id, ci.quantity, ci.size, ci.customization,
              p.slug, p.name, p.image, p.price AS unit_price, p.active, p.stock
       FROM cart_items ci JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = $1 ORDER BY ci.id FOR UPDATE OF p`,
      [cartId],
      client,
    );
    if (!lines.length) throw ApiError.badRequest("Your bag is empty");

    // Stock is checked per product across all lines (a product can be in the bag several times).
    const needed = new Map();
    for (const l of lines) {
      if (!l.active) throw ApiError.conflict(`${l.name} is no longer available. Please remove it from your bag.`);
      needed.set(l.product_id, (needed.get(l.product_id) ?? 0) + l.quantity);
    }
    for (const l of lines) {
      if (l.stock !== null && l.stock < needed.get(l.product_id)) {
        throw ApiError.conflict(`Only ${l.stock} of ${l.name} left in stock`);
      }
    }
    for (const [productId, qty] of needed) {
      await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock IS NOT NULL", [qty, productId]);
    }

    const priced = priceLines(lines, settings);
    const order = await one(
      `INSERT INTO orders (cart_id, customer_name, email, phone, shipping_address, subtotal, customization_total,
                           shipping_fee, total, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        cartId,
        customer.name,
        customer.email.toLowerCase(),
        customer.phone,
        JSON.stringify(shippingAddress),
        priced.subtotal,
        priced.customizationTotal,
        priced.shippingFee,
        priced.total,
        paymentMethod,
        notes,
      ],
      client,
    );

    for (const l of priced.lines) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_slug, product_name, image, quantity, size,
                                  customization, unit_price, customization_fee, line_total)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          order.id,
          l.product_id,
          l.slug,
          l.name,
          l.image,
          l.quantity,
          l.size,
          l.customization ? JSON.stringify(l.customization) : null,
          l.unit_price,
          l.customizationFee,
          l.lineTotal,
        ],
      );
    }
    await client.query(
      "INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, 'pending', 'Order placed', 'customer')",
      [order.id],
    );
    await client.query("UPDATE carts SET status = 'converted', email = $2 WHERE id = $1", [cartId, customer.email.toLowerCase()]);
    return order.id;
  });

  return loadOrder("id = $1", [orderId], { withAdminFields: false });
}

/** Customer-facing order lookup; the email must match the order. */
export async function trackOrder(orderNumber, email) {
  const order = await loadOrder("order_number = $1 AND lower(email) = lower($2)", [orderNumber.toUpperCase(), email], {
    withAdminFields: false,
  });
  return order;
}

// ------------------------------------------------------------------- admin

export async function listOrders({ status, search, limit, offset }) {
  const where = [];
  const params = [];
  if (status) {
    params.push(status);
    where.push(`o.status = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    const i = params.length;
    where.push(`(o.order_number ILIKE $${i} OR o.customer_name ILIKE $${i} OR o.email ILIKE $${i} OR o.phone ILIKE $${i})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const { count: total } = await one(`SELECT count(*) FROM orders o ${whereSql}`, params);
  params.push(limit, offset);
  const rows = await many(
    `SELECT o.*, (SELECT coalesce(sum(quantity), 0) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
     FROM orders o ${whereSql} ORDER BY o.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  const { currencySymbol } = await getSettings();
  return { total, items: rows.map((r) => toOrder(r, currencySymbol)) };
}

export const getOrder = (id) => loadOrder("id = $1", [id]);

export async function updateOrder(id, { status, paymentStatus, adminNotes, note }, adminName) {
  await withTransaction(async (client) => {
    const order = await one("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [id], client);
    if (!order) throw ApiError.notFound("Order not found");

    if (status && status !== order.status) {
      if (order.status === "cancelled") throw ApiError.conflict("Cancelled orders cannot be reopened");
      // Cancelling returns stock for products that track inventory.
      if (status === "cancelled") {
        await client.query(
          `UPDATE products p SET stock = p.stock + oi.quantity
           FROM order_items oi WHERE oi.order_id = $1 AND oi.product_id = p.id AND p.stock IS NOT NULL`,
          [id],
        );
      }
      await client.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
      await client.query("INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, $2, $3, $4)", [
        id,
        status,
        note || "",
        adminName,
      ]);
    } else if (note) {
      await client.query("INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, $2, $3, $4)", [
        id,
        order.status,
        note,
        adminName,
      ]);
    }
    if (paymentStatus && paymentStatus !== order.payment_status) {
      await client.query("UPDATE orders SET payment_status = $1 WHERE id = $2", [paymentStatus, id]);
      await client.query("INSERT INTO order_status_history (order_id, status, note, changed_by) VALUES ($1, $2, $3, $4)", [
        id,
        status ?? order.status,
        `Payment marked ${paymentStatus}`,
        adminName,
      ]);
    }
    if (adminNotes !== undefined) await client.query("UPDATE orders SET admin_notes = $1 WHERE id = $2", [adminNotes, id]);
  });
  return getOrder(id);
}
