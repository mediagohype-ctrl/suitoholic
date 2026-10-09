import { many, one } from "../db/pool.js";
import { getSettings } from "./settings.service.js";

/** Headline numbers and charts for the admin dashboard. */
export async function getDashboard() {
  const settings = await getSettings();
  const hours = Math.max(1, Math.floor(Number(settings.abandonedCartHours) || 24));
  const fee = Math.max(0, Number(settings.customizationFee) || 0);

  const [totals, byStatus, bags, catalog, subscribers, revenueByDay, topProducts, recentOrders] = await Promise.all([
    one(`SELECT
           coalesce(sum(total) FILTER (WHERE status <> 'cancelled'), 0) AS revenue,
           count(*) AS orders,
           count(*) FILTER (WHERE created_at >= now() - interval '30 days') AS orders_30d,
           coalesce(sum(total) FILTER (WHERE status <> 'cancelled' AND created_at >= now() - interval '30 days'), 0) AS revenue_30d,
           coalesce(avg(total) FILTER (WHERE status <> 'cancelled'), 0) AS avg_order_value
         FROM orders`),
    many("SELECT status, count(*) AS count FROM orders GROUP BY status"),
    one(`SELECT
           count(*) FILTER (WHERE NOT stale) AS active,
           count(*) FILTER (WHERE stale) AS abandoned,
           coalesce(sum(value) FILTER (WHERE NOT stale), 0) AS active_value,
           coalesce(sum(value) FILTER (WHERE stale), 0) AS abandoned_value
         FROM (
           SELECT c.updated_at < now() - interval '${hours} hours' AS stale, sum(ci.quantity * (p.price + CASE WHEN ci.customization IS NOT NULL THEN ${fee} ELSE 0 END)) AS value
           FROM carts c JOIN cart_items ci ON ci.cart_id = c.id JOIN products p ON p.id = ci.product_id
           WHERE c.status = 'active' GROUP BY c.id
         ) t`),
    one(`SELECT count(*) AS products,
                count(*) FILTER (WHERE active) AS active_products,
                count(*) FILTER (WHERE stock IS NOT NULL AND stock <= 5) AS low_stock,
                (SELECT count(*) FROM categories) AS categories
         FROM products`),
    one("SELECT count(*) AS count, (SELECT count(*) FROM inquiries WHERE status = 'new') AS new_inquiries FROM subscribers"),
    many(`SELECT to_char(d, 'YYYY-MM-DD') AS date,
                 coalesce(sum(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS revenue,
                 count(o.id) AS orders
          FROM generate_series(date_trunc('day', now()) - interval '29 days', date_trunc('day', now()), interval '1 day') d
          LEFT JOIN orders o ON date_trunc('day', o.created_at) = d
          GROUP BY d ORDER BY d`),
    many(`SELECT oi.product_name AS name, oi.product_slug AS slug, sum(oi.quantity) AS units, sum(oi.line_total) AS revenue
          FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.status <> 'cancelled'
          GROUP BY oi.product_name, oi.product_slug ORDER BY units DESC LIMIT 5`),
    many(`SELECT id, order_number AS "orderNumber", customer_name AS "customerName", total, status, created_at AS "createdAt"
          FROM orders ORDER BY created_at DESC LIMIT 8`),
  ]);

  return {
    currencySymbol: settings.currencySymbol,
    revenue: totals.revenue,
    revenue30d: totals.revenue_30d,
    orders: totals.orders,
    orders30d: totals.orders_30d,
    averageOrderValue: Math.round(totals.avg_order_value),
    ordersByStatus: Object.fromEntries(byStatus.map((r) => [r.status, r.count])),
    bags: {
      active: bags.active,
      abandoned: bags.abandoned,
      activeValue: bags.active_value,
      abandonedValue: bags.abandoned_value,
    },
    catalog: {
      products: catalog.products,
      activeProducts: catalog.active_products,
      lowStock: catalog.low_stock,
      categories: catalog.categories,
    },
    subscribers: subscribers.count,
    newInquiries: subscribers.new_inquiries,
    revenueByDay,
    topProducts,
    recentOrders,
  };
}
