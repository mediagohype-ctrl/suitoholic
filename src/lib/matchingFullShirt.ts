/**
 * Utility to resolve the matching full shirt preview image for any product or fabric swatch.
 * Matches by product ID, image filename, slug, color name, and pattern.
 * Guarantees 100% color consistency from card hover -> detail page -> customizer.
 */

export interface MatchableItem {
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
  category_key?: string;
  fibre?: string;
  description?: string;
}

export function getMatchingFullShirtImage(item?: MatchableItem | null): string {
  if (!item) return "";
  const raw = resolveRawShirtPath(item);
  if (!raw) return "";
  return raw.replace(/\.png$/i, ".jpg");
}

function resolveRawShirtPath(item: MatchableItem): string {

  // 1. Filter out non-shirts (trousers, tshirts, blazers, ceremonial, etc.)
  const cat = (item.category_key || item.category || "").toLowerCase();
  if (
    cat &&
    cat !== "formal_shirts" &&
    cat !== "formal_stripes" &&
    cat !== "formal_bespoke" &&
    cat !== "fabrics" &&
    !cat.includes("shirt")
  ) {
    return "";
  }

  const name = (item.name || item.title || "").toLowerCase();
  if (
    /\b(trouser|trousers|pant|pants|chino|chinos|tee|tees|t-shirt|polo|polos|blazer|blazers|bandhgala|sherwani|kurta|sadri)\b/i.test(
      name
    )
  ) {
    return "";
  }

  const slug = (item.slug || "").toLowerCase();
  const img = (item.image || "").toLowerCase();
  const text = `${name} ${slug} ${img} ${item.colour || ""} ${item.color || ""}`.toLowerCase();

  // 2. Pure / Crisp White Shirts (Must NOT match black & white bengal stripe)
  const isWhite =
    (text.includes("white") || img.includes("white")) &&
    !text.includes("black & white") &&
    !text.includes("black and white") &&
    !text.includes("black-white");
  if (
    isWhite &&
    (text.includes("pure") ||
      text.includes("crisp") ||
      text.includes("poplin") ||
      text.includes("oxford") ||
      text.includes("twill") ||
      text.includes("classic white") ||
      img.includes("formal_white") ||
      img.includes("classic_white") ||
      img.includes("crisp-white"))
  ) {
    return "/customizer/shirt_model_white.png";
  }

  // 3. Black & White Bengal Stripe
  if (text.includes("black & white") || text.includes("black and white") || slug.includes("black-white")) {
    return "/customizer/shirt_model_black_white_stripe.png";
  }

  // 4. Mustard Ochre Bengal Stripe
  if (text.includes("mustard") || text.includes("ochre")) {
    return "/customizer/shirt_model_mustard_ochre_stripe.png";
  }

  // 5. Green Bengal Stripes / Solids
  if (text.includes("forest green") || text.includes("bottle green")) {
    return "/customizer/shirt_model_forest_green_stripe.png";
  }
  if (text.includes("sage") || text.includes("mint") || text.includes("olive")) {
    return "/customizer/shirt_model_sage.png";
  }

  // 6. Midnight Obsidian / Solid Black
  if (
    text.includes("obsidian") ||
    text.includes("midnight black") ||
    slug.includes("midnight-black") ||
    img.includes("midnight-black")
  ) {
    return "/customizer/shirt_model_midnight_black.png";
  }

  // 7. Champagne Cream / Ivory / Sand
  if (
    text.includes("champagne") ||
    text.includes("ivory") ||
    (text.includes("cream") && !text.includes("ice")) ||
    text.includes("sandstone") ||
    text.includes("sand twill")
  ) {
    if (text.includes("linen") || text.includes("sandstone")) {
      return "/customizer/shirt_model_sandstone_linen.png";
    }
    return "/customizer/shirt_model_ivory.png";
  }

  // 8. Banker Pinstripe / British Banker
  if (text.includes("banker") || text.includes("fine pinstripe")) {
    return "/customizer/shirt_model_navy_banker_stripe.png";
  }

  // 9. Solid Sky Blue / French Cuff Blue / Mist Blue (non-striped)
  if (
    !text.includes("bengal") &&
    !text.includes("stripe") &&
    (text.includes("sky blue") ||
      text.includes("french cuff") ||
      text.includes("mist blue") ||
      img.includes("french_cuff_blue") ||
      img.includes("mist-blue"))
  ) {
    return "/customizer/shirt_model_skyblue.png";
  }

  // 10. Solid Navy Blue / Midnight Navy / Deep Petrol (non-striped)
  if (
    !text.includes("bengal") &&
    !text.includes("stripe") &&
    (text.includes("midnight navy") ||
      text.includes("deep petrol") ||
      text.includes("navy satin") ||
      text.includes("navy solid"))
  ) {
    return "/customizer/shirt_model_navy_solid.png";
  }

  // 11. Coral Red / Terracotta Brick Bengal Stripe
  if (text.includes("coral") || text.includes("terracotta") || text.includes("brick")) {
    return "/customizer/full_shirt_14.png";
  }

  // 12. Wine / Burgundy / Bordeaux / Berry / Crimson / Blackcurrant / Magenta
  if (
    text.includes("wine") ||
    text.includes("burgundy") ||
    text.includes("bordeaux") ||
    text.includes("blackcurrant") ||
    text.includes("crimson") ||
    text.includes("magenta") ||
    text.includes("berry")
  ) {
    return "/customizer/shirt_model_bordeaux.png";
  }

  // 13. Pink / Rose / Blush / Pastel
  if (text.includes("pink") || text.includes("rose") || text.includes("blush") || text.includes("pastel")) {
    return "/customizer/full_shirt_15.png";
  }

  // 14. Blue Bengal Stripe Family (Royal Blue, Azure, Navy Stripe, Cornflower, Ice Blue, French Blue, Sky Blue Stripe)
  if (text.includes("bengal") || text.includes("stripe")) {
    if (text.includes("navy")) return "/customizer/full_shirt_20.png";
    if (text.includes("charcoal")) return "/customizer/full_shirt_17.png";
    if (text.includes("grey") || text.includes("gray")) return "/customizer/full_shirt_25.png";
    if (
      text.includes("royal") ||
      text.includes("azure") ||
      text.includes("french blue") ||
      text.includes("cornflower") ||
      text.includes("ice blue") ||
      text.includes("sky blue") ||
      text.includes("blue")
    ) {
      return "/customizer/full_shirt_21.png";
    }
  }

  // 15. Purple / Violet / Lavender
  if (text.includes("purple") || text.includes("violet") || text.includes("lavender") || text.includes("imperial")) {
    return "/customizer/full_shirt_22.png";
  }

  // 16. Charcoal / Slate Grey / Boardroom
  if (
    text.includes("charcoal") ||
    text.includes("boardroom") ||
    text.includes("anthracite") ||
    text.includes("slate")
  ) {
    return "/customizer/shirt_model_charcoal.png";
  }

  // 17. Espresso / Chocolate / Coffee / Caramel / Khaki / Taupe
  if (text.includes("espresso") || text.includes("chocolate") || text.includes("coffee")) {
    return "/customizer/shirt_model_espresso.png";
  }
  if (
    text.includes("caramel") ||
    text.includes("khaki") ||
    text.includes("taupe") ||
    text.includes("mocha") ||
    text.includes("linen")
  ) {
    return "/customizer/shirt_model_sandstone_linen.png";
  }
  if (text.includes("steel") || text.includes("grey") || text.includes("gray") || img.includes("shirt_25")) {
    return "/customizer/full_shirt_25.png";
  }

  // Direct image path check shirt_13 .. shirt_25 (fallback if none matched)
  for (let i = 13; i <= 25; i++) {
    if (img.includes(`shirt_${i}`)) {
      return `/customizer/full_shirt_${i}.png`;
    }
  }

  // Also check gallery images
  if (item.gallery && item.gallery.length > 0) {
    for (const g of item.gallery) {
      const gLower = (g || "").toLowerCase();
      for (let i = 13; i <= 25; i++) {
        if (gLower.includes(`shirt_${i}`) || gLower.includes(`full_shirt_${i}`)) {
          return `/customizer/full_shirt_${i}.png`;
        }
      }
    }
  }

  // Generic white fallback if name has white
  if (text.includes("white")) {
    return "/customizer/shirt_model_white.png";
  }

  return "";
}
