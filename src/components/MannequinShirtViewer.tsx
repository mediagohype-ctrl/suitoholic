"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { useContent } from "@/context/SiteDataProvider";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

export interface MannequinShirtViewerProps {
  buyNow?: boolean;
  chestSize?: number;
  bodyFit?: "lean" | "regular" | "tummy" | "";
  height?: string;
  sleeveType?: "full" | "half" | "";
  collarStyle?: string;
  cuffStyle?: string;
  pocket?: "pocket" | "no-pocket" | "";
  initials?: string;
  threadColor?: string;
  currentStep?: number;
  /** The product being customised; its photo is used across all 6 steps so the chosen fabric and color stay consistent end-to-end. */
  product?: { name: string; image: string; gallery?: string[]; slug?: string; colorways?: unknown[] } | null;
}

const CORAL_BUY_NOW_PHOTOS = {
  lean: "/customizer/coral-stripe-chest-preview.webp?v=2",
  regular: "/customizer/coral-stripe-regular-preview.webp?v=3",
  tummy: "/customizer/coral-stripe-tummy-preview.webp?v=3",
};

type CoralFit = keyof typeof CORAL_BUY_NOW_PHOTOS;
const CORAL_FITS: CoralFit[] = ["lean", "regular", "tummy"];
const CORAL_HALF_POCKET_PHOTO = "/customizer/shirt_model_coral_stripe_half_pocket.png";
const CORAL_HALF_NO_POCKET_PHOTO = "/customizer/shirt_model_coral_stripe_half_nopocket.png";
const CORAL_PRODUCT_SLUG = "coral-red-bold-bengal-stripe-twill-shirt";
const CORAL_STEP5_WIDE_ASSETS = "/customizer/coral-step5-wide";
const CORAL_STEP5_COLLARS = { cutaway: "Cutaway", mandarin: "Mandarin", buttondown: "Button-down" };
const CORAL_HEIGHT_GUIDE_PHOTO = {
  width: 1072,
  height: 1536,
  collarY: 110,
  hemY: 1449,
  leftEdges: {
    lean: { collarX: 393, hemX: 368 },
    regular: { collarX: 385, hemX: 364 },
    tummy: { collarX: 387, hemX: 350 },
  },
};
const CORAL_FIT_FRAME = "absolute left-1/2 top-0 -translate-x-1/2 h-[min(100cqh,calc(100cqw*1536/1072))] w-[min(100cqw,calc(100cqh*1072/1536))]";
// Follow the transparent gaps beside the torso, preserving each fit's waist and hem.
const CORAL_HALF_SLEEVE_CLIP = "polygon(0 0, 100% 0, 100% 50%, 80% 54%, 81% 60%, 82% 70%, 83% 85%, 83% 100%, 16.6% 100%, 16.6% 85%, 17.3% 75%, 18.5% 60%, 19.2% 54%, 0 50%)";
// The original half-sleeve hems finish above the lower torso, which stays fit-specific.
const CORAL_SLEEVE_BLEND = "linear-gradient(90deg, #000 17%, transparent 24%, transparent 76%, #000 83%), linear-gradient(#000 52%, transparent 56%)";
const CORAL_TORSO_BLEND = "linear-gradient(90deg, transparent 17%, #000 24%, #000 76%, transparent 83%), linear-gradient(transparent 52%, #000 56%)";
// Complementary masks swap the collar while retaining the selected fit around it.
const CORAL_COLLAR_MASK = "ellipse 26% 29% at 50% 7%";
const CORAL_COLLAR_BLEND = "radial-gradient(" + CORAL_COLLAR_MASK + ", #000 76%, transparent 100%)";
const CORAL_BODY_BLEND = "radial-gradient(" + CORAL_COLLAR_MASK + ", transparent 76%, #000 100%)";

export function getCoralBuyNowFitPhoto(slug?: string, bodyFit?: string, sleeveType?: string, pocket?: string) {
  if (slug !== CORAL_PRODUCT_SLUG) return undefined;
  const fit = bodyFit === "regular" || bodyFit === "tummy" ? bodyFit : "lean";
  if (sleeveType === "half" && pocket === "pocket") return "/customizer/coral-stripe-half-pocket-step4-1072.webp";
  if (sleeveType === "half" && pocket === "no-pocket") return "/customizer/coral-stripe-half-no-pocket-step4-1072.webp";
  if (sleeveType === "full" && pocket === "pocket") return "/customizer/coral-stripe-full-pocket-step4-1072.webp";
  if (sleeveType === "full" && pocket === "no-pocket") return "/customizer/coral-stripe-full-no-pocket-step4-1072.webp";
  return CORAL_BUY_NOW_PHOTOS[fit];
}

const CORAL_STEP4_SLEEVE_PHOTOS = {
  half: {
    pocket: "/customizer/coral-stripe-half-pocket-step4-1072.webp",
    "no-pocket": "/customizer/coral-stripe-half-no-pocket-step4-1072.webp",
  },
  full: {
    pocket: "/customizer/coral-stripe-full-pocket-step4-1072.webp",
    "no-pocket": "/customizer/coral-stripe-full-no-pocket-step4-1072.webp",
  },
};

export function getCoralStep4SleevePhoto(
  slug?: string,
  sleeveType?: MannequinShirtViewerProps["sleeveType"],
  pocket?: MannequinShirtViewerProps["pocket"],
) {
  if (slug !== CORAL_PRODUCT_SLUG) return undefined;
  const slv = sleeveType === "half" ? "half" : "full";
  const pck = pocket === "no-pocket" ? "no-pocket" : "pocket";
  return CORAL_STEP4_SLEEVE_PHOTOS[slv][pck];
}

function CoralPocket({ visible, halfSleeve }: { visible: boolean; halfSleeve: boolean }) {
  const pocketPhoto = CORAL_STEP4_SLEEVE_PHOTOS[halfSleeve ? "half" : "full"].pocket;

  return (
    <div
      aria-hidden="true"
      data-coral-pocket={visible ? "visible" : "hidden"}
      className={`pointer-events-none absolute inset-0 z-10 [container-type:size] transition-opacity duration-200 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className={CORAL_FIT_FRAME}>
        {/* Align the pocket from the original studio photo with the fit preview's chest. */}
        <div
          className="absolute left-[56.06%] top-[31.9%] h-[16.93%] w-[17.72%]"
          style={{
            backgroundImage: `url(${pocketPhoto})`,
            backgroundPosition: "56.25% 38.40%",
            backgroundSize: "1448.42% 590.77%",
            clipPath: "polygon(5% 2%, 98% 6%, 90% 80%, 54% 97%, 2% 80%)",
          }}
        />
      </div>
    </div>
  );
}

export type ShirtColorFamily =
  | "bengal_blue"
  | "mustard_ochre_stripe"
  | "espresso"
  | "sandstone_linen"
  | "coral_stripe"
  | "white"
  | "skyblue"
  | "navy_solid"
  | "charcoal";

/**
 * Resolves the complete made shirt model based on the chosen product, fabric, or colorway.
 * Ensures the shirt displayed on the ghost mannequin is tailored in the exact selected color, pattern, and sleeve length.
 */
export function getShirtColorFamily(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null
): ShirtColorFamily {
  if (!product) return "bengal_blue";

  const img = (product.image || (product.gallery && product.gallery[0]) || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();
  const name = (product.name || "").toLowerCase();

  // 0. White Shirts
  if (
    (name.includes("white") || slug.includes("white") || img.includes("white")) &&
    !name.includes("black") &&
    !slug.includes("black")
  ) {
    return "white";
  }

  // 1. Direct matching by user uploaded shirt images (13 to 25)
  if (img.includes("shirt_13") || img.includes("sandstone") || img.includes("linen")) return "sandstone_linen";
  if (img.includes("shirt_14") || img.includes("terracotta") || img.includes("coral")) return "coral_stripe";
  if (img.includes("shirt_15") || img.includes("rose") || img.includes("pink")) return "coral_stripe";
  if (img.includes("shirt_16") || img.includes("magenta") || img.includes("wine")) return "coral_stripe";
  if (img.includes("shirt_17") || img.includes("charcoal")) return "charcoal";
  if (img.includes("mustard") || img.includes("ochre")) return "mustard_ochre_stripe";
  if (img.includes("shirt_18") || img.includes("sage") || img.includes("mint")) return "bengal_blue";
  if (img.includes("shirt_19") || img.includes("espresso") || img.includes("dark")) return "espresso";
  if (img.includes("shirt_20") || img.includes("navy")) return "bengal_blue";
  if (img.includes("shirt_21") || img.includes("azure") || img.includes("bengal")) return "bengal_blue";
  if (img.includes("shirt_22") || img.includes("violet") || img.includes("purple")) return "bengal_blue";
  if (img.includes("shirt_23") || img.includes("shadow")) return "charcoal";
  if (img.includes("shirt_24") || img.includes("chocolate")) return "espresso";
  if (img.includes("shirt_25") || img.includes("steel") || img.includes("grey")) return "charcoal";

  // 2. Specific Product Slugs (Specific colors FIRST before generic "bengal")
  if (slug.includes("mustard") || slug.includes("ochre")) return "mustard_ochre_stripe";
  if (slug.includes("terracotta") || slug.includes("coral") || slug.includes("rose") || slug.includes("magenta")) return "coral_stripe";
  if (slug.includes("espresso") || slug.includes("chocolate")) return "espresso";
  if (slug.includes("navy") || slug.includes("bengal") || slug.includes("azure") || slug.includes("royal")) return "bengal_blue";
  if (slug.includes("sandstone") || slug.includes("oatmeal") || slug.includes("linen") || slug.includes("beige")) return "sandstone_linen";
  if (slug.includes("charcoal") || slug.includes("shadow") || slug.includes("steel")) return "charcoal";

  // 3. Product Names (Specific colors FIRST before generic "bengal")
  if (name.includes("mustard") || name.includes("ochre")) return "mustard_ochre_stripe";
  if (name.includes("coral") || name.includes("terracotta") || name.includes("rose") || name.includes("wine")) return "coral_stripe";
  if (name.includes("espresso") || name.includes("chocolate")) return "espresso";
  if (name.includes("bengal") || name.includes("azure") || name.includes("navy") || name.includes("royal")) return "bengal_blue";
  if (name.includes("sandstone") || name.includes("oatmeal") || name.includes("linen") || name.includes("beige")) return "sandstone_linen";
  if (name.includes("charcoal") || name.includes("shadow") || name.includes("grey")) return "charcoal";

  return "bengal_blue";
}

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

export function getShirtId(
  product?: { id?: number | string; name?: string; image?: string; gallery?: string[]; slug?: string } | null
): number {
  if (!product) return 21;

  // 1. Check direct numeric ID (1 to 13)
  if (typeof product.id === "number" && ID_TO_SHIRT_NUM[product.id]) {
    return ID_TO_SHIRT_NUM[product.id];
  }
  if (typeof product.id === "string") {
    const parsed = parseInt(product.id, 10);
    if (!isNaN(parsed) && ID_TO_SHIRT_NUM[parsed]) {
      return ID_TO_SHIRT_NUM[parsed];
    }
  }

  // 2. Direct matching from image path (shirt_13 to shirt_25)
  const img = (product.image || (product.gallery && product.gallery[0]) || "").toLowerCase();
  for (let i = 13; i <= 25; i++) {
    if (img.includes(`shirt_${i}`) || img.includes(`full_shirt_${i}`)) {
      return i;
    }
  }

  // 3. Direct matching from gallery array
  if (product.gallery) {
    for (const g of product.gallery) {
      const gLower = (g || "").toLowerCase();
      for (let i = 13; i <= 25; i++) {
        if (gLower.includes(`shirt_${i}`) || gLower.includes(`full_shirt_${i}`)) {
          return i;
        }
      }
    }
  }

  // 4. Exact slug matching (CRITICAL: specific colors first, NEVER generic"bengal"!)
  const slug = (product.slug || "").toLowerCase();
  const name = (product.name || "").toLowerCase();

  if (slug.includes("mustard") || slug.includes("ochre") || name.includes("mustard") || name.includes("ochre")) return 49;
  if (slug.includes("terracotta") || slug.includes("brick") || name.includes("terracotta")) return 14;
  if (slug.includes("rose") || slug.includes("pastel") || name.includes("rose")) return 15;
  if (slug.includes("magenta") || slug.includes("wine") || name.includes("magenta")) return 16;
  if (slug.includes("charcoal") || name.includes("charcoal")) return 17;
  if (slug.includes("sage") || slug.includes("mint") || name.includes("sage")) return 18;
  if (slug.includes("chocolate") || name.includes("chocolate")) return 24;
  if (slug.includes("espresso") || name.includes("espresso")) return 19;
  if (slug.includes("navy") || name.includes("navy")) return 20;
  if (slug.includes("azure") || slug.includes("sky") || name.includes("azure")) return 21;
  if (slug.includes("violet") || slug.includes("imperial") || name.includes("violet")) return 22;
  if (slug.includes("shadow") || slug.includes("monochrome") || name.includes("shadow")) return 23;
  if (slug.includes("steel") || slug.includes("grey") || slug.includes("gray") || name.includes("steel")) return 25;
  if (slug.includes("sandstone") || slug.includes("linen") || slug.includes("oatmeal") || name.includes("sandstone")) return 13;

  return 21;
}

function getCollarKey(collarStyle: string): "mandarin" | "buttondown" | "cutaway" | "spread" {
  const norm = (collarStyle || "").toLowerCase();
  if (norm.includes("mandarin") || norm.includes("band")) return "mandarin";
  if (norm.includes("button")) return "buttondown";
  if (norm.includes("cutaway")) return "cutaway";
  return "spread";
}

function getCuffKey(cuffStyle: string): "classic" | "french" | "rounded" {
  const norm = (cuffStyle || "").toLowerCase();
  if (norm.includes("cufflink") || norm.includes("french") || norm.includes("double")) return "french";
  if (norm.includes("rounded") || norm.includes("round")) return "rounded";
  return "classic";
}

/**
 * Resolves the complete made shirt model based on the chosen product, fabric, or colorway.
 * Ensures the shirt displayed on the ghost mannequin is tailored in the exact selected color, pattern, and sleeve length.
 * 100% color-consistent end-to-end from card hover to Step 1 customizer.
 */
/**
 * Resolves the complete made shirt model based on the chosen product, fabric, or colorway.
 * Ensures the shirt displayed on the ghost mannequin is tailored in the exact selected color, pattern, and sleeve length.
 * 100% color-consistent end-to-end from card hover to Step 1 customizer.
 */
export function getMatchingShirtModel(
  product?: { id?: number | string; name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  isHalfSleeve: boolean = false,
  bodyFit: "lean" | "regular" | "tummy" = "lean",
  collarStyle: string = "",
  pocket: string = ""
): string {
  // 1. Central 100% color-consistent resolver
  const matchedFull = getMatchingFullShirtImage(product) || "/customizer/shirt_model_bengal_blue.png";
  const modelMatch = matchedFull.match(/shirt_model_([a-z_]+)\.png/);
  const modelKey = modelMatch ? modelMatch[1] : "";

  if (!modelKey) {
    // If not a shirt_model_* PNG (e.g. full_shirt_15.png), return the matched full shirt
    return matchedFull;
  }

  // Exact body-fit, pocket and sleeve pairing for coral_stripe (authentic master studio photography)
  if (modelKey === "coral_stripe") {
    const hasPocket = pocket === "pocket";
    if (isHalfSleeve) {
      if (hasPocket) {
        return "/customizer/shirt_model_coral_stripe_half_pocket.png";
      }
      if (bodyFit === "tummy") return "/customizer/shirt_model_coral_stripe_half_tummy.png";
      if (bodyFit === "regular") return "/customizer/shirt_model_coral_stripe_half_regular.png";
      return "/customizer/shirt_model_coral_stripe_half_nopocket.png";
    }
    if (hasPocket) {
      return "/customizer/shirt_model_coral_stripe_full_pocket.png";
    }
    if (bodyFit === "tummy") return "/customizer/shirt_model_coral_stripe_tummy.png";
    if (bodyFit === "regular") return "/customizer/shirt_model_coral_stripe_regular.png";
    return "/customizer/shirt_model_coral_stripe_full_nopocket.png";
  }

  // Check for collar-specific model variants (available for white and bengal_blue)
  let collarKey = "";
  const collarUpper = (collarStyle || "").toUpperCase();
  if (collarUpper.includes("BUTTON")) {
    collarKey = "buttondown";
  } else if (collarUpper.includes("MANDARIN")) {
    collarKey = "mandarin";
  } else if (collarUpper.includes("SPREAD") || collarUpper.includes("CUTAWAY")) {
    collarKey = "spread";
  }

  // Model-specific collar variants exist for white, bengal_blue, and mustard_ochre_stripe
  if ((modelKey === "white" || modelKey === "bengal_blue" || modelKey === "mustard_ochre_stripe") && collarKey) {
    if (bodyFit === "tummy") {
      return isHalfSleeve
        ? `/customizer/shirt_model_${modelKey}_half_tummy_${collarKey}.png`
        : `/customizer/shirt_model_${modelKey}_tummy_${collarKey}.png`;
    }
    if (bodyFit === "regular") {
      return isHalfSleeve
        ? `/customizer/shirt_model_${modelKey}_half_regular_${collarKey}.png`
        : `/customizer/shirt_model_${modelKey}_regular_${collarKey}.png`;
    }
    // lean fit
    return isHalfSleeve
      ? `/customizer/shirt_model_${modelKey}_half_${collarKey}.png`
      : `/customizer/shirt_model_${modelKey}_${collarKey}.png`;
  }

  // All colors: resolve authentic tailored fit (tummy, regular, lean) & sleeve (half, full)
  if (bodyFit === "tummy") {
    return isHalfSleeve
      ? `/customizer/shirt_model_${modelKey}_half_tummy.png`
      : `/customizer/shirt_model_${modelKey}_tummy.png`;
  }

  if (bodyFit === "regular") {
    return isHalfSleeve
      ? `/customizer/shirt_model_${modelKey}_half_regular.png`
      : `/customizer/shirt_model_${modelKey}_regular.png`;
  }

  // lean fit
  if (modelKey === "bengal_blue") {
    return isHalfSleeve
      ? "/customizer/shirt_model_bengal_blue_lean_half.png"
      : "/customizer/shirt_model_bengal_blue_lean.png";
  }

  return isHalfSleeve
    ? `/customizer/shirt_model_${modelKey}_half.png`
    : `/customizer/shirt_model_${modelKey}.png`;
}

function getFoldedShirtAssets(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  cuffStyle: string = "CLASSIC CUFF",
  collarStyle: string = "SPREAD"
) {
  const fabric = product?.slug === CORAL_PRODUCT_SLUG ? "coral_stripe" : getShirtId(product);
  const cuffKey = getCuffKey(cuffStyle);
  const collarKey = getCollarKey(collarStyle);
  const foldedAsset = `/customizer/shirt_folded_${fabric}_${collarKey}_${cuffKey}`;
  const isCoralFabric = fabric === "coral_stripe";
  const coralFoldedSuffix = "_tailored.webp?v=2";
  return {
    foldedImage: isCoralFabric ? `${foldedAsset}${coralFoldedSuffix}` : `${foldedAsset}.jpg`,
    foldedFallback: isCoralFabric
      ? `/customizer/shirt_folded_${fabric}_${collarKey}_classic${coralFoldedSuffix}`
      : `/customizer/shirt_folded_${fabric}_spread_classic.jpg`,
  };
}

export default function MannequinShirtViewer({
  buyNow = false,
  chestSize = 0,
  bodyFit = "",
  height = "",
  sleeveType = "full",
  collarStyle = "",
  cuffStyle = "",
  pocket = "",
  initials = "",
  threadColor = "",
  currentStep = 1,
  product = null,
}: MannequinShirtViewerProps) {
  const c = useContent("customizer");

  const isCoralProduct = product?.slug === CORAL_PRODUCT_SLUG;
  const isCoralAddToBagBodyFitStep = !buyNow && isCoralProduct && currentStep === 2;
  const wantsRegularFitReference = isCoralAddToBagBodyFitStep && bodyFit === "regular";
  const [regularFitReferenceStatus, setRegularFitReferenceStatus] = useState<"loading" | "ready" | "failed">("loading");
  const showRegularFitReference = wantsRegularFitReference && regularFitReferenceStatus === "ready";
  const [lastNonRegularFit, setLastNonRegularFit] = useState<Exclude<MannequinShirtViewerProps["bodyFit"], "regular" | undefined>>("");
  if (isCoralAddToBagBodyFitStep && bodyFit !== "regular" && bodyFit !== lastNonRegularFit) {
    setLastNonRegularFit(bodyFit);
  }
  // Keep the outgoing shirt and its guides together while the reference fades in.
  const previewBodyFit = wantsRegularFitReference && regularFitReferenceStatus !== "failed" ? lastNonRegularFit : bodyFit;
  const showCoralHeightGuides = currentStep === 3 && isCoralProduct;
  const showCoralSleevePreview = currentStep === 4 && isCoralProduct;
  const showCoralReview = currentStep === 6 && isCoralProduct;
  const isHalfSleeve = sleeveType === "half";
  const showCoralCollarPreview = isCoralProduct && !!pocket && currentStep === 5 && isHalfSleeve;
  const showCoralSleeveSelection = showCoralSleevePreview || showCoralCollarPreview || showCoralReview;
  const shirtStageRef = useRef<HTMLDivElement>(null);
  const [shirtStageSize, setShirtStageSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const stage = shirtStageRef.current;
    if (!showCoralHeightGuides || !stage) return;

    const updateSize = () => setShirtStageSize({ width: stage.clientWidth, height: stage.clientHeight });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [showCoralHeightGuides]);

  const isCoralBuyNow = buyNow && isCoralProduct;
  const isCoralStep4Plus = isCoralProduct && currentStep >= 4;
  const useCoralFitPhotos = isCoralBuyNow && currentStep <= 3;
  const showCoralFitMeasurements = isCoralBuyNow && currentStep === 2 && chestSize > 0 && !!previewBodyFit;
  const showCoralChestMeasurements = isCoralBuyNow && currentStep <= 2 && chestSize > 0;
  const showFoldedPreview = currentStep === 5 && !isHalfSleeve;

  // Step 5 folded shirt shows the selected collar and cuff together.
  const cuffKey = getCuffKey(cuffStyle);
  const activeCollarKey = getCollarKey(collarStyle);
  const { foldedImage, foldedFallback } = getFoldedShirtAssets(product, cuffStyle, collarStyle);
  const cuffLabel = cuffKey === "french" ? "Cufflink" : cuffKey === "rounded" ? "Rounded" : "Classic";
  const coralCollarKey = activeCollarKey === "spread" ? "cutaway" : activeCollarKey;
  const coralCollarLabel = CORAL_STEP5_COLLARS[coralCollarKey];
  const coralCuffKey = cuffKey === "french" ? "cufflink" : "classic";
  const coralCuffLabel = coralCuffKey === "cufflink" ? "Cufflink" : "Classic";

  const coralSleeve = sleeveType === "half" ? "half" : "full";
  const coralPocket = pocket === "no-pocket" ? "no-pocket" : "pocket";
  const coralStep4Photo = CORAL_STEP4_SLEEVE_PHOTOS[coralSleeve][coralPocket];
  let coralCustomPhoto = coralStep4Photo;
  if (currentStep === 5) {
    if (activeCollarKey === "buttondown") {
      coralCustomPhoto = `/customizer/coral-stripe-${coralSleeve}-${coralPocket}-buttondown-step5-1072.webp`;
    } else if (activeCollarKey === "mandarin") {
      coralCustomPhoto = `/customizer/coral-stripe-${coralSleeve}-${coralPocket}-mandarin-step5-1072.webp`;
    } else {
      coralCustomPhoto = coralStep4Photo;
    }
  } else if (currentStep === 6) {
    if (activeCollarKey === "buttondown") {
      coralCustomPhoto = `/customizer/coral-stripe-${coralSleeve}-${coralPocket}-buttondown-step6-1072.webp`;
    } else if (activeCollarKey === "mandarin") {
      coralCustomPhoto = `/customizer/coral-stripe-${coralSleeve}-${coralPocket}-mandarin-step5-1072.webp`;
    } else {
      coralCustomPhoto = coralStep4Photo;
    }
  }

  const activeFitForModel = (previewBodyFit === "regular" || previewBodyFit === "tummy" || previewBodyFit === "lean") ? previewBodyFit : "regular";
  const previewFit = useCoralFitPhotos && currentStep === 1 && !bodyFit ? "lean" : activeFitForModel;
  const showCoralSleevePhotos = isCoralBuyNow && currentStep === 5;
  const sleevePreviewSlug = showCoralCollarPreview ? product?.slug : undefined;
  const sleevePreviewPhotos = [
    [getCoralStep4SleevePhoto(sleevePreviewSlug, "half", "pocket"), "half sleeve with pocket"],
    [getCoralStep4SleevePhoto(sleevePreviewSlug, "half", "no-pocket"), "half sleeve without pocket"],
    [getCoralStep4SleevePhoto(sleevePreviewSlug, "full", "pocket"), "full sleeve with pocket"],
    [getCoralStep4SleevePhoto(sleevePreviewSlug, "full", "no-pocket"), "full sleeve without pocket"],
  ] as const;
  const selectedSleevePhoto = getCoralStep4SleevePhoto(sleevePreviewSlug, sleeveType, pocket);
  const collarPhotoOptions = showCoralCollarPreview && selectedSleevePhoto
    ? [
      { key: "cutaway", label: "Cutaway collar", src: selectedSleevePhoto },
      { key: "mandarin", label: "Mandarin collar", src: selectedSleevePhoto.replace("-step4-cutout.webp", "-mandarin-step5-v2.webp") },
      {
        key: "buttondown",
        label: "Button-down collar",
        src: selectedSleevePhoto.replace("-step4-cutout.webp", "-buttondown-step5.webp"),
      },
    ]
    : [];
  const selectedCollarPhoto = collarPhotoOptions.find(({ key }) => key === activeCollarKey)?.src;
  const halfSleevePhoto = showCoralSleeveSelection && isHalfSleeve
    ? CORAL_STEP4_SLEEVE_PHOTOS.half["no-pocket"]
    : undefined;
  const reviewSleevePhoto = getCoralStep4SleevePhoto(
    showCoralReview || showCoralCollarPreview ? product?.slug : undefined,
    sleeveType,
    pocket,
  );
  const reviewCollarPhoto = showCoralCollarPreview
    ? selectedCollarPhoto
    : activeCollarKey === "buttondown"
      ? reviewSleevePhoto?.replace("-step4-cutout.webp", "-buttondown-step6.webp")
      : activeCollarKey === "mandarin"
        ? reviewSleevePhoto?.replace("-step4-cutout.webp", "-mandarin-step5-v2.webp")
        : undefined;
  const requestedCoralPhoto = useCoralFitPhotos
    ? showCoralCollarPreview
      ? CORAL_BUY_NOW_PHOTOS[previewFit]
      : selectedCollarPhoto ?? selectedSleevePhoto ?? (
        showCoralSleevePhotos
          ? getCoralBuyNowFitPhoto(product?.slug, previewFit, sleeveType, pocket)
          : CORAL_BUY_NOW_PHOTOS[previewFit]
      )
    : undefined;
  const [readyCoralPhotos, setReadyCoralPhotos] = useState<Partial<Record<string, true>>>({});
  const showReviewCollar = !!(reviewCollarPhoto && readyCoralPhotos[reviewCollarPhoto]);
  const showOriginalHalfSleeves = !!(halfSleevePhoto && readyCoralPhotos[halfSleevePhoto]);
  const fitMask = [showReviewCollar ? CORAL_BODY_BLEND : "", showOriginalHalfSleeves ? CORAL_TORSO_BLEND : ""]
    .filter(Boolean).join(", ");
  const detailPhotos = [
    { src: halfSleevePhoto, maskImage: CORAL_SLEEVE_BLEND, maskComposite: "intersect" },
    { src: reviewCollarPhoto, maskImage: CORAL_COLLAR_BLEND, maskComposite: "add" },
  ];
  const markCoralPhotoReady = async (src: string, image: HTMLImageElement) => {
    try {
      await image.decode();
      setReadyCoralPhotos((ready) => ready[src] ? ready : { ...ready, [src]: true });
    } catch {
      // Keep the previous preview if decoding fails.
    }
  };
  const [lastReadyCoralPhoto, setLastReadyCoralPhoto] = useState<string>(CORAL_BUY_NOW_PHOTOS.lean);
  if (requestedCoralPhoto && readyCoralPhotos[requestedCoralPhoto] && lastReadyCoralPhoto !== requestedCoralPhoto) {
    setLastReadyCoralPhoto(requestedCoralPhoto);
  }
  const visibleCoralPhoto = requestedCoralPhoto && readyCoralPhotos[requestedCoralPhoto]
    ? requestedCoralPhoto : lastReadyCoralPhoto;
  const showCoralPocket = pocket === "pocket" && visibleCoralPhoto === CORAL_BUY_NOW_PHOTOS[previewFit]
    && showCoralSleeveSelection;
  const sleeveDescription = `${sleeveType} sleeve ${pocket === "pocket" ? "with" : "without"} pocket`;
  const collarVariantLayers = collarPhotoOptions.map(({ src, label }) => [src, `${label}, ${sleeveDescription}`] as const);
  const collarPreviewLayers = showCoralCollarPreview && selectedSleevePhoto
    ? collarVariantLayers
    : undefined;
  const visiblePhotoFit = CORAL_FITS.find((fit) => CORAL_BUY_NOW_PHOTOS[fit] === visibleCoralPhoto) ?? previewFit;
  const coralFitImages = useRef<Record<string, HTMLImageElement | null>>({});
  const coralFitAnimations = useRef<Animation[]>([]);
  useLayoutEffect(() => {
    const layers = useCoralFitPhotos
      ? Object.entries(coralFitImages.current).flatMap(([src, image]) =>
          image ? [{ image, from: Number(getComputedStyle(image).opacity), to: Number(src === visibleCoralPhoto) }] : [])
      : [];

    coralFitAnimations.current.forEach((animation) => animation.cancel());
    coralFitAnimations.current = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startTime = document.timeline.currentTime;
    for (const { image, from, to } of layers) {
      image.style.opacity = String(to);
      if (!reduceMotion && from !== to) {
        // Restart from the same painted frame so rapid fit changes keep the fade balanced.
        const animation = image.animate([{ opacity: from }, { opacity: to }], { duration: 220, easing: "linear" });
        if (startTime !== null) animation.startTime = startTime;
        coralFitAnimations.current.push(animation);
      }
    }
  }, [useCoralFitPhotos, showCoralSleevePhotos, showFoldedPreview, visibleCoralPhoto]);

  // Multi-model precomputed mapping for all 6 combinations of sleeve and body fit
  const shirtModels = {
    full: {
      lean: getMatchingShirtModel(product, false, "lean", collarStyle, pocket),
      regular: getMatchingShirtModel(product, false, "regular", collarStyle, pocket),
      tummy: getMatchingShirtModel(product, false, "tummy", collarStyle, pocket),
    },
    half: {
      lean: getMatchingShirtModel(product, true, "lean", collarStyle, pocket),
      regular: getMatchingShirtModel(product, true, "regular", collarStyle, pocket),
      tummy: getMatchingShirtModel(product, true, "tummy", collarStyle, pocket),
    },
  };

  // Keep the previous image visible while the replacement fades in.
  const currentShirtKey = product?.slug || product?.name || "bengal";
  const shirtSrc = shirtModels[isHalfSleeve ? "half" : "full"][activeFitForModel];
  const [displayedShirt, setDisplayedShirt] = useState({ key: currentShirtKey, src: shirtSrc });
  const [crossfadeShirtSrc, setCrossfadeShirtSrc] = useState<string | null>(null);
  if (displayedShirt.key !== currentShirtKey || displayedShirt.src !== shirtSrc) {
    if (displayedShirt.key !== currentShirtKey) setCrossfadeShirtSrc(displayedShirt.src);
    setDisplayedShirt({ key: currentShirtKey, src: shirtSrc });
  }
  useEffect(() => {
    if (!crossfadeShirtSrc) return;
    const timer = window.setTimeout(() => setCrossfadeShirtSrc(null), 550);
    return () => window.clearTimeout(timer);
  }, [crossfadeShirtSrc, currentShirtKey]);

  const [activeFolded, setActiveFolded] = useState(foldedImage);
  const [prevFolded, setPrevFolded] = useState<string | null>(null);
  if (foldedImage !== activeFolded) {
    setPrevFolded(activeFolded);
    setActiveFolded(foldedImage);
  }
  useEffect(() => {
    if (!prevFolded) return;
    const timer = window.setTimeout(() => setPrevFolded(null), 450);
    return () => window.clearTimeout(timer);
  }, [prevFolded, activeFolded]);

  // Calculated stomach measurement values matching the 3-panel reference
  const activeChestForCalc = chestSize && chestSize > 0 ? chestSize : 40;
  const stomachSizeLean = activeChestForCalc - 4;
  const stomachSizeRegular = activeChestForCalc - 2;
  const stomachSizeTummy = useCoralFitPhotos
    ? `${activeChestForCalc + 1}" – ${activeChestForCalc + 2}"`
    : `${activeChestForCalc + 2}" – ${activeChestForCalc + 4}"`;
  const measurementFit = useCoralFitPhotos ? visiblePhotoFit : previewBodyFit;

  const currentStomachValue =
    measurementFit === "lean"
      ? `${stomachSizeLean}"`
      : measurementFit === "regular"
        ? `${stomachSizeRegular}"`
        : measurementFit === "tummy"
          ? `${stomachSizeTummy}`
          : "";

  const fitConfig = {
    lean: {
      stomachArrowWidth: 175,
      label: c.bodyFits.find((f) => f.id === "lean")?.title ?? "LEAN FIT",
    },
    regular: {
      stomachArrowWidth: 212,
      label: c.bodyFits.find((f) => f.id === "regular")?.title ?? "REGULAR FIT",
    },
    tummy: {
      stomachArrowWidth: 264,
      label: c.bodyFits.find((f) => f.id === "tummy")?.title ?? "TUMMY COMFORT FIT",
    },
  }[activeFitForModel];

  // Dynamic visual height scaling factors and measurements
  const heightOption = c.heights.find((h) => h.id === height);
  const effectiveHeight = (height || "tall").toLowerCase();
  const isExtraTall = effectiveHeight.includes("extra") || effectiveHeight.includes("5.11") || effectiveHeight.includes("6.2");
  const isRegular = (!isExtraTall) && (effectiveHeight.includes("regular") || effectiveHeight.includes("5.5") || effectiveHeight.includes("5.7") || effectiveHeight.includes("standard"));

  const heightConfig = isExtraTall
    ? {
      scaleY: 1.045,
      label: heightOption?.shortTitle ?? "Extra Tall",
      range1: "5.11' to",
      range2: "6.2\"",
    }
    : isRegular
      ? {
        scaleY: 0.955,
        label: heightOption?.shortTitle ?? "Regular Height",
        range1: "5.5' to",
        range2: "5.7'",
      }
      : {
        scaleY: 1.0,
        label: heightOption?.shortTitle ?? "Tall Height",
        range1: "5.8' to",
        range2: "5.10\"",
      };

  const baseChest = isCoralBuyNow ? 38 : 40;
  const activeChest = chestSize > 0 ? chestSize : baseChest;
  const chestDiff = activeChest - baseChest;
  const chestScaleX = Number((1 + (chestDiff >= 0 ? chestDiff * 0.018 : chestDiff * 0.020)).toFixed(3));
  const chestScaleY = Number((1 + chestDiff * 0.005).toFixed(3));

  // Overall shirt container scales ONLY for chest size (Step 1) and height (Step 3).
  // In Step 2 (Body Fit), chest scale does NOT change at all.
  const totalScaleX = chestScaleX;
  const totalScaleY = Number((heightConfig.scaleY * chestScaleY).toFixed(3));

  // Dynamic precision height dimension line calculation:
  // Base shirt mannequin inside 400x480 container: Collar leaf/shoulder level Y = 36.6, Hem curve apex Y = 454.0
  // The shirt div scales with transformOrigin "center 30%", corresponding to (200, 144) in 400x480 coordinates.
  const isCoralStripe = (product?.slug ?? "").includes("coral");
  const collarBaseY = isCoralStripe ? 36.6 : 35.8;
  const hemBaseY = isCoralStripe ? 454.0 : 455.0;
  const scaleOriginY = 144;
  let dynamicTopY = scaleOriginY + (collarBaseY - scaleOriginY) * totalScaleY;
  let dynamicHemY = scaleOriginY + (hemBaseY - scaleOriginY) * totalScaleY;
  let collarGuideX = Math.round(200 - 20 * chestScaleX);
  let hemGuideX = Math.round(200 - 15 * chestScaleX);

  if (showCoralHeightGuides && shirtStageSize.width && shirtStageSize.height) {
    // Match the reference where the guides meet the left edge of the collar and hem.
    const photo = CORAL_HEIGHT_GUIDE_PHOTO;
    const { collarX, hemX } = photo.leftEdges[visiblePhotoFit];
    const { width, height } = shirtStageSize;
    const photoScale = Math.min(width / photo.width, height / photo.height);
    const overlayScale = Math.min(width / 400, height / 480);
    const originY = height * 0.3;
    // The photo is top-aligned with object-contain. The SVG centers its viewBox.
    const guideY = (y: number) =>
      240 + (originY + (y * photoScale - originY) * totalScaleY - height / 2) / overlayScale;
    const guideX = (x: number) => 200 + (x - photo.width / 2) * photoScale * totalScaleX / overlayScale;

    dynamicTopY = guideY(photo.collarY);
    dynamicHemY = guideY(photo.hemY);
    collarGuideX = guideX(collarX);
    hemGuideX = guideX(hemX);
  }

  // Dynamic chest measurement span calibrated precisely to torso side seams (Center is X=200)
  const chestY = Math.round(162 * chestScaleY);
  const chestHalfSpan = Math.round((useCoralFitPhotos ? 102 : 81) * chestScaleX);
  const chestLeftX = 200 - chestHalfSpan;
  const chestRightX = 200 + chestHalfSpan;
  const chestBadgeWidth = 88;
  const chestBadgeX = 200 - chestBadgeWidth / 2; // 156
  const chestLeftLineEnd = chestBadgeX - 4; // 152
  const chestRightLineStart = chestBadgeX + chestBadgeWidth + 4; // 248

  // Dynamic waist measurement span calibrated precisely to waist side seams
  const waistY = Math.round((useCoralFitPhotos ? 270 : 262) * heightConfig.scaleY * chestScaleY);
  const waistSpanByFit = useCoralFitPhotos
    ? { lean: 83, regular: 93, tummy: 103 }
    : { lean: 68, regular: 76, tummy: 88 };
  const waistFit = measurementFit || "lean";
  const waistHalfSpan = Math.round((waistSpanByFit[waistFit] ?? waistSpanByFit.lean) * chestScaleX);
  const waistLeftX = 200 - waistHalfSpan;
  const waistRightX = 200 + waistHalfSpan;
  const isTummyFit = measurementFit === "tummy";
  const waistBadgeWidth = isTummyFit ? 116 : 88;
  const waistBadgeX = 200 - waistBadgeWidth / 2;

  // Pristine clean presentation without card-like background shade
  const shirtFilter = "none";
  const shirtStageSizeClass = isCoralProduct
    ? "max-w-[345px] sm:max-w-[376px] lg:max-w-[398px] h-[355px] sm:h-[398px] lg:h-[440px]"
    : "max-w-[325px] sm:max-w-[355px] lg:max-w-[375px] h-[335px] sm:h-[375px] lg:h-[415px]";
  const fitFadeClass = "mix-blend-plus-lighter transition-opacity duration-300 ease-in-out motion-reduce:transition-none";

  return (
    <div
      className={`relative w-full ${showFoldedPreview
        ? "max-w-none"
        : currentStep === 3 && !useCoralFitPhotos
          ? "max-w-[460px] pl-6 sm:pl-8"
          : "max-w-[440px]"
        } mx-auto flex flex-col items-center justify-start py-0 transition-all duration-300 ${isCoralAddToBagBodyFitStep ? "isolate" : ""}`}
    >
      {isCoralAddToBagBodyFitStep && (
        <div
          aria-hidden={!showRegularFitReference}
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center ${fitFadeClass} ${showRegularFitReference ? "opacity-100" : "opacity-0"}`}
        >
          <div className={`relative w-full ${shirtStageSizeClass}`}>
            <div className="absolute left-1/2 top-[3.6%] h-[96%] max-w-full aspect-[5/6] -translate-x-1/2 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/customizer/coral-stripe-regular-fit-enhanced.webp"
                srcSet="/customizer/coral-stripe-regular-fit-enhanced-700.webp 700w, /customizer/coral-stripe-regular-fit-enhanced.webp 1120w"
                sizes="(max-width: 639px) 265px, (max-width: 1023px) 298px, 329px"
                alt="Coral red striped shirt in Regular Fit with a 38-inch chest and 36-inch waist"
                width={1120}
                height={1440}
                className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2"
                decoding="async"
                onLoad={({ currentTarget }) => {
                  const loadedSource = currentTarget.currentSrc;
                  void currentTarget.decode().then(
                    () => setRegularFitReferenceStatus("ready"),
                    () => {
                      if (currentTarget.isConnected && currentTarget.currentSrc === loadedSource) {
                        setRegularFitReferenceStatus("failed");
                      }
                    },
                  );
                }}
                onError={() => setRegularFitReferenceStatus("failed")}
              />
            </div>
          </div>
        </div>
      )}

      {showFoldedPreview && isCoralProduct ? (
        <figure className="w-full max-w-[clamp(220px,calc(125dvh-375px),520px)]">
          <figcaption className="mb-2 text-[10px] font-semibold tracking-wider text-[#72533b] uppercase">
            Style preview
          </figcaption>
          <div className="relative aspect-[670/518] overflow-hidden rounded-xl border border-[#C69C74]/45 bg-[#F6E7D9] sm:rounded-2xl">
            <Image
              src={`${CORAL_STEP5_WIDE_ASSETS}/${coralCollarKey}-${coralCuffKey}-reference-matched.webp`}
              alt={`Folded coral striped shirt with a ${coralCollarLabel.toLowerCase()} collar and ${coralCuffLabel.toLowerCase()} cuff`}
              fill
              loading="eager"
              unoptimized
              className="object-contain"
              style={{ filter: "contrast(0.77) brightness(1.15)" }}
            />
          </div>
          <div className="mx-3 mt-2 flex items-center justify-between gap-2 rounded-full bg-[#24201e] px-3 py-1.5 text-[9px] leading-tight font-semibold uppercase sm:mx-4 sm:px-4 sm:py-2 sm:text-[11px]">
            <span className="text-[#F0D9C9]">Folded Shirt</span>
            <span className="text-right text-[#E4A276]">{coralCollarLabel} ? {coralCuffLabel}</span>
          </div>
        </figure>
      ) : showFoldedPreview ? (
        <div className="relative w-full flex flex-col justify-start items-center py-0 animate-in fade-in duration-300">
          <div className="w-full max-w-[370px]">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#C68A4C]/45 shadow-lg flex flex-col group transition-all duration-300 hover:border-[#C68A4C] aspect-square w-full max-h-[320px] sm:max-h-[350px] lg:max-h-[370px]">
              {!isCoralProduct && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs border border-white/10 max-w-[calc(100%-16px)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C] shrink-0" />
                  <span className="truncate">
                    Collar • {collarStyle ? collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() : "Spread"} &nbsp;•&nbsp; Cuff • {cuffLabel}
                  </span>
                </div>
              )}
              <div className="relative w-full h-full overflow-hidden bg-[#161311] flex items-center justify-center">
                {prevFolded && (
                  <img
                    src={prevFolded}
                    alt="Previous Folded Shirt"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-400 ease-in-out opacity-0 z-0"
                  />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeFolded}
                  alt="Folded Bespoke Shirt Presentation"
                  className="w-full h-full object-cover object-center transition-opacity duration-400 ease-in-out relative z-10"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    if (!e.currentTarget.src.endsWith(foldedFallback)) e.currentTarget.src = foldedFallback;
                  }}
                />
              </div>
              <div className="absolute bottom-2 inset-x-2 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-white">
                <span className="font-semibold text-[#D0BDA9] uppercase tracking-wider shrink-0">Folded Shirt</span>
                <span className="font-extrabold text-[#C68A4C] uppercase tracking-wide truncate ml-2">
                  {collarStyle ? collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() : "Classic Spread"} • {cuffLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Steps 1, 2, 3, 4, 6 (and Step 5 for Half Sleeves): Full Ghost Mannequin Stage */
        <div
          aria-hidden={showRegularFitReference || undefined}
          className={`relative flex w-full items-start justify-center py-0 ${isCoralAddToBagBodyFitStep ? `${fitFadeClass} ${showRegularFitReference ? "opacity-0" : "opacity-100"}` : ""}`}
        >

          {/* ============================================================ */}
          {/* CORE SHIRT PHOTO: FULL MADE SHIRT IN MATCHING CHOSEN COLOR   */}
          {/* ============================================================ */}
          <div
            ref={shirtStageRef}
            className={`relative w-full aspect-[5/6] flex items-center justify-center z-10 mx-auto ${shirtStageSizeClass}`}
          >
            <div
              className={`relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out motion-reduce:transition-none ${useCoralFitPhotos ? "isolate [container-type:size]" : collarPreviewLayers ? "isolate" : ""}`}
              style={{
                transform: `scaleX(${totalScaleX}) scaleY(${totalScaleY})`,
                transformOrigin: "center 30%",
              }}
            >
              {/* Outgoing previous shirt layer during sister shirt change */}
              {crossfadeShirtSrc && (
                <img
                  src={crossfadeShirtSrc}
                  alt="Previous Shirt Model"
                  className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none transition-opacity duration-500 ease-in-out opacity-0 z-0"
                  style={{ filter: shirtFilter }}
                />
              )}

              {isCoralStep4Plus ? (
                <img
                  key={coralCustomPhoto}
                  src={coralCustomPhoto}
                  alt={`${product?.name ?? "Coral Red Bold Bengal Stripe Shirt"} (${coralSleeve} sleeve, ${coralPocket})`}
                  className={`${CORAL_FIT_FRAME} object-contain transition-opacity duration-300 ease-in-out`}
                  style={{ filter: shirtFilter }}
                  loading="eager"
                  decoding="async"
                />
              ) : (
                /* Keep fit photos mounted for transitions between selections. */
                (useCoralFitPhotos
                  ? [
                    ...CORAL_FITS.map((fit) => ({
                      key: CORAL_BUY_NOW_PHOTOS[fit],
                      src: CORAL_BUY_NOW_PHOTOS[fit],
                      description: `${fit} fit reference`,
                      fallback: getMatchingShirtModel(product, false, fit),
                      isCurrent: visibleCoralPhoto === CORAL_BUY_NOW_PHOTOS[fit],
                    })),
                    ...(showCoralSleevePhotos
                      ? [
                          ...sleevePreviewPhotos.flatMap(([src, description]) => src ? [[src, description]] : []),
                          ...collarVariantLayers,
                          [CORAL_HALF_POCKET_PHOTO, "half sleeve with pocket"],
                          [CORAL_HALF_NO_POCKET_PHOTO, "half sleeve without pocket"],
                        ]
                      : showCoralCollarPreview ? collarVariantLayers : []
                    ).map(([src, description]) => ({
                      key: src, src, description, fallback: undefined, isCurrent: visibleCoralPhoto === src,
                    })),
                  ]
                : collarPreviewLayers
                  ? collarPreviewLayers.map(([src, description]) => ({
                    key: src,
                    src,
                    description,
                    fallback: undefined,
                    isCurrent: src === (selectedCollarPhoto && readyCoralPhotos[selectedCollarPhoto] ? selectedCollarPhoto : selectedSleevePhoto),
                  }))
                  : (["full", "half"] as const).flatMap((slv) =>
                    CORAL_FITS.map((fit) => ({
                      key: `${slv}-${fit}`,
                      src: slv === sleeveType ? selectedSleevePhoto ?? shirtModels[slv][fit] : shirtModels[slv][fit],
                      description: slv === sleeveType && selectedSleevePhoto
                        ? `${slv} sleeve ${pocket === "pocket" ? "with" : "without"} pocket`
                        : `${fit} fit, ${slv} sleeve`,
                      fallback: slv === "half" ? "/customizer/shirt_model_white_half.png" : "/customizer/shirt_model_white.png",
                      isCurrent: slv === (isHalfSleeve ? "half" : "full") && fit === previewFit,
                    }))
                  )
              ).map(({ key, src, description, fallback, isCurrent }) => {
                  const fitPhoto = useCoralFitPhotos && CORAL_FITS.some((fit) => CORAL_BUY_NOW_PHOTOS[fit] === src);
                  const fitPhotoPath = fitPhoto ? src.split(".webp")[0] : undefined;
                  const isCollarVariant = collarPhotoOptions.some((option) => option.src === src);
                  const photoFraming = isCollarVariant || sleevePreviewPhotos.some(([sleeveSrc]) => src === sleeveSrc)
                    ? "object-cover object-center"
                    : "object-contain object-top";
                  const photoStyle = useCoralFitPhotos
                    ? "pointer-events-none"
                    : `transition-opacity ${collarPreviewLayers ? "duration-300 motion-reduce:transition-none" : "duration-500"} ease-in-out ${isCurrent ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`;
                  const photoDescription = showCoralSleeveSelection && fitPhoto
                    ? `${description}, ${sleeveDescription}${showCoralReview ? `, ${coralCollarLabel} collar` : ""}`
                    : description;

                  return (
                    <img
                      key={key}
                      ref={useCoralFitPhotos ? (image) => {
                        if (image) coralFitImages.current[src] = image;
                        else delete coralFitImages.current[src];
                      } : undefined}
                      src={src}
                      srcSet={fitPhotoPath && !showCoralCollarPreview ? `${fitPhotoPath}-640-v1.webp 640w, ${fitPhotoPath}-896-v1.webp 896w, ${src} 1072w` : undefined}
                      sizes={fitPhotoPath && !showCoralCollarPreview ? "(max-width: 639px) 295px, (max-width: 1023px) 330px, 365px" : undefined}
                      alt={`${product?.name ?? "Custom Bespoke Made Shirt"} (${photoDescription})`}
                      aria-hidden={!isCurrent}
                      className={`${fitPhoto ? CORAL_FIT_FRAME : "absolute inset-0 w-full h-full"} ${photoFraming} ${photoStyle}`}
                      style={{
                        clipPath: fitPhoto && showCoralSleeveSelection && isHalfSleeve ? CORAL_HALF_SLEEVE_CLIP : undefined,
                        maskImage: fitPhoto ? fitMask || undefined : undefined,
                        maskComposite: fitPhoto && showReviewCollar ? "intersect, add" : undefined,
                        filter: shirtFilter,
                        mixBlendMode: undefined,
                        opacity: useCoralFitPhotos ? Number(src === CORAL_BUY_NOW_PHOTOS.lean) : undefined,
                        willChange: useCoralFitPhotos ? undefined : "opacity",
                      }}
                      loading="eager"
                      decoding="async"
                      fetchPriority={useCoralFitPhotos && src === CORAL_BUY_NOW_PHOTOS.lean ? "high" : undefined}
                      onLoad={useCoralFitPhotos || isCollarVariant
                        ? ({ currentTarget }) => void markCoralPhotoReady(src, currentTarget)
                        : undefined}
                      onError={fallback ? (e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        if (!img.dataset.retried) {
                          img.dataset.retried = "1";
                          img.removeAttribute("srcset");
                          img.src = fallback;
                        }
                      } : undefined}
                    />
                  );
              })
              )}
              {!isCoralStep4Plus && detailPhotos.map(({ src, maskImage, maskComposite }) => src && (
                <div
                  key={src}
                  aria-hidden="true"
                  className={`${CORAL_FIT_FRAME} pointer-events-none`}
                  style={{ maskImage, maskComposite, mixBlendMode: "plus-lighter", opacity: Number(!!readyCoralPhotos[src]) }}
                >
                  <img
                    src={src}
                    alt=""
                    className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2"
                    decoding="async"
                    onLoad={({ currentTarget }) => void markCoralPhotoReady(src, currentTarget)}
                  />
                </div>
              ))}
              {!isCoralStep4Plus && showCoralSleeveSelection && (
                <CoralPocket visible={showCoralPocket} halfSleeve={isHalfSleeve} />
              )}
            </div>

            {/* Step 4 Sleeve & Pocket Live Status Badge */}
            {currentStep === 4 && pocket && (
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 whitespace-nowrap bg-black/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-white/10 animate-in fade-in duration-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C] shrink-0" />
                <span>
                  {isHalfSleeve ? "Half Sleeve" : "Full Sleeve"} • {pocket === "pocket" ? "With Pocket" : "Without Pocket"}
                </span>
              </div>
            )}

            {/* Step 5 Half Sleeve Collar Badge */}
            {currentStep === 5 && isHalfSleeve && (
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C] shrink-0" />
                <span>Collar • {collarStyle ? collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() : "Cutaway Collar"}</span>
              </div>
            )}

            {/* ========================================================== */}
            {/* STEPS 1–3: HIGH-CONTRAST MEASUREMENT ARROWS & BADGES       */}
            {/* ========================================================== */}
            {currentStep <= 3 && (
              <svg viewBox="0 0 400 480" className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" aria-hidden="true">
                <defs>
                  <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.45" />
                  </filter>
                  <filter id="heightBadgeShadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#14110E" floodOpacity="0.22" />
                    <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#14110E" floodOpacity="0.12" />
                  </filter>
                  <filter id="step3PillShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#14110E" floodOpacity="0.12" />
                  </filter>
                  <marker id="arrowLeft" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 10 1.5 L 1.5 5 L 10 8.5 Z" fill="#14110E" stroke="#FFFFFF" strokeWidth="0.75" />
                  </marker>
                  <marker id="arrowRight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 1.5 L 8.5 5 L 0 8.5 Z" fill="#14110E" stroke="#FFFFFF" strokeWidth="0.75" />
                  </marker>
                </defs>

                {/* ====================================================== */}
                {/* STEP 3 ONLY: VERTICAL HEIGHT DIMENSION & FLOATING BADGE */}
                {/* ====================================================== */}
                {currentStep === 3 && (() => {
                  const dimX = 8;
                  const guideStartX = dimX - 14;
                  // End each coral guide on a painted dash at the shirt edge.
                  const guidePathLength = (endX: number) =>
                    showCoralHeightGuides ? Math.round((endX - guideStartX - 4) / 8) * 8 + 4 : undefined;
                  const badgeWidth = 60;
                  const badgeHeight = 104;
                  const badgeX = dimX - badgeWidth / 2; // -22
                  const badgeY = Math.round((dynamicTopY + dynamicHemY) / 2 - badgeHeight / 2);

                  return (
                    <g className="transition-all duration-500 ease-out animate-in fade-in">
                      {/* Top horizontal dashed line extending to collar leaf contour */}
                      <line
                        x1={guideStartX}
                        y1={dynamicTopY}
                        x2={collarGuideX}
                        y2={dynamicTopY}
                        stroke="#14110E"
                        strokeWidth="1.6"
                        strokeDasharray="4 4"
                        pathLength={guidePathLength(collarGuideX)}
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Bottom horizontal dashed line extending to hem curve */}
                      <line
                        x1={guideStartX}
                        y1={dynamicHemY}
                        x2={hemGuideX}
                        y2={dynamicHemY}
                        stroke="#14110E"
                        strokeWidth="1.6"
                        strokeDasharray="4 4"
                        pathLength={guidePathLength(hemGuideX)}
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Vertical dimension line connecting top and bottom dashed lines */}
                      <line
                        x1={dimX}
                        y1={dynamicTopY}
                        x2={dimX}
                        y2={dynamicHemY}
                        stroke="#14110E"
                        strokeWidth="2.0"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Top arrow pointing UP touching top dashed line */}
                      <polygon
                        points={`${dimX},${dynamicTopY} ${dimX - 5},${dynamicTopY + 11} ${dimX + 5},${dynamicTopY + 11}`}
                        fill="#14110E"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Bottom arrow pointing DOWN touching bottom dashed line */}
                      <polygon
                        points={`${dimX},${dynamicHemY} ${dimX - 5},${dynamicHemY - 11} ${dimX + 5},${dynamicHemY - 11}`}
                        fill="#14110E"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Floating Height Badge centered on the vertical line */}
                      <g filter="url(#heightBadgeShadow)" className="transition-all duration-500 ease-out">
                        {/* Header: Dark Chocolate Brown with Rounded Top Corners */}
                        <path
                          d={`M ${badgeX} ${badgeY + 13}
                              A 13 13 0 0 1 ${badgeX + 13} ${badgeY}
                              H ${badgeX + badgeWidth - 13}
                              A 13 13 0 0 1 ${badgeX + badgeWidth} ${badgeY + 13}
                              V ${badgeY + 44}
                              H ${badgeX}
                              Z`}
                          fill="#3D2415"
                          className="transition-all duration-500 ease-out"
                        />

                        {/* Silhouette Icon inside Header */}
                        <circle
                          cx={dimX}
                          cy={badgeY + 15}
                          r="4.5"
                          fill="none"
                          stroke="#FFF8F0"
                          strokeWidth="1.6"
                          className="transition-all duration-500 ease-out"
                        />
                        <path
                          d={`M ${dimX - 7.5} ${badgeY + 28} C ${dimX - 6.5} ${badgeY + 22}, ${dimX + 6.5} ${badgeY + 22}, ${dimX + 7.5} ${badgeY + 28}`}
                          fill="none"
                          stroke="#FFF8F0"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-out"
                        />

                        {/* Label: Height */}
                        <text
                          x={dimX}
                          y={badgeY + 39}
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          fill="#FFF8F0"
                          letterSpacing="0.04em"
                          className="transition-all duration-500 ease-out"
                        >
                          Height
                        </text>

                        {/* Body: Light Cream with Rounded Bottom Corners */}
                        <path
                          d={`M ${badgeX} ${badgeY + 44}
                              H ${badgeX + badgeWidth}
                              V ${badgeY + badgeHeight - 13}
                              A 13 13 0 0 1 ${badgeX + badgeWidth - 13} ${badgeY + badgeHeight}
                              H ${badgeX + 13}
                              A 13 13 0 0 1 ${badgeX} ${badgeY + badgeHeight - 13}
                              Z`}
                          fill="#FFF8F1"
                          stroke="#DFCCA7"
                          strokeWidth="1.2"
                          className="transition-all duration-500 ease-out"
                        />

                        {/* Body Text: Dynamic Height Range */}
                        <text
                          x={dimX}
                          y={badgeY + 68}
                          textAnchor="middle"
                          fontSize="13.5"
                          fontWeight="800"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          fill="#14110E"
                          className="transition-all duration-500 ease-out"
                        >
                          {heightConfig.range1}
                        </text>
                        <text
                          x={dimX}
                          y={badgeY + 88}
                          textAnchor="middle"
                          fontSize="13.5"
                          fontWeight="800"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          fill="#14110E"
                          className="transition-all duration-500 ease-out"
                        >
                          {heightConfig.range2}
                        </text>
                      </g>
                    </g>
                  );
                })()}

                {/* ====================================================== */}
                {/* CHEST MEASUREMENT: STEP 1 (SOLID ARROWS) & STEP 3 (DASHED + PILL) */}
                {/* ====================================================== */}
                {currentStep === 1 && chestSize > 0 && !useCoralFitPhotos && (
                  <g filter="url(#badgeShadow)">
                    <line x1={chestLeftX} y1={chestY} x2={chestLeftLineEnd} y2={chestY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                    <line x1={chestLeftX} y1={chestY} x2={chestLeftLineEnd} y2={chestY} stroke="#14110E" strokeWidth="2.2" markerStart="url(#arrowLeft)" strokeLinecap="round" className="transition-all duration-500 ease-out" />

                    <rect x={chestBadgeX} y={chestY - 16} width={chestBadgeWidth} height="32" rx="16" fill="#14110E" stroke="#C68A4C" strokeWidth="1.75" className="transition-all duration-500 ease-out" />
                    <text x="200" y={chestY + 6} textAnchor="middle" fontSize="17" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#FFFFFF">
                      {chestSize}&quot;
                    </text>

                    <line x1={chestRightLineStart} y1={chestY} x2={chestRightX} y2={chestY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                    <line x1={chestRightLineStart} y1={chestY} x2={chestRightX} y2={chestY} stroke="#14110E" strokeWidth="2.2" markerEnd="url(#arrowRight)" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                  </g>
                )}

                {/* Dashed chest line with a cream measurement badge */}
                {(currentStep === 3 || showCoralChestMeasurements) && (() => {
                  const displayChest = chestSize > 0 ? chestSize : 38;
                  return (
                    <g className="transition-all duration-500 ease-out">
                      <line
                        x1={chestLeftX}
                        y1={chestY}
                        x2={chestRightX}
                        y2={chestY}
                        stroke="#14110E"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        className="transition-all duration-500 ease-out"
                      />
                      <circle cx={chestLeftX} cy={chestY} r="3.5" fill="#14110E" className="transition-all duration-500 ease-out" />
                      <circle cx={chestRightX} cy={chestY} r="3.5" fill="#14110E" className="transition-all duration-500 ease-out" />

                      <g filter="url(#step3PillShadow)">
                        <rect
                          x={chestBadgeX}
                          y={chestY - 16}
                          width={chestBadgeWidth}
                          height="32"
                          rx="16"
                          fill="#FFFDF8"
                          stroke="#DECBB8"
                          strokeWidth="1.5"
                          className="transition-all duration-500 ease-out"
                        />
                        <text
                          x="200"
                          y={chestY + 6}
                          textAnchor="middle"
                          fontSize="17"
                          fontWeight="800"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          fill="#14110E"
                        >
                          {displayChest}&quot;
                        </text>
                      </g>
                    </g>
                  );
                })()}

                {/* ====================================================== */}
                {/* STOMACH / WAIST MEASUREMENT: STEP 2 (SOLID ARROWS) & STEP 3 (DASHED + PILL) */}
                {/* ====================================================== */}
                {currentStep === 2 && !!previewBodyFit && !showCoralFitMeasurements && (
                  <g filter="url(#badgeShadow)">
                    <line x1={waistLeftX} y1={waistY} x2={waistBadgeX - 6} y2={waistY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                    <line x1={waistLeftX} y1={waistY} x2={waistBadgeX - 6} y2={waistY} stroke="#14110E" strokeWidth="2.2" markerStart="url(#arrowLeft)" strokeLinecap="round" className="transition-all duration-500 ease-out" />

                    <rect x={waistBadgeX} y={waistY - 16} width={waistBadgeWidth} height="32" rx="16" fill="#14110E" stroke="#C68A4C" strokeWidth="1.75" className="transition-all duration-500 ease-out" />
                    <text x="200" y={waistY + 5} textAnchor="middle" fontSize={isTummyFit ? "13.5" : "17"} fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#FFFFFF">
                      {currentStomachValue}
                    </text>

                    <line x1={waistBadgeX + waistBadgeWidth + 6} y1={waistY} x2={waistRightX} y2={waistY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                    <line x1={waistBadgeX + waistBadgeWidth + 6} y1={waistY} x2={waistRightX} y2={waistY} stroke="#14110E" strokeWidth="2.2" markerEnd="url(#arrowRight)" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                  </g>
                )}

                {/* Dashed stomach line with a cream measurement badge */}
                {(currentStep === 3 || showCoralFitMeasurements) && (() => {
                  const displayStomach = currentStomachValue || `${stomachSizeLean}"`;
                  return (
                    <g className="transition-all duration-500 ease-out">
                      <line
                        x1={waistLeftX}
                        y1={waistY}
                        x2={waistRightX}
                        y2={waistY}
                        stroke="#14110E"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        className="transition-all duration-500 ease-out"
                      />
                      <circle cx={waistLeftX} cy={waistY} r="3.5" fill="#14110E" className="transition-all duration-500 ease-out" />
                      <circle cx={waistRightX} cy={waistY} r="3.5" fill="#14110E" className="transition-all duration-500 ease-out" />

                      <g filter="url(#step3PillShadow)">
                        <rect
                          x={waistBadgeX}
                          y={waistY - 16}
                          width={waistBadgeWidth}
                          height="32"
                          rx="16"
                          fill="#FFFDF8"
                          stroke="#DECBB8"
                          strokeWidth="1.5"
                          className="transition-all duration-500 ease-out"
                        />
                        <text
                          x="200"
                          y={waistY + 6}
                          textAnchor="middle"
                          fontSize={isTummyFit ? "13.5" : "17"}
                          fontWeight="800"
                          fontFamily="system-ui, -apple-system, sans-serif"
                          fill="#14110E"
                        >
                          {displayStomach}
                        </text>
                      </g>
                    </g>
                  );
                })()}
              </svg>
            )}

          </div>

        </div>
      )}

      {isCoralAddToBagBodyFitStep && chestSize > 0 && chestSize !== 38 && (
        <p
          aria-hidden={!showRegularFitReference}
          className={`mt-1.5 text-center text-sm text-[#4E3B30] transition-opacity duration-300 motion-reduce:transition-none ${showRegularFitReference ? "opacity-100" : "opacity-0"}`}
        >
          Reference photo shown with a 38″ chest and 36″ waist.
        </p>
      )}
    </div>
  );
}
