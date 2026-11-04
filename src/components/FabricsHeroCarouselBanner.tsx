"use client";

import React from "react";

export default function FabricsHeroCarouselBanner() {
  return (
    <section
      aria-label="Fabrics Hero Banner"
      className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] overflow-hidden bg-[#ECEAE5] select-none"
    >
      {/* Background Photographic Image: Natural, crisp, and fully visible without any light shade overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/outfit_hero_suit_light.jpg"
        alt="Gentleman in Luxury Bespoke Tailored Suit in Sunlit Atelier"
        className="w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Banner Content: Clean Luxury Heading */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-normal text-[#1A1815] leading-[1.12] tracking-tight drop-shadow-xs">
              <span>The World&apos;s Finest Fabrics.</span>{" "}
              <span className="italic font-light text-[#8C6D38] block mt-1.5">
                Tailored For You.
              </span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
