import "server-only";
import { fallbackCategories } from "@/data/categories";
import { allProducts } from "@/data/products";
import { API_URL } from "@/lib/api";
import type { SiteBundle, StoreSettings } from "@/lib/types";

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
};

const FORMAL_COLORWAYS = [
  { name: "Crisp Royal White", hex: "#FFFFFF", productSlug: "royal-formal-crisp-white-shirt" },
  { name: "Boardroom Sky Blue", hex: "#7DA6CE", productSlug: "executive-french-cuff-blue-shirt" },
  { name: "Banker Navy Stripe", hex: "#2A3C54", productSlug: "boardroom-banker-pinstripe-formal" },
  { name: "Fine Ivory Herringbone", hex: "#EAE2D8", productSlug: "fine-ivory-herringbone-formal" },
  { name: "Executive Charcoal", hex: "#3A3836", productSlug: "midnight-charcoal-formal-shirt" },
];

function fallbackBundle(): SiteBundle {
  return {
    content: {},
    categories: fallbackCategories,
    products: allProducts.map((p) => ({
      ...p,
      colorways: p.category === "formal_shirts" ? FORMAL_COLORWAYS : [],
      customizable: true,
    })),
    settings: DEFAULT_SETTINGS,
    apiAvailable: false,
  };
}

/**
 * Loads CMS content, catalog and store settings for the storefront in a single request.
 * Always fresh (admin edits show up on the next page load). If the API is down the
 * site still renders using the built-in catalog and copy.
 */
export async function getSiteBundle(): Promise<SiteBundle> {
  try {
    const res = await fetch(`${API_URL}/api/site`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const data = await res.json();
    return {
      content: data.content ?? {},
      categories: data.categories ?? [],
      products: data.products ?? [],
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
      apiAvailable: true,
    };
  } catch (err) {
    console.warn(`[site] API unavailable at ${API_URL}, using built-in data:`, (err as Error).message);
    return fallbackBundle();
  }
}
