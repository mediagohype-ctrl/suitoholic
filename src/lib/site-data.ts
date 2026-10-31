import "server-only";
import { Pool } from "pg";
import { fallbackCategories } from "@/data/categories";
import { allProducts, type ProductItem } from "@/data/products";
import { API_URL } from "@/lib/api";
import type { Category, SiteBundle, StoreSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Suitoholic",
  currencySymbol: "₹",
  currencyCode: "INR",
  shippingFee: 0,
  freeShippingThreshold: 0,
  customizationFee: 0,
  codEnabled: true,
  upiEnabled: false,
  upiId: "",
  supportEmail: "care@suitoholic.com",
  supportPhone: "",
  orderNotice: "",
  partialPaymentEnabled: true,
  advancePaymentPercentage: 20,
};

const FORMAL_COLORWAYS = [
  { name: "Azure Sky Blue Stripe", hex: "#7E9CB9", productSlug: "azure-bengal-stripe-formal" },
  { name: "Terracotta Brick Stripe", hex: "#B86B5A", productSlug: "terracotta-brick-bengal-stripe" },
  { name: "Charcoal Executive Pinstripe", hex: "#4B4D50", productSlug: "charcoal-executive-pinstripe-formal" },
  { name: "Navy Banker Stripe", hex: "#162340", productSlug: "navy-executive-bengal-stripe-formal" },
  { name: "Savile Row Dark Espresso", hex: "#281813", productSlug: "savile-row-dark-espresso-twill" },
  { name: "Imperial Violet Stripe", hex: "#5A3D66", productSlug: "imperial-violet-executive-stripe" },
  { name: "Sandstone Oatmeal Linen", hex: "#B5A695", productSlug: "sandstone-oatmeal-linen-formal" },
  { name: "Sage Mint Sartorial Stripe", hex: "#7D9488", productSlug: "sage-mint-sartorial-stripe" },
  { name: "Rose Pastel Pinstripe", hex: "#C49A9A", productSlug: "rose-pastel-pinstripe-formal" },
  { name: "Magenta Wine Royal Stripe", hex: "#8B3A62", productSlug: "magenta-wine-royal-stripe" },
  { name: "Shadow Monochrome Stripe", hex: "#3A3D40", productSlug: "shadow-monochrome-stripe-formal" },
  { name: "Espresso Chocolate Stripe", hex: "#38241D", productSlug: "espresso-chocolate-bengal-stripe" },
  { name: "Steel Grey Royal Stripe", hex: "#7D8187", productSlug: "steel-grey-royal-stripe-formal" },
];

let pool: Pool | null = null;
const NEON_FALLBACK_URL =
  "postgresql://neondb_owner:npg_4xZcCH8IVzqm@ep-square-dream-b4ujdefr-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require";

function getPool(): Pool | null {
  const dbUrl = process.env.DATABASE_URL || NEON_FALLBACK_URL;
  if (!dbUrl) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
  }
  return pool;
}

function formatPrice(val: unknown, symbol = "₹"): string {
  const n = Number(val);
  if (isNaN(n)) return `${symbol} 0`;
  return `${symbol} ${n.toLocaleString("en-IN")}`;
}

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.key || row.id),
    title: String(row.title || ""),
    shortTitle: String(row.short_title || row.title || ""),
    mobileTitle: Array.isArray(row.mobile_title) ? (row.mobile_title as string[]) : [String(row.title || "")],
    subtitle: String(row.subtitle || ""),
    homeTitle: String(row.home_title || row.title || ""),
    description: String(row.description || ""),
    tag: String(row.tag || ""),
    image: String(row.image || ""),
    bgImage: String(row.bg_image || row.image || ""),
    showOnHome: Boolean(row.show_on_home),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    active: Boolean(row.active),
    productCount: typeof row.product_count === "number" ? row.product_count : undefined,
  };
}

function toProduct(row: Record<string, unknown>): ProductItem {
  return {
    id: typeof row.id === "number" ? row.id : Number(row.id),
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    category: String(row.category_key || ""),
    price: formatPrice(row.price),
    rawPrice: Number(row.price) || 0,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    subtitle: String(row.subtitle || ""),
    description: String(row.description || ""),
    fabric: String(row.fabric || ""),
    threadCount: String(row.thread_count || ""),
    collar: row.collar ? String(row.collar) : undefined,
    cuff: row.cuff ? String(row.cuff) : undefined,
    fit: row.fit ? String(row.fit) : undefined,
    image: String(row.image || ""),
    gallery: Array.isArray(row.gallery) && row.gallery.length > 0 ? (row.gallery as string[]) : [String(row.image || "")],
    colorways: Array.isArray(row.colorways) ? row.colorways : [],
    rating: row.rating ? Number(row.rating) : 5,
    reviewsCount: row.reviews_count ? Number(row.reviews_count) : 0,
    tag: row.tag ? String(row.tag) : undefined,
    stock: typeof row.stock === "number" ? row.stock : undefined,
    customizable: row.customizable !== undefined ? Boolean(row.customizable) : true,
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    sortOrder: typeof row.sort_order === "number" ? row.sort_order : 0,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
  } as ProductItem;
}

async function loadFromDb(): Promise<SiteBundle | null> {
  const db = getPool();
  if (!db) return null;
  try {
    const [catRes, prodRes, contentRes, settingsRes] = await Promise.all([
      db.query("SELECT * FROM categories WHERE active = TRUE ORDER BY sort_order ASC, id ASC"),
      db.query("SELECT * FROM products WHERE active = TRUE ORDER BY sort_order ASC, id ASC"),
      db.query("SELECT key, data FROM site_content").catch(() => ({ rows: [] })),
      db.query("SELECT key, value FROM settings").catch(() => ({ rows: [] })),
    ]);

    const categories = catRes.rows.map(toCategory);
    const products = prodRes.rows.map(toProduct);

    const content: Record<string, unknown> = {};
    for (const r of contentRes.rows) {
      content[r.key] = r.data;
    }

    const settings = { ...DEFAULT_SETTINGS };
    for (const r of settingsRes.rows) {
      if (r.key in settings) {
        (settings as Record<string, unknown>)[r.key] = r.value;
      }
    }

    return {
      content,
      categories,
      products,
      settings,
      apiAvailable: true,
    };
  } catch (e) {
    console.warn("[site] DB query failed:", (e as Error).message);
    return null;
  }
}

function fallbackBundle(): SiteBundle {
  return {
    content: {},
    categories: fallbackCategories,
    products: allProducts.map((p) => ({
      ...p,
      colorways: p.category.startsWith("formal") ? FORMAL_COLORWAYS : [],
      customizable: true,
    })),
    settings: DEFAULT_SETTINGS,
    apiAvailable: false,
  };
}

/**
 * Loads CMS content, catalog and store settings for the storefront in a single request.
 * Always fresh (admin edits show up on the next page load). First tries the API if configured,
 * then queries the database directly, and finally falls back to built-in data.
 */
export async function getSiteBundle(): Promise<SiteBundle> {
  if (API_URL) {
    try {
      const res = await fetch(`${API_URL}/api/site`, { cache: "no-store", signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        return {
          content: data.content ?? {},
          categories: data.categories ?? [],
          products: data.products ?? [],
          settings: { ...DEFAULT_SETTINGS, ...data.settings },
          apiAvailable: true,
        };
      }
    } catch {}
  }

  // Direct database query (ensures live products work reliably on Vercel and local dev)
  const fromDb = await loadFromDb();
  if (fromDb && fromDb.products.length > 0) {
    return fromDb;
  }

  return fallbackBundle();
}
