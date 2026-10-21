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
  if (!item) return "/customizer/shirt_model_white.jpg";

  // Check if item has a secondary gallery image that is explicitly a shirt model
  if (item.gallery && item.gallery.length > 1) {
    const galleryModel = item.gallery.find(
      (g) => typeof g === "string" && g.includes("shirt_model_")
    );
    if (galleryModel) return galleryModel;
  }

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

  // 1. Bengal Stripe / Sky Blue Pinstripe / Banker Stripes
  if (
    combined.includes("shirt_3") ||
    combined.includes("bengal_blue") ||
    combined.includes("bengal_stripe") ||
    combined.includes("bengal stripe") ||
    combined.includes("pinstripe") ||
    combined.includes("banker stripe") ||
    combined.includes("banker_stripe") ||
    combined.includes("aegean") ||
    combined.includes("sky blue pinstripe") ||
    combined.includes("navy_stripe") ||
    combined.includes("prod_navy_stripe")
  ) {
    return "/customizer/shirt_model_bengal_blue.jpg";
  }

  // 2. Coral / Rose / Terracotta / Maroon Stripes
  if (
    combined.includes("shirt_1") ||
    combined.includes("coral_stripe") ||
    combined.includes("coral") ||
    combined.includes("maroon") ||
    combined.includes("rose") ||
    combined.includes("terracotta") ||
    combined.includes("sh403_rose") ||
    combined.includes("st16974") ||
    combined.includes("prod_maroon_stripe")
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
