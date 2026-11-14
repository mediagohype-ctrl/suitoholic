"use client";

import React from "react";
import { useContent } from "@/context/SiteDataProvider";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

export interface MannequinShirtViewerProps {
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

export type ShirtColorFamily =
  | "bengal_blue"
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
  if (img.includes("shirt_18") || img.includes("sage") || img.includes("mint")) return "bengal_blue";
  if (img.includes("shirt_19") || img.includes("espresso") || img.includes("dark")) return "espresso";
  if (img.includes("shirt_20") || img.includes("navy")) return "bengal_blue";
  if (img.includes("shirt_21") || img.includes("azure") || img.includes("bengal")) return "bengal_blue";
  if (img.includes("shirt_22") || img.includes("violet") || img.includes("purple")) return "bengal_blue";
  if (img.includes("shirt_23") || img.includes("shadow")) return "charcoal";
  if (img.includes("shirt_24") || img.includes("chocolate")) return "espresso";
  if (img.includes("shirt_25") || img.includes("steel") || img.includes("grey")) return "charcoal";

  // 2. Specific Product Slugs
  if (slug.includes("espresso") || slug.includes("chocolate")) return "espresso";
  if (slug.includes("navy") || slug.includes("bengal") || slug.includes("azure") || slug.includes("royal")) return "bengal_blue";
  if (slug.includes("sandstone") || slug.includes("oatmeal") || slug.includes("linen") || slug.includes("beige")) return "sandstone_linen";
  if (slug.includes("terracotta") || slug.includes("coral") || slug.includes("rose") || slug.includes("magenta")) return "coral_stripe";
  if (slug.includes("charcoal") || slug.includes("shadow") || slug.includes("steel")) return "charcoal";

  // 3. Product Names
  if (name.includes("espresso") || name.includes("chocolate")) return "espresso";
  if (name.includes("bengal") || name.includes("azure") || name.includes("navy") || name.includes("royal")) return "bengal_blue";
  if (name.includes("sandstone") || name.includes("oatmeal") || name.includes("linen") || name.includes("beige")) return "sandstone_linen";
  if (name.includes("coral") || name.includes("terracotta") || name.includes("rose") || name.includes("wine")) return "coral_stripe";
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
function getMatchingShirtModel(
  product?: { id?: number | string; name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  isHalfSleeve: boolean = false,
  bodyFit: "lean" | "regular" | "tummy" = "lean",
  collarStyle: string = ""
): string {
  if (bodyFit === "tummy") {
    // Exact bespoke made-shirt with authentic rounded tummy profile, belly curvature and waist drape creases
    return "/customizer/tummy_fit_shirt.png";
  }

  // 1. Central 100% color-consistent resolver
  const matchedFull = getMatchingFullShirtImage(product);
  if (matchedFull) {
    if (isHalfSleeve) {
      if (matchedFull.includes("shirt_model_white")) return "/customizer/shirt_model_white_half.png";
      if (matchedFull.includes("shirt_model_skyblue")) return "/customizer/shirt_model_skyblue_half.png";
      if (matchedFull.includes("shirt_model_charcoal")) return "/customizer/shirt_model_charcoal_half.png";
      if (matchedFull.includes("shirt_model_espresso")) return "/customizer/shirt_model_espresso_half.png";
      if (matchedFull.includes("shirt_model_ivory")) return "/customizer/shirt_model_ivory_half.png";
      if (matchedFull.includes("shirt_model_sandstone_linen")) return "/customizer/shirt_model_sandstone_linen_half.png";
      if (matchedFull.includes("shirt_model_coral_stripe")) return "/customizer/shirt_model_coral_stripe_half.png";
      if (matchedFull.includes("shirt_model_navy_solid")) return "/customizer/shirt_model_navy_solid_half.png";
    }
    return matchedFull.replace(/\.jpe?g$/i, ".png");
  }

  const shirtId = getShirtId(product);
  return `/customizer/full_shirt_${shirtId}.png`;
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

  const isHalfSleeve = sleeveType === "half";

  // Step 5: High-end luxury folded shirt (showing collar & cuff) and macro cuff close-up
  const cuffKey = getCuffKey(cuffStyle);
  const { foldedImage, cuffDetailImage, shirtId, colorKey } = getFoldedAndCuffAssets(product, cuffStyle, collarStyle);

  const activeFitForModel = (bodyFit === "regular" || bodyFit === "tummy" || bodyFit === "lean") ? bodyFit : "regular";

  // Complete bespoke tailored made-shirt photo dynamically resolved to the chosen product/colorway, sleeve length, body fit & collar style!
  const fullShirtPhoto = getMatchingShirtModel(product, false, activeFitForModel, collarStyle);
  const halfShirtPhoto = getMatchingShirtModel(product, true, activeFitForModel, collarStyle);

  // Calculated stomach measurement values matching the 3-panel reference
  const activeChestForCalc = chestSize && chestSize > 0 ? chestSize : 40;
  const stomachSizeLean = activeChestForCalc - 4;
  const stomachSizeRegular = activeChestForCalc - 2;
  const stomachSizeTummy = `${activeChestForCalc + 2}" – ${activeChestForCalc + 4}"`;

  const currentStomachValue =
    bodyFit === "lean"
      ? `${stomachSizeLean}"`
      : bodyFit === "regular"
        ? `${stomachSizeRegular}"`
        : bodyFit === "tummy"
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
      topY: 25,
      hemY: 474,
    }
    : isRegular
      ? {
        scaleY: 0.955,
        label: heightOption?.shortTitle ?? "Regular Height",
        range1: "5.5' to",
        range2: "5.7'",
        topY: 33,
        hemY: 442,
      }
      : {
        scaleY: 1.0,
        label: heightOption?.shortTitle ?? "Tall Height",
        range1: "5.8' to",
        range2: "5.10\"",
        topY: 29,
        hemY: 458,
      };

  // Responsive Chest Scale Calculations (Base = 40")
  const activeChest = chestSize && chestSize > 0 ? chestSize : 40;
  const chestDiff = activeChest - 40;
  const chestScaleX = Number((1 + (chestDiff >= 0 ? chestDiff * 0.018 : chestDiff * 0.020)).toFixed(3));
  const chestScaleY = Number((1 + chestDiff * 0.005).toFixed(3));

  // Overall shirt container scales ONLY for chest size (Step 1) and height (Step 3).
  // In Step 2 (Body Fit), chest scale does NOT change at all.
  const totalScaleX = chestScaleX;
  const totalScaleY = Number((heightConfig.scaleY * chestScaleY).toFixed(3));

  // Dynamic chest measurement span calibrated precisely to torso side seams (Center is X=200)
  const chestY = Math.round(162 * chestScaleY);
  const chestHalfSpan = Math.round(81 * chestScaleX);
  const chestLeftX = 200 - chestHalfSpan;
  const chestRightX = 200 + chestHalfSpan;
  const chestBadgeWidth = 88;
  const chestBadgeX = 200 - chestBadgeWidth / 2; // 156
  const chestLeftLineEnd = chestBadgeX - 4; // 152
  const chestRightLineStart = chestBadgeX + chestBadgeWidth + 4; // 248

  // Dynamic waist measurement span calibrated precisely to waist side seams
  const waistY = Math.round(262 * heightConfig.scaleY * chestScaleY);
  const waistHalfSpan =
    bodyFit === "tummy"
      ? Math.round(88 * chestScaleX)
      : bodyFit === "regular"
        ? Math.round(76 * chestScaleX)
        : Math.round(68 * chestScaleX);
  const waistLeftX = 200 - waistHalfSpan;
  const waistRightX = 200 + waistHalfSpan;
  const isTummyFit = bodyFit === "tummy";
  const waistBadgeWidth = isTummyFit ? 116 : 88;
  const waistBadgeX = 200 - waistBadgeWidth / 2;

  // Completely uniform organic drop-shadow hugging only the garment silhouette
  const shirtFilter = "contrast(1.0) drop-shadow(0 14px 22px rgba(20,17,14,0.18))";

  return (
    <div
      className={`relative w-full ${
        currentStep === 5
          ? "max-w-none"
          : currentStep === 3
            ? "max-w-[460px] pl-6 sm:pl-8"
            : "max-w-[440px]"
      } mx-auto flex flex-col items-center justify-start py-0 transition-all duration-300`}
    >

      {/* ============================================================ */}
      {/* STEP 5: BESPOKE LUXURY PRESENTATION (FOLDED SHIRT & MACRO CUFF) */}
      {/* ============================================================ */}
      {currentStep === 5 ? (
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`folded-${foldedImage}`}
                  src={foldedImage}
                  alt="Folded Bespoke Shirt Presentation"
                  className="w-full h-full object-cover object-center transition-all duration-300 ease-out animate-in fade-in"
                  loading="eager"
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`macro-${cuffDetailImage}`}
                  src={cuffDetailImage}
                  alt="Cuff Construction Close-Up"
                  className="w-full h-full object-cover object-center transition-all duration-300 ease-out animate-in fade-in"
                  loading="eager"
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
        /* Steps 1, 2, 3, 4, 6: Full Ghost Mannequin Stage */
        <div className="relative w-full flex items-start justify-center py-0">

          {/* ============================================================ */}
          {/* CORE SHIRT PHOTO: FULL MADE SHIRT IN MATCHING CHOSEN COLOR   */}
          {/* ============================================================ */}
          <div className="relative w-full max-w-[325px] sm:max-w-[355px] lg:max-w-[375px] h-[335px] sm:h-[375px] lg:h-[415px] aspect-[5/6] flex items-center justify-center z-10 mx-auto">
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-500 ease-out"
              style={{
                transform: `scaleX(${totalScaleX}) scaleY(${totalScaleY})`,
                transformOrigin: "center 30%",
              }}
            >
              {/* Full Sleeve Shirt Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`full-${fullShirtPhoto}`}
                src={fullShirtPhoto}
                alt={product?.name ?? "Custom Bespoke Made Shirt (Full Sleeve)"}
                className={`w-full h-full object-contain object-top transition-all duration-300 ease-out animate-in fade-in-50 ${isHalfSleeve ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100 relative"
                  }`}
                style={{ filter: shirtFilter }}
                loading="eager"
                onError={(e) => {
                  if (bodyFit === "tummy") {
                    (e.currentTarget as HTMLImageElement).src = "/customizer/tummy_fit_shirt.png";
                  }
                }}
              />

              {/* Half Sleeve Shirt Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`half-${halfShirtPhoto}`}
                src={halfShirtPhoto}
                alt={product?.name ?? "Custom Bespoke Made Shirt (Half Sleeve)"}
                className={`w-full h-full object-contain object-top transition-all duration-300 ease-out animate-in fade-in-50 ${isHalfSleeve ? "opacity-100 relative" : "opacity-0 pointer-events-none absolute inset-0"
                  }`}
                style={{ filter: shirtFilter }}
                loading="eager"
                onError={(e) => {
                  if (bodyFit === "tummy") {
                    (e.currentTarget as HTMLImageElement).src = "/customizer/tummy_fit_shirt.png";
                  }
                }}
              />
            </div>

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
                  const badgeWidth = 60;
                  const badgeHeight = 104;
                  const badgeX = dimX - badgeWidth / 2; // -22
                  const badgeY = Math.round((heightConfig.topY + heightConfig.hemY) / 2 - badgeHeight / 2);

                  return (
                    <g className="transition-all duration-500 ease-out animate-in fade-in">
                      {/* Top horizontal dashed line extending to collar top rim */}
                      <line
                        x1={dimX - 14}
                        y1={heightConfig.topY}
                        x2="200"
                        y2={heightConfig.topY}
                        stroke="#14110E"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Bottom horizontal dashed line extending to hem curve */}
                      <line
                        x1={dimX - 14}
                        y1={heightConfig.hemY}
                        x2="180"
                        y2={heightConfig.hemY}
                        stroke="#14110E"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Vertical dimension line connecting top and bottom dashed lines */}
                      <line
                        x1={dimX}
                        y1={heightConfig.topY}
                        x2={dimX}
                        y2={heightConfig.hemY}
                        stroke="#14110E"
                        strokeWidth="2.0"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Top arrow pointing UP touching top dashed line */}
                      <polygon
                        points={`${dimX},${heightConfig.topY} ${dimX - 5},${heightConfig.topY + 11} ${dimX + 5},${heightConfig.topY + 11}`}
                        fill="#14110E"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Bottom arrow pointing DOWN touching bottom dashed line */}
                      <polygon
                        points={`${dimX},${heightConfig.hemY} ${dimX - 5},${heightConfig.hemY - 11} ${dimX + 5},${heightConfig.hemY - 11}`}
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
                {currentStep === 1 && chestSize > 0 && (
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

                {/* Step 3 Chest Line: Dashed with circular endcaps and luxury cream pill badge matching reference */}
                {currentStep === 3 && (() => {
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
                {currentStep === 2 && !!bodyFit && (
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

                {/* Step 3 Stomach Line: Dashed with circular endcaps and luxury cream pill badge matching reference */}
                {currentStep === 3 && (() => {
                  const displayStomach = currentStomachValue || `${activeChestForCalc - 4}"`;
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
