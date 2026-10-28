/**
 * Utility to resolve the matching full shirt preview image for any product or fabric swatch.
 * Matches by product ID, image filename, slug, color name, and pattern.
 * Guarantees 100% color consistency from card hover -> detail page -> customizer.
 */

interface MatchableItem {
  id?: number | string;
  name?: string;
  title?: string;
  image?: string;
  gallery?: string[];
  colour?: string;
  color?: string;
  pattern?: string;
  slug?: string;
  category?: string;
  fibre?: string;
  description?: string;
}

// Canonical 1-to-1 mapping for the 13 authentic catalog shirts:
// Catalog ID -> Shirt Image Number (13 to 25)
const ID_TO_SHIRT_NUM: Record<number, number> = {
  1: 21,  // Azure Sky Blue Bengal Stripe
  2: 14,  // Terracotta Brick Bengal Stripe
  3: 17,  // Charcoal Executive Pinstripe
  4: 20,  // Navy Executive Bengal Stripe
  5: 19,  // Savile Row Dark Espresso Twill
  6: 22,  // Imperial Violet Executive Stripe
  7: 13,  // Sandstone Oatmeal Linen
  8: 18,  // Sage Mint Sartorial Stripe
  9: 15,  // Rose Pastel Pinstripe
  10: 16, // Magenta Wine Royal Stripe
  11: 23, // Shadow Monochrome Stripe
  12: 24, // Espresso Chocolate Bengal Stripe
  13: 25, // Steel Grey Royal Stripe
};

export function getMatchingFullShirtImage(item?: MatchableItem | null): string {
  if (!item) return "";

  // 1. If item is not a shirt (trousers, tshirts, blazers, ceremonial), DO NOT show a shirt on hover!
  const cat = (item.category || "").toLowerCase();
  if (
    cat &&
    cat !== "formal_shirts" &&
    cat !== "formal_stripes" &&
    cat !== "formal_bespoke" &&
    !cat.includes("shirt")
  ) {
    return "";
  }

  // Check if name explicitly denotes non-shirts using whole word matching
  // (CRITICAL: Do NOT use simple substring "tee" which matches "steel"!)
  const name = (item.name || item.title || "").toLowerCase();
  if (
    /\b(trouser|trousers|pant|pants|chino|chinos|tee|tees|t-shirt|polo|polos|blazer|blazers|bandhgala|sherwani|kurta|sadri)\b/i.test(
      name
    )
  ) {
    return "";
  }

  // 2. Direct 1-to-1 match by image filename (e.g. shirt_21.jpg -> full_shirt_21.jpg)
  const img = (item.image || "").toLowerCase();
  for (let i = 13; i <= 25; i++) {
    if (img.includes(`shirt_${i}`)) {
      return `/customizer/full_shirt_${i}.jpg`;
    }
  }

  // Also check gallery images
  if (item.gallery && item.gallery.length > 0) {
    for (const g of item.gallery) {
      const gLower = (g || "").toLowerCase();
      for (let i = 13; i <= 25; i++) {
        if (gLower.includes(`shirt_${i}`) || gLower.includes(`full_shirt_${i}`)) {
          return `/customizer/full_shirt_${i}.jpg`;
        }
      }
    }
  }

  // 3. Match by numeric ID (1 to 13)
  if (typeof item.id === "number" && ID_TO_SHIRT_NUM[item.id]) {
    return `/customizer/full_shirt_${ID_TO_SHIRT_NUM[item.id]}.jpg`;
  }
  if (typeof item.id === "string") {
    const parsed = parseInt(item.id, 10);
    if (!isNaN(parsed) && ID_TO_SHIRT_NUM[parsed]) {
      return `/customizer/full_shirt_${ID_TO_SHIRT_NUM[parsed]}.jpg`;
    }
    for (let i = 13; i <= 25; i++) {
      if (item.id.includes(String(i))) {
        return `/customizer/full_shirt_${i}.jpg`;
      }
    }
  }

  // 4. Exact slug matching
  const slug = (item.slug || "").toLowerCase();
  if (slug.includes("azure") || slug === "azure-bengal-stripe-formal") return "/customizer/full_shirt_21.jpg";
  if (slug.includes("terracotta") || slug.includes("brick")) return "/customizer/full_shirt_14.jpg";
  if (slug.includes("charcoal")) return "/customizer/full_shirt_17.jpg";
  if (slug.includes("navy")) return "/customizer/full_shirt_20.jpg";
  if (slug.includes("savile-row") || (slug.includes("espresso") && !slug.includes("chocolate"))) return "/customizer/full_shirt_19.jpg";
  if (slug.includes("violet") || slug.includes("imperial")) return "/customizer/full_shirt_22.jpg";
  if (slug.includes("sandstone") || slug.includes("linen") || slug.includes("oatmeal")) return "/customizer/full_shirt_13.jpg";
  if (slug.includes("sage") || slug.includes("mint")) return "/customizer/full_shirt_18.jpg";
  if (slug.includes("rose") || slug.includes("pastel")) return "/customizer/full_shirt_15.jpg";
  if (slug.includes("magenta") || slug.includes("wine")) return "/customizer/full_shirt_16.jpg";
  if (slug.includes("shadow") || slug.includes("monochrome")) return "/customizer/full_shirt_23.jpg";
  if (slug.includes("chocolate")) return "/customizer/full_shirt_24.jpg";
  if (slug.includes("steel") || slug.includes("grey") || slug.includes("gray")) return "/customizer/full_shirt_25.jpg";

  // 5. Specific keyword matching on name and title
  const text = `${item.name ?? ""} ${item.title ?? ""} ${item.colour ?? ""} ${item.color ?? ""}`.toLowerCase();
  if (text.includes("terracotta") || text.includes("brick")) return "/customizer/full_shirt_14.jpg";
  if (text.includes("rose") || text.includes("pastel") || text.includes("blush")) return "/customizer/full_shirt_15.jpg";
  if (text.includes("magenta") || text.includes("wine") || text.includes("berry")) return "/customizer/full_shirt_16.jpg";
  if (text.includes("charcoal")) return "/customizer/full_shirt_17.jpg";
  if (text.includes("sage") || text.includes("mint")) return "/customizer/full_shirt_18.jpg";
  if (text.includes("chocolate")) return "/customizer/full_shirt_24.jpg";
  if (text.includes("espresso")) return "/customizer/full_shirt_19.jpg";
  if (text.includes("navy")) return "/customizer/full_shirt_20.jpg";
  if (text.includes("azure") || text.includes("sky blue")) return "/customizer/full_shirt_21.jpg";
  if (text.includes("violet") || text.includes("imperial") || text.includes("purple")) return "/customizer/full_shirt_22.jpg";
  if (text.includes("shadow") || text.includes("monochrome")) return "/customizer/full_shirt_23.jpg";
  if (text.includes("steel") || text.includes("grey") || text.includes("gray")) return "/customizer/full_shirt_25.jpg";
  if (text.includes("sandstone") || text.includes("linen") || text.includes("oatmeal")) return "/customizer/full_shirt_13.jpg";

  // Fallback for shirts only
  return "/customizer/full_shirt_21.jpg";
}
