"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";
import { useCustomizer } from "@/context/CustomizerModalProvider";

export default function ShopByCategoryGrid() {
  const c = useContent("shopByCategory");
  const categoryItems = c.items ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openCustomizer } = useCustomizer();

  const handlePrev = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: -scrollRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: scrollRef.current.clientWidth * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 my-10 sm:my-14 lg:my-18 select-none relative">
      {/* Title */}
      <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          {c.heading}
        </h2>
      </div>

      {/* Carousel Container with Left & Right Arrow Buttons */}
      <div className="relative w-full group/carousel">
        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Categories"
          type="button"
          className="absolute -left-2 sm:-left-4 lg:-left-6 top-[40%] -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={20} className="stroke-[2.5]" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          aria-label="Next Categories"
          type="button"
          className="absolute -right-2 sm:-right-4 lg:-right-6 top-[40%] -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-black text-white hover:bg-neutral-800 transition-all duration-300 shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={20} className="stroke-[2.5]" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3.5 sm:gap-4.5 lg:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-3 pt-1 px-0.5"
        >
          {categoryItems.map((item, index) => (
            <div
              key={`${index}-${item.title}`}
              className="flex flex-col items-center w-[78%] sm:w-[calc(50%-10px)] md:w-[calc((100%-54px)/4)] shrink-0 group"
            >
              {/* Portrait Image Container */}
              <Link
                href={item.href || "/shop"}
                className="relative w-full aspect-[3/4.2] rounded-[9px] overflow-hidden bg-white border border-[#E5E3DD] shadow-xs group-hover:shadow-md transition-all duration-500 block cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              </Link>

              {/* Sub-label & Plus Button under card */}
              <div className="w-full flex items-center justify-between pt-3 px-1">
                <Link
                  href={item.href || "/shop"}
                  className="font-bold text-[10.5px] sm:text-xs tracking-[0.18em] text-black hover:opacity-75 uppercase transition-opacity truncate pr-2"
                >
                  {item.title}
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openCustomizer({
                      id: (item as unknown as { id?: number }).id || 100 + index,
                      name: item.title,
                      image: item.image,
                      slug: (item as unknown as { slug?: string }).slug || item.title.toLowerCase().replace(/\s+/g, "-"),
                      price: (item as unknown as { price?: string }).price || "₹ 2,600",
                      rawPrice: 2600,
                    });
                  }}
                  aria-label={`Customise ${item.title}`}
                  title="Customise Shirt (6 Steps)"
                  className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
