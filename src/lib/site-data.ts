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
  partialPaymentEnabled: true,
  advancePaymentPercentage: 20,
};

const FORMAL_COLORWAYS = [
  { name: "Dark Espresso Twill", hex: "#2B1A16", productSlug: "savile-row-dark-espresso-twill" },
  { name: "Navy Bengal Stripe", hex: "#385286", productSlug: "navy-executive-pinstripe-formal" },
  { name: "Sandstone Oatmeal Linen", hex: "#D2C5B5", productSlug: "sandstone-oatmeal-linen-formal" },
  { name: "Terracotta Coral Stripe", hex: "#B86B5A", productSlug: "terracotta-coral-pinstripe-formal" },
  { name: "Crisp Egyptian White", hex: "#F8F8F8", productSlug: "royal-formal-crisp-white-shirt" },
  { name: "Sky Blue Oxford", hex: "#C7DBEC", productSlug: "classic-sky-blue-oxford-formal" },
  { name: "Midnight Navy Solid", hex: "#1C2E52", productSlug: "midnight-navy-corporate-solid" },
  { name: "Anthracite Charcoal Twill", hex: "#4B4D50", productSlug: "anthracite-charcoal-twill-formal" },
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
