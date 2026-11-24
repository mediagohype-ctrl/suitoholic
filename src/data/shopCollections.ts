import type { ProductItem } from "@/lib/types";

export const shopCollections = [
  { id: "plain-formal-shirts", title: "Plain Formal Shirts", heroImage: "/banners/shop_hero_banner_hd.jpg" },
  { id: "stripe-cotton-shirts", title: "Stripe Cotton Shirts", heroImage: "/bengal_stripe_flatlay_macro.jpg" },
  { id: "executive-linen-shirts", title: "Executive Linen Shirts", heroImage: "/banners/shop_hero_nature_linen.jpg" },
  { id: "handcrafted-shirts", title: "Handcrafted Shirts", heroImage: "/about_atelier_heritage.jpg" },
] as const;

type ShopCollectionId = (typeof shopCollections)[number]["id"];

const legacyShirtCategories = new Set(["formal_shirts", "formal_stripes", "formal_bespoke"]);

export function isLegacyShirtCategory(category: string) {
  return legacyShirtCategories.has(category);
}

export function shopCategoryHref(id: string) {
  return `/shop?category=${encodeURIComponent(id)}`;
}

export function getShopCollectionId(product: ProductItem): ShopCollectionId | undefined {
  const assigned = shopCollections.find(({ id }) => id === product.category);
  if (assigned) return assigned.id;

  const isLegacyStripe = product.category === "formal_stripes";
  const isFormal = isLegacyShirtCategory(product.category);
  const isShirt = isFormal || (/\bshirts?\b/i.test(product.name) && !/\bt[ -]?shirts?\b/i.test(product.name));
  if (!isShirt) return;

  const fabric = product.fabric?.trim();
  if (/\blinen\b/i.test(`${product.name} ${fabric ?? ""}`)) return "executive-linen-shirts";

  const design = `${product.name} ${product.subtitle} ${product.slug}`;
  const isStriped = /\b(?:stripes?|striped|pinstripes?|pinstriped)\b/i.test(design);
  // Older striped cotton shirts can have a blank fabric field even when catalogued as cotton.
  const isCotton = fabric
    ? /\bcotton\b/i.test(fabric)
    : isLegacyStripe || /\bcotton\b/i.test(`${product.name} ${product.subtitle} ${product.description}`);
  if (isStriped && isCotton) return "stripe-cotton-shirts";

  const workmanship = `${product.name} ${product.subtitle} ${product.description} ${product.tag ?? ""}`;
  if (/\b(?:hand[ -]?(?:crafted|stitched|finished|embroidered|made)|hand\s+(?:crafting|stitching|finishing|embroidery))\b/i.test(workmanship)) {
    return "handcrafted-shirts";
  }

  if (isFormal && !isStriped && !/\b(?:checks?|checked|checkered|plaid|printed|patterned|houndstooth)\b/i.test(design)) {
    return "plain-formal-shirts";
  }
}
