"use client";

import React from "react";
import { useContent } from "@/context/SiteDataProvider";

export interface MannequinShirtViewerProps {
  chestSize: number;
  bodyFit: "lean" | "regular" | "tummy";
  height?: string;
  sleeveType?: "full" | "half";
  collarStyle?: string;
  cuffStyle?: string;
  pocket?: "pocket" | "no-pocket";
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
  if (!product) return "espresso";

  const img = (product.image || (product.gallery && product.gallery[0]) || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();
  const name = (product.name || "").toLowerCase();

  // 1. Primary Source of Truth: Image URL (Prevents any color drift across steps!)
  if (img.includes("shirt_2") || img.includes("espresso")) return "espresso";
  if (img.includes("shirt_3") || img.includes("bengal_blue") || img.includes("banker")) return "bengal_blue";
  if (img.includes("shirt_4") || img.includes("sandstone") || img.includes("linen") || img.includes("oatmeal")) return "sandstone_linen";
  if (img.includes("shirt_1") || img.includes("coral") || img.includes("terracotta") || img.includes("rose")) return "coral_stripe";
  if (img.includes("shirt_5") || img.includes("white")) return "white";
  if (img.includes("shirt_9") || img.includes("skyblue") || img.includes("sky-blue")) return "skyblue";
  if (img.includes("shirt_7") || img.includes("navy_solid") || img.includes("midnight")) return "navy_solid";
  if (img.includes("shirt_8") || img.includes("charcoal") || img.includes("anthracite")) return "charcoal";

  // 2. Specific Product Slugs (including legacy aliases)
  if (slug.includes("espresso") || slug.includes("chocolate")) return "espresso";
  if (slug.includes("navy-executive") || slug.includes("bengal") || slug.includes("pinstripe")) return "bengal_blue";
  if (slug.includes("sandstone") || slug.includes("oatmeal") || slug.includes("linen")) return "sandstone_linen";
  if (slug.includes("terracotta") || slug.includes("coral")) return "coral_stripe";
  if (slug.includes("white")) return "white";
  if (slug.includes("sky-blue") || slug.includes("skyblue") || slug.includes("oxford")) return "skyblue";
  if (slug.includes("midnight-navy") || slug.includes("navy-solid")) return "navy_solid";
  if (slug.includes("charcoal") || slug.includes("anthracite")) return "charcoal";

  // 3. Product Names
  if (name.includes("espresso") || name.includes("chocolate") || name.includes("dark")) return "espresso";
  if (name.includes("bengal") || (name.includes("navy") && name.includes("pinstripe"))) return "bengal_blue";
  if (name.includes("sandstone") || name.includes("oatmeal") || name.includes("linen") || name.includes("beige")) return "sandstone_linen";
  if (name.includes("coral") || name.includes("terracotta") || name.includes("rust")) return "coral_stripe";
  if (name.includes("white") || name.includes("crisp")) return "white";
  if (name.includes("sky") || name.includes("oxford")) return "skyblue";
  if (name.includes("midnight") || (name.includes("navy") && name.includes("solid"))) return "navy_solid";
  if (name.includes("charcoal") || name.includes("anthracite")) return "charcoal";

  return "espresso";
}

function getCollarKey(collarStyle: string): "mandarin" | "buttondown" | "spread" {
  const norm = (collarStyle || "").toLowerCase();
  if (norm.includes("mandarin") || norm.includes("band")) return "mandarin";
  if (norm.includes("button")) return "buttondown";
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
 */
function getMatchingShirtModel(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  isHalfSleeve: boolean = false,
  bodyFit: "lean" | "regular" | "tummy" = "lean",
  collarStyle: string = ""
): string {
  const fitSuffix = bodyFit === "tummy" ? "_tummy" : bodyFit === "regular" ? "_regular" : "";
  const halfSuffix = isHalfSleeve ? "_half" : "";

  const normCollar = (collarStyle || "").toLowerCase();
  const collarSuffix =
    normCollar.includes("mandarin") || normCollar.includes("band")
      ? "_mandarin"
      : normCollar.includes("button")
      ? "_buttondown"
      : normCollar.includes("spread") || (normCollar.includes("classic") && !normCollar.includes("cuff"))
      ? "_spread"
      : "";

  const resolveModel = (base: string) => {
    // Fabrics with dedicated photorealistic collar variations
    const supportsCollar = base.includes("bengal_blue") || base.includes("white");
    const cPart = supportsCollar ? collarSuffix : "";
    return `/customizer/${base}${halfSuffix}${fitSuffix}${cPart}.png`;
  };

  const colorFamily = getShirtColorFamily(product);

  switch (colorFamily) {
    case "espresso":
      return resolveModel("shirt_model_espresso");
    case "bengal_blue":
      return resolveModel("shirt_model_bengal_blue");
    case "sandstone_linen":
      return resolveModel("shirt_model_sandstone_linen");
    case "coral_stripe":
      return resolveModel("shirt_model_coral_stripe");
    case "white":
      return resolveModel("shirt_model_white");
    case "skyblue":
      return resolveModel("shirt_model_skyblue");
    case "navy_solid":
      return resolveModel("shirt_model_navy_solid");
    case "charcoal":
      return resolveModel("shirt_model_charcoal");
    default:
      return resolveModel("shirt_model_espresso");
  }
}

function getFoldedAndCuffAssets(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  cuffStyle: string = "CLASSIC CUFF",
  collarStyle: string = "SPREAD"
): { foldedImage: string; cuffDetailImage: string } {
  const cuffKey = getCuffKey(cuffStyle);
  const collarKey = getCollarKey(collarStyle);
  const colorKey = getShirtColorFamily(product);

  return {
    foldedImage: `/customizer/shirt_folded_${colorKey}_${collarKey}_${cuffKey}.jpg`,
    cuffDetailImage: `/customizer/cuff_detail_${colorKey}_${cuffKey}.jpg`,
  };
}

export default function MannequinShirtViewer({
  chestSize = 38,
  bodyFit = "lean",
  height = "TALL HEIGHT (5.8 - 5.10\")",
  sleeveType = "full",
  collarStyle = "",
  cuffStyle = "",
  currentStep = 1,
  product = null,
}: MannequinShirtViewerProps) {
  const c = useContent("customizer");

  const isHalfSleeve = sleeveType === "half";

  // Step 5: High-end luxury folded shirt (showing collar & cuff) and macro cuff close-up
  const colorKey = getShirtColorFamily(product);
  const cuffKey = getCuffKey(cuffStyle);
  const { foldedImage, cuffDetailImage } = getFoldedAndCuffAssets(product, cuffStyle, collarStyle);

  // Complete bespoke tailored made-shirt photo dynamically resolved to the chosen product/colorway, sleeve length, body fit & collar style!
  const fullShirtPhoto = getMatchingShirtModel(product, false, bodyFit, collarStyle);
  const halfShirtPhoto = getMatchingShirtModel(product, true, bodyFit, collarStyle);

  // Calculated stomach measurement values matching the 3-panel reference:
  // Lean: chestSize - 4" (e.g. 38" for 42" chest or 34" for 38" chest)
  // Regular: chestSize - 2" (e.g. 42" for 44" chest)
  // Tummy: chestSize + 2" – chestSize + 4" (e.g. 46" for 42" chest)
  const stomachSizeLean = chestSize - 4;
  const stomachSizeRegular = chestSize - 2;
  const stomachSizeTummy = `${chestSize + 2}" – ${chestSize + 4}"`;

  const currentStomachValue =
    bodyFit === "lean"
      ? `${stomachSizeLean}"`
      : bodyFit === "regular"
      ? `${stomachSizeRegular}"`
      : `${stomachSizeTummy}`;

  // Dynamic visual parameters based on bodyFit:
  // - Lean: Crisp baseline bespoke made-shirt photo (Panel 1)
  // - Regular: Natural stomach fullness photo (Panel 2)
  // - Tummy: Large spherical belly dome photo matching Panel 3 reference
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
  }[bodyFit];

  // Dynamic visual height scaling factors
  const heightOption = c.heights.find((h) => h.id === height);
  const heightConfig = height.toLowerCase().includes("extra")
    ? { scaleY: 1.045, label: heightOption?.shortTitle ?? "Extra Tall" }
    : height.toLowerCase().includes("regular") || height.toLowerCase().includes("5.5") || height.toLowerCase().includes("standard")
    ? { scaleY: 0.965, label: heightOption?.shortTitle ?? "Regular Height" }
    : { scaleY: 1.0, label: heightOption?.shortTitle ?? "Tall Height" };

  // Responsive Chest Scale Calculations (Base = 40")
  const chestDiff = chestSize - 40;
  const chestScaleX = Number((1 + (chestDiff >= 0 ? chestDiff * 0.018 : chestDiff * 0.020)).toFixed(3));
  const chestScaleY = Number((1 + chestDiff * 0.005).toFixed(3));

  // Overall shirt container scales ONLY for chest size (Step 1) and height (Step 3).
  // In Step 2 (Body Fit), chest scale does NOT change at all.
  const totalScaleX = chestScaleX;
  const totalScaleY = Number((heightConfig.scaleY * chestScaleY).toFixed(3));

  // Dynamic chest measurement arrow span (Center is X=200)
  const chestHalfSpan = Math.round(115 * chestScaleX);
  const chestLeftX = 200 - chestHalfSpan;
  const chestRightX = 200 + chestHalfSpan;
  const chestBadgeWidth = 88;
  const chestBadgeX = 200 - chestBadgeWidth / 2; // 156
  const chestLeftLineEnd = chestBadgeX - 4; // 152
  const chestRightLineStart = chestBadgeX + chestBadgeWidth + 4; // 248

  // Completely uniform drop-shadow so the chest and shirt tone never change between fits
  const shirtFilter = "contrast(1.0) drop-shadow(0 16px 28px rgba(20,17,14,0.25))";

  return (
    <div className={`relative w-full ${currentStep === 5 ? "max-w-none" : "max-w-[520px]"} h-full mx-auto flex flex-col items-center justify-center select-none py-1 flex-1`}>

      {/* ============================================================ */}
      {/* STEP 5: BESPOKE LUXURY PRESENTATION (FOLDED SHIRT & MACRO CUFF) */}
      {/* ============================================================ */}
      {currentStep === 5 ? (
        <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] lg:min-h-[500px] flex flex-col justify-center items-center py-1 sm:py-2 animate-in fade-in duration-300">
          {/* Dual Image Presentation - Always 2-Column Side-by-Side Responsive */}
          <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 items-stretch flex-1 max-h-[520px]">
            {/* 1. Primary Folded Shirt Presentation (Collar View) */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#C68A4C]/45 shadow-xl flex flex-col group transition-all duration-300 hover:border-[#C68A4C] aspect-[4/5] sm:aspect-auto">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C]" />
                <span>Collar • {collarStyle ? collarStyle.replace(/COLLAR|\/ BAND/gi, "").trim() : "Spread"}</span>
              </div>
              <div className="relative w-full h-full min-h-[220px] sm:min-h-[360px] lg:min-h-[440px] overflow-hidden bg-[#161311] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`folded-${foldedImage}`}
                  src={foldedImage}
                  alt="Folded Bespoke Shirt Presentation"
                  className="w-full h-full object-cover object-center transition-all duration-300 ease-out animate-in fade-in"
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `/customizer/shirt_folded_${colorKey}_spread_classic.jpg`;
                  }}
                />
              </div>
              <div className="absolute bottom-2 inset-x-2 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[9px] sm:text-[10px] text-white">
                <span className="font-semibold text-[#D0BDA9] uppercase tracking-wider">Folded Shirt</span>
                <span className="font-extrabold text-[#C68A4C] uppercase tracking-wide truncate">{collarStyle || "Classic Spread"}</span>
              </div>
            </div>

            {/* 2. Side Macro Cuff Detail (Only Cuff shown) */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-[#C68A4C]/45 shadow-xl flex flex-col group transition-all duration-300 hover:border-[#C68A4C] aspect-[4/5] sm:aspect-auto">
              <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-md text-white text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase px-2 py-0.5 rounded shadow-xs border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C]" />
                <span>Cuff • {cuffStyle ? cuffStyle.replace(/CUFF|DOUBLE/gi, "").trim() : "Classic"}</span>
              </div>
              <div className="relative w-full h-full min-h-[220px] sm:min-h-[360px] lg:min-h-[440px] overflow-hidden bg-[#161311] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`macro-${cuffDetailImage}`}
                  src={cuffDetailImage}
                  alt="Cuff Construction Close-Up"
                  className="w-full h-full object-cover object-center transition-all duration-300 ease-out animate-in fade-in"
                  loading="eager"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `/customizer/cuff_detail_${colorKey}_${cuffKey}.jpg`;
                  }}
                />
              </div>
              <div className="absolute bottom-2 inset-x-2 z-10 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[9px] sm:text-[10px] text-white">
                <span className="font-semibold text-[#D0BDA9] uppercase tracking-wider">Wrist Cuff</span>
                <span className="font-extrabold text-[#C68A4C] uppercase tracking-wide truncate">{cuffStyle || "Classic Cuff"}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Steps 1, 2, 3, 4, 6: Full Ghost Mannequin Stage */
        <div className="relative w-full h-full min-h-[420px] sm:min-h-[470px] lg:min-h-[510px] flex items-center justify-center flex-1">

          {/* ============================================================ */}
          {/* CORE SHIRT PHOTO: FULL MADE SHIRT IN MATCHING CHOSEN COLOR   */}
          {/* ============================================================ */}
          <div className="relative w-full h-full flex items-center justify-center z-10 pt-1 sm:pt-2">
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
                className={`w-full h-full object-contain object-top transition-all duration-300 ease-out animate-in fade-in-50 ${
                  isHalfSleeve ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100 relative"
                }`}
                style={{ filter: shirtFilter }}
                loading="eager"
              />

              {/* Half Sleeve Shirt Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`half-${halfShirtPhoto}`}
                src={halfShirtPhoto}
                alt={product?.name ?? "Custom Bespoke Made Shirt (Half Sleeve)"}
                className={`w-full h-full object-contain object-top transition-all duration-300 ease-out animate-in fade-in-50 ${
                  isHalfSleeve ? "opacity-100 relative" : "opacity-0 pointer-events-none absolute inset-0"
                }`}
                style={{ filter: shirtFilter }}
                loading="eager"
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
                  <marker id="arrowLeft" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 10 1.5 L 1.5 5 L 10 8.5 Z" fill="#14110E" stroke="#FFFFFF" strokeWidth="0.75" />
                  </marker>
                  <marker id="arrowRight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 0 1.5 L 8.5 5 L 0 8.5 Z" fill="#14110E" stroke="#FFFFFF" strokeWidth="0.75" />
                  </marker>
                </defs>

                {/* Chest Measurement: Step 1 (and Step 3 overview) only - hidden in Step 2 */}
                {(currentStep === 1 || currentStep === 3) && (
                  <g filter="url(#badgeShadow)">
                    <line x1={chestLeftX} y1="172" x2={chestLeftLineEnd} y2="172" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                    <line x1={chestLeftX} y1="172" x2={chestLeftLineEnd} y2="172" stroke="#14110E" strokeWidth="2.2" markerStart="url(#arrowLeft)" strokeLinecap="round" className="transition-all duration-500 ease-out" />

                    <rect x={chestBadgeX} y="156" width={chestBadgeWidth} height="32" rx="16" fill="#14110E" stroke="#C68A4C" strokeWidth="1.75" className="transition-all duration-500 ease-out" />
                    <text x="200" y="177" textAnchor="middle" fontSize="17" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#FFFFFF">
                      {chestSize}&quot;
                    </text>

                    <line x1={chestRightLineStart} y1="172" x2={chestRightX} y2="172" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                    <line x1={chestRightLineStart} y1="172" x2={chestRightX} y2="172" stroke="#14110E" strokeWidth="2.2" markerEnd="url(#arrowRight)" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                  </g>
                )}

                {/* Stomach / Waist Measurement (Steps 2 & 3) */}
                {currentStep >= 2 && (() => {
                  const halfWidth = (fitConfig.stomachArrowWidth * chestScaleX) / 2;
                  const stomachY = 278 * heightConfig.scaleY * chestScaleY;
                  const isTummy = bodyFit === "tummy";
                  const badgeWidth = isTummy ? 128 : 92;
                  const badgeX = 200 - badgeWidth / 2;
                  const leftArrowX = Math.min(badgeX - 8, 200 - halfWidth);
                  const rightArrowX = Math.max(badgeX + badgeWidth + 8, 200 + halfWidth);

                  return (
                    <g filter="url(#badgeShadow)">
                      <line x1={leftArrowX} y1={stomachY} x2={badgeX - 6} y2={stomachY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                      <line x1={leftArrowX} y1={stomachY} x2={badgeX - 6} y2={stomachY} stroke="#14110E" strokeWidth="2.2" markerStart="url(#arrowLeft)" strokeLinecap="round" className="transition-all duration-500 ease-out" />

                      <rect x={badgeX} y={stomachY - 16} width={badgeWidth} height="32" rx="16" fill="#14110E" stroke="#C68A4C" strokeWidth="1.75" className="transition-all duration-500 ease-out" />
                      <text x="200" y={stomachY + 5} textAnchor="middle" fontSize={isTummy ? "13.5" : "17"} fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#FFFFFF">
                        {currentStomachValue}
                      </text>

                      <line x1={badgeX + badgeWidth + 6} y1={stomachY} x2={rightArrowX} y2={stomachY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                      <line x1={badgeX + badgeWidth + 6} y1={stomachY} x2={rightArrowX} y2={stomachY} stroke="#14110E" strokeWidth="2.2" markerEnd="url(#arrowRight)" strokeLinecap="round" className="transition-all duration-500 ease-out" />
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
