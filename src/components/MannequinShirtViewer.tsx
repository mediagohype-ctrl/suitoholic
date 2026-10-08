"use client";

import React from "react";
import { useContent } from "@/context/SiteDataProvider";
import { CollarIllustration, CuffIllustration } from "@/components/customizer/StyleIllustrations";

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
  /** The product being customised; its photo is used for the fabric chip and the detail/review steps. */
  product?: { name: string; image: string; gallery?: string[] } | null;
}

export default function MannequinShirtViewer({
  chestSize = 38,
  bodyFit = "lean",
  height = "TALL HEIGHT (5.8 - 5.10\")",
  sleeveType = "full",
  collarStyle = "",
  cuffStyle = "",
  initials = "",
  threadColor = "black",
  currentStep = 4,
  product = null,
}: MannequinShirtViewerProps) {
  const c = useContent("customizer");
  const v = c.visuals;

  // Which preview the step shows: measurements/sleeves on the mannequin, details & review on the product photo.
  const stage = currentStep >= 6 ? "review" : currentStep === 5 ? "details" : "mannequin";
  const productPhoto = product?.image || product?.gallery?.[0] || v.fallbackDetailImage;

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
      waistScaleX: 1.075,
      stomachArrowWidth: 212,
      label: c.bodyFits.find((f) => f.id === "regular")?.title ?? "REGULAR FIT",
      stomachGlowOpacity: "0.15",
    },
    tummy: {
      waistScaleX: 1.155,
      stomachArrowWidth: 252,
      label: c.bodyFits.find((f) => f.id === "tummy")?.title ?? "TUMMY COMFORT FIT",
      stomachGlowOpacity: "0.28",
    },
  }[bodyFit];

  // Dynamic visual height scaling factors
  const heightOption = c.heights.find((h) => h.id === height);
  const heightConfig = height.toLowerCase().includes("extra")
    ? { scaleY: 1.055, label: heightOption?.shortTitle ?? "Extra Tall" }
    : height.toLowerCase().includes("regular") || height.toLowerCase().includes("5.5") || height.toLowerCase().includes("standard")
    ? { scaleY: 0.96, label: heightOption?.shortTitle ?? "Regular Height" }
    : { scaleY: 1.0, label: heightOption?.shortTitle ?? "Tall Height" };

  const isHalfSleeve = sleeveType === "half";
  const collarOption = c.collarStyles.find((s) => s.name === collarStyle);
  const cuffOption = c.cuffStyles.find((s) => s.name === cuffStyle);
  const threadHex = c.threadColors.find((t) => t.value === threadColor)?.hex ?? "#14110E";

  const shirtFilter =
    bodyFit === "tummy"
      ? "contrast(1.02) drop-shadow(0 22px 38px rgba(20,17,14,0.32))"
      : bodyFit === "regular"
      ? "contrast(1.01) drop-shadow(0 20px 35px rgba(20,17,14,0.28))"
      : "contrast(1.0) drop-shadow(0 18px 32px rgba(20,17,14,0.25))";

  return (
    <div className="relative w-full max-w-[480px] mx-auto flex flex-col items-center justify-center select-none py-2 sm:py-4">

      {/* Preview stage */}
      <div className="relative w-full aspect-[4/4.8] sm:aspect-[4/4.5] max-h-[460px] flex items-center justify-center">

        {/* ============================================================ */}
        {/* STEPS 1–4: Mannequin shirt with measurement arrows & sleeves */}
        {/* ============================================================ */}
        {stage === "mannequin" && (
          <div key="mannequin" className="absolute inset-0 animate-in fade-in duration-300">
            {/* Dynamic Studio Ambient Glow behind Mannequin */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-[#FAF5EC]/70 blur-2xl transform -translate-y-4 transition-all duration-700"
                style={{ transform: `scale(${bodyFit === "tummy" ? 1.08 : bodyFit === "regular" ? 1.03 : 1.0})` }}
              />
            </div>

            <div className="relative w-full h-full flex items-center justify-center z-10">
              {/* Shirt layers morph with the chosen fit (width) and height (length) */}
              <div
                className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
                style={{
                  transform: `scaleX(${fitConfig.waistScaleX}) scaleY(${heightConfig.scaleY})`,
                  transformOrigin: "center 55%",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.fullSleeveImage}
                  alt="Full sleeve bespoke shirt"
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-out ${
                    isHalfSleeve ? "opacity-0 pointer-events-none scale-[0.98]" : "opacity-100 scale-100"
                  }`}
                  style={{ filter: shirtFilter }}
                  loading="eager"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.halfSleeveImage}
                  alt="Half sleeve bespoke shirt"
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-out ${
                    isHalfSleeve ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-[0.98]"
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
                  <div className="w-[68%] h-full rounded-full bg-gradient-to-r from-transparent via-[#EADCCE]/30 to-transparent blur-md" />
                </div>
              )}

              {/* Measurement arrows (steps 1–3) */}
              {currentStep <= 3 && (
                <svg viewBox="0 0 400 480" className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible" aria-hidden="true">
                  <defs>
                    <marker id="arrowLeft" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 10 1.5 L 1.5 5 L 10 8.5 Z" fill="#14110E" />
                    </marker>
                    <marker id="arrowRight" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 1.5 L 8.5 5 L 0 8.5 Z" fill="#14110E" />
                    </marker>
                  </defs>

                  {/* Chest */}
                  <g>
                    <line x1="100" y1="160" x2="162" y2="160" stroke="#14110E" strokeWidth="1.75" markerStart="url(#arrowLeft)" />
                    <text x="200" y="166" textAnchor="middle" fontSize="22" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#14110E">
                      {chestSize}&quot;
                    </text>
                    <line x1="238" y1="160" x2="300" y2="160" stroke="#14110E" strokeWidth="1.75" markerEnd="url(#arrowRight)" />
                  </g>

                  {/* Stomach / waist */}
                  {(() => {
                    const halfWidth = fitConfig.stomachArrowWidth / 2;
                    const textMargin = bodyFit === "tummy" ? 48 : 34;
                    const stomachY = 275 * heightConfig.scaleY;
                    return (
                      <g>
                        <line x1={200 - halfWidth} y1={stomachY} x2={200 - textMargin} y2={stomachY} stroke="#14110E" strokeWidth="1.75" markerStart="url(#arrowLeft)" className="transition-all duration-500 ease-out" />
                        <text x="200" y={stomachY + 6} textAnchor="middle" fontSize="22" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="#14110E">
                          {currentStomachValue}
                        </text>
                        <line x1={200 + textMargin} y1={stomachY} x2={200 + halfWidth} y2={stomachY} stroke="#14110E" strokeWidth="1.75" markerEnd="url(#arrowRight)" className="transition-all duration-500 ease-out" />
                      </g>
                    );
                  })()}
                </svg>
              )}
            </div>

            {/* Fabric chip: the product being customised */}
            {product && (
              <div className="absolute bottom-2 right-0 z-30 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-[#D0BDA9] rounded-xl p-1.5 pr-3 shadow-md max-w-[210px]">
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#241D17] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productPhoto} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[8.5px] font-bold tracking-[0.2em] text-[#9E774C] uppercase">{v.fabricChipLabel}</span>
                  <span className="block text-[10.5px] font-bold text-[#14110E] uppercase leading-tight line-clamp-2">{product.name}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 5: Product photo with collar, cuff & monogram previews   */}
        {/* ============================================================ */}
        {stage === "details" && (
          <div key="details" className="absolute inset-0 animate-in fade-in duration-300 rounded-2xl overflow-hidden bg-[#241D17] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={productPhoto} alt={product?.name ?? "Shirt fabric"} className="absolute inset-0 w-full h-full object-cover object-top" loading="eager" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

            {product && (
              <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-sm text-white text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full">
                {product.name}
              </div>
            )}

            {/* Selected detail previews */}
            <div className="absolute inset-x-3 bottom-3 grid grid-cols-3 gap-2">
              {/* Collar */}
              <div className="bg-white/92 backdrop-blur-sm rounded-xl p-2 text-center border border-white/60 shadow-md">
                <span className="block text-[8px] font-bold tracking-[0.2em] text-[#9E774C] uppercase">{v.collarPreviewLabel}</span>
                <div className="h-14 sm:h-16 flex items-center justify-center text-[#14110E] my-0.5">
                  {collarOption?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={collarOption.image} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <CollarIllustration key={collarStyle} name={collarStyle} className="h-full w-full animate-in zoom-in-95 duration-300" />
                  )}
                </div>
                <span className="block text-[9px] font-bold text-[#14110E] uppercase leading-tight line-clamp-2">{collarStyle || "—"}</span>
              </div>

              {/* Cuff (full sleeve only) */}
              <div className={`bg-white/92 backdrop-blur-sm rounded-xl p-2 text-center border border-white/60 shadow-md transition-opacity ${isHalfSleeve ? "opacity-50" : ""}`}>
                <span className="block text-[8px] font-bold tracking-[0.2em] text-[#9E774C] uppercase">{v.cuffPreviewLabel}</span>
                <div className="h-14 sm:h-16 flex items-center justify-center text-[#14110E] my-0.5">
                  {isHalfSleeve ? (
                    <span className="text-[9px] font-semibold text-[#8C6D47] uppercase">{c.halfSleeveLabel}</span>
                  ) : cuffOption?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cuffOption.image} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <CuffIllustration key={cuffStyle} name={cuffStyle} className="h-full w-full animate-in zoom-in-95 duration-300" />
                  )}
                </div>
                <span className="block text-[9px] font-bold text-[#14110E] uppercase leading-tight line-clamp-2">{isHalfSleeve ? "—" : cuffStyle || "—"}</span>
              </div>

              {/* Monogram */}
              <div className="bg-white/92 backdrop-blur-sm rounded-xl p-2 text-center border border-white/60 shadow-md">
                <span className="block text-[8px] font-bold tracking-[0.2em] text-[#9E774C] uppercase">{v.monogramPreviewLabel}</span>
                <div className="h-14 sm:h-16 flex items-center justify-center my-0.5">
                  <span
                    key={`${initials}-${threadColor}`}
                    className="font-serif-luxury italic text-3xl sm:text-4xl leading-none tracking-[0.12em] animate-in zoom-in-95 duration-300"
                    style={{ color: threadHex, textShadow: "0 1px 0 rgba(255,255,255,0.6)" }}
                  >
                    {initials?.trim() || "—"}
                  </span>
                </div>
                <span className="block text-[9px] font-bold text-[#14110E] uppercase leading-tight">
                  {c.threadColors.find((t) => t.value === threadColor)?.label ?? threadColor}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 6: Product photo with the complete selection summary     */}
        {/* ============================================================ */}
        {stage === "review" && (
          <div key="review" className="absolute inset-0 animate-in fade-in duration-300 rounded-2xl overflow-hidden bg-[#241D17] shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={productPhoto} alt={product?.name ?? "Shirt fabric"} className="absolute inset-0 w-full h-full object-cover object-top" loading="eager" />
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />
            <div className="absolute inset-x-4 bottom-4 text-white">
              <span className="block text-[9px] font-bold tracking-[0.22em] text-[#D9B98A] uppercase mb-1">{v.reviewLabel}</span>
              {product && <span className="block font-serif-luxury text-lg sm:text-xl uppercase leading-tight mb-2">{product.name}</span>}
              <div className="flex flex-wrap gap-1.5">
                {[
                  `${chestSize}" ${fitConfig.label}`,
                  heightConfig.label,
                  isHalfSleeve ? c.halfSleeveLabel : c.fullSleeveLabel,
                  collarStyle,
                  !isHalfSleeve && cuffStyle,
                  initials?.trim() ? `${initials.trim().toUpperCase()} · ${threadColor}` : null,
                ]
                  .filter(Boolean)
                  .map((tag, i) => (
                    <span key={i} className="bg-white/15 border border-white/30 backdrop-blur-sm rounded-full px-2.5 py-1 text-[9.5px] font-bold tracking-wider uppercase">
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Active Fit, Height & Sleeve Status Pill below the stage */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2 bg-[#EFE2D4]/95 border border-[#D0BDA9] px-3.5 py-1.5 rounded-full shadow-sm text-xs backdrop-blur-xs transition-all duration-300">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7A4B1A] animate-pulse" />
          <span className="font-bold text-[#14110E] tracking-wider uppercase text-[11px]">{fitConfig.label}</span>
          <span className="text-[#8C6D47]">({currentStomachValue})</span>
        </div>
        <span className="text-[#8C6D47]">•</span>
        <div className="flex items-center space-x-1 text-[#5A4E42] text-[10.5px]">
          <span>{heightConfig.label}</span>
          <span>•</span>
          <span className="font-semibold uppercase text-[#14110E]">{isHalfSleeve ? c.halfSleeveLabel : c.fullSleeveLabel}</span>
        </div>
      </div>

    </div>
  );
}
