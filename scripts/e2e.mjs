// Browser end-to-end test: plays a customer journey (shop → customizer → bag → checkout →
// tracking) and an admin journey (login → orders → bags → content edits) in real Chrome.
//
//   npm run test:e2e
//
// Needs the API (npm run dev:api) and the site (npm run dev, or next build + next start) running.
// Admin login is read from server/.env (ADMIN_EMAIL / ADMIN_PASSWORD). Override with env vars:
//   SITE_URL, API_URL, CHROME_PATH, ADMIN_EMAIL, ADMIN_PASSWORD
// Screenshots are written to scripts/e2e-shots/. Test data (orders, bags, inquiries, a subscriber)
// is left in the database so you can see it in the admin — run on a dev database / Neon branch.
import { chromium } from "playwright-core";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Minimal .env reader so the admin login matches what the API was started with.
function readEnvFile(file) {
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith("#") && l.includes("="))
      .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
  );
}
const serverEnv = readEnvFile(path.join(ROOT, "server", ".env"));
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || serverEnv.ADMIN_EMAIL || "admin@suitoholic.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || serverEnv.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("ADMIN_PASSWORD not found: set it in server/.env or as an environment variable.");
  process.exit(1);
}

const SITE = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const API = (process.env.API_URL || "http://localhost:4000").replace(/\/$/, "") + "/api";
const SHOTS = path.join(ROOT, "scripts", "e2e-shots") + path.sep;
mkdirSync(SHOTS, { recursive: true });

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome/Edge found. Set CHROME_PATH to your browser executable.");
  process.exit(1);
}

for (const [name, url] of [["API", API + "/health"], ["site", SITE]]) {
  const ok = await fetch(url).then((r) => r.ok).catch(() => false);
  if (!ok) {
    console.error(`${name} is not reachable at ${url}. Start it first (see README).`);
    process.exit(1);
  }
}

const browser = await chromium.launch({ executablePath, headless: process.env.HEADED !== "1" });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(15000);

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text().slice(0, 200)} @ ${page.url()}`);
});
page.on("pageerror", (e) => problems.push(`pageerror: ${e.message.slice(0, 200)} @ ${page.url()}`));
page.on("requestfailed", (r) => {
  // ERR_ABORTED = the browser cancelled a download (e.g. the hero video) because the page changed; not an error.
  if (r.failure()?.errorText === "net::ERR_ABORTED") return;
  if (!r.url().includes("_rsc") && !/favicon/.test(r.url())) problems.push(`requestfailed: ${r.method()} ${r.url()} ${r.failure()?.errorText}`);
});
const apiCalls = [];
page.on("response", (r) => {
  if (r.url().startsWith(API)) apiCalls.push(`${r.request().method()} ${r.url().replace(API, "")} → ${r.status()}`);
});

let passed = 0;
const failed = [];
async function step(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed.push(name);
    console.log(`  ✗ ${name}\n      ${err.message.split("\n")[0]}`);
    await page.screenshot({ path: `${SHOTS}FAIL-${name.replace(/[^a-z0-9]+/gi, "_").slice(0, 50)}.png` }).catch(() => {});
  }
}
const expect = (c, m) => {
  if (!c) throw new Error(m);
};
const bagCount = async () => Number((await page.locator('a[href="/cart"] span').first().innerText()).trim());

console.log("\nCUSTOMER JOURNEY");

await step("Homepage loads collections from the API", async () => {
  await page.goto(SITE + "/");
  await page.getByText("Latest drop").first().waitFor();
  await page.getByText("ROYAL FORMAL CRISP WHITE SHIRT").first().waitFor();
  await page.screenshot({ path: SHOTS + "01-home.png" });
});

await step("Newsletter signup saves a subscriber", async () => {
  const input = page.getByPlaceholder("e.g. name@example.com").first();
  await input.scrollIntoViewIfNeeded();
  await input.fill("e2e-newsletter@example.com");
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByRole("button", { name: /^Subscribe$/ }).first().click();
  await page.getByText(/Thank you for subscribing/).first().waitFor();
});

await step("Shop: category filter + price sort work", async () => {
  await page.goto(SITE + "/shop");
  await page.getByRole("button", { name: "TROUSERS & PANTS" }).first().click();
  await page.waitForURL(/category=trousers/);
  await page.getByRole("button", { name: /SORT BY/ }).click();
  await page.getByRole("button", { name: "PRICE: LOW TO HIGH" }).click();
  const prices = await page.locator("div.hidden.lg\\:grid p.text-sm.font-bold").allInnerTexts();
  const nums = prices.map((p) => Number(p.replace(/[^\d]/g, "")));
  expect(nums.length > 1, `found ${nums.length} prices`);
  expect(nums.every((n, i) => i === 0 || n >= nums[i - 1]), `not sorted: ${nums}`);
  await page.screenshot({ path: SHOTS + "02-shop.png" });
});

await step("Product page → 6-step customizer → ADD TO BAG (bag count 1)", async () => {
  await page.goto(SITE + "/product/royal-formal-crisp-white-shirt");
  await page.getByRole("button", { name: /ADD TO BAG/ }).first().click();
  await page.getByText("SELECT YOUR CHEST SIZE").waitFor();
  await page.getByRole("button", { name: "42", exact: true }).click();
  await page.screenshot({ path: SHOTS + "03-customizer-step1.png" });
  for (let i = 0; i < 5; i++) await page.getByRole("button", { name: /CONTINUE →/ }).click();
  await page.getByText("REVIEW & CONFIRM BESPOKE FIT").waitFor();
  await page.screenshot({ path: SHOTS + "04-customizer-review.png" });
  await page.getByRole("button", { name: /ADD TO BAG WITH CUSTOMIZATION/ }).click();
  await page.getByText(/ADDED TO BAG!/).waitFor();
  expect((await bagCount()) === 1, `bag count ${await bagCount()}`);
});

await step("Complete the look: + ADD TO OUTFIT (bag count 2)", async () => {
  await page.getByRole("button", { name: "+ ADD TO OUTFIT" }).first().click();
  await page.getByText(/ADDED TO YOUR OUTFIT/).waitFor();
  expect((await bagCount()) === 2, `bag count ${await bagCount()}`);
});

await step("Bag page shows bespoke details; quantity +1 updates total", async () => {
  await page.goto(SITE + "/cart");
  await page.getByText("BESPOKE CUSTOMIZED").waitFor();
  await page.getByText("Chest:").first().waitFor();
  const before = await page.locator("aside .font-serif-luxury.text-2xl").innerText();
  await page.getByRole("button", { name: "Increase quantity" }).last().click();
  await page.waitForFunction((b) => document.querySelector("aside .font-serif-luxury.text-2xl")?.textContent !== b, before);
  expect((await bagCount()) === 3, `bag count ${await bagCount()}`);
  await page.screenshot({ path: SHOTS + "05-bag.png", fullPage: true });
});

let orderNumber = "";
await step("Bag survives a reload (stored server-side)", async () => {
  await page.reload();
  await page.getByText("BESPOKE CUSTOMIZED").waitFor();
  expect((await bagCount()) === 3, `bag count after reload ${await bagCount()}`);
});

await step("Checkout → order placed → confirmation page; bag emptied", async () => {
  await page.getByRole("link", { name: /PROCEED TO CHECKOUT/ }).click();
  await page.waitForURL(/\/checkout/);
  await page.getByLabel("Full name").fill("E2E Customer");
  await page.getByLabel("Email").fill("e2e-customer@example.com");
  await page.getByLabel("Phone").fill("9876543210");
  await page.getByLabel("Address", { exact: true }).fill("221B Marine Drive");
  await page.getByLabel("City").fill("Mumbai");
  await page.getByLabel("State").fill("Maharashtra");
  await page.getByLabel("PIN code").fill("400020");
  await page.screenshot({ path: SHOTS + "06-checkout.png", fullPage: true });
  await page.getByRole("button", { name: /PLACE ORDER/ }).click();
  await page.waitForURL(/\/order\/SUIT-/);
  orderNumber = decodeURIComponent(page.url().split("/order/")[1]);
  await page.getByText("YOUR ORDER IS CONFIRMED").waitFor();
  await page.getByText("221B Marine Drive").waitFor();
  expect((await bagCount()) === 0, `bag count after order ${await bagCount()}`);
  await page.screenshot({ path: SHOTS + "07-confirmation.png", fullPage: true });
});

await step("Track order page finds the order", async () => {
  await page.getByRole("link", { name: "TRACK THIS ORDER" }).click();
  await page.waitForURL(/track-order/);
  await page.getByText("ORDER STATUS").waitFor();
  await page.getByText(orderNumber).first().waitFor();
});

await step("Custom Fit page: configure and add to bag", async () => {
  await page.goto(SITE + "/custom-shirt");
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: /CONTINUE/ }).first().click();
  }
  await page.getByRole("button", { name: /ADD TO BAG ✓/ }).click();
  await page.getByText(/ADDED TO YOUR BAG/).first().waitFor();
  expect((await bagCount()) === 1, `bag count ${await bagCount()}`);
  await page.screenshot({ path: SHOTS + "08-custom-fit.png" });
});

// Remember the bag the Custom Fit step created so it can be removed at the end.
const e2eBagId = await page.evaluate(() => localStorage.getItem("suitoholic_cart_id"));

await step("Fabrics: swatch request submits to backend", async () => {
  await page.goto(SITE + "/fabrics");
  await page.getByRole("button", { name: /REQUEST PHYSICAL SWATCH SAMPLE/ }).first().click();
  await page.getByPlaceholder("e.g. Lord Alexander Wright").fill("E2E Swatch");
  await page.getByPlaceholder(/Apartment, Street/).fill("12 Linking Road, Mumbai 400050");
  await page.getByPlaceholder("+91 98765 43210").fill("9123456789");
  await page.getByRole("button", { name: /DISPATCH SWATCH SAMPLE/ }).click();
  await page.getByText("Sample Box Dispatched").waitFor();
});

await step("Contact page (teammate's new design) saves inquiry with real reference", async () => {
  await page.goto(SITE + "/contact");
  await page.getByRole("button", { name: "Private Fitting", exact: true }).first().click();
  await page.getByPlaceholder("e.g. Lord Alexander Wright").fill("E2E Contact");
  await page.getByPlaceholder("e.g. alexander@domain.com").fill("e2e-contact@example.com");
  await page.getByPlaceholder(/Please specify your measurements/).fill("Do you offer home fittings?");
  await page.getByRole("button", { name: /Transmit Private Inquiry/ }).click();
  await page.getByText("Inquiry Received").waitFor();
  const ref = await page.getByText(/^SUI-\d{6}$/).innerText();
  expect(/^SUI-\d{6}$/.test(ref), `reference ${ref}`);
  await page.screenshot({ path: SHOTS + "08b-contact.png" });
});

await step("Homepage: hero colour swatches, dark feature cards, feature bar inside hero", async () => {
  await page.goto(SITE + "/");
  await page.getByText("EFFORTLESSLY ELEGANT").first().waitFor();
  await page.getByRole("button", { name: "Select Sand Beige Linen" }).last().click();
  await page.getByText("Sand Beige Linen").first().waitFor();
  await page.getByRole("link", { name: /PREMIUM\s*FABRICS/ }).first().waitFor();
  const img = await page.locator('img[src="/dark_fabric.jpg"]').count();
  expect(img === 1, "dark fabric card missing");
  await page.screenshot({ path: SHOTS + "00-home-merged.png" });
});

await step("Other pages render: about, faq, returns", async () => {
  for (const p of ["/about", "/faq", "/returns"]) {
    const r = await page.goto(SITE + p);
    expect(r.status() === 200, `${p} → ${r.status()}`);
  }
});

console.log("\nADMIN JOURNEY");

await step("/admin redirects to login; sign in", async () => {
  await page.goto(SITE + "/admin");
  await page.waitForURL(/\/admin\/login/);
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((u) => !u.pathname.includes("/login"));
  await page.getByText(orderNumber).first().waitFor();
  await page.screenshot({ path: SHOTS + "09-admin-dashboard.png", fullPage: true });
});

await step("Admin order detail shows bespoke measurements; update status", async () => {
  await page.getByText(orderNumber).first().click();
  await page.waitForURL(/\/admin\/orders\/\d+/);
  await page.getByText("221B Marine Drive").first().waitFor();
  await page.getByText(/42/).first().waitFor();
  await page.getByLabel("Order status").selectOption("in_tailoring");
  await page.getByLabel("Note for the timeline").fill("Cutting started (e2e)");
  await page.getByRole("button", { name: "Update order" }).click();
  await page.getByText("Cutting started (e2e)").first().waitFor();
  await page.screenshot({ path: SHOTS + "10-admin-order.png", fullPage: true });
  const r = await fetch(`${API}/orders/${orderNumber}?email=e2e-customer@example.com`).then((x) => x.json());
  expect(r.status === "in_tailoring", `customer sees status ${r.status}`);
});

await step("Admin Bags shows the Custom Fit bag", async () => {
  await page.goto(SITE + "/admin/bags");
  await page.getByText(/bespoke/i).first().waitFor();
  await page.screenshot({ path: SHOTS + "11-admin-bags.png", fullPage: true });
});

await step("Admin Inquiries lists swatch + contact; Subscribers lists newsletter", async () => {
  await page.goto(SITE + "/admin/inquiries");
  await page.getByText("Swatch Request").first().waitFor();
  await page.getByText(/Do you offer home fittings\?/).first().waitFor();
  await page.locator("td span", { hasText: "Private Fitting" }).first().waitFor();
  await page.goto(SITE + "/admin/subscribers");
  await page.getByText("e2e-newsletter@example.com").waitFor();
});

await step("Admin edits header text → storefront shows it", async () => {
  await page.goto(SITE + "/admin/content/header");
  const field = page.locator('input[value="Welcome to Suitoholic"]');
  await field.fill("E2E FESTIVE SALE");
  await page.getByRole("button", { name: /^Save/ }).first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: SHOTS + "12-admin-content.png", fullPage: true });
  await page.goto(SITE + "/");
  await page.getByText("E2E FESTIVE SALE").first().waitFor();
});

await step("Admin edits customizer chest sizes → customizer shows new size", async () => {
  await page.goto(SITE + "/admin/content/customizer");
  await page.locator('input[value="Welcome to Suitoholic"]').count(); // noop
  const chestLabel = page.locator('input[value="CHEST SIZE (IN INCHES)"]');
  await chestLabel.fill("CHEST SIZE — E2E");
  await page.getByRole("button", { name: /^Save/ }).first().click();
  await page.waitForTimeout(1200);
  await page.goto(SITE + "/product/royal-formal-crisp-white-shirt");
  await page.getByRole("button", { name: /ADD TO BAG/ }).first().click();
  await page.getByText("CHEST SIZE — E2E").waitFor();
});

await step("Admin edits product price → product page shows it", async () => {
  await page.goto(SITE + "/admin/products/1");
  const price = page.getByLabel("Price", { exact: true });
  await price.waitFor();
  expect((await price.inputValue()) === "2499", `price field ${await price.inputValue()}`);
  await price.fill("2999");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForTimeout(1200);
  await page.goto(SITE + "/product/royal-formal-crisp-white-shirt");
  await page.getByText("₹ 2,999").first().waitFor();
});

await step("Admin pages all render without crashing", async () => {
  for (const p of ["/admin/products", "/admin/categories", "/admin/orders", "/admin/content", "/admin/media", "/admin/settings", "/admin/users", "/admin/account"]) {
    await page.goto(SITE + p);
    await page.waitForLoadState("networkidle");
    const crashed = await page.getByText(/Application error|Unhandled Runtime Error/).count();
    expect(!crashed, `${p} crashed`);
  }
});

// ------------------------------------------------------------------ revert
const tok = (await fetch(`${API}/admin/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }) }).then((r) => r.json())).token;
const H = { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" };
await fetch(`${API}/admin/content/header`, { method: "DELETE", headers: H });
await fetch(`${API}/admin/content/customizer`, { method: "DELETE", headers: H });
await fetch(`${API}/admin/products/1`, { method: "PATCH", headers: H, body: JSON.stringify({ price: 2499 }) });
if (e2eBagId) await fetch(`${API}/admin/carts/${e2eBagId}`, { method: "DELETE", headers: H });

await browser.close();

const unexpected = apiCalls.filter((c) => / → [45]\d\d$/.test(c));
console.log(`\n${passed} passed, ${failed.length} failed`);
console.log(`API calls made by the browser: ${apiCalls.length} (${unexpected.length} non-2xx)`);
unexpected.forEach((c) => console.log("   " + c));
console.log(`Browser console/page errors: ${problems.length}`);
[...new Set(problems)].slice(0, 15).forEach((p) => console.log("   " + p));
process.exit(failed.length ? 1 : 0);
