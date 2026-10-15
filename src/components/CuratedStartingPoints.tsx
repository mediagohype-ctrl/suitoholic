"use client";

import React from "react";
import { ChevronRight, Check } from "lucide-react";
import { ProductItem } from "@/data/products";

export interface CuratedLookItem {
  id: string | number;
  slug: string;
  title: string;
  subtitle: string;
  price: string;
  image: string;
  tag?: string;
}

interface CuratedStartingPointsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: CuratedLookItem[];
  activeProductSlug?: string;
  onSelectLook: (item: CuratedLookItem) => void;
}

const DEFAULT_LOOKS: CuratedLookItem[] = [
  {
    id: "look-1",
    slug: "royal-formal-crisp-white-shirt",
    title: "Royal Bengal Stripe Formal",
    subtitle: "100% Egyptian Giza 140s Cotton",
    price: "₹ 2,499",
    image: "/new_shirts/shirt_1.jpg",
    tag: "SIGNATURE",
  },
  {
    id: "look-2",
    slug: "french-cuff-noble-charcoal-formal",
    title: "Noble Espresso Sateen Twill",
    subtitle: "Superfine 120s Sateen Drape",
    price: "₹ 2,699",
    image: "/new_shirts/shirt_2.jpg",
    tag: "BESTSELLER",
  },
  {
    id: "look-3",
    slug: "executive-french-cuff-blue-shirt",
    title: "Executive Sky Blue Pinstripe",
    subtitle: "Two-Fold Italian Poplin Weave",
    price: "₹ 2,799",
    image: "/new_shirts/shirt_3.jpg",
    tag: "BOARDROOM ICON",
  },
  {
    id: "look-4",
    slug: "fine-ivory-herringbone-formal",
    title: "Fine Ivory Sand Herringbone",
    subtitle: "130s Micro-Herringbone Weave",
    price: "₹ 2,899",
    image: "/new_shirts/shirt_4.jpg",
    tag: "LUXURY BESPOKE",
  },
];

export default function CuratedStartingPoints({
  eyebrow = "CURATED STARTING POINTS",
  title = "Signature Bespoke Ensembles",
  description = "Start with a master-tailored bespoke dress shirt where every cloth, drape, and silhouette is engineered to perfection. Select a starting point below to custom tailor it live in our 3D Atelier.",
  items = DEFAULT_LOOKS,
  activeProductSlug,
  onSelectLook,
}: CuratedStartingPointsProps) {
  return (
    <section id="curated-looks" className="relative w-full py-12 sm:py-16 lg:py-20 border-b border-[#E3D4C4] bg-gradient-to-b from-[#FBF8F3] via-[#FAF6F0] to-[#F7F2EB] overflow-hidden select-none">
      {/* Subtle warm luxury backdrop glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-[#C59B6A]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 bg-[#C59B6A]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header: Eyebrow, Title, Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rotate-45 bg-[#8C5A28] inline-block" />
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#8C5A28]">
              {eyebrow}
            </span>
            <span className="w-1.5 h-1.5 rotate-45 bg-[#8C5A28] inline-block" />
          </div>

          {/* Title - matching reference layout with Suitoholic's font styling */}
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#14110E] tracking-[0.14em] uppercase leading-tight">
            Signature Bespoke <span className="text-[#8C5A28] italic font-serif">Ensembles</span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-[#524436] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* 4-Card Responsive Grid matching Home Page Image Format (aspect-[3/4.1], rounded-[9px]) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {items.map((item) => {
            const isSelected = activeProductSlug === item.slug;
            return (
              <div
                key={item.id}
                onClick={() => onSelectLook(item)}
                className={`group flex flex-col justify-between p-3 sm:p-3.5 rounded-[14px] bg-white border transition-all duration-300 shadow-2xs hover:shadow-lg cursor-pointer ${
                  isSelected
                    ? "border-[#8C5A28] ring-2 ring-[#8C5A28]/40 shadow-md"
                    : "border-[#E2DDD5] hover:border-[#8C5A28]"
                }`}
              >
                {/* Upper Image Container: EXACT HOME PAGE FORMAT (aspect-[3/4.1], rounded-[9px], bg-[#F3F0EC], border) */}
                <div className="relative w-full aspect-[3/4.1] rounded-[9px] overflow-hidden bg-[#F3F0EC] border border-[#E2DDD5]/70 shadow-2xs transition-all duration-300 group-hover:shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Subtle Gradient Overlay at bottom for clean contrast */}
                  <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                  {/* Top Badge: Active or Tag */}
                  {isSelected ? (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-full bg-[#8C5A28] text-white text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Check size={11} className="stroke-[3]" />
                      <span>Configuring Now</span>
                    </div>
                  ) : item.tag ? (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-black/65 backdrop-blur-xs text-[#FAF5EE] text-[9px] font-semibold uppercase tracking-wider border border-white/20">
                      {item.tag}
                    </div>
                  ) : null}
                </div>

                {/* Lower Details Strip & Action Button */}
                <div className="mt-3.5 flex flex-col justify-between flex-1 text-left">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-[12px] sm:text-[13px] text-[#14110E] uppercase tracking-wide truncate group-hover:text-[#8C5A28] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10.5px] text-[#665749]">
                      <span className="truncate">{item.subtitle}</span>
                      <span className="font-bold text-[#8C5A28] shrink-0 ml-1.5">{item.price}</span>
                    </div>
                  </div>

                  {/* Full-width Divider Line */}
                  <div className="w-full h-[1px] bg-[#E8DFD5] my-2.5" />

                  {/* CUSTOMIZE THIS LOOK Button (Matching reference action) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLook(item);
                    }}
                    className={`w-full text-white text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.14em] py-2.5 px-3.5 rounded-lg flex items-center justify-between transition-all duration-300 shadow-2xs cursor-pointer ${
                      isSelected
                        ? "bg-[#8C5A28]"
                        : "bg-[#14110E] group-hover:bg-[#8C5A28]"
                    }`}
                  >
                    <span>{isSelected ? "CONFIGURING IN 3D" : "CUSTOMIZE THIS LOOK"}</span>
                    <ChevronRight size={13} className="text-[#E8C296] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
