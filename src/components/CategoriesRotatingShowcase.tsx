"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";

export default function CategoriesRotatingShowcase() {
  const c = useContent("categoriesShowcase");
  const categoriesData = c.items ?? [];
  const total = categoriesData.length;

  const [rawActiveIndex, setActiveIndex] = useState(() => Number(c.defaultActiveIndex) || 0); // Default to CO-ORD SETS matching reference
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Keep the index in range even if the admin removes items.
  const activeIndex = total > 0 ? ((Math.trunc(rawActiveIndex) % total) + total) % total : 0;

  // Clockwise rotation (Next category on right button click)
  const rotateClockwise = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (((prev % total) + total) % total + 1) % total);
  }, [total]);

  // Anti-Clockwise rotation (Previous category on left button click)
  const rotateAntiClockwise = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (((prev % total) + total) % total - 1 + total) % total);
  }, [total]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      rotateClockwise();
    } else if (diff < -45) {
      rotateAntiClockwise();
    }
    touchStartX.current = null;
  };

  // Keyboard navigation when hovered
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovered) return;
      if (e.key === "ArrowRight") rotateClockwise();
      if (e.key === "ArrowLeft") rotateAntiClockwise();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isHovered, rotateClockwise, rotateAntiClockwise]);

  if (total === 0) return null;

  return (
    <section 
      className="w-full py-8 sm:py-12 lg:py-14 px-4 sm:px-8 lg:px-12 max-w-[1720px] mx-auto relative select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Heading matching reference screenshot: CATEGORIES */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#4A202A] tracking-[0.22em] uppercase font-bold">
          {c.heading}
        </h2>
      </div>

      {/* 3D Coverflow Revolving Carousel Stage matching reference screenshot */}
      <div className="relative w-full h-[260px] sm:h-[340px] md:h-[380px] lg:h-[420px] flex items-center justify-center [perspective:1400px]">
        
        {/* Anti-Clockwise Left Button */}
        <button
          onClick={rotateAntiClockwise}
          aria-label={c.previousAriaLabel}
          type="button"
          className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#4A202A] hover:bg-[#38161F] text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 group cursor-pointer"
        >
          <ChevronLeft size={20} className="transform group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Clockwise Right Button */}
        <button
          onClick={rotateClockwise}
          aria-label={c.nextAriaLabel}
          type="button"
          className="absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#4A202A] hover:bg-[#38161F] text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 group cursor-pointer"
        >
          <ChevronRight size={20} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Rotating Category Cards matching reference screenshot */}
        <div className="relative w-full max-w-[1280px] h-full flex items-center justify-center">
          {categoriesData.map((category, index) => {
            // Compute shortest circular offset from active index
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isLeft = offset === -1 || (offset < 0 && Math.abs(offset) <= 1);
            const isRight = offset === 1 || (offset > 0 && Math.abs(offset) <= 1);

            // Position & 3D Transform Styles matching reference layout
            let transformStyle = "";
            let zIndex = 10;
            let opacity = 0;
            let pointerEvents: "auto" | "none" = "none";

            if (isCenter) {
              transformStyle = "translate3d(0, 0, 40px) scale(1.05) rotateY(0deg)";
              zIndex = 30;
              opacity = 1;
              pointerEvents = "auto";
            } else if (isLeft) {
              transformStyle = "translate3d(-76%, 0, 0px) scale(0.85) rotateY(0deg)";
              zIndex = 20;
              opacity = 0.92;
              pointerEvents = "auto";
            } else if (isRight) {
              transformStyle = "translate3d(76%, 0, 0px) scale(0.85) rotateY(0deg)";
              zIndex = 20;
              opacity = 0.92;
              pointerEvents = "auto";
            } else {
              transformStyle = offset < 0 
                ? "translate3d(-130%, 0, -100px) scale(0.7) rotateY(0deg)" 
                : "translate3d(130%, 0, -100px) scale(0.7) rotateY(0deg)";
              zIndex = 5;
              opacity = 0;
            }

            return (
              <div
                key={index}
                onClick={() => {
                  if (isLeft) rotateAntiClockwise();
                  if (isRight) rotateClockwise();
                }}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  pointerEvents,
                }}
                className={`absolute w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] h-[210px] sm:h-[280px] md:h-[320px] lg:h-[360px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-xl ${
                  isCenter ? "border border-white/30 shadow-2xl" : "brightness-90 hover:brightness-100"
                }`}
              >
                <Link href={category.href || "/shop"} className="block w-full h-full relative group">
                  {/* Background Luxury Category Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

                  {/* Category Title Overlay matching reference screenshot */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-center">
                    <h3 className={`font-serif-luxury text-white tracking-[0.16em] uppercase font-normal drop-shadow-md transition-all ${
                      isCenter ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-xl lg:text-2xl opacity-90"
                    }`}>
                      {category.title}
                    </h3>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Horizontal Pagination Bars matching reference screenshot */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {categoriesData.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              type="button"
              aria-label={(c.dotAriaLabelTemplate || "Go to category {n}").replace("{n}", String(i + 1))}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 sm:w-10 bg-[#4A202A] shadow-xs"
                  : "w-6 sm:w-8 bg-[#DCD4CE] hover:bg-[#4A202A]/50"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
