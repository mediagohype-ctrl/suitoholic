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

  if (!product) return resolveModel("shirt_model_white");

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
    return resolveModel("shirt_model_coral_stripe");
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
    return resolveModel("shirt_model_espresso");
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
    return resolveModel("shirt_model_bengal_blue");
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
    return resolveModel("shirt_model_sandstone_linen");
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
    return resolveModel("shirt_model_skyblue");
  }

  // 1.6 Solid Navy (matches blazer_navy_wool.jpg, navy apparel)
  if (
    img.includes("blazer_navy") ||
    img.includes("navy_wool") ||
    img.includes("navy_chinos") ||
    img.includes("knit_navy_polo") ||
    img.includes("navy_solid")
  ) {
    return resolveModel("shirt_model_navy_solid");
  }

  // 1.7 Pure Crisp White (matches formal_white_twill.jpg, prod_classic_white.jpg, shirt_classic_white.jpg)
  if (
    img.includes("white_twill") ||
    img.includes("prod_classic_white") ||
    img.includes("shirt_classic_white") ||
    img.includes("oxford_white") ||
    img.includes("white")
  ) {
    return resolveModel("shirt_model_white");
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
    return resolveModel("shirt_model_coral_stripe");
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
    return resolveModel("shirt_model_espresso");
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
    return resolveModel("shirt_model_bengal_blue");
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
    return resolveModel("shirt_model_sandstone_linen");
  }

  // 2.5 Sky Blue
  if (
    slug.includes("sky-blue") ||
    slug.includes("french-cuff") ||
    name.includes("sky blue") ||
    name.includes("french cuff")
  ) {
    return resolveModel("shirt_model_skyblue");
  }

  // 2.6 Solid Navy
  if (slug.includes("navy") || name.includes("navy")) {
    return resolveModel("shirt_model_navy_solid");
  }

  // 2.7 Pure Crisp White
  if (slug.includes("white") || name.includes("white")) {
    return resolveModel("shirt_model_white");
  }

  return resolveModel("shirt_model_white");
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

function getFoldedAndCuffAssets(
  product?: { name?: string; image?: string; gallery?: string[]; slug?: string } | null,
  cuffStyle: string = "CLASSIC CUFF",
  collarStyle: string = "SPREAD"
): { foldedImage: string; cuffDetailImage: string } {
  const cuffKey = getCuffKey(cuffStyle);
  const collarKey = getCollarKey(collarStyle);
  const img = (product?.image || (product?.gallery && product.gallery[0]) || "").toLowerCase();
  const name = (product?.name || "").toLowerCase();
  const slug = (product?.slug || "").toLowerCase();

  const isWhite =
    img.includes("white") ||
    name.includes("white") ||
    slug.includes("white");

  if (isWhite) {
    return {
      foldedImage: `/customizer/shirt_folded_white_${collarKey}_${cuffKey}.png`,
      cuffDetailImage: `/customizer/cuff_detail_white_${cuffKey}.png`,
    };
  }

  // Bengal Blue Stripe (Matches default custom shirt fabric)
  return {
    foldedImage: `/customizer/shirt_folded_bengal_blue_${collarKey}_${cuffKey}.jpg`,
    cuffDetailImage: `/customizer/cuff_detail_bengal_blue_${cuffKey}.jpg`,
  };
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

  // Step 5: High-end luxury folded shirt (showing collar & cuff) and macro cuff close-up
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

  // Active collar resolution
  const normCollar = (collarStyle || "").toLowerCase();
  const activeCollarKind: "cutaway" | "spread" | "band" | "buttonDown" =
    normCollar.includes("mandarin") || normCollar.includes("band")
      ? "band"
      : normCollar.includes("button")
      ? "buttonDown"
      : normCollar.includes("spread") || normCollar.includes("classic")
      ? "spread"
      : "cutaway";

  // Shirt fabric base tone and stripe accent for SVG collar styling & blending
  const fabricColorInfo = (() => {
    const src = fullShirtPhoto.toLowerCase();
    if (src.includes("coral_stripe")) return { base: "#FCF8F6", stripe: "#C86358", isStriped: true };
    if (src.includes("espresso")) return { base: "#27221E", stripe: "#38312B", isStriped: false };
    if (src.includes("sandstone_linen")) return { base: "#E8E1D2", stripe: "#D8CEBC", isStriped: false };
    if (src.includes("skyblue")) return { base: "#BDD5EC", stripe: "#8CB5DA", isStriped: false };
    if (src.includes("navy_solid")) return { base: "#172338", stripe: "#1F2E48", isStriped: false };
    if (src.includes("charcoal")) return { base: "#2B2B2D", stripe: "#3C3C40", isStriped: false };
    if (src.includes("ivory")) return { base: "#F9F5EB", stripe: "#EDE5D4", isStriped: false };
    if (src.includes("navy_pinstripe")) return { base: "#1A253A", stripe: "#CBD8EC", isStriped: true };
    if (src.includes("bengal_blue")) return { base: "#F4F7FC", stripe: "#2F5899", isStriped: true };
    return { base: "#FFFFFF", stripe: "#E5E5E5", isStriped: false };
  })();
  const shirtBaseTone = fabricColorInfo.base;

  const threadHex = c.threadColors.find((t) => t.value === threadColor)?.hex ?? "#14110E";

  // Completely uniform drop-shadow so the chest and shirt tone never change between fits
  const shirtFilter = "contrast(1.0) drop-shadow(0 16px 28px rgba(20,17,14,0.25))";

  return (
    <div className="relative w-full max-w-[520px] h-full mx-auto flex flex-col items-center justify-center select-none py-1 flex-1">

      {/* ============================================================ */}
      {/* STEP 5: BESPOKE LUXURY PRESENTATION (FOLDED SHIRT & MACRO CUFF) */}
      {/* ============================================================ */}
      {currentStep === 5 ? (
        <div className="relative w-full h-full min-h-[420px] sm:min-h-[470px] lg:min-h-[510px] flex flex-col justify-center items-center py-1 sm:py-2 animate-in fade-in duration-300">
          {/* Dual Image Presentation */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-3.5 items-stretch flex-1 max-h-[460px]">
            {/* 1. Primary Folded Shirt Presentation (Collar & Cuff shown together) */}
            <div className="sm:col-span-7 relative rounded-2xl overflow-hidden bg-[#110E0C] border border-[#C68A4C]/35 shadow-2xl flex flex-col group transition-all duration-300 hover:border-[#C68A4C]/70">
              <div className="relative w-full h-full min-h-[260px] sm:min-h-[360px] overflow-hidden bg-[#16120F] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`folded-${foldedImage}`}
                  src={foldedImage}
                  alt="Folded Bespoke Shirt Presentation"
                  className="w-full h-full object-cover object-center transition-all duration-500 ease-out animate-in fade-in zoom-in-95"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#110E0C] via-[#110E0C]/70 to-transparent pointer-events-none" />

                {/* Top Badge: Folded Presentation */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-[#14110E]/90 backdrop-blur-md border border-[#C68A4C]/50 px-2.5 py-1 rounded-full shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C68A4C] animate-pulse" />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E5E3DD]">
                    Folded Presentation
                  </span>
                </div>

                {/* Monogram Badge (if provided) */}
                {initials?.trim() && (
                  <div className="absolute top-2.5 right-2.5 z-10 bg-[#14110E]/90 backdrop-blur-md border border-[#C68A4C]/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="text-[8px] font-bold tracking-widest text-[#C68A4C] uppercase">Mono:</span>
                    <span
                      className="text-xs font-serif-luxury font-black uppercase tracking-widest drop-shadow"
                      style={{ color: threadHex }}
                    >
                      {initials.trim().toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Bottom Bar: Collar & Cuff */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-10 bg-[#14110E]/92 backdrop-blur-md border border-[#E5E3DD]/15 rounded-xl px-3 py-2 flex flex-col gap-0.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#A09A93] tracking-widest uppercase">Collar &amp; Cuff</span>
                    <span className="text-[10px] font-black text-[#C68A4C] tracking-wider uppercase">
                      {cuffStyle || "Classic Cuff"}
                    </span>
                  </div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-wide truncate">
                    {collarStyle || "Spread Collar"} • Italian Presentation
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Side Macro Cuff Detail (Only Cuff shown) */}
            <div className="sm:col-span-5 relative rounded-2xl overflow-hidden bg-[#110E0C] border border-[#C68A4C]/35 shadow-2xl flex flex-col group transition-all duration-300 hover:border-[#C68A4C]/70">
              <div className="relative w-full h-full min-h-[220px] sm:min-h-[360px] overflow-hidden bg-[#16120F] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`macro-${cuffDetailImage}`}
                  src={cuffDetailImage}
                  alt="Cuff Construction Close-Up"
                  className="w-full h-full object-cover object-center transition-all duration-500 ease-out animate-in fade-in zoom-in-95"
                  loading="eager"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#110E0C] via-[#110E0C]/70 to-transparent pointer-events-none" />

                {/* Top Badge: Macro Detail */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-[#14110E]/90 backdrop-blur-md border border-[#C68A4C]/50 px-2.5 py-1 rounded-full shadow-lg">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#E5E3DD]">
                    Cuff Detail Only
                  </span>
                </div>

                {/* Bottom Bar: Construction */}
                <div className="absolute bottom-2.5 inset-x-2.5 z-10 bg-[#14110E]/92 backdrop-blur-md border border-[#E5E3DD]/15 rounded-xl px-3 py-2 flex flex-col gap-0.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#A09A93] tracking-widest uppercase">Tailoring</span>
                    <span className="text-[10px] font-black text-[#C68A4C] tracking-wider uppercase">Bespoke</span>
                  </div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-wide truncate">
                    Fused Interlining &amp; Edging
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtitle Footnote */}
          <div className="mt-2 text-center text-[10.5px] text-[#777777] font-medium tracking-wide flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C68A4C]" />
            <span>Updates dynamically when you change Collar or Cuff style</span>
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
