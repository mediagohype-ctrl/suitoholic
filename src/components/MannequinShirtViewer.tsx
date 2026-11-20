"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
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
const CORAL_HEIGHT_GUIDE_PHOTOS = {
  buyNow: {
    width: 1072,
    height: 1536,
    collarY: 110,
    hemY: 1449,
    leftEdges: {
      lean: { collarX: 393, hemX: 368 },
      regular: { collarX: 385, hemX: 364 },
      tummy: { collarX: 387, hemX: 350 },
    },
  },
  addToBag: {
    width: 896,
    height: 1200,
    collarY: 95,
    hemY: 1120,
    leftEdges: {
      lean: { collarX: 343, hemX: 321 },
      regular: { collarX: 343, hemX: 323 },
      tummy: { collarX: 341, hemX: 304 },
    },
  },
};

export function getCoralBuyNowFitPhoto(slug?: string, bodyFit?: string, sleeveType?: string, pocket?: string) {
  if (slug !== CORAL_PRODUCT_SLUG) return undefined;
  const fit = bodyFit === "regular" || bodyFit === "tummy" ? bodyFit : "lean";
  if (sleeveType === "half" && pocket === "pocket") return CORAL_HALF_POCKET_PHOTO;
  if (sleeveType === "half" && pocket === "no-pocket") return CORAL_HALF_NO_POCKET_PHOTO;
  return CORAL_BUY_NOW_PHOTOS[fit];
}

export function CoralFullSleevePocket({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-coral-pocket={visible ? "visible" : "hidden"}
      className={`pointer-events-none absolute inset-0 z-10 [container-type:size] transition-opacity duration-200 motion-reduce:transition-none ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{ height: "min(100cqh, calc(100cqw * 1536 / 1072))", aspectRatio: "1072 / 1536" }}
      >
        <div
          className="absolute left-[60%] top-[33%] h-[14.5%] w-[16.5%]"
          style={{ filter: "drop-shadow(0.4px 0.9px 0.45px #54272380)" }}
        >
          <div
            className="h-full w-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 99% 84%, 52% 100%, 1% 86%)",
              background: "linear-gradient(180deg, #fff4e654 2% 7%, #fff4e622 8% 10%, #fff4e60d 10% 100%), linear-gradient(90deg, #68302938, transparent 5% 95%, #68302938)",
            }}
          />
          <div
            className="absolute inset-0 bg-[#662e2766]"
            style={{
              clipPath: "polygon(evenodd, 0 0, 100% 0, 99% 84%, 52% 100%, 1% 86%, 0 0, 2% 1.5%, 3% 85%, 52% 98%, 97% 83%, 98% 1.5%, 2% 1.5%)",
            }}
          />
        </div>
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
  if (norm.includes("french") || norm.includes("double")) return "french";
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
      return "/customizer/shirt_model_coral_stripe_half.png";
    }
    if (hasPocket) {
      return "/customizer/shirt_model_coral_stripe_pocket.png";
    }
    if (bodyFit === "tummy") return "/customizer/shirt_model_coral_stripe_tummy.png";
    if (bodyFit === "regular") return "/customizer/shirt_model_coral_stripe_regular.png";
    return "/customizer/shirt_model_coral_stripe_lean.png";
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

function getFoldedAndCuffAssets(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  cuffStyle: string = "CLASSIC CUFF",
  collarStyle: string = "SPREAD"
): { foldedImage: string; cuffDetailImage: string; shirtId: number; colorKey: string } {
  const shirtId = getShirtId(product);
  const cuffKey = getCuffKey(cuffStyle);
  const collarKey = getCollarKey(collarStyle);
  const colorKey = getShirtColorFamily(product);

  return {
    shirtId,
    colorKey,
    foldedImage: `/customizer/shirt_folded_${shirtId}_${collarKey}_${cuffKey}.jpg`,
    cuffDetailImage: `/customizer/cuff_detail_${shirtId}_${cuffKey}.jpg`,
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
  const showRegularFitReference = isCoralProduct && currentStep === 2 && bodyFit === "regular";
  const showCoralHeightGuides = currentStep === 3 && isCoralProduct;
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

  const useCoralFitPhotos = buyNow && isCoralProduct;
  const showCoralFitMeasurements = useCoralFitPhotos && currentStep === 2 && chestSize > 0 && !!bodyFit;
  const showCoralChestMeasurements = useCoralFitPhotos && currentStep <= 2 && chestSize > 0;
  const isHalfSleeve = sleeveType === "half";
  const showFoldedPreview = currentStep === 5 && !isHalfSleeve && !useCoralFitPhotos;

  // Step 5: High-end luxury folded shirt (showing collar & cuff) and macro cuff close-up
  const cuffKey = getCuffKey(cuffStyle);
  const { foldedImage, cuffDetailImage, shirtId, colorKey } = getFoldedAndCuffAssets(product, cuffStyle, collarStyle);
  const isDarkShirt = colorKey === "charcoal" || colorKey === "espresso" || colorKey === "navy_pinstripe";

  const activeFitForModel = (bodyFit === "regular" || bodyFit === "tummy" || bodyFit === "lean") ? bodyFit : "regular";
  const previewFit = useCoralFitPhotos && currentStep === 1 && !bodyFit ? "lean" : activeFitForModel;
  const showCoralSleevePhotos = useCoralFitPhotos && currentStep >= 4;
  const requestedCoralPhoto = useCoralFitPhotos
    ? getCoralBuyNowFitPhoto(product?.slug, previewFit, showCoralSleevePhotos ? sleeveType : "", pocket)
    : undefined;
  const [readyCoralPhotos, setReadyCoralPhotos] = useState<Partial<Record<string, true>>>({});
  const [lastReadyCoralPhoto, setLastReadyCoralPhoto] = useState<string>(CORAL_BUY_NOW_PHOTOS.lean);
  if (requestedCoralPhoto && readyCoralPhotos[requestedCoralPhoto] && lastReadyCoralPhoto !== requestedCoralPhoto) {
    setLastReadyCoralPhoto(requestedCoralPhoto);
  }
  const visibleCoralPhoto = requestedCoralPhoto && readyCoralPhotos[requestedCoralPhoto]
    ? requestedCoralPhoto : lastReadyCoralPhoto;
  const showCoralFullPocket = showCoralSleevePhotos && sleeveType === "full" && pocket === "pocket"
    && visibleCoralPhoto === CORAL_BUY_NOW_PHOTOS[previewFit];
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
  }, [useCoralFitPhotos, showCoralSleevePhotos, visibleCoralPhoto]);

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

  // Crossfade state when switching sister shirt / fabric product
  const currentShirtKey = `${product?.slug || product?.name || "bengal"}`;
  const [displayedProductKey, setDisplayedProductKey] = useState(currentShirtKey);
  const [crossfadeShirtSrc, setCrossfadeShirtSrc] = useState<string | null>(null);

  useEffect(() => {
    if (currentShirtKey !== displayedProductKey) {
      const prevSrc = shirtModels[isHalfSleeve ? "half" : "full"][activeFitForModel];
      setCrossfadeShirtSrc(prevSrc);
      setDisplayedProductKey(currentShirtKey);

      const timer = setTimeout(() => {
        setCrossfadeShirtSrc(null);
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [currentShirtKey, displayedProductKey, isHalfSleeve, activeFitForModel, shirtModels]);

  // Smooth Crossfade for Step 5 (Folded Shirt & Cuff Detail)
  const [activeFolded, setActiveFolded] = useState(foldedImage);
  const [prevFolded, setPrevFolded] = useState<string | null>(null);
  useEffect(() => {
    if (foldedImage !== activeFolded) {
      setPrevFolded(activeFolded);
      setActiveFolded(foldedImage);
      const timer = setTimeout(() => setPrevFolded(null), 450);
      return () => clearTimeout(timer);
    }
  }, [foldedImage, activeFolded]);

  const [activeCuff, setActiveCuff] = useState(cuffDetailImage);
  const [prevCuff, setPrevCuff] = useState<string | null>(null);
  useEffect(() => {
    if (cuffDetailImage !== activeCuff) {
      setPrevCuff(activeCuff);
      setActiveCuff(cuffDetailImage);
      const timer = setTimeout(() => setPrevCuff(null), 450);
      return () => clearTimeout(timer);
    }
  }, [cuffDetailImage, activeCuff]);

  // Calculated stomach measurement values matching the 3-panel reference
  const activeChestForCalc = chestSize && chestSize > 0 ? chestSize : 40;
  const stomachSizeLean = activeChestForCalc - 4;
  const stomachSizeRegular = activeChestForCalc - 2;
  const stomachSizeTummy = useCoralFitPhotos
    ? `${activeChestForCalc + 1}" – ${activeChestForCalc + 2}"`
    : `${activeChestForCalc + 2}" – ${activeChestForCalc + 4}"`;
  const measurementFit = useCoralFitPhotos ? visiblePhotoFit : bodyFit;

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

  const baseChest = useCoralFitPhotos ? 38 : 40;
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
    const photo = useCoralFitPhotos ? CORAL_HEIGHT_GUIDE_PHOTOS.buyNow : CORAL_HEIGHT_GUIDE_PHOTOS.addToBag;
    const { collarX, hemX } = photo.leftEdges[useCoralFitPhotos ? visiblePhotoFit : previewFit];
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

  return (
    <div
      className={`relative w-full ${showFoldedPreview
        ? "max-w-none"
        : currentStep === 3 && !useCoralFitPhotos
          ? "max-w-[460px] pl-6 sm:pl-8"
          : "max-w-[440px]"
        } mx-auto flex flex-col items-center justify-start py-0 transition-all duration-300`}
    >
      {showRegularFitReference && (
        <figure className="flex w-full flex-col items-center">
          <div className={`relative w-full ${shirtStageSizeClass}`}>
            <div className="absolute left-1/2 top-[3.6%] h-[96%] max-w-full aspect-[5/6] -translate-x-1/2 overflow-hidden">
              {/* The shirt is centered at 24.2% of the original landscape photo's width. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/customizer/coral-stripe-regular-fit-cutout.webp"
                alt="Coral red striped shirt in Regular Fit with a 38-inch chest and 36-inch waist"
                width={1600}
                height={900}
                className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-[24.2%]"
              />
            </div>
          </div>
          {chestSize > 0 && chestSize !== 38 && (
            <figcaption className="mt-1.5 text-sm text-[#4E3B30]">
              Reference photo shown with a 38″ chest and 36″ waist.
            </figcaption>
          )}
        </figure>
      )}

      {/* ============================================================ */}
      {/* STEP 5: BESPOKE LUXURY PRESENTATION (FOLDED SHIRT & MACRO CUFF) */}
      {/* (Only for Full Sleeves — Half Sleeve shirts do not have cuffs) */}
      {/* ============================================================ */}
      {showFoldedPreview ? (
        <div className="relative w-full flex flex-col justify-start items-center py-0 animate-in fade-in duration-300">
          {/* Dual Image Presentation - Always 2-Column Side-by-Side Responsive */}
          <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 items-start">
            {/* 1. Primary Folded Shirt Presentation (Collar & Cuff View) */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#C68A4C]/45 shadow-lg flex flex-col group transition-all duration-300 hover:border-[#C68A4C] aspect-square w-full max-h-[320px] sm:max-h-[350px] lg:max-h-[370px]">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs border border-white/10 max-w-[calc(100%-16px)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C] shrink-0" />
                <span className="truncate">
                  Collar • {collarStyle ? collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() : "Spread"} &nbsp;•&nbsp; Cuff • {cuffStyle ? cuffStyle.replace(/CUFF|DOUBLE/gi, "").trim() : "Classic"}
                </span>
              </div>
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
                    (e.currentTarget as HTMLImageElement).src = `/customizer/shirt_folded_${shirtId}_spread_classic.jpg`;
                  }}
                />
              </div>
              <div className="absolute bottom-2 inset-x-2 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-white">
                <span className="font-semibold text-[#D0BDA9] uppercase tracking-wider shrink-0">Folded Shirt</span>
                <span className="font-extrabold text-[#C68A4C] uppercase tracking-wide truncate ml-2">
                  {collarStyle ? collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() : "Classic Spread"} • {cuffStyle ? cuffStyle.replace(/CUFF|DOUBLE/gi, "").trim() : "Classic Cuff"}
                </span>
              </div>
            </div>

            {/* 2. Side Macro Cuff Detail (Only Cuff shown) */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#C68A4C]/45 shadow-lg flex flex-col group transition-all duration-300 hover:border-[#C68A4C] aspect-square w-full max-h-[320px] sm:max-h-[350px] lg:max-h-[370px]">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C]" />
                <span>Cuff • {cuffStyle ? cuffStyle.replace(/CUFF|DOUBLE/gi, "").trim() : "Classic"}</span>
              </div>
              <div className="relative w-full h-full overflow-hidden bg-[#161311] flex items-center justify-center">
                {prevCuff && (
                  <img
                    src={prevCuff}
                    alt="Previous Cuff Detail"
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-400 ease-in-out opacity-0 z-0"
                  />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeCuff}
                  alt="Cuff Construction Close-Up"
                  className="w-full h-full object-cover object-center transition-opacity duration-400 ease-in-out relative z-10"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `/customizer/cuff_detail_${shirtId}_${cuffKey}.jpg`;
                  }}
                />
              </div>
              <div className="absolute bottom-2 inset-x-2 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-white">
                <span className="font-semibold text-[#D0BDA9] uppercase tracking-wider">Wrist Cuff</span>
                <span className="font-extrabold text-[#C68A4C] uppercase tracking-wide truncate">{cuffStyle || "Classic Cuff"}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Steps 1, 2, 3, 4, 6 (and Step 5 for Half Sleeves): Full Ghost Mannequin Stage */
        <div className={showRegularFitReference ? "hidden" : "relative w-full flex items-start justify-center py-0"}>

          {/* ============================================================ */}
          {/* CORE SHIRT PHOTO: FULL MADE SHIRT IN MATCHING CHOSEN COLOR   */}
          {/* ============================================================ */}
          <div
            ref={shirtStageRef}
            className={`relative w-full aspect-[5/6] flex items-center justify-center z-10 mx-auto ${shirtStageSizeClass}`}
          >
            <div
              className={`relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out motion-reduce:transition-none ${useCoralFitPhotos ? "isolate" : ""}`}
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

              {/* 6-Way Permanent Multi-Layer Stack for Butter-Smooth Fit & Sleeve Crossfades */}
              {(useCoralFitPhotos
                ? [
                    ...CORAL_FITS.map((fit) => ({
                      key: CORAL_BUY_NOW_PHOTOS[fit],
                      src: CORAL_BUY_NOW_PHOTOS[fit],
                      description: `${fit} fit reference`,
                      fallback: getMatchingShirtModel(product, false, fit),
                      isCurrent: visibleCoralPhoto === CORAL_BUY_NOW_PHOTOS[fit],
                    })),
                    ...(showCoralSleevePhotos ? [
                      [CORAL_HALF_POCKET_PHOTO, "half sleeve with pocket"],
                      [CORAL_HALF_NO_POCKET_PHOTO, "half sleeve without pocket"],
                    ].map(([src, description]) => ({
                      key: src, src, description, fallback: undefined, isCurrent: visibleCoralPhoto === src,
                    })) : []),
                  ]
                : (["full", "half"] as const).flatMap((slv) =>
                    CORAL_FITS.map((fit) => ({
                      key: `${slv}-${fit}`,
                      src: shirtModels[slv][fit],
                      description: `${fit} fit, ${slv} sleeve`,
                      fallback: slv === "half" ? "/customizer/shirt_model_white_half.png" : "/customizer/shirt_model_white.png",
                      isCurrent: slv === (isHalfSleeve ? "half" : "full") && fit === previewFit,
                    }))
                  )
              ).map(({ key, src, description, fallback, isCurrent }) => {
                  const fitPhoto = useCoralFitPhotos && CORAL_FITS.some((fit) => CORAL_BUY_NOW_PHOTOS[fit] === src);
                  const fitPhotoPath = fitPhoto ? src.split(".webp")[0] : undefined;
                  const photoStyle = useCoralFitPhotos
                    ? "pointer-events-none"
                    : `transition-opacity duration-500 ease-in-out ${isCurrent ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`;

                  return (
                    <img
                      key={key}
                      ref={useCoralFitPhotos ? (image) => {
                        if (image) coralFitImages.current[src] = image;
                        else delete coralFitImages.current[src];
                      } : undefined}
                      src={src}
                      srcSet={fitPhotoPath ? `${fitPhotoPath}-640-v1.webp 640w, ${fitPhotoPath}-896-v1.webp 896w, ${src} 1072w` : undefined}
                      sizes={fitPhotoPath ? "(max-width: 639px) 295px, (max-width: 1023px) 330px, 365px" : undefined}
                      alt={`${product?.name ?? "Custom Bespoke Made Shirt"} (${description}${isCurrent && showCoralFullPocket ? ", full sleeve with pocket" : ""})`}
                      aria-hidden={!isCurrent}
                      className={`absolute inset-0 w-full h-full object-contain object-top ${photoStyle}`}
                      style={{
                        filter: shirtFilter,
                        mixBlendMode: useCoralFitPhotos ? "plus-lighter" : undefined,
                        opacity: useCoralFitPhotos ? Number(src === CORAL_BUY_NOW_PHOTOS.lean) : undefined,
                        willChange: useCoralFitPhotos ? undefined : "opacity",
                      }}
                      loading="eager"
                      decoding="async"
                      fetchPriority={useCoralFitPhotos && src === CORAL_BUY_NOW_PHOTOS.lean ? "high" : undefined}
                      onLoad={useCoralFitPhotos ? async ({ currentTarget: img }) => {
                        try {
                          await img.decode();
                          setReadyCoralPhotos((ready) => ready[src] ? ready : { ...ready, [src]: true });
                        } catch {
                          // The error handler can retry with the catalog photo.
                        }
                      } : undefined}
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
              })}
              {useCoralFitPhotos && <CoralFullSleevePocket visible={showCoralFullPocket} />}

              {/* Authentic Studio Photography handles with-pocket and without-pocket models directly */}
            </div>

            {/* Step 4 Sleeve & Pocket Live Status Badge */}
            {currentStep === 4 && pocket && (
              <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs border border-white/10 animate-in fade-in duration-200">
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
                {currentStep === 2 && !!bodyFit && !showCoralFitMeasurements && (
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

    </div>
  );
}
