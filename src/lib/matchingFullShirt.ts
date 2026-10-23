/**
 * Utility to resolve the matching full shirt preview image for any product or fabric swatch.
 * Matches by fabric characteristics, color name, pattern, and imagery.
 */

interface MatchableItem {
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

export function getMatchingFullShirtImage(item?: MatchableItem | null): string {
  if (!item) return "/customizer/shirt_model_espresso.jpg";

  // Check if item has a secondary gallery image that is explicitly a shirt model
  if (item.gallery && item.gallery.length > 1) {
    const galleryModel = item.gallery.find(
      (g) => typeof g === "string" && g.includes("shirt_model_")
    );
    if (galleryModel) return galleryModel;
  }

  const img = (item.image || "").toLowerCase();
  // 1. DIRECT IMAGE MATCHING FIRST (Absolute priority)
  if (img.includes("shirt_2") || img.includes("espresso")) return "/customizer/shirt_model_espresso.jpg";
  if (img.includes("shirt_3") || img.includes("bengal_blue")) return "/customizer/shirt_model_bengal_blue.jpg";
  if (img.includes("shirt_4") || img.includes("sandstone")) return "/customizer/shirt_model_sandstone_linen.jpg";
  if (img.includes("shirt_1") || img.includes("coral")) return "/customizer/shirt_model_coral_stripe.jpg";

  // Combine all textual cues into a lowercase string for unified inspection
  const combined = [
    item.image ?? "",
    item.name ?? "",
    item.title ?? "",
    item.colour ?? "",
    item.color ?? "",
    item.pattern ?? "",
    item.slug ?? "",
    item.category ?? "",
    item.fibre ?? "",
    item.description ?? "",
    ...(item.gallery ?? []),
  ]
    .join(" ")
    .toLowerCase();

  // 1. Rich Espresso / Dark Chocolate Brown
  if (
    combined.includes("shirt_2") ||
    combined.includes("espresso") ||
    combined.includes("chocolate") ||
    combined.includes("bengal-stripe-blue-business-shirt")
  ) {
    return "/customizer/shirt_model_espresso.jpg";
  }

  // 2. Bengal Stripe / Navy Banker Stripes
  if (
    combined.includes("shirt_3") ||
    combined.includes("bengal_blue") ||
    combined.includes("navy_executive") ||
    combined.includes("banker") ||
    combined.includes("bengal")
  ) {
    return "/customizer/shirt_model_bengal_blue.jpg";
  }

  // 3. Sandstone / Oatmeal Linen
  if (
    combined.includes("shirt_4") ||
    combined.includes("sandstone") ||
    combined.includes("oatmeal") ||
    combined.includes("sky-blue-poplin-striped-formal") ||
    combined.includes("linen")
  ) {
    return "/customizer/shirt_model_sandstone_linen.jpg";
  }

  // 4. Coral / Terracotta / Rust Stripes
  if (
    combined.includes("shirt_1") ||
    combined.includes("coral_stripe") ||
    combined.includes("coral") ||
    combined.includes("terracotta") ||
    combined.includes("savile-row-charcoal-pinstripe")
  ) {
    return "/customizer/shirt_model_coral_stripe.jpg";
  }

  // 3. Bordeaux / Wine / Burgundy
  if (
    combined.includes("bordeaux") ||
    combined.includes("wine") ||
    combined.includes("burgundy")
  ) {
    return "/customizer/shirt_model_bordeaux.jpg";
  }

  // 4. Sage / Olive / Green
  if (
    combined.includes("sage") ||
    combined.includes("olive") ||
    combined.includes("green") ||
    combined.includes("mint")
  ) {
    return "/customizer/shirt_model_sage.jpg";
  }

  // 5. Rich Espresso / Dark Chocolate Brown
  if (
    combined.includes("shirt_2") ||
    combined.includes("espresso") ||
    combined.includes("chocolate") ||
    combined.includes("sateen") ||
    combined.includes("coffee") ||
    combined.includes("brown") ||
    combined.includes("espresso_pique")
  ) {
    return "/customizer/shirt_model_espresso.jpg";
  }

  // 6. Charcoal / Black / Dark Grey / Slate / Obsidian
  if (
    combined.includes("charcoal") ||
    combined.includes("black") ||
    combined.includes("obsidian") ||
    combined.includes("slate") ||
    combined.includes("charcoal_boardroom") ||
    combined.includes("dove grey") ||
    combined.includes("dove_grey")
  ) {
    return "/customizer/shirt_model_charcoal.jpg";
  }

  // 7. Navy Solid / Midnight Navy / Dark Blue
  if (
    combined.includes("midnight navy") ||
    combined.includes("navy_solid") ||
    combined.includes("navy solid") ||
    combined.includes("navy wool") ||
    combined.includes("sapphire") ||
    (combined.includes("navy") && !combined.includes("stripe"))
  ) {
    return "/customizer/shirt_model_navy_solid.jpg";
  }

  // 8. Plain Sky Blue / Ice Blue / Light Blue
  if (
    combined.includes("skyblue") ||
    combined.includes("sky blue") ||
    combined.includes("sky_blue") ||
    combined.includes("iceblue") ||
    combined.includes("ice blue") ||
    combined.includes("french_cuff_blue") ||
    combined.includes("glacier")
  ) {
    return "/customizer/shirt_model_skyblue.jpg";
  }

  // 9. Sandstone / Normandy Linen / Oatmeal / Beige / Ivory Herringbone
  if (
    combined.includes("shirt_4") ||
    combined.includes("sandstone") ||
    combined.includes("sand_linen") ||
    combined.includes("sandstone_linen") ||
    combined.includes("superviola") ||
    combined.includes("linen") ||
    combined.includes("oatmeal") ||
    combined.includes("beige") ||
    combined.includes("camel") ||
    combined.includes("tan") ||
    combined.includes("herringbone") ||
    combined.includes("flax")
  ) {
    return "/customizer/shirt_model_sandstone_linen.jpg";
  }

  // 10. Ivory / Cream
  if (
    combined.includes("ivory") ||
    combined.includes("cream") ||
    combined.includes("supima_cream")
  ) {
    return "/customizer/shirt_model_ivory.jpg";
  }

  // 11. Pure Crisp White / Twill / Oxford
  if (
    combined.includes("white") ||
    combined.includes("twill") ||
    combined.includes("oxford") ||
    combined.includes("formal_shirts")
  ) {
    return "/customizer/shirt_model_white.jpg";
  }

  // Fallback to white full shirt
  return "/customizer/shirt_model_white.jpg";
}
