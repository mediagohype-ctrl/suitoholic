"use client";

import React, { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import { ZoomIn, ArrowRight } from "lucide-react";

export interface HeroFabricItem {
  id: string;
  tabLabel: string;
  millBrand: string;
  title: string;
  weight: string;
  composition: string;
  season: string;
  weave: string;
  origin: string;
  softness: number;
  durability: number;
  drape: number;
  image: string;
  code: string;
}

export const HERO_FABRIC_ITEMS: HeroFabricItem[] = [
  {
    id: "fabric-superviola-sand",
    tabLabel: "SAND LINEN",
    millBrand: "SUITOHOLIC ATELIER • NORMANDY FLAX, FRANCE",
    title: "Superviola Sand Flax Linen",
    weight: "155 g/m²",
    composition: "100% Pure Artisanal Normandy Flax Linen",
    season: "Spring / Summer Breathable",
    weave: "Natural Slub Textural Cross-Weave",
    origin: "Normandy Flax Fields, France",
    softness: 88,
    durability: 96,
    drape: 92,
    image: "/detail_fabric_macro.jpg",
    code: "V-13672/06",
  },
  {
    id: "fabric-sh403-royal",
    tabLabel: "BENGAL STRIPE",
    millBrand: "SUITOHOLIC ATELIER • NILE DELTA & BIELLA",
    title: "Royal Bengal Banker Stripe",
    weight: "120 g/m²",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    season: "All-Season Sartorial",
    weave: "High-Density Fine Twill Weave",
    origin: "Nile Delta Harvest • Spun in Italy",
    softness: 94,
    durability: 91,
    drape: 95,
    image: "/fabric_roll_charcoal_wool.jpg",
    code: "SH-403-BL",
  },
  {
    id: "fabric-sh403-rose",
    tabLabel: "ROSE STRIPE",
    millBrand: "SUITOHOLIC ATELIER • BIELLA MILLS, ITALY",
    title: "Blossom Rose Banker Stripe",
    weight: "120 g/m²",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    season: "All-Season Executive",
    weave: "Precision Micro-Twill Candy Stripe",
    origin: "Alexandria Delta • Finished in Biella, Italy",
    softness: 95,
    durability: 90,
    drape: 93,
    image: "/formal_white_twill.jpg",
    code: "SH-403-RS",
  },
  {
    id: "fabric-bordeaux-silk",
    tabLabel: "DARK TWILL",
    millBrand: "SUITOHOLIC ATELIER • COMO MILLS, NORTHERN ITALY",
    title: "Deep Espresso Silk Twill",
    weight: "145 g/m²",
    composition: "100% Pure Mulberry Silk & Giza Cotton",
    season: "Evening Black-Tie Structured",
    weave: "High-Luster Intricate Jacquard Luster",
    origin: "Como Historic Mills, Northern Italy",
    softness: 97,
    durability: 89,
    drape: 96,
    image: "/dark_fabric.jpg",
    code: "SJ-200-BX",
  },
];

interface FabricHeroShowcaseBannerProps {
  onSelectFabricForCustomization?: (fabricCode: string) => void;
  onRequestSwatch?: (fabricId: string) => void;
  activeFabricId?: string;
}

export default function FabricHeroShowcaseBanner({
  onSelectFabricForCustomization,
  onRequestSwatch,
  activeFabricId,
}: FabricHeroShowcaseBannerProps) {
  const activeFabric = (activeFabricId ? HERO_FABRIC_ITEMS.find((f) => f.id === activeFabricId || f.code === activeFabricId) : null) || HERO_FABRIC_ITEMS[0];

  // Magnifier inspection state
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !e.touches[0]) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setMousePos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
    setIsHovering(true);
  };

  return (
    <section 
      aria-label="Interactive Bespoke Fabric Weave Showcase"
      className="relative w-full pt-20 sm:pt-24 bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F8] to-[#EEE5EA] text-[#14110E] select-none border-b border-[#DDD2D8]"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[580px] sm:min-h-[620px] lg:min-h-[660px]">
        
        {/* =================================================================== */}
        {/* LEFT COLUMN: INTERACTIVE MACRO WEAVE TEXTURE WITH HOVER LENS ZOOM   */}
        {/* =================================================================== */}
        <div 
          ref={imageContainerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsHovering(true)}
          onTouchEnd={() => setIsHovering(false)}
          onTouchMove={handleTouchMove}
          className="relative lg:col-span-6 w-full h-[440px] sm:h-[520px] lg:h-full min-h-[460px] lg:min-h-[620px] overflow-hidden bg-[#FAF6F8] cursor-crosshair group select-none lg:border-r border-[#DDD2D8]"
        >
          {/* Base Fabric Texture with Dynamic Zoom Origin */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeFabric.image}
            src={activeFabric.image}
            alt={`${activeFabric.title} Weave Texture`}
            className="w-full h-full object-cover object-top sm:object-center transition-transform duration-150 ease-out will-change-transform"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isHovering ? "scale(2.4)" : "scale(1.0)",
            }}
            loading="eager"
          />

          {/* Clean Subtle Ambient Lighting Sheen (Light Theme) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />

          {/* Centered "HOVER TO INSPECT WEAVE" Badge in Crisp Luxury Light Glass */}
          <div
            className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${
              isHovering ? "opacity-0 scale-90" : "opacity-100 scale-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center p-3.5 sm:p-4 bg-white/95 backdrop-blur-md border border-[#DDD2D8] rounded-full shadow-[0_12px_32px_rgba(74,32,42,0.12)]">
              <div className="w-10 h-10 rounded-full bg-[#EEE5EA] border border-[#DDD2D8] flex items-center justify-center mb-1 shadow-2xs">
                <ZoomIn size={18} className="text-[#4A202A] stroke-[2.2]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#4A202A] px-3">
                HOVER TO INSPECT WEAVE
              </span>
            </div>
          </div>


          {/* Top Right Corner: Zoom Factor indicator when active */}
          {isHovering && (
            <div className="pointer-events-none absolute top-4 right-4 z-10 px-3 py-1.5 bg-[#4A202A] text-[#FAF8F5] backdrop-blur-md rounded border border-[#9E774C]/50 text-[10px] font-mono font-bold shadow-md">
              2.4X MACRO ZOOM
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* RIGHT COLUMN: LUXURY LIGHT THEME SPECIFICATIONS, TABS & METRICS     */}
        {/* =================================================================== */}
        <div className="lg:col-span-6 w-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-gradient-to-br from-[#FFFFFF] via-[#FAF6F8] to-[#EEE5EA] relative overflow-hidden text-left">
          
          {/* Subtle Warm Amber/Burgundy Glow in background */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-[#4A202A]/5 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-[#9E774C]/8 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6 sm:space-y-7">
            

            {/* Main Title in Luxury Cormorant Garamond Serif */}
            <div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-[#14110E] uppercase tracking-[0.02em] leading-[1.08]">
                {activeFabric.title}
              </h1>
            </div>

            {/* 4-Item Technical Specifications Grid (2 columns) */}
            <div className="grid grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-4 pt-1 sm:pt-2 border-t border-[#DDD2D8]">
              {/* Weight */}
              <div className="space-y-0.5">
                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#9E774C] block">
                  WEIGHT
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#14110E]">
                  {activeFabric.weight}
                </span>
              </div>

              {/* Composition */}
              <div className="space-y-0.5">
                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#9E774C] block">
                  COMPOSITION
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#14110E] line-clamp-1">
                  {activeFabric.composition}
                </span>
              </div>

              {/* Ideal Season */}
              <div className="space-y-0.5">
                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#9E774C] block">
                  IDEAL SEASON
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#14110E]">
                  {activeFabric.season}
                </span>
              </div>

              {/* Weave Structure */}
              <div className="space-y-0.5">
                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#9E774C] block">
                  WEAVE
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#14110E] line-clamp-1">
                  {activeFabric.weave}
                </span>
              </div>

              {/* Origin / Mill */}
              <div className="space-y-0.5 col-span-2">
                <span className="text-[9.5px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#9E774C] block">
                  ORIGIN
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#14110E]">
                  {activeFabric.origin}
                </span>
              </div>
            </div>

            {/* Performance & Attribute Progress Bars */}
            <div className="space-y-3 pt-2 sm:pt-3 border-t border-[#DDD2D8]">
              
              {/* Softness */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em]">
                  <span className="text-[#14110E]">SOFTNESS</span>
                  <span className="text-[#9E774C] font-mono font-bold">{activeFabric.softness}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#DDD2D8]/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9E774C] to-[#4A202A] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${activeFabric.softness}%` }}
                  />
                </div>
              </div>

              {/* Durability */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em]">
                  <span className="text-[#14110E]">DURABILITY</span>
                  <span className="text-[#9E774C] font-mono font-bold">{activeFabric.durability}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#DDD2D8]/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9E774C] to-[#4A202A] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${activeFabric.durability}%` }}
                  />
                </div>
              </div>

              {/* Drape */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.16em]">
                  <span className="text-[#14110E]">DRAPE</span>
                  <span className="text-[#9E774C] font-mono font-bold">{activeFabric.drape}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#DDD2D8]/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#9E774C] to-[#4A202A] transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${activeFabric.drape}%` }}
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Action Row at Bottom */}
          <div className="pt-6 sm:pt-8 flex flex-wrap items-center gap-3 sm:gap-4 relative z-10">
            {/* Customizer Button */}
            <Link
              href={`/custom-shirt?fabric=${activeFabric.code}`}
              style={{ borderRadius: "7px" }}
              className="inline-flex items-center gap-2 bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.18em] py-3.5 px-6 sm:px-7 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
            >
              <span>CUSTOMIZE IN THIS FABRIC</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Request Physical Swatch Link / Scroll down */}
            <button
              type="button"
              onClick={() => {
                const studioEl = document.getElementById("swatches-studio");
                if (studioEl) {
                  studioEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{ borderRadius: "7px" }}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF8F5] border border-[#DDD2D8] hover:border-[#4A202A] text-[#14110E] hover:text-[#4A202A] text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] py-3.5 px-5 sm:px-6 transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-sm"
            >
              <span>EXPLORE ALL SWATCHES</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
