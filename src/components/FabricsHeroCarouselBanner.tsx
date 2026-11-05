"use client";

import React from"react";

export default function FabricsHeroCarouselBanner() {
  return (
    <section
      aria-label="Fabrics Hero Banner"
      className="relative w-full h-[100dvh] min-h-[580px] overflow-hidden bg-[#ECEAE5]"
    >
      {/* Background Photographic Image: Natural, crisp, full 100vh viewport coverage */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/outfit_hero_suit_light.jpg"
        alt="Gentleman in Luxury Bespoke Tailored Suit in Sunlit Atelier"
        className="w-full h-full object-cover object-center"
        loading="eager"
      />

      {/* Left Bottom: Minimalist Label */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 lg:left-16 z-20 flex items-center">
        <p className="font-sans text-xs sm:text-[13px] font-medium tracking-[0.22em] uppercase text-[#14110E]/90">
          The World&apos;s Finest Fabrics &middot; Tailored For You
        </p>
      </div>
    </section>
  );
}
