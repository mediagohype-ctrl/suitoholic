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
      {/* Top Header Row matching Reference Screenshot */}
      <div className="flex items-center justify-between gap-4 mb-2.5 sm:mb-3">
        
        {/* Left Side: Bold, Luxury Title */}
        <h2 className="text-sm sm:text-[16px] lg:text-[18px] font-bold tracking-tight text-[#14110E] leading-snug">
          {headerTitle || collection.title}
        </h2>

        {/* Right Side: Navigation Controls + Discover More Button */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Subtle Carousel Arrow Buttons for desktop (if more than 4 items) */}
          {products.length > 4 && (
            <div className="hidden sm:flex items-center space-x-1 mr-1">
              <button
                onClick={() => handleScroll("left")}
                type="button"
                aria-label="Scroll left"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF8F5]/90 hover:bg-[#14110E] hover:text-[#FAF8F5] text-[#14110E] border border-[#D0BDA9] flex items-center justify-center transition-colors shadow-2xs"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => handleScroll("right")}
                type="button"
                aria-label="Scroll right"
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF8F5]/90 hover:bg-[#14110E] hover:text-[#FAF8F5] text-[#14110E] border border-[#D0BDA9] flex items-center justify-center transition-colors shadow-2xs"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          )}

          {/* Pill "Discover more" Button matching reference image */}
          <Link
            href={`/shop?category=${collection.id}`}
            className="bg-[#FAF8F5] hover:bg-[#14110E] text-[#14110E] hover:text-[#FAF8F5] border border-[#14110E]/15 text-[10.5px] sm:text-[11.5px] font-medium px-3.5 sm:px-4 py-0.5 sm:py-1 rounded-full transition-all duration-200 shadow-2xs whitespace-nowrap"
          >
            Discover more
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
