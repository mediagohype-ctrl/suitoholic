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
  hoverImage?: string;
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
    slug: "azure-bengal-stripe-formal",
    title: "Azure Sky Blue Bengal Stripe",
    subtitle: "Italian 130s Pure Egyptian Cotton",
    price: "₹ 2,799",
    image: "/new_shirts/shirt_21.jpg",
    hoverImage: "/customizer/full_shirt_21.jpg",
    tag: "BESTSELLER",
  },
  {
    id: "look-2",
    slug: "terracotta-brick-bengal-stripe",
    title: "Terracotta Brick Bengal Stripe",
    subtitle: "Warm Terracotta Brick & Ecru Weave",
    price: "₹ 2,699",
    image: "/new_shirts/shirt_14.jpg",
    hoverImage: "/customizer/full_shirt_14.jpg",
    tag: "HERITAGE STRIPE",
  },
  {
    id: "look-3",
    slug: "charcoal-executive-pinstripe-formal",
    title: "Charcoal Executive Pinstripe Formal",
    subtitle: "Architectural Graphite Charcoal Shadow",
    price: "₹ 2,699",
    image: "/new_shirts/shirt_17.jpg",
    hoverImage: "/customizer/full_shirt_17.jpg",
    tag: "POWER PINSTRIPE",
  },
  {
    id: "look-4",
    slug: "navy-executive-bengal-stripe-formal",
    title: "Navy Executive Bengal Stripe Formal",
    subtitle: "Deep Navy & Crisp White Banker Stripe",
    price: "₹ 2,799",
    image: "/new_shirts/shirt_20.jpg",
    hoverImage: "/customizer/full_shirt_20.jpg",
    tag: "EXECUTIVE STRIPE",
  },
];

function HeadingFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 4-Petal Floral Clover Motif on Far Left */}
      <circle cx="14" cy="24" r="1.5" fill="currentColor" />
      <ellipse cx="14" cy="17.5" rx="2.2" ry="4.5" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="14" cy="30.5" rx="2.2" ry="4.5" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="7.5" cy="24" rx="4.5" ry="2.2" stroke="currentColor" strokeWidth="1.3" />
      <ellipse cx="20.5" cy="24" rx="4.5" ry="2.2" stroke="currentColor" strokeWidth="1.3" />

      {/* Central Horizontal Stem */}
      <path d="M 25 24 L 84 24" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />

      {/* 3 Pairs of Delicate Leaves */}
      {/* Leaf Pair 1 */}
      <path d="M 33 24 C 36 17, 44 16, 48 19 C 44 23, 38 24, 33 24 Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M 33 24 C 36 31, 44 32, 48 29 C 44 25, 38 24, 33 24 Z" stroke="currentColor" strokeWidth="1.2" />

      {/* Leaf Pair 2 */}
      <path d="M 47 24 C 50 17, 58 16, 62 19 C 58 23, 52 24, 47 24 Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M 47 24 C 50 31, 58 32, 62 29 C 58 25, 52 24, 47 24 Z" stroke="currentColor" strokeWidth="1.2" />

      {/* Leaf Pair 3 */}
      <path d="M 61 24 C 64 17, 72 16, 76 19 C 72 23, 66 24, 61 24 Z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M 61 24 C 64 31, 72 32, 76 29 C 72 25, 66 24, 61 24 Z" stroke="currentColor" strokeWidth="1.2" />

      {/* Right End: Upper Sweeping Arch & Lower Spiral Loop */}
      <path d="M 84 24 C 95 11, 122 11, 144 22" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M 84 24 C 95 36, 116 41, 130 32 C 140 25, 136 15, 125 17 C 117 19, 116 29, 123 32 C 128 34, 133 31, 132 26" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export default function CuratedStartingPoints({
  eyebrow = "CURATED STARTING POINTS",
  title = "Signature Bespoke Ensembles",
  description = "Start with a master-tailored bespoke dress shirt where every cloth, drape, and silhouette is engineered to perfection. Select a starting point below to custom tailor it live in our 3D Atelier.",
  items = DEFAULT_LOOKS,
  activeProductSlug,
  onSelectLook,
}: CuratedStartingPointsProps) {
  return (
    <section id="curated-looks" className="relative w-full py-12 sm:py-16 lg:py-20 border-b border-[#E5E3DD] bg-[#ECEAE5] overflow-hidden select-none">
      <div className="relative z-10 w-full max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Eyebrow, Ornate Calligraphic Title, Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.28em] text-black">
              {eyebrow}
            </span>
          </div>

          {/* Title Row: Left Flourish + Calligraphic Script Title + Right Flourish */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full">
            {/* Left Flourish */}
            <HeadingFlourish className="text-black/30 shrink-0 w-14 sm:w-24 md:w-32 lg:w-40 xl:w-44 h-auto" />

            {/* Heading */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-black leading-[1.05] tracking-normal whitespace-nowrap">
              {title}
            </h2>

            {/* Right Flourish (Mirrored) */}
            <HeadingFlourish className="text-black/30 shrink-0 w-14 sm:w-24 md:w-32 lg:w-40 xl:w-44 h-auto scale-x-[-1]" />
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-[#666666] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* 4-Card Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-3.5">
          {items.map((item) => (
            <div
                key={item.id}
                onClick={() => onSelectLook(item)}
                className="group flex flex-col justify-between rounded-[11px] overflow-hidden bg-white border border-[#E5E3DD] hover:border-black/30 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer"
              >
                {/* Upper Image Container: Flush edge-to-edge with card, zero gap */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F5F4F0]">
                  {/* Default Image: Collar & Fabric Macro View */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover Image */}
                  {item.hoverImage && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.hoverImage}
                      alt={`${item.title} Full Shirt`}
                      className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Lower Details Strip & Action Button */}
                <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 text-left">
                  {/* Title & Price */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[11px] sm:text-[12.5px] text-black uppercase tracking-wide truncate group-hover:text-neutral-700 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <span className="font-bold text-xs text-black shrink-0">{item.price}</span>
                  </div>

                  {/* Full-width Divider Line */}
                  <div className="w-full h-[1px] bg-[#E5E3DD] my-2.5" />

                  {/* CUSTOMIZE THIS LOOK Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLook(item);
                    }}
                    className="w-full bg-black hover:bg-neutral-800 text-white text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.14em] py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-full flex items-center justify-between transition-all duration-300 shadow-xs hover:shadow cursor-pointer group"
                  >
                    <span>CUSTOMIZE THIS LOOK</span>
                    <ChevronRight size={13} className="text-white group-hover:translate-x-0.5 transition-transform stroke-[2.5]" />
                  </button>
                </div>
              </div>
          ))}
        </div>

      </div>
    </section>
  );
}
