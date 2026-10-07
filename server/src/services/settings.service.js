import { one, query } from "../db/pool.js";

export const DEFAULT_SETTINGS = {
  storeName: "Suitoholic",
  currencySymbol: "₹",
  currencyCode: "INR",
  // Flat shipping fee; waived when the bag subtotal reaches freeShippingThreshold (0 = always free/flat).
  shippingFee: 0,
  freeShippingThreshold: 0,
  // Added per unit for items ordered with bespoke customization.
  customizationFee: 0,
  codEnabled: true,
  upiEnabled: false,
  upiId: "",
  supportEmail: "care@suitoholic.com",
  supportPhone: "",
  orderNotice: "Every bespoke garment is hand-cut to your measurements and dispatched within 7–10 working days.",
  // Active bags untouched for this many hours are reported as abandoned in the admin.
  abandonedCartHours: 24,
};

const CACHE_MS = 15_000;
let cache = null;
let cachedAt = 0;

export async function getSettings() {
  if (cache && Date.now() - cachedAt < CACHE_MS) return cache;
  const row = await one("SELECT value FROM settings WHERE key = 'store'");
  cache = { ...DEFAULT_SETTINGS, ...(row?.value ?? {}) };
  cachedAt = Date.now();
  return cache;
}

/** Settings safe to expose to the storefront. */
export async function getPublicSettings() {
  const s = await getSettings();
  const { abandonedCartHours, ...rest } = s;
  return rest;
}

export async function updateSettings(patch) {
  const next = { ...(await getSettings()), ...patch };
  await query(
    `INSERT INTO settings (key, value) VALUES ('store', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [next],
  );
  cache = null;
  return getSettings();
}
