"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Plus, ChevronRight } from "lucide-react";

export type OutfitCategory = "ethnic" | "bespoke_suit";

export interface OutfitGarment {
  id: string;
  name: string;
  type: "kurta" | "pajama" | "sadri" | "coat" | "shirt" | "trouser" | "waistcoat" | "blazer";
  selected: boolean;
  category: OutfitCategory;
}

const INITIAL_GARMENTS: OutfitGarment[] = [
  // Ethnic Set items (as seen in reference design)
  { id: "kurta", name: "Kurta", type: "kurta", selected: true, category: "ethnic" },
  { id: "pajama", name: "Pajama", type: "pajama", selected: true, category: "ethnic" },
  { id: "sadri", name: "Sadri", type: "sadri", selected: true, category: "ethnic" },
  { id: "coat", name: "Coat", type: "coat", selected: false, category: "ethnic" },

  // Bespoke Suit items (Suitoholic signature menswear)
  { id: "blazer", name: "Suit Blazer", type: "blazer", selected: true, category: "bespoke_suit" },
  { id: "trouser", name: "Trousers", type: "trouser", selected: true, category: "bespoke_suit" },
  { id: "shirt", name: "Bespoke Shirt", type: "shirt", selected: true, category: "bespoke_suit" },
  { id: "waistcoat", name: "Waistcoat", type: "waistcoat", selected: false, category: "bespoke_suit" },
];

/* ========================================================================= */
/* PRECISE SVG VECTOR SILHOUETTE ICONS MATCHING REFERENCE AESTHETIC          */
/* ========================================================================= */

function KurtaIcon({ className = "w-14 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  const dotColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mandarin Collar */}
      <path d="M34 10C36 8 44 8 46 10L48 14H32L34 10Z" fill={fillColor} />
      {/* Kurta Body & Sleeves */}
      <path
        d="M32 14L16 28L23 35L29 27V88H38V50H42V88H51V27L57 35L64 28L48 14H32Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Placket line & pocket */}
      <line x1="40" y1="14" x2="40" y2="38" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <rect x="44" y="26" width="6" height="4" rx="1" fill={dotColor} opacity="0.8" />
      {/* Buttons */}
      <circle cx="40" cy="18" r="1.1" fill={dotColor} />
      <circle cx="40" cy="24" r="1.1" fill={dotColor} />
      <circle cx="40" cy="30" r="1.1" fill={dotColor} />
    </svg>
  );
}

function PajamaIcon({ className = "w-12 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 70 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Waistband */}
      <rect x="22" y="10" width="26" height="4" rx="1" fill={fillColor} />
      {/* Churidar / Pleated Trousers Legs */}
      <path
        d="M22 14L24 50L28 88H33L35 36L37 88H42L46 50L48 14H22Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Fabric gathering / pleat lines */}
      <path d="M26 58C29 60 28 62 31 63" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M39 58C42 60 41 62 44 63" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M27 70C30 72 29 74 32 75" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      <path d="M38 70C41 72 40 74 43 75" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function SadriIcon({ className = "w-14 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mandarin Collar */}
      <path d="M33 12C36 10 44 10 47 12L49 16H31L33 12Z" fill={fillColor} />
      {/* Sleeveless Nehru Jacket Body */}
      <path
        d="M31 16L24 23L27 34L26 78L40 82L54 78L53 34L56 23L49 16H31Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Center opening line */}
      <line x1="40" y1="16" x2="40" y2="82" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      {/* Buttons */}
      <circle cx="40" cy="24" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="32" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="40" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="48" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="56" r="1.2" fill={strokeColor} />
      {/* Chest pocket & twin lower jetted pockets */}
      <line x1="44" y1="28" x2="50" y2="28" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <line x1="30" y1="58" x2="36" y2="58" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
      <line x1="44" y1="58" x2="50" y2="58" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

function CoatIcon({ className = "w-16 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tailored Coat / Blazer with Lapels */}
      <path
        d="M32 14L15 26L21 44L22 84L42 86L62 84L63 44L69 26L52 14H32Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Inner lapel cuts */}
      <path d="M32 14L37 36L42 56L47 36L52 14" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="42" y1="56" x2="42" y2="86" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
      {/* Buttons */}
      <circle cx="42" cy="62" r="1.3" fill={strokeColor} />
      <circle cx="42" cy="70" r="1.3" fill={strokeColor} />
      {/* Flap pockets & welt breast pocket */}
      <line x1="48" y1="36" x2="54" y2="36" stroke={strokeColor} strokeWidth="1.4" strokeLinecap="round" />
      <rect x="25" y="66" width="9" height="3" rx="0.5" fill={strokeColor} opacity="0.85" />
      <rect x="50" y="66" width="9" height="3" rx="0.5" fill={strokeColor} opacity="0.85" />
    </svg>
  );
}

function BespokeShirtIcon({ className = "w-14 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cutaway Collar */}
      <path d="M30 14L36 20L40 16L44 20L50 14L40 10L30 14Z" fill={fillColor} />
      {/* Shirt Body with Cuffs */}
      <path
        d="M30 14L14 26L20 34L26 27V82L40 84L54 82V27L60 34L66 26L50 14H30Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Placket */}
      <line x1="40" y1="18" x2="40" y2="84" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="40" cy="28" r="1.1" fill={strokeColor} />
      <circle cx="40" cy="38" r="1.1" fill={strokeColor} />
      <circle cx="40" cy="48" r="1.1" fill={strokeColor} />
      <circle cx="40" cy="58" r="1.1" fill={strokeColor} />
      {/* Pocket */}
      <rect x="44" y="32" width="6" height="6" rx="1" fill={strokeColor} opacity="0.7" />
    </svg>
  );
}

function TrouserIcon({ className = "w-12 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 70 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Waistband & loops */}
      <rect x="22" y="10" width="26" height="5" rx="1" fill={fillColor} />
      {/* Straight tailored legs */}
      <path
        d="M22 15L24 50L26 86H33L35 38L37 86H44L46 50L48 15H22Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Crease lines */}
      <line x1="29.5" y1="20" x2="29.5" y2="84" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
      <line x1="40.5" y1="20" x2="40.5" y2="84" stroke={strokeColor} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function WaistcoatIcon({ className = "w-14 h-16", isChecked = false }: { className?: string; isChecked?: boolean }) {
  const fillColor = isChecked ? "#4A202A" : "#8C7B83";
  const strokeColor = "#FAF8F5";
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* V-Neck Cut */}
      <path
        d="M32 14L24 22L27 34L26 78L40 85L54 78L53 34L56 22L48 14L40 32L32 14Z"
        fill={fillColor}
        filter="drop-shadow(0px 2px 4px rgba(74,32,42,0.12))"
      />
      {/* Center line & buttons */}
      <line x1="40" y1="32" x2="40" y2="85" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="40" cy="40" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="48" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="56" r="1.2" fill={strokeColor} />
      <circle cx="40" cy="64" r="1.2" fill={strokeColor} />
      {/* Welt pockets */}
      <line x1="29" y1="52" x2="35" y2="52" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
      <line x1="45" y1="52" x2="51" y2="52" stroke={strokeColor} strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* ========================================================================= */
/* MAIN COMPONENT: CustomOutfitHero                                          */
/* ========================================================================= */

export default function CustomOutfitHero() {
  const [activeCategory, setActiveCategory] = useState<OutfitCategory>("ethnic");
  const [garments, setGarments] = useState<OutfitGarment[]>(INITIAL_GARMENTS);

  const toggleGarment = (id: string) => {
    setGarments((prev) =>
      prev.map((g) => (g.id === id ? { ...g, selected: !g.selected } : g))
    );
  };

  const currentCategoryGarments = garments.filter((g) => g.category === activeCategory);
  const selectedCount = currentCategoryGarments.filter((g) => g.selected).length;

  const handleStartCustomizing = () => {
    const target = document.getElementById("curated-starting-points") || document.getElementById("appointment-booking");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartDesigning = () => {
    const target = document.getElementById("curated-starting-points") || document.getElementById("appointment-booking");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Content configuration based on active category
  const isEthnic = activeCategory === "ethnic";

  const heroTitle = isEthnic
    ? "Custom Kurta Pajama Sets for Men"
    : "Custom Bespoke Suits & Sets for Men";
  const heroDescription = isEthnic
    ? "Design a complete ethnic set for men — build the kurta and pajama together, add a Nehru jacket or coat, and have it tailored to your exact measurements for weddings and festive occasions."
    : "Design a complete bespoke suit set for men — build the tailored jacket and trousers together, add a crisp bespoke shirt or waistcoat, and have it hand-cut to your unique posture in Delhi NCR.";

  return (
    <section className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden bg-[#FBF9F7] select-none pt-[76px] sm:pt-[92px] lg:pt-[100px] pb-12 sm:pb-16 border-b border-[#DDD2D8]">
      {/* ===================================================================== */}
      {/* 1. CINEMATIC DAYLIGHT PALACE PHOTOSHOOT (PURE & CLEAR - ZERO SHADE)   */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banners/outfit_hero_bg.jpg"
          alt="Gentleman in bespoke tailored burgundy kurta outfit in sunlit royal palace"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ===================================================================== */}
      {/* 2. HERO CONTENT GRID: EDITORIAL COPY (LEFT) & OUTFIT BUILDER (RIGHT)  */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: HERO HEADLINE, BADGES, PARAGRAPH, CTA BUTTONS        */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 text-left space-y-4 sm:space-y-6">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9E774C] inline-block" />
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#9E774C]">
                SUITOHOLIC BESPOKE ATELIER
              </span>
              <span className="w-1.5 h-1.5 rotate-45 bg-[#9E774C] inline-block" />
            </div>

            {/* Main Editorial Headline */}
            <h1 className="cormorant-garamond-700 text-3xl sm:text-4xl md:text-[38px] lg:text-[42px] xl:text-[45px] font-bold text-[#14110E] tracking-tight leading-[1.12]">
              {isEthnic ? (
                <>
                  Custom Kurta Pajama{" "}
                  <span className="text-[#4A202A] italic font-serif">Sets for Men</span>
                </>
              ) : (
                <>
                  Custom Bespoke{" "}
                  <span className="text-[#4A202A] italic font-serif">Suits for Men</span>
                </>
              )}
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-[14px] text-[#3D332B] font-sans font-normal leading-[1.75] max-w-md">
              {heroDescription}
            </p>

            {/* Action Buttons: START DESIGNING & VIEW COLLECTION */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Primary Burgundy Button */}
              <button
                type="button"
                onClick={handleStartDesigning}
                style={{ borderRadius: "7px" }}
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#4A202A] hover:bg-[#34141D] active:scale-[0.98] text-[#FAF8F5] font-extrabold text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
              >
                <span>START DESIGNING</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </button>

              {/* Secondary Light Palette Luxury Outline Button */}
              <Link
                href="/shop"
                style={{ borderRadius: "7px" }}
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-white/95 hover:bg-white border border-[#DDD2D8] hover:border-[#4A202A] active:scale-[0.98] text-[#14110E] hover:text-[#4A202A] font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer group shadow-2xs hover:shadow-sm"
              >
                <span>VIEW COLLECTION</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* ================================================================= */}
          {/* MIDDLE CLEAR COLUMN: OPEN WINDOW WHERE CENTERED MODEL STANDS      */}
          {/* ================================================================= */}
          <div className="hidden lg:block lg:col-span-2 xl:col-span-2 pointer-events-none" />

          {/* ================================================================= */}
          {/* RIGHT COLUMN: FLOATING "BUILD YOUR OUTFIT" INTERACTIVE CARD        */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div
              style={{ borderRadius: "7px" }}
              className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl border border-[#DDD2D8] shadow-[0_16px_40px_rgba(74,32,42,0.08)] p-5 sm:p-6 lg:p-7 relative overflow-hidden"
            >
              {/* Subtle Ambient Brand Glow Behind Card */}
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#9E774C]/15 blur-3xl rounded-full" />

              {/* Card Header Title */}
              <div className="text-center mb-4">
                <h3 className="font-serif-luxury text-xs sm:text-sm font-bold tracking-[0.24em] uppercase text-[#4A202A]">
                  BUILD YOUR OUTFIT
                </h3>
              </div>

              {/* Category Preset Switcher: Ethnic Set vs. Bespoke Suit */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveCategory("ethnic")}
                  style={{ borderRadius: "7px" }}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isEthnic
                      ? "bg-[#4A202A] text-[#FAF8F5] shadow-xs font-extrabold"
                      : "bg-[#EEE5EA]/70 hover:bg-[#EEE5EA] text-[#5A4E42] border border-[#DDD2D8]"
                  }`}
                >
                  Ethnic Set
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("bespoke_suit")}
                  style={{ borderRadius: "7px" }}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    !isEthnic
                      ? "bg-[#4A202A] text-[#FAF8F5] shadow-xs font-extrabold"
                      : "bg-[#EEE5EA]/70 hover:bg-[#EEE5EA] text-[#5A4E42] border border-[#DDD2D8]"
                  }`}
                >
                  Bespoke Suit
                </button>
              </div>

              {/* 2x2 Interactive Garment Grid matching reference screenshot */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mb-4">
                {currentCategoryGarments.map((garment) => {
                  const isChecked = garment.selected;
                  return (
                    <div
                      key={garment.id}
                      onClick={() => toggleGarment(garment.id)}
                      style={{ borderRadius: "7px" }}
                      className={`relative flex flex-col justify-between p-3.5 sm:p-4 min-h-[148px] sm:min-h-[160px] transition-all duration-300 cursor-pointer select-none group ${
                        isChecked
                          ? "bg-[#FAF6F8] border-2 border-[#4A202A] ring-1 ring-[#4A202A]/20 shadow-xs"
                          : "bg-white border border-[#DDD2D8] hover:border-[#9E774C]/60 hover:bg-[#FAF6F8]"
                      }`}
                    >
                      {/* Top Bar: Garment Name & Toggle Indicator */}
                      <div className="flex items-center justify-between gap-1 w-full z-10">
                        <span className={`text-xs sm:text-[13px] font-bold ${isChecked ? "text-[#4A202A]" : "text-[#5A4E42] group-hover:text-[#14110E]"}`}>
                          {garment.name}
                        </span>

                        {/* Round Checkmark or Plus Circle */}
                        {isChecked ? (
                          <div className="w-5 h-5 rounded-full bg-[#4A202A] text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#EEE5EA] text-[#5A4E42] border border-[#DDD2D8] flex items-center justify-center shrink-0 group-hover:border-[#9E774C]/60 group-hover:text-[#4A202A]">
                            <Plus size={11} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>

                      {/* Center: Vector Garment Silhouette with subtle animation */}
                      <div className="flex-1 flex items-center justify-center py-2 transition-transform duration-300 group-hover:scale-105">
                        {garment.type === "kurta" && <KurtaIcon isChecked={isChecked} />}
                        {garment.type === "pajama" && <PajamaIcon isChecked={isChecked} />}
                        {garment.type === "sadri" && <SadriIcon isChecked={isChecked} />}
                        {garment.type === "coat" && <CoatIcon isChecked={isChecked} />}
                        {garment.type === "shirt" && <BespokeShirtIcon isChecked={isChecked} />}
                        {garment.type === "trouser" && <TrouserIcon isChecked={isChecked} />}
                        {garment.type === "waistcoat" && <WaistcoatIcon isChecked={isChecked} />}
                        {garment.type === "blazer" && <CoatIcon isChecked={isChecked} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Pill: Garments Selected count */}
              <div className="text-center mb-4">
                <span className="inline-block text-[11px] text-[#5A4E42] font-semibold tracking-wide">
                  {selectedCount} of 4 Garments Selected • 100% Fit Guarantee
                </span>
              </div>

              {/* Wide CTA Button: START CUSTOMIZING > */}
              <button
                type="button"
                onClick={handleStartCustomizing}
                style={{ borderRadius: "7px" }}
                className="w-full py-3.5 sm:py-4 bg-[#4A202A] hover:bg-[#34141D] active:scale-[0.99] text-[#FAF8F5] font-extrabold text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>START CUSTOMIZING</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
