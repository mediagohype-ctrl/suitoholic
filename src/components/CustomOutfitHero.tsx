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

function KurtaIcon({ className = "w-14 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mandarin Collar */}
      <path d="M34 10C36 8 44 8 46 10L48 14H32L34 10Z" fill="#FAF8F5" />
      {/* Kurta Body & Sleeves */}
      <path
        d="M32 14L16 28L23 35L29 27V88H38V50H42V88H51V27L57 35L64 28L48 14H32Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Placket line & pocket */}
      <line x1="40" y1="14" x2="40" y2="38" stroke="#14110E" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="44" y="26" width="6" height="4" rx="1" fill="#14110E" opacity="0.6" />
      {/* Buttons */}
      <circle cx="40" cy="18" r="1" fill="#14110E" />
      <circle cx="40" cy="24" r="1" fill="#14110E" />
      <circle cx="40" cy="30" r="1" fill="#14110E" />
    </svg>
  );
}

function PajamaIcon({ className = "w-12 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Waistband */}
      <rect x="22" y="10" width="26" height="4" rx="1" fill="#FAF8F5" />
      {/* Churidar / Pleated Trousers Legs */}
      <path
        d="M22 14L24 50L28 88H33L35 36L37 88H42L46 50L48 14H22Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Fabric gathering / pleat lines */}
      <path d="M26 58C29 60 28 62 31 63" stroke="#14110E" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M39 58C42 60 41 62 44 63" stroke="#14110E" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M27 70C30 72 29 74 32 75" stroke="#14110E" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M38 70C41 72 40 74 43 75" stroke="#14110E" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function SadriIcon({ className = "w-14 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Mandarin Collar */}
      <path d="M33 12C36 10 44 10 47 12L49 16H31L33 12Z" fill="#FAF8F5" />
      {/* Sleeveless Nehru Jacket Body */}
      <path
        d="M31 16L24 23L27 34L26 78L40 82L54 78L53 34L56 23L49 16H31Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Center opening line */}
      <line x1="40" y1="16" x2="40" y2="82" stroke="#14110E" strokeWidth="1.2" strokeLinecap="round" />
      {/* Buttons */}
      <circle cx="40" cy="24" r="1.2" fill="#14110E" />
      <circle cx="40" cy="32" r="1.2" fill="#14110E" />
      <circle cx="40" cy="40" r="1.2" fill="#14110E" />
      <circle cx="40" cy="48" r="1.2" fill="#14110E" />
      <circle cx="40" cy="56" r="1.2" fill="#14110E" />
      {/* Chest pocket & twin lower jetted pockets */}
      <line x1="44" y1="28" x2="50" y2="28" stroke="#14110E" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="30" y1="58" x2="36" y2="58" stroke="#14110E" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="44" y1="58" x2="50" y2="58" stroke="#14110E" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function CoatIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Tailored Coat / Blazer with Lapels */}
      <path
        d="M32 14L15 26L21 44L22 84L42 86L62 84L63 44L69 26L52 14H32Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Inner lapel cuts */}
      <path d="M32 14L37 36L42 56L47 36L52 14" stroke="#14110E" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="42" y1="56" x2="42" y2="86" stroke="#14110E" strokeWidth="1.4" strokeLinecap="round" />
      {/* Buttons */}
      <circle cx="42" cy="62" r="1.3" fill="#14110E" />
      <circle cx="42" cy="70" r="1.3" fill="#14110E" />
      {/* Flap pockets & welt breast pocket */}
      <line x1="48" y1="36" x2="54" y2="36" stroke="#14110E" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="25" y="66" width="9" height="3" rx="0.5" fill="#14110E" opacity="0.7" />
      <rect x="50" y="66" width="9" height="3" rx="0.5" fill="#14110E" opacity="0.7" />
    </svg>
  );
}

function BespokeShirtIcon({ className = "w-14 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Cutaway Collar */}
      <path d="M30 14L36 20L40 16L44 20L50 14L40 10L30 14Z" fill="#FAF8F5" />
      {/* Shirt Body with Cuffs */}
      <path
        d="M30 14L14 26L20 34L26 27V82L40 84L54 82V27L60 34L66 26L50 14H30Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Placket */}
      <line x1="40" y1="18" x2="40" y2="84" stroke="#14110E" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="40" cy="28" r="1" fill="#14110E" />
      <circle cx="40" cy="38" r="1" fill="#14110E" />
      <circle cx="40" cy="48" r="1" fill="#14110E" />
      <circle cx="40" cy="58" r="1" fill="#14110E" />
      {/* Pocket */}
      <rect x="44" y="32" width="6" height="6" rx="1" fill="#14110E" opacity="0.5" />
    </svg>
  );
}

function TrouserIcon({ className = "w-12 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Waistband & loops */}
      <rect x="22" y="10" width="26" height="5" rx="1" fill="#FAF8F5" />
      {/* Straight tailored legs */}
      <path
        d="M22 15L24 50L26 86H33L35 38L37 86H44L46 50L48 15H22Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Crease lines */}
      <line x1="29.5" y1="20" x2="29.5" y2="84" stroke="#14110E" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="40.5" y1="20" x2="40.5" y2="84" stroke="#14110E" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function WaistcoatIcon({ className = "w-14 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 96" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* V-Neck Cut */}
      <path
        d="M32 14L24 22L27 34L26 78L40 85L54 78L53 34L56 22L48 14L40 32L32 14Z"
        fill="#FAF8F5"
        filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.3))"
      />
      {/* Center line & buttons */}
      <line x1="40" y1="32" x2="40" y2="85" stroke="#14110E" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="40" cy="40" r="1.2" fill="#14110E" />
      <circle cx="40" cy="48" r="1.2" fill="#14110E" />
      <circle cx="40" cy="56" r="1.2" fill="#14110E" />
      <circle cx="40" cy="64" r="1.2" fill="#14110E" />
      {/* Welt pockets */}
      <line x1="29" y1="52" x2="35" y2="52" stroke="#14110E" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
      <line x1="45" y1="52" x2="51" y2="52" stroke="#14110E" strokeWidth="1.3" strokeLinecap="round" opacity="0.8" />
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
    // Smooth scroll down to starting points / configurator
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
    <section className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center overflow-hidden bg-[#0F0D0B] select-none pt-[76px] sm:pt-[92px] lg:pt-[100px] pb-12 sm:pb-16 border-b border-[#2C241E]">
      {/* ===================================================================== */}
      {/* 1. CINEMATIC BACKGROUND IMAGE (HERO PALACE ATELIER PHOTOSHOOT)       */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banners/outfit_hero_bg.jpg"
          alt="Gentleman in bespoke tailored outfit in palace atelier"
          className="w-full h-full object-cover object-[center_right] sm:object-center filter brightness-[0.92] contrast-[1.05]"
        />
        
        {/* Deep luxury vignettes for crystal-clear text readability */}
        {/* Left Editorial Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0D0B]/95 via-[#0F0D0B]/75 to-transparent sm:w-[65%]" />
        
        {/* Right Subtle Dark Vignette behind outfit card */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#0F0D0B]/85 via-[#0F0D0B]/40 to-transparent sm:w-[50%] ml-auto" />
        
        {/* Bottom feathering gradient into following sections */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0F0D0B] via-[#0F0D0B]/50 to-transparent" />
      </div>

      {/* ===================================================================== */}
      {/* 2. HERO CONTENT GRID: EDITORIAL COPY (LEFT) & OUTFIT BUILDER (RIGHT)  */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: HERO HEADLINE, BADGES, PARAGRAPH, CTA BUTTONS        */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 xl:col-span-7 text-left space-y-4 sm:space-y-6">
            {/* Main Editorial Headline */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[52px] xl:text-[58px] font-bold text-[#FAF8F5] tracking-tight leading-[1.08] drop-shadow-sm">
              {heroTitle}
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base text-[#DCD1C5] font-sans font-light leading-[1.75] max-w-xl drop-shadow-xs">
              {heroDescription}
            </p>

            {/* Action Buttons: START DESIGNING & VIEW COLLECTION */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Primary Amber/Gold Button */}
              <button
                type="button"
                onClick={handleStartDesigning}
                style={{ borderRadius: "7px" }}
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#C59B6A] hover:bg-[#D5AB7B] active:scale-[0.98] text-[#14110E] font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 shadow-lg hover:shadow-[#C59B6A]/30 cursor-pointer group"
              >
                <span>START DESIGNING</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </button>

              {/* Secondary Dark Outline Glass Button */}
              <Link
                href="/shop"
                style={{ borderRadius: "7px" }}
                className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-[#14110E]/60 hover:bg-[#14110E]/85 backdrop-blur-md border border-[#FAF8F5]/30 hover:border-[#FAF8F5]/60 active:scale-[0.98] text-[#FAF8F5] font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 cursor-pointer group"
              >
                <span>VIEW COLLECTION</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: FLOATING "BUILD YOUR OUTFIT" INTERACTIVE CARD        */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div
              style={{ borderRadius: "7px" }}
              className="w-full max-w-[420px] bg-[#181411]/90 backdrop-blur-xl border border-[#C59B6A]/35 shadow-[0_25px_60px_rgba(0,0,0,0.75)] p-5 sm:p-6 lg:p-7 relative overflow-hidden"
            >
              {/* Subtle Ambient Gold Radial Glow Behind Card */}
              <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-36 bg-[#C59B6A]/15 blur-3xl rounded-full" />

              {/* Card Header Title */}
              <div className="text-center mb-4">
                <h3 className="font-serif-luxury text-xs sm:text-sm font-bold tracking-[0.24em] uppercase text-[#E0C097]">
                  BUILD YOUR OUTFIT
                </h3>
              </div>

              {/* Category Preset Switcher: Ethnic Set vs. Bespoke Suit */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveCategory("ethnic")}
                  style={{ borderRadius: "7px" }}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isEthnic
                      ? "bg-[#C59B6A] text-[#14110E] shadow-xs"
                      : "bg-white/5 hover:bg-white/10 text-[#C4B7AB] border border-white/10"
                  }`}
                >
                  Ethnic Set
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCategory("bespoke_suit")}
                  style={{ borderRadius: "7px" }}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    !isEthnic
                      ? "bg-[#C59B6A] text-[#14110E] shadow-xs"
                      : "bg-white/5 hover:bg-white/10 text-[#C4B7AB] border border-white/10"
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
                          ? "bg-[#251E1A]/90 border border-[#C59B6A] ring-1 ring-[#C59B6A]/35 shadow-[0_0_20px_rgba(197,155,106,0.18)]"
                          : "bg-[#1F1916]/80 border border-white/10 hover:border-white/25 hover:bg-[#251E1A]/60"
                      }`}
                    >
                      {/* Top Bar: Garment Name & Toggle Indicator */}
                      <div className="flex items-center justify-between gap-1 w-full z-10">
                        <span className="text-xs sm:text-[13px] font-semibold text-[#F5EFEB] group-hover:text-white">
                          {garment.name}
                        </span>

                        {/* Round Checkmark or Plus Circle */}
                        {isChecked ? (
                          <div className="w-5 h-5 rounded-full bg-[#C59B6A] text-[#14110E] flex items-center justify-center shrink-0 shadow-xs">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-white/10 text-white/50 border border-white/20 flex items-center justify-center shrink-0 group-hover:text-white group-hover:border-white/40">
                            <Plus size={11} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>

                      {/* Center: Vector Garment Silhouette with subtle glow */}
                      <div className="flex-1 flex items-center justify-center py-2 transition-transform duration-300 group-hover:scale-105">
                        {garment.type === "kurta" && <KurtaIcon />}
                        {garment.type === "pajama" && <PajamaIcon />}
                        {garment.type === "sadri" && <SadriIcon />}
                        {garment.type === "coat" && <CoatIcon />}
                        {garment.type === "shirt" && <BespokeShirtIcon />}
                        {garment.type === "trouser" && <TrouserIcon />}
                        {garment.type === "waistcoat" && <WaistcoatIcon />}
                        {garment.type === "blazer" && <CoatIcon />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Pill: Garments Selected count */}
              <div className="text-center mb-4">
                <span className="inline-block text-[11px] text-[#C4B7AB] font-mono tracking-wide">
                  {selectedCount} of 4 Garments Selected • 100% Fit Guarantee
                </span>
              </div>

              {/* Wide CTA Button: START CUSTOMIZING > */}
              <button
                type="button"
                onClick={handleStartCustomizing}
                style={{ borderRadius: "7px" }}
                className="w-full py-3.5 sm:py-4 bg-[#C59B6A] hover:bg-[#D5AB7B] active:scale-[0.99] text-[#14110E] font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
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
