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
  product?: { name: string; image: string; gallery?: string[]; slug?: string; colorways?: any[] } | null;
}

/**
 * Resolves the complete made shirt model based on the chosen product, fabric, or colorway.
 * Ensures the shirt displayed on the ghost mannequin is tailored in the exact selected color, pattern, and sleeve length.
 */
function getMatchingShirtModel(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  isHalfSleeve: boolean = false
): string {
  const suffix = isHalfSleeve ? "_half.png" : ".png";
  if (!product) return `/customizer/shirt_model_white${suffix}`;

  const img = (product.image || (product.gallery && product.gallery[0]) || "").toLowerCase();
  const name = (product.name || "").toLowerCase();
  const slug = (product.slug || "").toLowerCase();

  // 1. DIRECT IMAGE MATCHING (Highest priority - reflects the exact visual shirt the customer clicked)
  // 1.1 Coral / Rose / Terracotta / Maroon Stripes (matches shirt_1.jpg and prod_maroon_stripe.jpg)
  if (
    img.includes("shirt_1.jpg") ||
    img.includes("shirt_1.png") ||
    img.includes("prod_maroon_stripe") ||
    img.includes("rose_stripe") ||
    img.includes("terracotta_stripe") ||
    img.includes("st16974_terracotta") ||
    img.includes("sh403_rose") ||
    img.includes("maroon") ||
    img.includes("coral") ||
    img.includes("terracotta")
  ) {
    return `/customizer/shirt_model_coral_stripe${suffix}`;
  }

  // 1.2 Rich Dark Chocolate / Espresso Brown (matches shirt_2.jpg, formal_charcoal_boardroom.jpg, prod_charcoal_stripe.jpg)
  if (
    img.includes("shirt_2.jpg") ||
    img.includes("shirt_2.png") ||
    img.includes("formal_charcoal_boardroom") ||
    img.includes("prod_charcoal_stripe") ||
    img.includes("charcoal_oxford") ||
    img.includes("black_minimal") ||
    img.includes("espresso_polo") ||
    img.includes("espresso") ||
    img.includes("dark_fabric") ||
    img.includes("charcoal") ||
    img.includes("obsidian")
  ) {
    return `/customizer/shirt_model_espresso${suffix}`;
  }

  // 1.3 Blue Bengal Stripe / Executive Navy Banker Pinstripe (matches shirt_3.jpg, prod_navy_stripe.jpg, formal_banker_stripe.jpg)
  if (
    img.includes("shirt_3.jpg") ||
    img.includes("shirt_3.png") ||
    img.includes("prod_navy_stripe") ||
    img.includes("formal_banker_stripe") ||
    img.includes("bengal_stripe") ||
    img.includes("banker_stripe") ||
    img.includes("luxury_pinstripe")
  ) {
    return `/customizer/shirt_model_bengal_blue${suffix}`;
  }

  // 1.4 Fine Sandstone / Oatmeal Linen / Ivory (matches shirt_4.jpg, formal_ivory_herringbone.jpg, prod_beige_stripe.jpg)
  if (
    img.includes("shirt_4.jpg") ||
    img.includes("shirt_4.png") ||
    img.includes("formal_ivory_herringbone") ||
    img.includes("prod_beige_stripe") ||
    img.includes("dove_grey_linen") ||
    img.includes("sand_linen") ||
    img.includes("linen_oatmeal") ||
    img.includes("supima_cream") ||
    img.includes("sandstone") ||
    img.includes("oatmeal") ||
    img.includes("linen") ||
    img.includes("beige") ||
    img.includes("ivory")
  ) {
    return `/customizer/shirt_model_sandstone_linen${suffix}`;
  }

  // 1.5 Executive Sky Blue / French Cuff Blue (matches formal_french_cuff_blue.jpg, prod_skyblue_stripe.jpg)
  if (
    img.includes("french_cuff_blue") ||
    img.includes("prod_skyblue_stripe") ||
    img.includes("sky_blue_model") ||
    img.includes("iceblue") ||
    img.includes("skyblue") ||
    img.includes("sky_blue")
  ) {
    return `/customizer/shirt_model_skyblue${suffix}`;
  }

  // 1.6 Solid Navy (matches blazer_navy_wool.jpg, navy apparel)
  if (
    img.includes("blazer_navy") ||
    img.includes("navy_wool") ||
    img.includes("navy_chinos") ||
    img.includes("knit_navy_polo") ||
    img.includes("navy_solid")
  ) {
    return `/customizer/shirt_model_navy_solid${suffix}`;
  }

  // 1.7 Pure Crisp White (matches formal_white_twill.jpg, prod_classic_white.jpg, shirt_classic_white.jpg)
  if (
    img.includes("white_twill") ||
    img.includes("prod_classic_white") ||
    img.includes("shirt_classic_white") ||
    img.includes("oxford_white") ||
    img.includes("white")
  ) {
    return `/customizer/shirt_model_white${suffix}`;
  }

  // 2. PRODUCT SLUG & NAME FALLBACK (Used if image path is an external or unspecified URL)
  // 2.1 Coral / Rose / Terracotta
  if (
    slug.includes("coral") ||
    slug.includes("rose") ||
    slug.includes("terracotta") ||
    slug.includes("maroon") ||
    name.includes("rose") ||
    name.includes("coral") ||
    name.includes("terracotta")
  ) {
    return `/customizer/shirt_model_coral_stripe${suffix}`;
  }

  // 2.2 Rich Dark Chocolate / Espresso / Obsidian
  if (
    slug.includes("charcoal") ||
    slug.includes("espresso") ||
    slug.includes("midnight") ||
    slug.includes("obsidian") ||
    slug.includes("black") ||
    name.includes("charcoal") ||
    name.includes("espresso") ||
    name.includes("obsidian") ||
    name.includes("midnight")
  ) {
    return `/customizer/shirt_model_espresso${suffix}`;
  }

  // 2.3 Bengal / Banker / Pinstripe
  if (
    slug.includes("bengal") ||
    slug.includes("banker") ||
    slug.includes("pinstripe") ||
    name.includes("bengal") ||
    name.includes("banker") ||
    name.includes("pinstripe")
  ) {
    return `/customizer/shirt_model_bengal_blue${suffix}`;
  }

  // 2.4 Sandstone / Oatmeal Linen / Ivory
  if (
    slug.includes("ivory") ||
    slug.includes("linen") ||
    slug.includes("sandstone") ||
    slug.includes("oatmeal") ||
    slug.includes("beige") ||
    slug.includes("taupe") ||
    name.includes("ivory") ||
    name.includes("linen") ||
    name.includes("sandstone") ||
    name.includes("oatmeal") ||
    name.includes("herringbone")
  ) {
    return `/customizer/shirt_model_sandstone_linen${suffix}`;
  }

  // 2.5 Sky Blue
  if (
    slug.includes("sky-blue") ||
    slug.includes("french-cuff") ||
    name.includes("sky blue") ||
    name.includes("french cuff")
  ) {
    return `/customizer/shirt_model_skyblue${suffix}`;
  }

  // 2.6 Solid Navy
  if (slug.includes("navy") || name.includes("navy")) {
    return `/customizer/shirt_model_navy_solid${suffix}`;
  }

  // 2.7 Pure Crisp White
  if (slug.includes("white") || name.includes("white")) {
    return `/customizer/shirt_model_white${suffix}`;
  }

  return `/customizer/shirt_model_white${suffix}`;
}

export default function MannequinShirtViewer({
  chestSize = 38,
  bodyFit = "lean",
  height = "TALL HEIGHT (5.8 - 5.10\")",
  sleeveType = "full",
  collarStyle = "",
  cuffStyle = "",
  pocket = "pocket",
  initials = "",
  threadColor = "black",
  currentStep = 1,
  product = null,
}: MannequinShirtViewerProps) {
  const c = useContent("customizer");
  const v = c.visuals;

  const isHalfSleeve = sleeveType === "half";

  // Complete bespoke tailored made-shirt photo dynamically resolved to the chosen product/colorway & sleeve length
  const fullShirtPhoto = getMatchingShirtModel(product, false);
  const halfShirtPhoto = getMatchingShirtModel(product, true);

  // Calculated stomach measurement values
  const stomachSizeLean = chestSize - 4;
  const stomachSizeRegular = chestSize - 2;
  const stomachSizeTummy = `${chestSize + 1}" – ${chestSize + 2}"`;

  const currentStomachValue =
    bodyFit === "lean"
      ? `${stomachSizeLean}"`
      : bodyFit === "regular"
      ? `${stomachSizeRegular}"`
      : `${stomachSizeTummy}`;

  // Dynamic visual parameters based on bodyFit
  const fitConfig = {
    lean: {
      waistScaleX: 1.0,
      stomachArrowWidth: 175,
      label: c.bodyFits.find((f) => f.id === "lean")?.title ?? "LEAN FIT",
      stomachGlowOpacity: "0.0",
    },
    regular: {
      waistScaleX: 1.06,
      stomachArrowWidth: 212,
      label: c.bodyFits.find((f) => f.id === "regular")?.title ?? "REGULAR FIT",
      stomachGlowOpacity: "0.15",
    },
    tummy: {
      waistScaleX: 1.13,
      stomachArrowWidth: 252,
      label: c.bodyFits.find((f) => f.id === "tummy")?.title ?? "TUMMY COMFORT FIT",
      stomachGlowOpacity: "0.28",
    },
  }[bodyFit];

  // Dynamic visual height scaling factors
  const heightOption = c.heights.find((h) => h.id === height);
  const heightConfig = height.toLowerCase().includes("extra")
    ? { scaleY: 1.045, label: heightOption?.shortTitle ?? "Extra Tall" }
    : height.toLowerCase().includes("regular") || height.toLowerCase().includes("5.5") || height.toLowerCase().includes("standard")
    ? { scaleY: 0.965, label: heightOption?.shortTitle ?? "Regular Height" }
    : { scaleY: 1.0, label: heightOption?.shortTitle ?? "Tall Height" };

  const threadHex = c.threadColors.find((t) => t.value === threadColor)?.hex ?? "#14110E";

  const shirtFilter =
    bodyFit === "tummy"
      ? "contrast(1.02) drop-shadow(0 20px 36px rgba(20,17,14,0.32))"
      : bodyFit === "regular"
      ? "contrast(1.01) drop-shadow(0 18px 32px rgba(20,17,14,0.28))"
      : "contrast(1.0) drop-shadow(0 16px 28px rgba(20,17,14,0.24))";

  return (
    <div className="relative w-full max-w-[520px] h-full mx-auto flex flex-col items-center justify-center select-none py-1 flex-1">

      {/* Main Bespoke Preview Stage - Free-standing without box container */}
      <div className="relative w-full h-full min-h-[420px] sm:min-h-[470px] lg:min-h-[510px] flex items-center justify-center flex-1">

        {/* ============================================================ */}
        {/* CORE SHIRT PHOTO: FULL MADE SHIRT IN MATCHING CHOSEN COLOR   */}
        {/* ============================================================ */}
        <div className="relative w-full h-full flex items-center justify-center z-10 pt-1 sm:pt-2">
          <div
            className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
            style={{
              transform: `scaleX(${fitConfig.waistScaleX}) scaleY(${heightConfig.scaleY})`,
              transformOrigin: "center 48%",
            }}
          >
            {/* Full Sleeve Shirt Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullShirtPhoto}
              alt={product?.name ?? "Custom Bespoke Made Shirt (Full Sleeve)"}
              className={`w-full h-full object-contain object-top transition-all duration-500 ease-out ${
                isHalfSleeve ? "opacity-0 pointer-events-none absolute inset-0" : "opacity-100 relative"
              }`}
              style={{ filter: shirtFilter }}
              loading="eager"
            />

            {/* Half Sleeve Shirt Photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={halfShirtPhoto}
              alt={product?.name ?? "Custom Bespoke Made Shirt (Half Sleeve)"}
              className={`w-full h-full object-contain object-top transition-all duration-500 ease-out ${
                isHalfSleeve ? "opacity-100 relative" : "opacity-0 pointer-events-none absolute inset-0"
              }`}
              style={{ filter: shirtFilter }}
              loading="eager"
            />
          </div>

          {/* Soft waist shadow expansion for Regular & Tummy fits */}
          {bodyFit !== "lean" && (
            <div
              className="absolute inset-x-0 top-[48%] h-[32%] pointer-events-none transition-opacity duration-700 flex items-center justify-center"
              style={{ opacity: fitConfig.stomachGlowOpacity }}
            >
              <div className="w-[72%] h-full rounded-full bg-gradient-to-r from-transparent via-[#DDC8B4]/35 to-transparent blur-md" />
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
                <marker id="arrowLeft" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 10 1.5 L 1.5 5 L 10 8.5 Z" fill="#14110E" stroke="#FFFFFF" strokeWidth="0.75" />
                </marker>
                <marker id="arrowRight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M 0 1.5 L 8.5 5 L 0 8.5 Z" fill="#14110E" stroke="#FFFFFF" strokeWidth="0.75" />
                </marker>
              </defs>

              {/* Chest Measurement (Steps 1, 2, 3) */}
              <g filter="url(#badgeShadow)">
                {/* Contrast under-line */}
                <line x1="85" y1="172" x2="152" y2="172" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="85" y1="172" x2="152" y2="172" stroke="#14110E" strokeWidth="2.2" markerStart="url(#arrowLeft)" strokeLinecap="round" />

                {/* Chest Pill Badge */}
                <rect x="156" y="156" width="88" height="32" rx="16" fill="#14110E" stroke="#C68A4C" strokeWidth="1.75" />
                <text x="200" y="177" textAnchor="middle" fontSize="17" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#FFFFFF">
                  {chestSize}&quot;
                </text>

                {/* Right Arrow */}
                <line x1="248" y1="172" x2="315" y2="172" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <line x1="248" y1="172" x2="315" y2="172" stroke="#14110E" strokeWidth="2.2" markerEnd="url(#arrowRight)" strokeLinecap="round" />
              </g>

              {/* Stomach / Waist Measurement (Steps 2 & 3) */}
              {currentStep >= 2 && (() => {
                const halfWidth = fitConfig.stomachArrowWidth / 2;
                const stomachY = 278 * heightConfig.scaleY;
                const isTummy = bodyFit === "tummy";
                const badgeWidth = isTummy ? 124 : 92;
                const badgeX = 200 - badgeWidth / 2;
                const leftArrowX = Math.min(badgeX - 8, 200 - halfWidth);
                const rightArrowX = Math.max(badgeX + badgeWidth + 8, 200 + halfWidth);

                return (
                  <g filter="url(#badgeShadow)">
                    {/* Contrast under-line */}
                    <line x1={leftArrowX} y1={stomachY} x2={badgeX - 6} y2={stomachY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1={leftArrowX} y1={stomachY} x2={badgeX - 6} y2={stomachY} stroke="#14110E" strokeWidth="2.2" markerStart="url(#arrowLeft)" strokeLinecap="round" className="transition-all duration-500 ease-out" />

                    {/* Stomach Pill Badge */}
                    <rect x={badgeX} y={stomachY - 16} width={badgeWidth} height="32" rx="16" fill="#14110E" stroke="#C68A4C" strokeWidth="1.75" />
                    <text x="200" y={stomachY + 5} textAnchor="middle" fontSize={isTummy ? "13.5" : "17"} fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#FFFFFF">
                      {currentStomachValue}
                    </text>

                    {/* Right Arrow */}
                    <line x1={badgeX + badgeWidth + 6} y1={stomachY} x2={rightArrowX} y2={stomachY} stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1={badgeX + badgeWidth + 6} y1={stomachY} x2={rightArrowX} y2={stomachY} stroke="#14110E" strokeWidth="2.2" markerEnd="url(#arrowRight)" strokeLinecap="round" className="transition-all duration-500 ease-out" />
                  </g>
                );
              })()}
            </svg>
          )}



          {/* ========================================================== */}
          {/* STEP 5: COLLAR, CUFF & MONOGRAM DETAIL OVERLAYS            */}
          {/* ========================================================== */}
          {currentStep === 5 && (
            <div className="absolute inset-0 z-25 pointer-events-none flex flex-col justify-between p-3.5 animate-in fade-in duration-300">
              {/* Top: Collar Badge */}
              <div className="flex justify-start">
                <div className="bg-[#14110E]/90 backdrop-blur-md border border-[#C68A4C] rounded-xl px-3 py-1.5 shadow-xl flex items-center space-x-2">
                  <span className="text-[9px] font-bold tracking-widest text-[#C68A4C] uppercase">Collar:</span>
                  <span className="text-xs font-extrabold text-white uppercase">{collarStyle || "Spread Collar"}</span>
                </div>
              </div>

              {/* Middle: Embroidered Monogram Initials Badge */}
              {initials?.trim() && (
                <div className="self-center bg-[#14110E]/92 backdrop-blur-md border-2 border-dashed border-[#C68A4C] rounded-2xl px-5 py-2.5 shadow-2xl flex flex-col items-center space-y-1 my-auto">
                  <span className="text-[8.5px] font-bold tracking-[0.22em] text-[#D0BDA9] uppercase">
                    Embroidered Monogram
                  </span>
                  <span
                    className="font-serif-luxury font-extrabold text-2xl tracking-[0.25em] uppercase drop-shadow-md"
                    style={{ color: threadHex, textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                  >
                    {initials.trim().toUpperCase()}
                  </span>
                  <span className="text-[8px] font-semibold text-[#C68A4C] uppercase tracking-wider">
                    {c.threadColors.find((t) => t.value === threadColor)?.label ?? threadColor}
                  </span>
                </div>
              )}

              {/* Bottom: Cuff & Pocket Info */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {!isHalfSleeve && cuffStyle && (
                  <div className="bg-[#14110E]/90 backdrop-blur-md border border-[#C68A4C] rounded-xl px-3 py-1.5 shadow-xl flex items-center space-x-2">
                    <span className="text-[9px] font-bold tracking-widest text-[#C68A4C] uppercase">Cuff:</span>
                    <span className="text-xs font-extrabold text-white uppercase">{cuffStyle}</span>
                  </div>
                )}
                {pocket && (
                  <div className="bg-[#14110E]/90 backdrop-blur-md border border-[#D0BDA9]/40 rounded-xl px-3 py-1.5 shadow-xl text-xs font-bold text-white uppercase">
                    {pocket === "pocket" ? "Chest Pocket" : "No Pocket (Clean)"}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
