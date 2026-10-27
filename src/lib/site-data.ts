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
