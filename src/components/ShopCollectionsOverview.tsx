"use client";

import React from "react";
import Link from "next/link";

export interface CollectionSectionData {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  bgBottom?: string;
  images: [
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string },
    { src: string; alt: string }
  ];
}

export const SUITOHOLIC_COLLECTIONS: CollectionSectionData[] = [
  {
    id: "formal_shirts",
    title: "EXCLUSIVE FORMAL SHIRTS",
    description:
      "Cut from ultra-fine 120s–160s 2-ply Egyptian Giza cotton with hand-turned spread collars, single-needle French seams, and genuine Australian mother-of-pearl buttons. Tailored for lasting elegance.",
    bgBottom: "#F7F5F0",
    images: [
      {
        src: "/banners/shop_hero_banner_hd.jpg",
        alt: "Suitoholic Bespoke Formal Shirts Collection - Master Atelier Tailoring",
      },
      {
        src: "/about_principles_model.jpg",
        alt: "Bespoke Tailored Look Silhouette",
      },
      {
        src: "/new_shirts/shirt_21.jpg",
        alt: "Royal Steel Blue Bengal Stripe Shirt",
      },
      {
        src: "/new_shirts/shirt_22.jpg",
        alt: "Sky Blue Royal Twill Dress Shirt",
      },
      {
        src: "/new_shirts/shirt_23.jpg",
        alt: "Crisp Executive White Twill Shirt",
      },
    ],
  },
  {
    id: "formal_stripes",
    title: "BEST SELLERS",
    description:
      "Our most revered bespoke commissions — timeless English bengal stripes and micro-patterns woven from long-staple cotton for fluid drape and impeccable all-day structure.",
    bgBottom: "#FAF8F5",
    images: [
      {
        src: "/banners/menu_card_country_edit.jpg",
        alt: "Suitoholic Country Edit - Best Sellers",
      },
      {
        src: "/bengal_stripe_royal_blue_model.jpg",
        alt: "Royal Blue Bengal Stripe Bespoke Tailored Look",
      },
      {
        src: "/new_shirts/shirt_14.jpg",
        alt: "Terracotta Rust Bengal Stripe Shirt",
      },
      {
        src: "/new_shirts/shirt_15.jpg",
        alt: "Navy Sovereign Stripe Dress Shirt",
      },
      {
        src: "/new_shirts/shirt_16.jpg",
        alt: "Burgundy Executive Bengal Stripe Shirt",
      },
    ],
  },
  {
    id: "formal_bespoke",
    title: "LUXURY TEXTURED & TWILL SHIRTS",
    description:
      "Tactile royal twill weaves, dobby textures, and pinpoint oxfords tailored with sartorial precision — engineered for authoritative executive poise, breathability, and comfort.",
    bgBottom: "#F5F3ED",
    images: [
      {
        src: "/about_atelier_heritage.jpg",
        alt: "Suitoholic Master Cutting Table Atelier",
      },
      {
        src: "/about_materials_provenance.jpg",
        alt: "World's Finest Woven Mills Heritage",
      },
      {
        src: "/new_shirts/shirt_19.jpg",
        alt: "Dark Espresso Brown Twill Shirt",
      },
      {
        src: "/new_shirts/shirt_20.jpg",
        alt: "Champagne Cream Dobby Twill Shirt",
      },
      {
        src: "/new_shirts/shirt_24.jpg",
        alt: "Monochrome Slate Grey Twill Shirt",
      },
    ],
  },
  {
    id: "blazers",
    title: "BESPOKE SUITS & BLAZERS",
    description:
      "Full floating canvas construction, hand-padded lapels, and horn buttons cut from Super 130s–150s Vitale Barberis Canonico Italian wool and lightweight linen blends.",
    bgBottom: "#F7F5F0",
    images: [
      {
        src: "/blazer_navy_wool.jpg",
        alt: "Midnight Navy Super 130s Wool Blazer",
      },
      {
        src: "/blazer_charcoal_tux.jpg",
        alt: "Sartorial Charcoal Wool Dinner Jacket",
      },
      {
        src: "/blazer_houndstooth.jpg",
        alt: "Heritage English Houndstooth Blazer",
      },
      {
        src: "/blazer_sand_linen.jpg",
        alt: "Bespoke Sandstone Linen Blazer",
      },
      {
        src: "/blazer_double_breasted.jpg",
        alt: "Executive Double-Breasted Italian Blazer",
      },
    ],
  },
  {
    id: "ceremonial",
    title: "ETHNIC & CEREMONIAL LUXURY",
    description:
      "Regal raw silk bandhgalas, handcrafted velvet smoking jackets, and festive bespoke sherwanis curated for weddings, royal galas, and life's most momentous celebrations.",
    bgBottom: "#FAF8F5",
    images: [
      {
        src: "/ceremonial_bandhgala.jpg",
        alt: "Royal Silk Bandhgala Jacket",
      },
      {
        src: "/ceremonial_ivory_tux.jpg",
        alt: "Ivory Silk Blend Ceremonial Jacket",
      },
      {
        src: "/ceremonial_kurta_silk.jpg",
        alt: "Hand-Stitched Silk Kurta Ensemble",
      },
      {
        src: "/ceremonial_velvet.jpg",
        alt: "Bespoke Midnight Velvet Smoking Jacket",
      },
      {
        src: "/ceremonial_silk_blend.jpg",
        alt: "Artisanal Jacquard Ceremonial Royal Coat",
      },
    ],
  },
];

interface ShopCollectionsOverviewProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function ShopCollectionsOverview({ onSelectCategory }: ShopCollectionsOverviewProps) {
  return (
    <div className="w-full space-y-12 sm:space-y-16">
      {SUITOHOLIC_COLLECTIONS.map((cat) => (
        <section
          key={cat.id}
          aria-labelledby={`collection-${cat.id}`}
          className="w-full bg-[#ECEAE5] border-b border-[#E5E3DD]"
        >
          {/* Section Header */}
          <div className="w-full px-4 pb-4 pt-10 sm:px-6 sm:pb-5 sm:pt-14 lg:px-8 flex items-center justify-between">
            <h2
              id={`collection-${cat.id}`}
              className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight"
            >
              {cat.title}
            </h2>
            <button
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="text-xs font-semibold tracking-wider uppercase text-[#666666] hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Explore</span>
              <span>→</span>
            </button>
          </div>

          {/* Signature 5-Card Editorial Collage Grid (Matching suosindia.com/collections pattern) */}
          <div className="grid grid-cols-2 gap-0.5 sm:gap-[2px] lg:grid-cols-6 w-full bg-[#E5E3DD]">
            
            {/* Item 1: Large Featured Landscape Card (4 cols on lg, aspect 16/11) */}
            <div
              onClick={() => onSelectCategory(cat.id)}
              className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-2 aspect-[4/5] lg:col-span-4 lg:aspect-[16/11]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.images[0].src}
                alt={cat.images[0].alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Item 2: Companion Tall Portrait Card (2 cols on lg, aspect auto) */}
            <div
              onClick={() => onSelectCategory(cat.id)}
              className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2 lg:aspect-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.images[1].src}
                alt={cat.images[1].alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Item 3: Card 3 (2 cols on lg, aspect 3/4) */}
            <div
              onClick={() => onSelectCategory(cat.id)}
              className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.images[2].src}
                alt={cat.images[2].alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Item 4: Card 4 (2 cols on lg, aspect 3/4) */}
            <div
              onClick={() => onSelectCategory(cat.id)}
              className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.images[3].src}
                alt={cat.images[3].alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

            {/* Item 5: Card 5 (2 cols on lg, aspect 3/4) */}
            <div
              onClick={() => onSelectCategory(cat.id)}
              className="group relative block overflow-hidden bg-[#E7E7E4] cursor-pointer col-span-1 aspect-[3/4] lg:col-span-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cat.images[4].src}
                alt={cat.images[4].alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
            </div>

          </div>

          {/* Bottom Editorial Callout Strip */}
          <div
            className="flex flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16 border-t border-[#E5E3DD]"
            style={{ backgroundColor: cat.bgBottom || "#F7F5F0" }}
          >
            <p className="font-serif-luxury text-[20px] font-bold uppercase leading-[1.15] tracking-[0.08em] text-black sm:text-[24px]">
              Shop {cat.title} Collection
            </p>
            <p className="mt-3 max-w-[560px] text-[13px] font-normal leading-relaxed text-black/75 sm:text-[14px] font-sans">
              {cat.description}
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className="mt-6 inline-flex h-9 min-w-[136px] items-center justify-center border border-black bg-transparent px-7 text-[12px] font-semibold uppercase leading-none tracking-[0.08em] text-black transition-all hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:h-10 sm:text-[13px] cursor-pointer active:scale-95"
              aria-label={`Shop the ${cat.title} collection`}
            >
              Shop now
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}

