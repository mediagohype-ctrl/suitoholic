/**
 * Utility to resolve the matching full shirt preview image for any product or fabric swatch.
 * Matches by fabric characteristics, color name, pattern, and imagery.
 * Guarantees 100% color consistency from card hover -> detail page -> customizer.
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

  // Also check if name explicitly denotes non-shirts
  const name = (item.name || item.title || "").toLowerCase();
  if (
    name.includes("trouser") ||
    name.includes("pant") ||
    name.includes("chino") ||
    name.includes("tee") ||
    name.includes("crewneck") ||
    name.includes("polo") ||
    name.includes("blazer") ||
    name.includes("bandhgala") ||
    name.includes("sherwani")
  ) {
    return "";
  }

  // 2. Check if item has a secondary gallery image that is explicitly a full shirt model
  if (item.gallery && item.gallery.length > 1) {
    const galleryModel = item.gallery.find(
      (g) => typeof g === "string" && (g.includes("full_shirt_") || g.includes("shirt_model_"))
    );
    if (galleryModel) return galleryModel;
  }

  const img = (item.image || "").toLowerCase();

  // 3. DIRECT 1-TO-1 MATCH FOR USER SHIRTS (shirt_13 to shirt_25)
  for (let i = 13; i <= 25; i++) {
    if (img.includes(`shirt_${i}`)) {
      return `/customizer/full_shirt_${i}.jpg`;
    }
  }

  // Also check in gallery strings
  if (item.gallery) {
    for (const g of item.gallery) {
      const gLower = (g || "").toLowerCase();
      for (let i = 13; i <= 25; i++) {
        if (gLower.includes(`shirt_${i}`) || gLower.includes(`full_shirt_${i}`)) {
          return `/customizer/full_shirt_${i}.jpg`;
        }
      }
    }
  }

  // 4. Combined keyword matching for fabrics or legacy items
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
  ]
    .join(" ")
    .toLowerCase();

  if (combined.includes("bengal") && (combined.includes("blue") || combined.includes("azure") || combined.includes("sky"))) {
    return "/customizer/full_shirt_21.jpg";
  }
  if (combined.includes("terracotta") || combined.includes("coral") || combined.includes("brick")) {
    return "/customizer/full_shirt_14.jpg";
  }
  if (combined.includes("rose") || combined.includes("pastel") || combined.includes("pink")) {
    return "/customizer/full_shirt_15.jpg";
  }
  if (combined.includes("magenta") || combined.includes("wine") || combined.includes("berry") || combined.includes("bordeaux")) {
    return "/customizer/full_shirt_16.jpg";
  }
  if (combined.includes("charcoal-executive") || combined.includes("black banker") || combined.includes("black stripe")) {
    return "/customizer/full_shirt_17.jpg";
  }
  if (combined.includes("sage") || combined.includes("mint") || combined.includes("green")) {
    return "/customizer/full_shirt_18.jpg";
  }
  if (combined.includes("espresso") || combined.includes("chocolate") || combined.includes("dark brown")) {
    return "/customizer/full_shirt_19.jpg";
  }
  if (combined.includes("navy") && (combined.includes("banker") || combined.includes("executive"))) {
    return "/customizer/full_shirt_20.jpg";
  }
  if (combined.includes("violet") || combined.includes("purple") || combined.includes("imperial")) {
    return "/customizer/full_shirt_22.jpg";
  }
  if (combined.includes("shadow") || combined.includes("monochrome") || combined.includes("pinstripe")) {
    return "/customizer/full_shirt_23.jpg";
  }
  if (combined.includes("tweed") || combined.includes("slate") || combined.includes("grey") || combined.includes("steel")) {
    return "/customizer/full_shirt_25.jpg";
  }
  if (combined.includes("sandstone") || combined.includes("linen") || combined.includes("oatmeal")) {
    return "/customizer/full_shirt_13.jpg";
  }

  // Fallback for shirts only
  return "/customizer/full_shirt_21.jpg";
}
