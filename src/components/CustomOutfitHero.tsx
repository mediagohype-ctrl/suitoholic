"use client";

import React from"react";

export default function CustomOutfitHero() {
  return (
    <section className="relative w-full h-[100dvh] min-h-[560px] overflow-hidden bg-[#ECEAE5]">
      {/* Clean, Full-Screen 100vh Luxury Editorial Banner (Without Text, Without Buttons) */}
      <div className="relative w-full h-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banners/custom_fit_atelier_hero.jpg"
          alt="Suitoholic Bespoke Handcrafted Shirting"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </div>
    </section>
  );
}
