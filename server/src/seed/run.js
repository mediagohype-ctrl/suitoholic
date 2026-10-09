// npm run seed         -> migrate, create the first admin, load the catalog if empty
// npm run seed:reset   -> same, but wipes products/categories/bags/orders first
import { migrate } from "../db/migrate.js";
import { pool } from "../db/pool.js";
import { ensureAdmin, seedCatalog } from "./seed.js";

const reset = process.argv.includes("--reset");

try {
  await migrate();
  await ensureAdmin();
  const seeded = await seedCatalog({ reset });
  if (!seeded) console.log("[seed] catalog already present; use `npm run seed:reset` to reload it");
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
