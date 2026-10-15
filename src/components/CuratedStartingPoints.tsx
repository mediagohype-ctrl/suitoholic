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
    title: "Royal Formal Crisp White",
    subtitle: "100% Egyptian Giza 140s Cotton",
    price: "₹ 2,499",
    image: "/white_twill_model_editorial.jpg",
    tag: "SIGNATURE",
  },
  {
    id: "look-2",
    slug: "executive-french-cuff-blue-shirt",
    title: "Executive French Cuff Blue",
    subtitle: "Double-Ply Italian Poplin",
    price: "₹ 2,699",
    image: "/sky_blue_model_editorial.jpg",
    tag: "BESTSELLER",
  },
  {
    id: "look-3",
    slug: "boardroom-banker-pinstripe-formal",
    title: "Boardroom Banker Stripe",
    subtitle: "Two-Fold Savile Row Stripe",
    price: "₹ 2,799",
    image: "/bengal_stripe_royal_blue_model.jpg",
    tag: "FORMAL ICON",
  },
  {
    id: "look-4",
    slug: "ceremonial-bandhgala",
    title: "Royal Heritage Bandhgala",
    subtitle: "Handcrafted Structured Cut",
    price: "₹ 4,999",
    image: "/ceremonial_bandhgala.jpg",
    tag: "ROYAL EDIT",
  },
  {
    id: "look-5",
    slug: "black-tie-silk-tuxedo",
    title: "Silk Lapel Tuxedo Ensemble",
    subtitle: "Black-Tie Silk Satin Lapels",
    price: "₹ 5,499",
    image: "/blazer_charcoal_tux.jpg",
    tag: "EVENING",
  },
];

export default function CuratedStartingPoints({
  eyebrow = "CURATED STARTING POINTS",
  title = "Signature Bespoke Ensembles",
  description = "Start with a master-tailored bespoke ensemble where every cloth, drape, and silhouette is engineered to perfection. Select a starting point below to custom tailor it live in our 3D Atelier.",
  items = DEFAULT_LOOKS,
  activeProductSlug,
  onSelectLook,
}: CuratedStartingPointsProps) {
  return (
    <section id="curated-looks" className="relative w-full py-12 sm:py-16 lg:py-20 border-b border-[#E3D4C4] bg-gradient-to-b from-[#FBF8F3] via-[#FAF6F0] to-[#F7F2EB] overflow-hidden">
      {/* Subtle Tailor Cutting Grid Pattern (Bespoke Pattern Paper Graph Lines) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(140, 90, 40, 0.22) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(140, 90, 40, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

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

          {/* Title - matching reference screenshot layout with Suitoholic's font styling */}
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] font-bold text-[#14110E] tracking-[0.14em] uppercase leading-tight">
            Signature Bespoke <span className="text-[#8C5A28] italic font-serif">Ensembles</span>
          </h2>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-[#524436] font-sans font-normal leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* 5-Card Responsive Showcase (Swipeable on mobile, 5-col grid on desktop) */}
        <div className="flex lg:grid lg:grid-cols-5 gap-4 sm:gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x">
          {items.map((item) => {
            const isSelected = activeProductSlug === item.slug;
            return (
              <div
                key={item.id}
                onClick={() => onSelectLook(item)}
                className={`relative group shrink-0 w-[260px] sm:w-[280px] lg:w-auto rounded-2xl overflow-hidden border transition-all duration-500 flex flex-col justify-end aspect-[3/4.9] sm:aspect-[3/5.1] shadow-md hover:shadow-2xl snap-center cursor-pointer select-none ${
                  isSelected
                    ? "border-[#8C5A28] ring-2 ring-[#8C5A28] shadow-xl"
                    : "border-[#D5C2AF] hover:border-[#8C5A28]"
                }`}
              >
                {/* Background Full-Length Model Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Soft gradient shadow for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                {/* Top Badge: Selected or Tag */}
                {isSelected ? (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#8C5A28] text-white text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Check size={11} className="stroke-[3]" />
                    <span>Configuring Now</span>
                  </div>
                ) : item.tag ? (
                  <div className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#FAF5EE] text-[9px] font-medium uppercase tracking-wider border border-white/20">
                    {item.tag}
                  </div>
                ) : null}

                {/* Floating Bottom Card Footer (matching reference screenshot pill box) */}
                <div className="relative z-10 m-3 sm:m-3.5 p-3.5 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E2D4C3] shadow-lg text-left transition-all duration-300 group-hover:bg-white">
                  {/* Title of look */}
                  <h3 className="font-bold text-xs sm:text-[13px] text-[#14110E] uppercase tracking-wide line-clamp-1 mb-0.5 group-hover:text-[#8C5A28] transition-colors">
                    {item.title}
                  </h3>

                  {/* Subtitle / Fabric & Price */}
                  <div className="flex items-center justify-between text-[10px] text-[#665749] mb-2 font-normal">
                    <span className="line-clamp-1">{item.subtitle}</span>
                    <span className="font-bold text-[#8C5A28] shrink-0 ml-1">{item.price}</span>
                  </div>

                  {/* Full-width subtle divider line (matching reference screenshot) */}
                  <div className="w-full h-[1px] bg-[#E5DCD2] mb-3" />

                  {/* Customize Button (matching reference screenshot) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLook(item);
                    }}
                    className={`w-full text-white text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.14em] py-2.5 px-3.5 rounded-lg flex items-center justify-between transition-all duration-300 shadow-sm cursor-pointer ${
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
