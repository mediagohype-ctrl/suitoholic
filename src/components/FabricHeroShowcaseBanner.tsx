"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { ZoomIn } from "lucide-react";

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
      className="relative w-full h-[100dvh] min-h-[580px] sm:min-h-[640px] overflow-hidden bg-[#FAF6F8] select-none border-b border-[#DDD2D8]"
    >
      <div 
        ref={imageContainerRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsHovering(true)}
        onTouchEnd={() => setIsHovering(false)}
        onTouchMove={handleTouchMove}
        className="relative w-full h-full overflow-hidden bg-[#FAF6F8] cursor-crosshair group select-none"
      >
        {/* Base Fabric Texture with Dynamic Zoom Origin */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeFabric.image}
          src={activeFabric.image}
          alt={`${activeFabric.title} Weave Texture`}
          className="w-full h-full object-cover object-center transition-transform duration-150 ease-out will-change-transform"
          style={{
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isHovering ? "scale(2.4)" : "scale(1.0)",
          }}
          loading="eager"
        />

        {/* Clean Subtle Ambient Lighting Sheen (Light Theme) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10" />
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
          <div className="pointer-events-none absolute top-24 sm:top-28 right-4 sm:right-8 z-10 px-3 py-1.5 bg-[#4A202A] text-[#FAF8F5] backdrop-blur-md rounded border border-[#9E774C]/50 text-[10px] font-mono font-bold shadow-md">
            2.4X MACRO ZOOM
          </div>
        )}
      </div>
    </section>
  );
}
