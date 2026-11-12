"use client";

import React, { useRef, useState, useEffect } from"react";
import Link from"next/link";
import { ChevronLeft, ChevronRight } from"lucide-react";
import { useContent } from"@/context/SiteDataProvider";
import { getMatchingFullShirtImage } from"@/lib/matchingFullShirt";

export default function ShopByCategoryGrid() {
  const c = useContent("shopByCategory");
  const categoryItems = c.items ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalPages = Math.max(1, Math.ceil(categoryItems.length / 3));

  // Auto-play: Slide to the left every 2 seconds
  useEffect(() => {
    if (isHovered || categoryItems.length === 0) return;

    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
      const firstCard = scrollRef.current.firstElementChild as HTMLElement;
      const step = firstCard ? firstCard.offsetWidth + 5 : 360;

      if (scrollLeft + clientWidth >= scrollWidth - 25) {
        // Reached end, loop back smoothly to start
        scrollRef.current.scrollTo({ left: 0, behavior:"smooth" });
      } else {
        // Slide leftwards by 1 card step
        scrollRef.current.scrollBy({ left: step, behavior:"smooth" });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, categoryItems.length]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActivePageIndex(0);
      return;
    }
    const ratio = scrollLeft / maxScroll;
    const page = Math.min(totalPages - 1, Math.round(ratio * (totalPages - 1)));
    setActivePageIndex(page);
  };

  const handlePrev = () => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 5 : scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: -step, behavior:"smooth" });
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.firstElementChild as HTMLElement;
    const step = firstCard ? firstCard.offsetWidth + 5 : scrollRef.current.clientWidth;
    scrollRef.current.scrollBy({ left: step, behavior:"smooth" });
  };

  const scrollToPage = (pageIdx: number) => {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: pageIdx * step, behavior:"smooth" });
  };

  return (
    <section className="w-full my-12 sm:my-16 lg:my-20 relative">
      {/* Title: OUR FAVOURITE */}
      <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          {c.heading ==="SHOP BY CATEGORY" ?"OUR FAVOURITE" : (c.heading ||"OUR FAVOURITE")}
        </h2>
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Collection"
          type="button"
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black text-white transition-all duration-300 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <ChevronLeft size={22} className="stroke-[2.5]" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next Collection"
          type="button"
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black text-white transition-all duration-300 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
        >
          <ChevronRight size={22} className="stroke-[2.5]" />
        </button>

        {/* Scrollable Track - 3 Cards per view on desktop, full-width edge-to-edge, 5px gap */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-stretch gap-[5px] overflow-x-auto scrollbar-none scroll-smooth w-full px-0"
        >
          {categoryItems.map((item, index) => {
            const hoverImage = getMatchingFullShirtImage(item);
            return (
              <Link
                key={`${index}-${item.title}`}
                href={item.href ||"/shop"}
                className="relative w-full min-w-[85vw] sm:min-w-[calc((100vw-5px)/2)] lg:min-w-[calc((100vw-10px)/3)] lg:w-[calc((100vw-10px)/3)] aspect-[3/4.2] sm:aspect-[3/4] lg:aspect-[3/3.8] shrink-0 overflow-hidden bg-[#ECEAE5] group/card block cursor-pointer"
              >
                {/* Default Portrait Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className={`w-full h-full object-cover object-center group-hover/card:scale-103 transition-all duration-700 ease-out ${
                    hoverImage ? "group-hover/card:opacity-0" : ""
                  }`}
                  loading="lazy"
                />

                {/* Hover Image: Full Tailored Shirt View */}
                {hoverImage && (
                  <div className="absolute inset-0 w-full h-full bg-[#ECEAE5] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ease-out z-10 overflow-hidden pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hoverImage}
                      alt={`${item.title} Full Look`}
                      className="w-full h-full object-cover object-center group-hover/card:scale-103 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Bottom Subtle Dark Gradient for Contrast */}
                <div className="absolute inset-x-0 bottom-0 h-40 sm:h-48 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                {/* Bottom Left Title Overlay - Exact Match to Reference: ATELIER COLLECTION / NOIR COLLECTION / HERITAGE COLLECTION */}
                <div className="absolute bottom-6 sm:bottom-8 left-5 sm:left-8 z-20 pr-4">
                  <h3 className="font-sans font-bold text-sm sm:text-base lg:text-[18px] tracking-[0.16em] uppercase text-white drop-shadow-sm leading-tight">
                    {item.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Pagination Dots / Dash Indicators matching reference (• • —) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
            {Array.from({ length: totalPages }).map((_, pIdx) => {
              const isActive = activePageIndex === pIdx;
              return (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => scrollToPage(pIdx)}
                  aria-label={`Go to slide page ${pIdx + 1}`}
                  className="py-2 cursor-pointer group/dot"
                >
                  <span
                    className={`block h-[2px] transition-all duration-300 ${
                      isActive
                        ?"w-8 sm:w-10 bg-[#8C7355] shadow-xs"
                        :"w-2 sm:w-2.5 bg-[#CCCCCC] group-hover/dot:bg-[#888888]"
                    } rounded-full`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
