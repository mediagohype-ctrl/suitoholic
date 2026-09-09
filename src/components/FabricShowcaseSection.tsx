"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, Layers, ShieldCheck, ZoomIn } from "lucide-react";

export interface FabricSwatch {
  id: string;
  code: string;
  name: string;
  category: "stripes" | "linen" | "luster";
  categoryLabel: string;
  composition: string;
  weave: string;
  weight: string;
  origin: string;
  image: string;
  description: string;
  bestFor: string;
}

export const luxuryFabricsList: FabricSwatch[] = [
  {
    id: "fabric-sh403-rose",
    code: "SH-403 (Shade 01)",
    name: "Blossom Rose Banker Stripe",
    category: "stripes",
    categoryLabel: "EGYPTIAN GIZA STRIPE",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    weave: "High-Density Fine Twill Weave",
    weight: "120 GSM • All-Season",
    origin: "Nile Delta Harvest • Spun in Italy",
    image: "/fabric_sh403_rose_stripe.jpg",
    description:
      "Soft blossom rose pink and optic white alternating candy/banker stripes with fine diagonal twill ribbing. Provides an immaculate refined aesthetic for modern power dressing.",
    bestFor: "Power Dressing Dress Shirts, Spread Collars",
  },
  {
    id: "fabric-sh403",
    code: "SH-403 (Shade 02)",
    name: "Royal Bengal Banker Stripe",
    category: "stripes",
    categoryLabel: "EGYPTIAN GIZA STRIPE",
    composition: "100% Egyptian Giza 140s Cotton (2-Ply)",
    weave: "High-Density Fine Twill Weave",
    weight: "120 GSM • All-Season",
    origin: "Nile Delta Harvest • Spun in Italy",
    image: "/fabric_sh403_royal_stripe.jpg",
    description:
      "Crisp royal blue and optic white alternating bengal stripes with micro-twill diagonal ribbing. Exceptional color vibrancy and soft, wrinkle-resistant luster.",
    bestFor: "Executive Boardroom Shirts, French Cuff Formals",
  },
  {
    id: "fabric-st16974",
    code: "ST-16974",
    name: "Terracotta & Chalk Stripe",
    category: "stripes",
    categoryLabel: "LONG-STAPLE STRIPE",
    composition: "100% Extra-Long Staple Luxury Cotton",
    weave: "Precision Vertical Bengal Weave",
    weight: "115 GSM • Lightweight",
    origin: "Combed Long-Staple Cotton",
    image: "/fabric_st16974_terracotta_stripe.jpg",
    description:
      "Subtle dusty terracotta rose and chalk-white stripe with a smooth compact surface. Delivers a modern sartorial presence with effortless drape.",
    bestFor: "Contemporary Sartorial Dress Shirts, Spread Collars",
  },
  {
    id: "fabric-superviola",
    code: "V-13672/06",
    name: "Superviola Sand Flax Linen",
    category: "linen",
    categoryLabel: "SUPERVIOLA LINEN",
    composition: "100% Pure Artisanal Normandy Flax Linen",
    weave: "Natural Slub Textural Cross-Weave",
    weight: "155 GSM • Summer Drape",
    origin: "Artisanal European Flax Milling",
    image: "/fabric_superviola_sand_linen.jpg",
    description:
      "Undyed natural oatmeal sand tone with authentic linen slub texture. Air-permeable, cool to the skin, and develops a richer patina with each wear.",
    bestFor: "Resort Tailoring, Relaxed Bespoke Shirts, Gurkha Trousers",
  },
  {
    id: "fabric-imperial-gold",
    code: "IGT-2003",
    name: "Imperial Gold Satin Twill",
    category: "luster",
    categoryLabel: "LUSTER SATIN TWILL",
    composition: "100% Combed Compact Cotton with Silk Luster",
    weave: "Luminous Satin Twill Weave",
    weight: "140 GSM • Year-Round",
    origin: "Multi-Tension Double Spun",
    image: "/fabric_imperial_gold_twill.jpg",
    description:
      "Opulent liquid-gold finish with fluid drape and warm sheen. Structured yet featherweight, designed for ceremonial luxury and evening statements.",
    bestFor: "Ceremonial Bandhgalas, Evening Blazers, Statement Tuxedos",
  },
  {
    id: "fabric-flx01069",
    code: "FLX-01069",
    name: "Platinum Dove Grey Linen",
    category: "linen",
    categoryLabel: "FLAX LINEN COLLECTION",
    composition: "100% Natural Fine-Spun Pure Linen",
    weave: "Micro-Basket Cross-Weave",
    weight: "135 GSM • High Breathability",
    origin: "Soft-Washed Flax Fiber",
    image: "/fabric_flx01069_dove_grey_linen.jpg",
    description:
      "Refined cool dove grey tone with subtle cross-hatch texture. Pre-washed for a soft hand-feel that drapes with relaxed elegance.",
    bestFor: "Monogrammed Summer Shirts, Unstructured Blazers",
  },
];

export default function FabricShowcaseSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeFabric, setActiveFabric] = useState<FabricSwatch>(luxuryFabricsList[0]);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  const filteredFabrics = selectedCategory === "all"
    ? luxuryFabricsList
    : luxuryFabricsList.filter((f) => f.category === selectedCategory);

  return (
    <section id="fabrics" className="py-6 sm:py-10 lg:py-14 px-3.5 sm:px-6 lg:px-10 xl:px-12 select-none">
      <div className="max-w-[1720px] mx-auto space-y-8 sm:space-y-10">
        
        {/* Section Header: Luxury Enterprise Architectural Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[#D5C2AF] pb-6">
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              THE ATELIER FABRIC ARCHIVE
            </h2>
            <p className="text-xs sm:text-sm text-[#55473A] font-sans max-w-xl">
              Every Suitoholic garment begins at the loom. Explore our authentic hand-curated textile collection of pure Egyptian Giza 140s cottons, Superviola artisanal linens, and lustrous ceremonial weaves.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "ALL FABRICS (6)" },
              { id: "stripes", label: "GIZA STRIPES" },
              { id: "linen", label: "PURE LINEN" },
              { id: "luster", label: "SATIN & LUSTER" },
            ].map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-2 rounded-lg transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-sm"
                      : "bg-[#EFE5D9] hover:bg-white text-[#14110E] border-[#D5C2AF]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 12-Column Interactive Swatch Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column (5 Cols): Active Fabric Macro Spec Card */}
          <div className="lg:col-span-5 bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            
            {/* Top Swatch Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#D5C2AF] pb-3">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase font-sans">
                  {activeFabric.categoryLabel}
                </span>
                <span className="font-mono text-xs font-bold text-[#14110E] bg-white/80 px-2.5 py-1 rounded border border-[#D5C2AF]">
                  {activeFabric.code}
                </span>
              </div>

              <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-[#14110E] leading-snug">
                {activeFabric.name}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#55473A] font-sans leading-relaxed">
                {activeFabric.description}
              </p>
            </div>

            {/* Macro Texture Preview Box with Zoom Feature */}
            <div 
              onClick={() => setZoomModalOpen(true)}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[240px] sm:h-[280px] bg-[#1E1914] border border-[#D5C2AF] shadow-inner cursor-zoom-in group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 right-3 bg-[#14110E]/85 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
                <ZoomIn size={13} className="text-[#C5A069]" />
                <span>Magnify Swatch</span>
              </div>
            </div>

            {/* Fabric Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">Composition</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.composition}</span>
              </div>
              <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">Weave &amp; Weight</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.weight}</span>
              </div>
            </div>

            {/* Direct Customization CTA */}
            <div className="pt-2">
              <Link
                href={`/custom-shirt?fabric=${encodeURIComponent(activeFabric.code)}`}
                className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-md group/btn"
              >
                <span>CUSTOMIZE IN THIS FABRIC</span>
                <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

          {/* Right Column (7 Cols): Swatches Grid Card Gallery */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
            {filteredFabrics.map((fabric) => {
              const isSelected = activeFabric.id === fabric.id;
              return (
                <div
                  key={fabric.id}
                  onClick={() => setActiveFabric(fabric)}
                  className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 transition-all duration-300 border flex flex-col justify-between space-y-3 cursor-pointer group ${
                    isSelected
                      ? "bg-[#14110E] text-white border-[#14110E] shadow-xl ring-2 ring-[#9E774C]/60 scale-[1.02]"
                      : "bg-[#EFE5D9] hover:bg-white text-[#14110E] border-[#D5C2AF] hover:border-[#9E774C] shadow-xs"
                  }`}
                >
                  {/* Swatch Square Image */}
                  <div className="relative rounded-xl overflow-hidden aspect-square w-full bg-[#221B16] border border-[#D5C2AF]/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Selected Check Pill */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#9E774C] text-white p-1 rounded-full shadow-md">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Swatch Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold tracking-wider uppercase font-mono ${
                          isSelected ? "text-[#D8C7B5]" : "text-[#8C6D47]"
                        }`}
                      >
                        {fabric.code}
                      </span>
                      <span
                        className={`text-[8.5px] font-semibold uppercase ${
                          isSelected ? "text-white/60" : "text-[#6E5D4F]"
                        }`}
                      >
                        {fabric.category.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-tight leading-snug line-clamp-1">
                      {fabric.name}
                    </h4>

                    <p
                      className={`text-[10px] font-sans line-clamp-1 ${
                        isSelected ? "text-[#CDBEB0]" : "text-[#55473A]"
                      }`}
                    >
                      {fabric.composition}
                    </p>
                  </div>

                  {/* Click to Inspect Action */}
                  <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span>{isSelected ? "ACTIVE SELECTION" : "SELECT SWATCH"}</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* High-Resolution Fullscreen Zoom Modal */}
      {zoomModalOpen && (
        <div 
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 cursor-pointer"
        >
          <div className="relative max-w-4xl w-full bg-[#1E1914] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between text-white border-b border-white/15 pb-3">
              <div>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase">
                  {activeFabric.name}
                </h3>
                <span className="text-xs font-mono text-[#C5A069]">CODE: {activeFabric.code} • {activeFabric.composition}</span>
              </div>
              <button 
                onClick={() => setZoomModalOpen(false)}
                className="text-xs font-bold uppercase bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                Close ✕
              </button>
            </div>

            <div className="relative w-full h-[360px] sm:h-[480px] rounded-xl overflow-hidden bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between text-white/80 text-xs pt-1">
              <span>{activeFabric.weave} • {activeFabric.weight}</span>
              <span className="text-[#C5A069] font-medium">{activeFabric.bestFor}</span>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
