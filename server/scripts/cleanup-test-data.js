// Removes the records created by `npm run test:api` and `npm run test:e2e`:
//   npm run test:cleanup            (inside server/, or `npm run test:cleanup` from the project root)
//
// It only touches rows that carry the test markers (smoke+<id>@example.com, e2e-*@example.com,
// names starting with "E2E", "smoke test" notes) plus empty bags, so real customer data is kept.
import "dotenv/config";
import { pool, withTransaction } from "../src/db/pool.js";

const TEST_EMAILS = "(email LIKE 'smoke+%@example.com' OR email LIKE 'e2e-%@example.com')";

try {
  const result = await withTransaction(async (c) => {
    const orders = await c.query(`DELETE FROM orders WHERE ${TEST_EMAILS} OR notes = 'smoke test'`);
    const carts = await c.query(
      `DELETE FROM carts WHERE ${TEST_EMAILS}
         OR NOT EXISTS (SELECT 1 FROM cart_items ci WHERE ci.cart_id = carts.id)
         OR (status = 'active' AND EXISTS (
               SELECT 1 FROM cart_items ci JOIN products p ON p.id = ci.product_id
               WHERE ci.cart_id = carts.id AND p.name LIKE 'Smoke %'))`,
    );
    const subscribers = await c.query(`DELETE FROM subscribers WHERE ${TEST_EMAILS}`);
    const inquiries = await c.query(`DELETE FROM inquiries WHERE name LIKE 'E2E %' OR name = 'Smoke' OR ${TEST_EMAILS}`);
    const products = await c.query("DELETE FROM products WHERE name LIKE 'Smoke %'");
    const categories = await c.query("DELETE FROM categories WHERE key LIKE 'smoke\\_%'");
    const users = await c.query("DELETE FROM admin_users WHERE email LIKE 'editor+%@example.com'");
    const media = await c.query("DELETE FROM media WHERE original_name LIKE 'smoke-%'");

    // Restart order numbering if no orders remain.
    const { count } = (await c.query("SELECT count(*) FROM orders")).rows[0];
    if (count === 0) await c.query("SELECT setval('order_number_seq', 100001, false)");

    return {
      orders: orders.rowCount,
      bags: carts.rowCount,
      subscribers: subscribers.rowCount,
      inquiries: inquiries.rowCount,
      products: products.rowCount,
      categories: categories.rowCount,
      users: users.rowCount,
      media: media.rowCount,
    };
  });
  console.log("[cleanup] removed test data:", result);
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
