import { readFile } from "node:fs/promises";
import { env } from "../config/env.js";
import { one, withTransaction } from "../db/pool.js";
import { createCategory, createProduct } from "../services/catalog.service.js";
import { getSettings } from "../services/settings.service.js";
import { hashPassword } from "../services/user.service.js";

const load = async (name) => JSON.parse(await readFile(new URL(`./data/${name}.json`, import.meta.url), "utf8"));

/** Creates the first admin account from ADMIN_EMAIL / ADMIN_PASSWORD when no admin exists. */
export async function ensureAdmin({ log = console.log } = {}) {
  const { count } = await one("SELECT count(*) FROM admin_users");
  if (count > 0) return;
  if (!env.adminPassword) {
    log("[seed] no admin users exist; set ADMIN_EMAIL and ADMIN_PASSWORD and restart to create one");
    return;
  }
  await one("INSERT INTO admin_users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin') RETURNING id", [
    env.adminName,
    env.adminEmail,
    await hashPassword(env.adminPassword),
  ]);
  log(`[seed] created admin user ${env.adminEmail}`);
}

/** Loads the original storefront catalog when the database has no categories yet. */
export async function seedCatalog({ log = console.log, reset = false } = {}) {
  const { count } = await one("SELECT count(*) FROM categories");
  if (count > 0 && !reset) return false;

  const [categories, products] = await Promise.all([load("categories"), load("products")]);
  await getSettings(); // warm the cache so the transaction below never waits on a second connection
  await withTransaction(async (client) => {
    if (reset) {
      await client.query("TRUNCATE order_items, orders, cart_items, carts, products, categories RESTART IDENTITY CASCADE");
    }
    for (const c of categories) await createCategory(c, client);
    for (const p of products) {
      const { id, ...rest } = p;
      // Keep the original numeric ids so existing /product/<id> links still work.
      await client.query("SELECT setval(pg_get_serial_sequence('products', 'id'), $1, false)", [id]);
      await createProduct(rest, client);
    }
    await client.query("SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT max(id) FROM products))");
  });
  log(`[seed] loaded ${categories.length} categories and ${products.length} products`);
  return true;
}
