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
    slug: "royal-formal-crisp-white-shirt",
    title: "Royal Bengal Stripe Formal",
    subtitle: "100% Egyptian Giza 140s Cotton",
    price: "₹ 2,499",
    image: "/new_shirts/shirt_1.jpg",
    hoverImage: "/customizer/shirt_model_coral_stripe.jpg",
    tag: "SIGNATURE",
  },
  {
    id: "look-2",
    slug: "french-cuff-noble-charcoal-formal",
    title: "Noble Espresso Sateen Twill",
    subtitle: "Superfine 120s Sateen Drape",
    price: "₹ 2,699",
    image: "/new_shirts/shirt_2.jpg",
    hoverImage: "/customizer/shirt_model_espresso.jpg",
    tag: "BESTSELLER",
  },
  {
    id: "look-3",
    slug: "executive-french-cuff-blue-shirt",
    title: "Executive Sky Blue Pinstripe",
    subtitle: "Two-Fold Italian Poplin Weave",
    price: "₹ 2,799",
    image: "/new_shirts/shirt_3.jpg",
    hoverImage: "/customizer/shirt_model_bengal_blue.jpg",
    tag: "BOARDROOM ICON",
  },
  {
    id: "look-4",
    slug: "fine-ivory-herringbone-formal",
    title: "Fine Ivory Sand Herringbone",
    subtitle: "130s Micro-Herringbone Weave",
    price: "₹ 2,899",
    image: "/new_shirts/shirt_4.jpg",
    hoverImage: "/customizer/shirt_model_sandstone_linen.jpg",
    tag: "LUXURY BESPOKE",
  },
  {
    id: "look-5",
    slug: "classic-bengal-stripe-cutaway",
    title: "Classic Bengal Stripe Cutaway",
    subtitle: "Wide Spread Cutaway Formal Collar",
    price: "₹ 2,499",
    image: "/new_shirts/shirt_1.jpg",
    hoverImage: "/customizer/shirt_model_coral_stripe.jpg",
    tag: "SIGNATURE",
  },
  {
    id: "look-6",
    slug: "sovereign-espresso-french-cuff",
    title: "Sovereign Espresso French Cuff",
    subtitle: "Double French Cuffs for Cufflinks",
    price: "₹ 2,699",
    image: "/new_shirts/shirt_2.jpg",
    hoverImage: "/customizer/shirt_model_espresso.jpg",
    tag: "BESTSELLER",
  },
  {
    id: "look-7",
    slug: "boardroom-skyblue-banker-stripe",
    title: "Boardroom Sky Blue Banker Stripe",
    subtitle: "Semi-Spread Collar with Split Yoke",
    price: "₹ 2,799",
    image: "/new_shirts/shirt_3.jpg",
    hoverImage: "/customizer/shirt_model_bengal_blue.jpg",
    tag: "BOARDROOM ICON",
  },
  {
    id: "look-8",
    slug: "sandstone-linen-resort-shirt",
    title: "Sandstone Linen Resort Dress Shirt",
    subtitle: "Breathable Pure Normandy Linen",
    price: "₹ 2,899",
    image: "/new_shirts/shirt_4.jpg",
    hoverImage: "/customizer/shirt_model_sandstone_linen.jpg",
    tag: "LUXURY BESPOKE",
  },
  {
    id: "look-9",
    slug: "signature-bengal-stripe-evening",
    title: "Signature Bengal Stripe Evening",
    subtitle: "Two-Ply Egyptian Cotton Poplin",
    price: "₹ 2,499",
    image: "/new_shirts/shirt_1.jpg",
    hoverImage: "/customizer/shirt_model_coral_stripe.jpg",
    tag: "SIGNATURE",
  },
  {
    id: "look-10",
    slug: "espresso-luxury-sartorial-twill",
    title: "Espresso Luxury Sartorial Twill",
    subtitle: "Mother-of-Pearl Buttons & Tailored Fit",
    price: "₹ 2,699",
    image: "/new_shirts/shirt_2.jpg",
    hoverImage: "/customizer/shirt_model_espresso.jpg",
    tag: "BESTSELLER",
  },
  {
    id: "look-11",
    slug: "italian-skyblue-pinpoint-poplin",
    title: "Italian Sky Blue Pinpoint Poplin",
    subtitle: "Reinforced Gussets & Dual-Button Cuff",
    price: "₹ 2,799",
    image: "/new_shirts/shirt_3.jpg",
    hoverImage: "/customizer/shirt_model_bengal_blue.jpg",
    tag: "BOARDROOM ICON",
  },
  {
    id: "look-12",
    slug: "ivory-atelier-micro-chevron-weave",
    title: "Ivory Atelier Micro-Chevron Weave",
    subtitle: "100% Superfine Combed Pure Cotton",
    price: "₹ 2,899",
    image: "/new_shirts/shirt_4.jpg",
    hoverImage: "/customizer/shirt_model_sandstone_linen.jpg",
    tag: "LUXURY BESPOKE",
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
    <section id="curated-looks" className="relative w-full py-12 sm:py-16 lg:py-20 border-b border-[#DDD2D8] bg-gradient-to-b from-[#FFFFFF] via-[#FAF6F8] to-[#EEE5EA] overflow-hidden select-none">
      {/* Subtle warm luxury backdrop glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-[#4A202A]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 bg-[#4A202A]/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header: Eyebrow, Ornate Calligraphic Title, Subtitle */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#4A202A]">
              {eyebrow}
            </span>
          </div>

          {/* Title Row: Left Flourish + Calligraphic Script Title + Right Flourish */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full">
            {/* Left Flourish */}
            <HeadingFlourish className="text-[#4A202A]/40 shrink-0 w-14 sm:w-24 md:w-32 lg:w-40 xl:w-44 h-auto" />

            {/* Cursive Calligraphic Heading matching reference screenshot */}
            <h2 className="font-script-calligraphy text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[60px] text-[#4A202A] leading-[1.05] tracking-normal whitespace-nowrap drop-shadow-xs">
              {title}
            </h2>

            {/* Right Flourish (Mirrored) */}
            <HeadingFlourish className="text-[#4A202A]/40 shrink-0 w-14 sm:w-24 md:w-32 lg:w-40 xl:w-44 h-auto scale-x-[-1]" />
          </div>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-[#5A4E42] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* 4-Card Responsive Grid matching Home Page Image Format (aspect-[3/4], rounded-[7px], no image border) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {items.map((item) => {
            const isSelected = activeProductSlug === item.slug;
            return (
              <div
                key={item.id}
                onClick={() => onSelectLook(item)}
                className="group flex flex-col justify-between rounded-[7px] overflow-hidden bg-white border border-[#DDD2D8] hover:border-[#4A202A] transition-all duration-300 shadow-2xs hover:shadow-lg cursor-pointer"
              >
                {/* Upper Image Container: Flush edge-to-edge with card, zero gap */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#EEE5EA]">
                  {/* Default Image: Collar & Fabric Macro View */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover Image: Full Shirt View in exact same color */}
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

                {/* Lower Details Strip & Action Button with dedicated padding */}
                <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 text-left">
                  {/* Title & Price */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-[12px] sm:text-[13px] text-[#14110E] uppercase tracking-wide truncate group-hover:text-[#4A202A] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <span className="font-bold text-xs text-[#4A202A] shrink-0">{item.price}</span>
                  </div>

                  {/* Full-width Divider Line */}
                  <div className="w-full h-[1px] bg-[#DDD2D8] my-2.5" />

                  {/* CUSTOMIZE THIS LOOK Button (Uniform styling across all cards) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLook(item);
                    }}
                    className="w-full text-white text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.14em] py-2.5 px-3.5 rounded-[7px] flex items-center justify-between transition-all duration-300 shadow-2xs cursor-pointer bg-[#14110E] group-hover:bg-[#4A202A]"
                  >
                    <span>CUSTOMIZE THIS LOOK</span>
                    <ChevronRight size={13} className="text-[#FAF8F5] group-hover:translate-x-0.5 transition-transform" />
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
