"use client";

import React from "react";
import { ArrowDown } from "lucide-react";

interface FeaturePillar {
  title: string;
}

const PILLARS: FeaturePillar[] = [
  { title: "100% Natural Fibres" },
  { title: "Handcrafted by Artisans" },
  { title: "Sustainably Made" },
  { title: "Premium Quality" },
];

export default function ShopNatureHeroBanner() {
  const handleScrollToCatalog = () => {
    const target = document.getElementById("catalog-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden select-none bg-white border-b border-[#E5E3DD]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[560px] sm:min-h-[620px] lg:min-h-[680px]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: EDITORIAL CONTENT (BLUORNG MINIMALIST PALETTE)               */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 text-black relative z-20">
          <div className="max-w-xl">
            {/* Main Dual-Tone Headline matching website aesthetic */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] xl:text-[54px] font-bold tracking-tight leading-[1.1] mb-5">
              <span className="block text-black">Grown by nature.</span>
              <span className="block italic text-black font-serif">Guided by restraint.</span>
            </h1>

            {/* Subtitle / Philosophy Description */}
            <p className="text-sm sm:text-base lg:text-[17px] text-[#666666] leading-relaxed mb-7 sm:mb-8 font-sans font-normal">
              Crafted with natural fibres and timeless design, each piece brings together
              thoughtful craftsmanship, conscious choices and effortless elegance, created for
              everyday living and made to remain meaningful beyond seasons and trends.
            </p>

            {/* 4 Feature Rows with Subtle Dividers */}
            <div className="border-t border-[#E5E3DD] divide-y divide-[#E5E3DD] mb-8 sm:mb-9">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="py-3 sm:py-3.5 text-xs sm:text-[13px] text-black font-semibold tracking-wide flex items-center justify-between"
                >
                  <span>{p.title}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
                </div>
              ))}
            </div>

            {/* Call To Action: SHOP COLLECTION in solid black pill */}
            <div>
              <button
                type="button"
                onClick={handleScrollToCatalog}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-black hover:bg-neutral-800 active:scale-[0.99] text-white text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-sm cursor-pointer group"
              >
                <span>SHOP COLLECTION</span>
                <ArrowDown size={14} className="text-white transition-transform duration-300 group-hover:translate-y-0.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SUITOHOLIC BESPOKE LUXURY FABRICS SHOWCASE                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 relative min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden bg-[#ECEAE5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fabrics_hero_rolls.jpg"
            alt="Suitoholic Master Bespoke Heritage Fabrics"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
            loading="eager"
          />
          {/* Subtle gradient sheen overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/40 lg:via-transparent lg:to-transparent" />
        </div>
      </div>
    </section>
  );
}
