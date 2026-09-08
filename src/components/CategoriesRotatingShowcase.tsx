"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CategoryCardItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const categoriesData: CategoryCardItem[] = [
  {
    id: "formal-shirts",
    title: "SHIRTS",
    subtitle: "Egyptian Giza Twill & Sea Island Poplins",
    image: "/shop_bespoke_shirt.jpg",
    link: "/shop?category=formal_shirts",
  },
  {
    id: "suits-blazers",
    title: "CO-ORD SETS",
    subtitle: "Italian Super 130s Worsted Wool & Double-Breasted",
    image: "/blazer_navy_wool.jpg",
    link: "/shop?category=blazers",
  },
  {
    id: "tailored-trousers",
    title: "DENIM EDIT & PANTS",
    subtitle: "Sartorial Pleated Gurkha & Wool Dress Pants",
    image: "/pant_pleated_beige.jpg",
    link: "/shop?category=trousers",
  },
  {
    id: "ceremonial-atelier",
    title: "CEREMONIAL ATELIER",
    subtitle: "Royal Bandhgalas & Italian Velvet Smoking Jackets",
    image: "/ceremonial_bandhgala.jpg",
    link: "/shop?category=ceremonial",
  },
  {
    id: "luxury-polos",
    title: "LUXURY KNIT POLOS",
    subtitle: "Silk-Blend Knitwear & Pima Cotton Essentials",
    image: "/tshirt_knit_navy_polo.jpg",
    link: "/shop?category=tshirts",
  },
  {
    id: "custom-fit",
    title: "BESPOKE CONFIGURATOR",
    subtitle: "Tailored to Your Exact Body Measurements & Monogram",
    image: "/tailoring_tools.jpg",
    link: "/custom-shirt",
  },
];

export default function CategoriesRotatingShowcase() {
  const [activeIndex, setActiveIndex] = useState(1); // Default to CO-ORD SETS matching reference
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const total = categoriesData.length;

  // Clockwise rotation (Next category on right button click)
  const rotateClockwise = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Anti-Clockwise rotation (Previous category on left button click)
  const rotateAntiClockwise = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
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

  return (
    <section 
      className="w-full py-8 sm:py-12 lg:py-14 px-4 sm:px-8 lg:px-12 max-w-[1720px] mx-auto relative select-none overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Heading matching reference image: CATEGORIES */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-[#3D1E28] tracking-[0.22em] uppercase font-medium">
          CATEGORIES
        </h2>
        <div className="w-12 sm:w-16 h-[1.5px] bg-[#9E774C]/60 mx-auto mt-2 sm:mt-3" />
      </div>

      {/* 3D Coverflow Revolving Carousel Stage */}
      <div className="relative w-full h-[280px] sm:h-[360px] md:h-[400px] lg:h-[440px] flex items-center justify-center [perspective:1400px]">
        
        {/* Anti-Clockwise Left Button */}
        <button
          onClick={rotateAntiClockwise}
          aria-label="Rotate Anti-Clockwise (Previous Category)"
          type="button"
          className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#3D1E28] hover:bg-[#14110E] text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/20 group cursor-pointer"
        >
          <ChevronLeft size={20} className="transform group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Clockwise Right Button */}
        <button
          onClick={rotateClockwise}
          aria-label="Rotate Clockwise (Next Category)"
          type="button"
          className="absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#3D1E28] hover:bg-[#14110E] text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 border border-white/20 group cursor-pointer"
        >
          <ChevronRight size={20} className="transform group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3D Rotating Category Cards */}
        <div className="relative w-full max-w-[1280px] h-full flex items-center justify-center">
          {categoriesData.map((category, index) => {
            // Compute shortest circular offset from active index
            let offset = index - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isLeft = offset === -1 || (offset < 0 && Math.abs(offset) <= 1);
            const isRight = offset === 1 || (offset > 0 && Math.abs(offset) <= 1);

            // Position & 3D Transform Styles
            let transformStyle = "";
            let zIndex = 10;
            let opacity = 0;
            let pointerEvents: "auto" | "none" = "none";

            if (isCenter) {
              transformStyle = "translate3d(0, 0, 80px) scale(1) rotateY(0deg)";
              zIndex = 30;
              opacity = 1;
              pointerEvents = "auto";
            } else if (isLeft) {
              transformStyle = "translate3d(-58%, 0, -60px) scale(0.82) rotateY(16deg)";
              zIndex = 20;
              opacity = 0.85;
              pointerEvents = "auto";
            } else if (isRight) {
              transformStyle = "translate3d(58%, 0, -60px) scale(0.82) rotateY(-16deg)";
              zIndex = 20;
              opacity = 0.85;
              pointerEvents = "auto";
            } else {
              transformStyle = offset < 0 
                ? "translate3d(-100%, 0, -200px) scale(0.6) rotateY(35deg)" 
                : "translate3d(100%, 0, -200px) scale(0.6) rotateY(-35deg)";
              zIndex = 5;
              opacity = 0;
            }

            return (
              <div
                key={category.id}
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
                className={`absolute w-[290px] sm:w-[400px] md:w-[480px] lg:w-[540px] h-[230px] sm:h-[300px] md:h-[350px] lg:h-[390px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out shadow-2xl border ${
                  isCenter ? "border-white/50 ring-2 ring-[#9E774C]/30" : "border-white/20 brightness-90 hover:brightness-100"
                }`}
              >
                <Link href={category.link} className="block w-full h-full relative group">
                  {/* Background Luxury Category Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                  {/* Category Title Overlay matching screenshot */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-center space-y-1">
                    <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-white tracking-[0.16em] uppercase font-normal drop-shadow-md">
                      {category.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#E5D7C7] font-sans font-medium tracking-wide opacity-90 line-clamp-1">
                      {category.subtitle}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Horizontal Pagination Bars matching screenshot */}
      <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
        {categoriesData.map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              type="button"
              aria-label={`Go to category ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-300 ${
                isActive
                  ? "w-8 sm:w-10 bg-[#3D1E28] shadow-xs"
                  : "w-5 sm:w-7 bg-[#3D1E28]/25 hover:bg-[#3D1E28]/50"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
