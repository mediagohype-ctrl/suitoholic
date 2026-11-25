"use client";

import React from"react";

export default function ShopNatureHeroBanner() {
  return (
    <section
      aria-label="Shop Collection Hero Banner"
      className="relative h-[100dvh] w-full overflow-hidden bg-[#e4d5bf]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/banners/shop-warm-conversation-over-tea.webp"
        alt="Two men in striped tailored shirts sharing tea on a sofa in a bright atelier."
        className="absolute inset-0 h-full w-full object-contain [@media(min-aspect-ratio:8/5)_and_(max-aspect-ratio:5/2)]:object-cover"
        fetchPriority="high"
      />

      {/* Left Bottom: Minimalist Label */}
      <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 lg:left-16 z-20 flex items-center">
        <p className="font-sans text-xs sm:text-[13px] font-medium tracking-[0.22em] uppercase text-[#14110E]/90">
          The Bespoke Collection &middot; Tailored For You
        </p>
      </div>
    </section>
  );
}
