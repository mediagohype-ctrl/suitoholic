"use client";

import React from "react";
import Link from "next/link";
import { ProductItem } from "@/data/products";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";

interface YouMayAlsoLikeSectionProps {
  products: ProductItem[];
  currentProductId?: string | number;
}

export default function YouMayAlsoLikeSection({
  products,
  currentProductId,
}: YouMayAlsoLikeSectionProps) {
  // Filter out the current active product so we show alternative recommendations
  const filtered = (products || []).filter(
    (p) => String(p.id) !== String(currentProductId) && p.image
  );

  // If filtered is small, fallback to all valid products
  const candidates = filtered.length >= 6 ? filtered : products || [];

  // Duplicate candidates to create a continuous, infinite smooth marquee loop
  const displayItems = [...candidates, ...candidates];

  return (
    <section className="w-full my-10 sm:my-14 lg:my-16 relative overflow-hidden">
      {/* Header Row: Title on Left, View All on Right with 5px Screen Margins */}
      <div className="w-full px-[5px] sm:px-3 mb-5 sm:mb-7 flex items-end justify-between border-b border-[#E5E3DD] pb-4">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          YOU MAY ALSO LIKE
        </h2>

        <Link
          href="/shop"
          className="text-xs sm:text-[13px] font-bold tracking-[0.18em] uppercase text-black hover:text-neutral-600 transition-colors pb-0.5 shrink-0"
        >
          VIEW ALL
        </Link>
      </div>

      {/* Infinite Autoplay Smooth Slow Moving Carousel - Exactly 5px from Screen */}
      <div className="relative w-full overflow-hidden select-none px-[5px]">
        <div
          className="flex items-center gap-2.5 sm:gap-3.5 animate-marquee-slow hover:[animation-play-state:paused]"
          style={{
            animationDuration: `${Math.max(50, displayItems.length * 3.5)}s`,
          }}
        >
          {displayItems.map((item, idx) => {
            const productHref = item.slug
              ? `/product/${item.slug}`
              : `/product/${item.id}`;

            const fullImg = getMatchingFullShirtImage(item);
            const imageSrc = fullImg || item.image;

            return (
              <Link
                key={`${item.id}-${idx}`}
                href={productHref}
                className="group relative block shrink-0 w-[230px] sm:w-[270px] md:w-[300px] lg:w-[330px] aspect-[3/4] overflow-hidden bg-[#ECEAE5] cursor-pointer"
                title={item.name}
              >
                {/* Product Image: Clean, high-resolution portrait format without any text, price or badges */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Subtle Luxury Hover Vignette */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
