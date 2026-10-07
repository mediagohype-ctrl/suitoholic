// End-to-end API smoke test.
//   npm run test:api                         (uses http://localhost:4000 and ADMIN_EMAIL/ADMIN_PASSWORD from .env)
//   API_URL=https://api.example.com npm run test:api
//
// It creates temporary products, categories, bags, users, media, etc. and removes them at the end.
// Orders cannot be deleted through the API, so the test orders are left CANCELLED (with a
// "smoke test" note) — run it against a development/staging database, not your live shop.
import "dotenv/config";

const BASE = (process.env.API_URL || "http://localhost:4000").replace(/\/$/, "") + "/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@suitoholic.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";
const RUN = Date.now().toString(36);

let passed = 0;
const failures = [];
const cleanup = [];

async function call(method, path, { body, token, form, raw } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const res = await fetch(BASE + path, {
    method,
    headers,
    body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  if (raw) return { status: res.status, res };
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } catch (err) {
    failures.push({ name, err });
    console.log(`  \x1b[31m✗ ${name}\x1b[0m\n      ${err.message}`);
  }
}

function expect(cond, message) {
  if (!cond) throw new Error(message);
}
function expectStatus(r, status) {
  expect(r.status === status, `expected HTTP ${status}, got ${r.status}: ${JSON.stringify(r.data)?.slice(0, 300)}`);
}

const section = (title) => console.log(`\n\x1b[1m${title}\x1b[0m`);

// ---------------------------------------------------------------------------
section("Health & storefront data");
let site;
await test("GET /health → database up", async () => {
  const r = await call("GET", "/health");
  expectStatus(r, 200);
  expect(r.data.db === "up", "db not up");
});
await test("GET /site returns content, categories, products, settings", async () => {
  const r = await call("GET", "/site");
  expectStatus(r, 200);
  site = r.data;
  for (const k of ["content", "categories", "products", "settings"]) expect(k in site, `missing ${k}`);
  expect(site.products.length > 0, "no products");
  expect(site.categories.length > 0, "no categories");
  expect(/^\D+ [\d,]+/.test(site.products[0].price), `bad price label ${site.products[0].price}`);
});
await test("GET /catalog, /categories, /products", async () => {
  expectStatus(await call("GET", "/catalog"), 200);
  expectStatus(await call("GET", "/categories"), 200);
  const r = await call("GET", `/products?category=${site.categories[0].id}`);
  expectStatus(r, 200);
  expect(r.data.items.every((p) => p.category === site.categories[0].id), "category filter not applied");
});
const sample = () => site.products[0];
await test("GET /products/:slug and /products/:id", async () => {
  expectStatus(await call("GET", `/products/${sample().slug}`), 200);
  const r = await call("GET", `/products/${sample().id}`);
  expectStatus(r, 200);
  expect(r.data.slug === sample().slug, "id lookup mismatch");
});
await test("Unknown product → 404, unknown route → 404", async () => {
  expectStatus(await call("GET", "/products/definitely-not-a-product"), 404);
  expectStatus(await call("GET", "/nope"), 404);
});

// ---------------------------------------------------------------------------
section("Admin authentication");
let token;
await test("Admin route without token → 401", async () => {
  expectStatus(await call("GET", "/admin/dashboard"), 401);
});
await test("Invalid token → 401", async () => {
  expectStatus(await call("GET", "/admin/dashboard", { token: "garbage" }), 401);
});
await test("Wrong password → 401", async () => {
  expectStatus(await call("POST", "/admin/auth/login", { body: { email: ADMIN_EMAIL, password: "wrong-password" } }), 401);
});
await test("Login → token; /auth/me", async () => {
  const r = await call("POST", "/admin/auth/login", { body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } });
  expectStatus(r, 200);
  token = r.data.token;
  const me = await call("GET", "/admin/auth/me", { token });
  expectStatus(me, 200);
  expect(me.data.role === "admin", "not an admin");
});
if (!token) {
  console.log("\nCannot continue without an admin token (check ADMIN_EMAIL / ADMIN_PASSWORD).");
  process.exit(1);
}
const admin = (method, path, opts = {}) => call(method, path, { ...opts, token });

// Store settings are restored at the end.
const originalSettings = (await admin("GET", "/admin/settings")).data;
cleanup.push(() => admin("PUT", "/admin/settings", { body: originalSettings }));

// ---------------------------------------------------------------------------
section("Catalog management (admin)");
const catKey = `smoke_${RUN}`;
let product, stockProduct;
await test("Create category", async () => {
  const r = await admin("POST", "/admin/categories", { body: { key: catKey, title: "Smoke Test Category", showOnHome: false } });
  expectStatus(r, 201);
  cleanup.push(() => admin("DELETE", `/admin/categories/${catKey}`));
});
await test("Create product validation errors → 400 with details", async () => {
  const r = await admin("POST", "/admin/products", { body: { name: "", category: catKey, price: -5 } });
  expectStatus(r, 400);
  expect(Array.isArray(r.data.details) && r.data.details.length >= 2, "expected field details");
});
await test("Create product (auto slug, gallery, colourways)", async () => {
  const r = await admin("POST", "/admin/products", {
    body: {
      name: `Smoke Shirt ${RUN}`,
      category: catKey,
      price: 1000,
      gallery: ["/formal_white_twill.jpg"],
      colorways: [{ name: "White", hex: "#FFFFFF", productSlug: `smoke-shirt-${RUN}` }],
      image: "/formal_white_twill.jpg",
    },
  });
  expectStatus(r, 201);
  product = r.data;
  expect(product.slug === `smoke-shirt-${RUN}`, `unexpected slug ${product.slug}`);
  cleanup.unshift(() => admin("DELETE", `/admin/products/${product.id}`));
});
await test("Duplicate slug → 409", async () => {
  expectStatus(await admin("POST", "/admin/products", { body: { name: `Smoke Shirt ${RUN}`, category: catKey, price: 1 } }), 409);
});
await test("Update product price → storefront shows new price", async () => {
  expectStatus(await admin("PATCH", `/admin/products/${product.id}`, { body: { price: 1500, tag: "SMOKE" } }), 200);
  const pub = await call("GET", `/products/${product.slug}`);
  expect(pub.data.rawPrice === 1500, `storefront price ${pub.data.rawPrice}`);
});
await test("Inactive product hidden from storefront, visible in admin", async () => {
  await admin("PATCH", `/admin/products/${product.id}`, { body: { active: false } });
  expectStatus(await call("GET", `/products/${product.slug}`), 404);
  expectStatus(await admin("GET", `/admin/products/${product.id}`), 200);
  await admin("PATCH", `/admin/products/${product.id}`, { body: { active: true } });
});
await test("Delete category that still has products → 409", async () => {
  expectStatus(await admin("DELETE", `/admin/categories/${catKey}`), 409);
});
await test("Create stock-tracked product (stock 1)", async () => {
  const r = await admin("POST", "/admin/products", { body: { name: `Smoke Limited ${RUN}`, category: catKey, price: 2000, stock: 1 } });
  expectStatus(r, 201);
  stockProduct = r.data;
  cleanup.unshift(() => admin("DELETE", `/admin/products/${stockProduct.id}`));
});

// ---------------------------------------------------------------------------
section("Bag (Add to Bag)");
await admin("PUT", "/admin/settings", {
  body: { customizationFee: 250, shippingFee: 100, freeShippingThreshold: 0, codEnabled: true },
});
let cart;
const bespoke = { chestSize: 40, collarSize: 15.5, shoulderSize: 18, bodyFit: "regular", height: "TALL", sleeveType: "full", collarStyle: "CUTAWAY COLLAR", cuffStyle: "CLASSIC CUFF", pocket: "pocket", initials: "SM", threadColor: "gold" };
await test("Create empty bag", async () => {
  const r = await call("POST", "/cart");
  expectStatus(r, 201);
  cart = r.data;
  expect(cart.items.length === 0 && cart.total === 0, "bag not empty");
});
await test("Add bespoke item → customization fee applied", async () => {
  const r = await call("POST", `/cart/${cart.id}/items`, { body: { productId: product.id, size: "40", customization: bespoke } });
  expectStatus(r, 201);
  expect(r.data.customizationTotal === 250, `customizationTotal ${r.data.customizationTotal}`);
  expect(r.data.items[0].customization.initials === "SM", "customization not stored");
});
await test("Add same standard item twice → merged into one line", async () => {
  await call("POST", `/cart/${cart.id}/items`, { body: { slug: product.slug, size: "42", quantity: 1 } });
  const r = await call("POST", `/cart/${cart.id}/items`, { body: { slug: product.slug, size: "42", quantity: 2 } });
  const std = r.data.items.filter((i) => !i.customization);
  expect(std.length === 1 && std[0].quantity === 3, `standard lines ${JSON.stringify(std.map((i) => i.quantity))}`);
  cart = r.data;
});
await test("Totals = items + bespoke fee + shipping", async () => {
  const expected = 1500 * 4 + 250 + 100;
  expect(cart.total === expected, `total ${cart.total}, expected ${expected}`);
});
await test("Update quantity, then remove a line", async () => {
  const line = cart.items.find((i) => !i.customization);
  let r = await call("PATCH", `/cart/${cart.id}/items/${line.id}`, { body: { quantity: 1 } });
  expectStatus(r, 200);
  r = await call("DELETE", `/cart/${cart.id}/items/${line.id}`);
  expectStatus(r, 200);
  expect(r.data.items.length === 1, "line not removed");
  cart = r.data;
});
await test("Invalid add (no product, qty 99) → 400; unknown product → 404; bad bag id → 404", async () => {
  expectStatus(await call("POST", `/cart/${cart.id}/items`, { body: { quantity: 99 } }), 400);
  expectStatus(await call("POST", `/cart/${cart.id}/items`, { body: { slug: "nope-nope" } }), 404);
  expectStatus(await call("GET", "/cart/not-a-uuid"), 404);
  expectStatus(await call("GET", "/cart/00000000-0000-4000-8000-000000000000"), 404);
});
await test("Stock limit: adding 2 of a product with stock 1 → 409", async () => {
  const c = (await call("POST", "/cart")).data;
  expectStatus(await call("POST", `/cart/${c.id}/items`, { body: { productId: stockProduct.id, quantity: 2 } }), 409);
  cleanup.push(() => admin("DELETE", `/admin/carts/${c.id}`));
});
await test("Admin sees the active bag with its bespoke line", async () => {
  const r = await admin("GET", "/admin/carts?status=active");
  expectStatus(r, 200);
  const row = r.data.items.find((b) => b.id === cart.id);
  expect(row && row.bespokeLines === 1, "bag not listed with bespoke line");
  expect(row.value === 1750, `bag value ${row.value} (expected price + bespoke fee)`);
  expectStatus(await admin("GET", `/admin/carts/${cart.id}`), 200);
});

// ---------------------------------------------------------------------------
section("Checkout & orders");
const customer = { name: "Smoke Tester", email: `smoke+${RUN}@example.com`, phone: "9876543210" };
const address = { line1: "1 Test Lane", city: "Mumbai", state: "Maharashtra", postalCode: "400001" };
let order;
await test("Checkout validation (bad email, missing city) → 400", async () => {
  const r = await call("POST", "/orders", { body: { cartId: cart.id, customer: { ...customer, email: "nope" }, shippingAddress: { ...address, city: "" } } });
  expectStatus(r, 400);
});
await test("Checkout → order created with server-side totals", async () => {
  const r = await call("POST", "/orders", { body: { cartId: cart.id, customer, shippingAddress: address, notes: "smoke test" } });
  expectStatus(r, 201);
  order = r.data;
  expect(/^SUIT-\d+$/.test(order.orderNumber), `order number ${order.orderNumber}`);
  expect(order.total === 1500 + 250 + 100, `order total ${order.total}`);
  expect(order.items[0].customization.threadColor === "gold", "bespoke selections lost");
  expect(order.adminNotes === undefined, "admin notes leaked to customer");
});
await test("Checking out the same bag again → 409; adding to it → 409", async () => {
  expectStatus(await call("POST", "/orders", { body: { cartId: cart.id, customer, shippingAddress: address } }), 409);
  expectStatus(await call("POST", `/cart/${cart.id}/items`, { body: { productId: product.id } }), 409);
});
await test("Empty bag checkout → 400; disabled payment method → 400", async () => {
  const c = (await call("POST", "/cart")).data;
  cleanup.push(() => admin("DELETE", `/admin/carts/${c.id}`));
  expectStatus(await call("POST", "/orders", { body: { cartId: c.id, customer, shippingAddress: address } }), 400);
  await admin("PUT", "/admin/settings", { body: { upiEnabled: false } });
  await call("POST", `/cart/${c.id}/items`, { body: { productId: product.id } });
  expectStatus(await call("POST", "/orders", { body: { cartId: c.id, customer, shippingAddress: address, paymentMethod: "upi" } }), 400);
});
await test("Track order with right email → 200, wrong email → 404", async () => {
  expectStatus(await call("GET", `/orders/${order.orderNumber}?email=${encodeURIComponent(customer.email)}`), 200);
  expectStatus(await call("GET", `/orders/${order.orderNumber}?email=someone@else.com`), 404);
});
let stockOrder;
await test("Stock is decremented on checkout and restored on cancel", async () => {
  const c = (await call("POST", "/cart")).data;
  await call("POST", `/cart/${c.id}/items`, { body: { productId: stockProduct.id, quantity: 1 } });
  const r = await call("POST", "/orders", { body: { cartId: c.id, customer, shippingAddress: address } });
  expectStatus(r, 201);
  stockOrder = r.data;
  let p = await admin("GET", `/admin/products/${stockProduct.id}`);
  expect(p.data.stock === 0, `stock after order ${p.data.stock}`);
  await admin("PATCH", `/admin/orders/${stockOrder.id}`, { body: { status: "cancelled", note: "smoke test" } });
  p = await admin("GET", `/admin/products/${stockProduct.id}`);
  expect(p.data.stock === 1, `stock after cancel ${p.data.stock}`);
});
await test("Admin: list/search orders, view detail", async () => {
  const r = await admin("GET", `/admin/orders?search=${encodeURIComponent(customer.email)}`);
  expectStatus(r, 200);
  expect(r.data.items.some((o) => o.id === order.id), "order not found by search");
  const d = await admin("GET", `/admin/orders/${order.id}`);
  expect(d.data.items.length === 1 && d.data.history.length >= 1, "detail incomplete");
});
await test("Admin: status + payment updates recorded in history", async () => {
  const r = await admin("PATCH", `/admin/orders/${order.id}`, { body: { status: "in_tailoring", paymentStatus: "paid", note: "Cutting started", adminNotes: "VIP" } });
  expectStatus(r, 200);
  expect(r.data.status === "in_tailoring" && r.data.paymentStatus === "paid" && r.data.adminNotes === "VIP", "update not applied");
  expect(r.data.history.some((h) => h.note === "Cutting started"), "status note missing");
  expect(r.data.history.some((h) => /Payment marked paid/.test(h.note)), "payment history missing");
  const t = await call("GET", `/orders/${order.orderNumber}?email=${encodeURIComponent(customer.email)}`);
  expect(t.data.status === "in_tailoring", "customer tracking not updated");
});
await test("Cancelled order cannot be reopened → 409; converted bag cannot be deleted → 404", async () => {
  expectStatus(await admin("PATCH", `/admin/orders/${stockOrder.id}`, { body: { status: "pending" } }), 409);
  expectStatus(await admin("DELETE", `/admin/carts/${cart.id}`), 404);
});
cleanup.push(() => admin("PATCH", `/admin/orders/${order.id}`, { body: { status: "cancelled", note: "smoke test order" } }));
await test("Dashboard reflects orders and bags", async () => {
  const r = await admin("GET", "/admin/dashboard");
  expectStatus(r, 200);
  expect(r.data.orders >= 2 && r.data.revenueByDay.length === 30, "dashboard numbers missing");
});

// ---------------------------------------------------------------------------
section("Page content (CMS)");
const contentKey = "seo";
const originalContent = (await call("GET", "/content")).data[contentKey];
await test("Save content → public /content and /site serve it", async () => {
  expectStatus(await admin("PUT", `/admin/content/${contentKey}`, { body: { data: { title: `Smoke ${RUN}` } } }), 200);
  const pub = await call("GET", "/site");
  expect(pub.data.content[contentKey]?.title === `Smoke ${RUN}`, "content not served");
});
await test("Reset content → override removed", async () => {
  if (originalContent) await admin("PUT", `/admin/content/${contentKey}`, { body: { data: originalContent } });
  else expectStatus(await admin("DELETE", `/admin/content/${contentKey}`), 204);
  const pub = await call("GET", "/content");
  expect(JSON.stringify(pub.data[contentKey]) === JSON.stringify(originalContent), "content not restored");
});
await test("Invalid content key / body → 400", async () => {
  expectStatus(await admin("PUT", "/admin/content/bad key!", { body: { data: {} } }), 400);
  expectStatus(await admin("PUT", `/admin/content/${contentKey}`, { body: { data: "string" } }), 400);
});

// ---------------------------------------------------------------------------
section("Media, inquiries, newsletter");
await test("Upload image → served publicly → delete", async () => {
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
  const form = new FormData();
  form.append("files", new Blob([png], { type: "image/png" }), `smoke-${RUN}.png`);
  const r = await admin("POST", "/admin/media", { form });
  expectStatus(r, 201);
  const file = r.data[0];
  const got = await fetch(file.url);
  expect(got.status === 200 && got.headers.get("content-type") === "image/png", `served ${got.status}`);
  expectStatus(await admin("DELETE", `/admin/media/${file.id}`), 204);
});
await test("Upload disallowed type → 400", async () => {
  const form = new FormData();
  form.append("files", new Blob(["hi"], { type: "text/plain" }), "x.txt");
  expectStatus(await admin("POST", "/admin/media", { form }), 400);
});
await test("Swatch request → appears in admin → update → delete", async () => {
  expectStatus(await call("POST", "/inquiries", { body: { type: "swatch_request", name: "Smoke" } }), 400);
  expectStatus(await call("POST", "/inquiries", { body: { type: "swatch_request", name: "Smoke", phone: "9876543210", subject: `Smoke ${RUN}` } }), 201);
  const list = await admin("GET", `/admin/inquiries?search=${RUN}`);
  const item = list.data.items[0];
  expect(item?.type === "swatch_request", "inquiry not listed");
  expectStatus(await admin("PATCH", `/admin/inquiries/${item.id}`, { body: { status: "closed" } }), 200);
  expectStatus(await admin("DELETE", `/admin/inquiries/${item.id}`), 204);
});
await test("Newsletter subscribe (idempotent) → listed → CSV → delete", async () => {
  const email = `smoke+${RUN}@example.com`;
  expectStatus(await call("POST", "/newsletter", { body: { email: "not-an-email" } }), 400);
  expectStatus(await call("POST", "/newsletter", { body: { email } }), 201);
  expectStatus(await call("POST", "/newsletter", { body: { email: email.toUpperCase() } }), 201);
  const list = await admin("GET", `/admin/subscribers?search=${RUN}`);
  expect(list.data.items.length === 1, `subscribers found ${list.data.items.length}`);
  const csv = await admin("GET", "/admin/subscribers/export", { raw: true });
  expect((await csv.res.text()).includes(email), "CSV missing subscriber");
  expectStatus(await admin("DELETE", `/admin/subscribers/${list.data.items[0].id}`), 204);
});

// ---------------------------------------------------------------------------
section("Settings & users");
await test("Settings validation → 400", async () => {
  expectStatus(await admin("PUT", "/admin/settings", { body: { shippingFee: -1 } }), 400);
});
await test("Editor role: can read, cannot change settings or users", async () => {
  const email = `editor+${RUN}@example.com`;
  const u = await admin("POST", "/admin/users", { body: { name: "Smoke Editor", email, password: "editor-pass-123", role: "editor" } });
  expectStatus(u, 201);
  cleanup.unshift(() => admin("DELETE", `/admin/users/${u.data.id}`));
  const login = await call("POST", "/admin/auth/login", { body: { email, password: "editor-pass-123" } });
  expectStatus(login, 200);
  const et = login.data.token;
  expectStatus(await call("GET", "/admin/products", { token: et }), 200);
  expectStatus(await call("PUT", "/admin/settings", { token: et, body: { shippingFee: 0 } }), 403);
  expectStatus(await call("GET", "/admin/users", { token: et }), 403);
  expectStatus(await call("POST", "/admin/auth/password", { token: et, body: { currentPassword: "editor-pass-123", newPassword: "editor-pass-456" } }), 204);
  expectStatus(await call("POST", "/admin/auth/login", { body: { email, password: "editor-pass-456" } }), 200);
  const dis = await admin("PATCH", `/admin/users/${u.data.id}`, { body: { active: false } });
  expectStatus(dis, 200);
  expectStatus(await call("GET", "/admin/auth/me", { token: et }), 401);
});
await test("Admin cannot delete own account → 409", async () => {
  const me = await admin("GET", "/admin/auth/me");
  expectStatus(await admin("DELETE", `/admin/users/${me.data.id}`), 409);
});

// ---------------------------------------------------------------------------
section("Cleanup");
for (const fn of cleanup) {
  try {
    await fn();
  } catch {
    /* best effort */
  }
}
await test("Temporary products and category removed", async () => {
  expectStatus(await call("GET", `/products/${product?.slug}`), 404);
  expectStatus(await admin("DELETE", `/admin/categories/${catKey}`), 404);
});

console.log(`\n${failures.length ? "\x1b[31m" : "\x1b[32m"}${passed} passed, ${failures.length} failed\x1b[0m`);
process.exit(failures.length ? 1 : 0);
