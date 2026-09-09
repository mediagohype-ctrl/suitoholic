"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCategory, ProductItem } from "@/data/products";
import ModernProductCard from "./ModernProductCard";

interface ModernCollectionSectionProps {
  collection: CollectionCategory;
  products: ProductItem[];
  headerTitle?: string;
}

export default function ModernCollectionSection({
  collection,
  products,
  headerTitle,
}: ModernCollectionSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id={collection.id}
      className="py-2.5 sm:py-3.5 lg:py-4 px-3.5 sm:px-6 lg:px-10 xl:px-12 max-w-[1720px] mx-auto w-full relative z-10"
    >
      {/* Top Header Row with Luxury Accents */}
      <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
        
        {/* Left Side: Premium Bold Title with Bronze Accent */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-1 sm:w-1.5 h-4 sm:h-5 rounded-full bg-[#9E774C]" />
          <h2 className="text-[15px] sm:text-[18px] lg:text-[20px] font-bold tracking-tight text-[#14110E] leading-snug">
            {headerTitle || collection.title}
          </h2>
        </div>

        {/* Right Side: Navigation Controls + Discover More Button */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Subtle Carousel Arrow Buttons for desktop (if more than 4 items) */}
          {products.length > 4 && (
            <div className="hidden sm:flex items-center space-x-1.5 mr-1">
              <button
                onClick={() => handleScroll("left")}
                type="button"
                aria-label="Scroll left"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-[#14110E] hover:text-[#FAF8F5] text-[#14110E] border border-[#D0BDA9] flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-95"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                type="button"
                aria-label="Scroll right"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-[#14110E] hover:text-[#FAF8F5] text-[#14110E] border border-[#D0BDA9] flex items-center justify-center transition-all duration-200 shadow-2xs active:scale-95"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Pill "Discover more" Button with animated arrow */}
          <Link
            href={`/shop?category=${collection.id}`}
            className="bg-white/80 hover:bg-[#14110E] text-[#14110E] hover:text-[#FAF8F5] border border-[#14110E]/15 text-[11px] sm:text-[12px] font-semibold px-4 sm:px-4.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 shadow-2xs flex items-center gap-1.5 group whitespace-nowrap"
          >
            <span>Discover more</span>
            <span className="transform group-hover:translate-x-0.5 transition-transform duration-200 text-[10px]">→</span>
          </Link>
        </div>

      </div>

      {/* Product Cards Row (4 wide expansive cards per view on desktop, smooth swipe on mobile) */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-3.5 sm:gap-4 lg:gap-5 pb-1 sm:pb-0 scrollbar-none snap-x snap-mandatory w-full scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[280px] sm:w-[320px] md:w-[calc(50%-12px)] lg:w-[calc(25%-15px)] shrink-0 snap-start"
          >
            <ModernProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
