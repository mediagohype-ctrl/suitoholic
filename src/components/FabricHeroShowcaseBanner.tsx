"use client";

import React, { useState, useRef, MouseEvent } from"react";
import { ZoomIn } from"lucide-react";

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
    id:"fabric-superviola-sand",
    tabLabel:"SAND LINEN",
    millBrand:"SUITOHOLIC ATELIER • NORMANDY FLAX, FRANCE",
    title:"Superviola Sand Flax Linen",
    weight:"155 g/m²",
    composition:"100% Pure Artisanal Normandy Flax Linen",
    season:"Spring / Summer Breathable",
    weave:"Natural Slub Textural Cross-Weave",
    origin:"Normandy Flax Fields, France",
    softness: 88,
    durability: 96,
    drape: 92,
    image:"/api/media/6/whatsapp-image-2026-10-27-at-1-06-36-pm-3.jpeg",
    code:"V-13672/06",
  },
  {
    id:"fabric-sh403-royal",
    tabLabel:"BENGAL STRIPE",
    millBrand:"SUITOHOLIC ATELIER • NILE DELTA & BIELLA",
    title:"Royal Bengal Banker Stripe",
    weight:"120 g/m²",
    composition:"100% Egyptian Giza 140s Cotton (2-Ply)",
    season:"All-Season Sartorial",
    weave:"High-Density Fine Twill Weave",
    origin:"Nile Delta Harvest • Spun in Italy",
    softness: 94,
    durability: 91,
    drape: 95,
    image:"/api/media/8/whatsapp-image-2026-10-27-at-2-47-02-pm-2.jpeg",
    code:"SH-403-BL",
  },
  {
    id:"fabric-sh403-terracotta",
    tabLabel:"TERRACOTTA",
    millBrand:"SUITOHOLIC ATELIER • BIELLA MILLS, ITALY",
    title:"Terracotta Bold Bengal Stripe",
    weight:"120 g/m²",
    composition:"100% Egyptian Giza 140s Cotton (2-Ply)",
    season:"All-Season Executive",
    weave:"Precision Bengal Stripe Twill Weave",
    origin:"Alexandria Delta • Finished in Biella, Italy",
    softness: 95,
    durability: 90,
    drape: 93,
    image:"/api/media/5/whatsapp-image-2026-10-27-at-1-06-36-pm-2.jpeg",
    code:"SH-403-TC",
  },
  {
    id:"fabric-bordeaux-silk",
    tabLabel:"DARK TWILL",
    millBrand:"SUITOHOLIC ATELIER • COMO MILLS, NORTHERN ITALY",
    title:"Deep Espresso Silk Twill",
    weight:"145 g/m²",
    composition:"100% Pure Mulberry Silk & Giza Cotton",
    season:"Evening Black-Tie Structured",
    weave:"High-Luster Intricate Jacquard Luster",
    origin:"Como Historic Mills, Northern Italy",
    softness: 97,
    durability: 89,
    drape: 96,
    image:"/api/media/7/whatsapp-image-2026-10-27-at-2-47-01-pm-1.jpeg",
    code:"SJ-200-BX",
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
  const [selectedFabricId, setSelectedFabricId] = useState<string>(
    activeFabricId || HERO_FABRIC_ITEMS[0].id
  );

  const activeFabric =
    HERO_FABRIC_ITEMS.find((f) => f.id === selectedFabricId || f.code === selectedFabricId) ||
    HERO_FABRIC_ITEMS[0];

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
      className="relative w-full bg-[#ECEAE5] py-12 sm:py-16 lg:py-20 border-b border-[#E5E3DD]"
    >
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
            INSPECT WEAVE &amp; TEXTURE
          </h2>
        </div>

        {/* Fabric Switcher Pills */}
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 flex-wrap">
          {HERO_FABRIC_ITEMS.map((item) => {
            const isSelected = activeFabric.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedFabricId(item.id)}
                className={`px-4 py-2 rounded-[8px] text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                  isSelected
                    ?"bg-black text-white shadow-xs"
                    :"bg-white text-[#666666] border border-[#E5E3DD] hover:text-black hover:border-black"
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Enlarged Framed Weave Inspection Box with 12px Border Radius */}
        <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] lg:h-[540px] rounded-[12px] overflow-hidden border border-[#E5E3DD] shadow-md bg-white">
          <div 
            ref={imageContainerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovering(true)}
            onTouchEnd={() => setIsHovering(false)}
            onTouchMove={handleTouchMove}
            className="relative w-full h-full overflow-hidden bg-[#ECEAE5] cursor-crosshair group"
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
                transform: isHovering ?"scale(2.4)" :"scale(1.0)",
              }}
              loading="lazy"
            />

            {/* Clean Subtle Ambient Lighting Sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10" />

            {/* Centered"HOVER TO INSPECT WEAVE" Badge in Crisp Luxury Light Glass */}
            <div
              className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isHovering ?"opacity-0 scale-90" :"opacity-100 scale-100"
              }`}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md border border-[#E5E3DD] rounded-full shadow-lg">
                <ZoomIn size={16} className="text-[#8C7355] stroke-[2.2]" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-black">
                  HOVER TO INSPECT WEAVE
                </span>
              </div>
            </div>

            {/* Top Right Corner: Zoom Factor indicator when active */}
            {isHovering && (
              <div className="pointer-events-none absolute top-3.5 right-3.5 z-10 px-3 py-1 bg-black text-white backdrop-blur-md rounded-full border border-white/20 text-[10px] font-sans font-bold shadow-md">
                2.4X MACRO ZOOM
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
