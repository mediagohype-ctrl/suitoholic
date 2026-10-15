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
    <section className="w-full mb-12 sm:mb-16 overflow-hidden rounded-xl sm:rounded-2xl border border-[#D5C7B8] shadow-md select-none bg-[#1C3B2B]">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] sm:min-h-[560px] lg:min-h-[620px]">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: EDITORIAL CONTENT (Deep Forest Emerald Luxury Theme)         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-14 xl:px-18 py-10 sm:py-14 lg:py-16 text-white">
          <div className="max-w-xl">
            {/* Main Dual-Tone Headline matching reference screenshot */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] lg:text-[46px] xl:text-[50px] font-normal tracking-tight leading-[1.12] mb-5">
              <span className="block text-white">Grown by nature.</span>
              <span className="block italic text-[#EADBC8]">Guided by restraint.</span>
            </h1>

            {/* Subtitle / Philosophy Description */}
            <p className="text-xs sm:text-[13.5px] lg:text-[14px] text-[#D1DDD5] leading-relaxed mb-7 sm:mb-8 font-sans font-normal">
              Crafted with natural fibres and timeless design, each piece brings together
              thoughtful craftsmanship, conscious choices and effortless elegance, created for
              everyday living and made to remain meaningful beyond seasons and trends.
            </p>

            {/* 4 Feature Rows with Subtle Dividers */}
            <div className="border-t border-white/15 divide-y divide-white/10 mb-8 sm:mb-9">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="py-3 sm:py-3.5 text-xs sm:text-[13px] text-white/95 font-medium tracking-wide flex items-center justify-between"
                >
                  <span>{p.title}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EADBC8]/70 inline-block" />
                </div>
              ))}
            </div>

            {/* Call To Action: SHOP COLLECTION */}
            <div>
              <button
                type="button"
                onClick={handleScrollToCatalog}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#EADBC8] hover:bg-[#DDD0BC] active:scale-[0.99] text-[#1C3B2B] text-xs sm:text-[13px] font-bold tracking-[0.16em] uppercase rounded-xs transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
              >
                <span>SHOP COLLECTION</span>
                <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: HIGH FASHION EDITORIAL SUNLIT LINEN PHOTOGRAPH             */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-6 relative min-h-[380px] sm:min-h-[460px] lg:min-h-full overflow-hidden bg-[#244734]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/banners/shop_hero_nature_linen.jpg"
            alt="Gentleman walking in natural linen shirting in sunlit golden prairie"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
            loading="eager"
          />
          {/* Subtle gradient sheen overlay for cinematic mood */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 lg:bg-gradient-to-r lg:from-[#1C3B2B]/40 lg:via-transparent lg:to-transparent" />
        </div>
      </div>
    </section>
  );
}
