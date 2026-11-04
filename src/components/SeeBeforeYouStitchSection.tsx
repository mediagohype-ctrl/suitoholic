"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";
import type { FinishedLookSlide } from "@/content/sections/finishedLooks";

// Authentic Fallback Slides (Directly derived from the 13 backend catalog shirts)
const DEFAULT_BACKEND_SLIDES: FinishedLookSlide[] = [
  {
    id: "look-linen-shirt",
    fabricImage: "/new_shirts/shirt_13.jpg",
    lookImage: "/customizer/full_shirt_13.jpg",
    title: "Fabric to bespoke natural linen shirt",
    description: "Shown to you in minutes, in store & online",
    fabricName: "Beige Textured Linen Cotton",
  },
  {
    id: "look-chocolate-shirt",
    fabricImage: "/new_shirts/shirt_19.jpg",
    lookImage: "/customizer/full_shirt_19.jpg",
    title: "Fabric to bespoke Italian chocolate luxury shirt",
    description: "Shown to you in minutes, in store & online",
    fabricName: "Dark Chocolate Brown Satin Twill",
  },
  {
    id: "look-banker-shirt",
    fabricImage: "/new_shirts/shirt_21.jpg",
    lookImage: "/customizer/full_shirt_21.jpg",
    title: "Fabric to Italian bespoke banker stripe shirt",
    description: "Shown to you in minutes, in store & online",
    fabricName: "Royal Blue Classic Bengal Stripe Twill",
  },
  {
    id: "look-terracotta-shirt",
    fabricImage: "/new_shirts/shirt_14.jpg",
    lookImage: "/customizer/full_shirt_14.jpg",
    title: "Fabric to bespoke coral bengal stripe shirt",
    description: "Shown to you in minutes, in store & online",
    fabricName: "Coral Red Bold Bengal Stripe Twill",
  },
  {
    id: "look-sage-shirt",
    fabricImage: "/new_shirts/shirt_18.jpg",
    lookImage: "/customizer/full_shirt_18.jpg",
    title: "Fabric to bespoke sage green striped shirt",
    description: "Shown to you in minutes, in store & online",
    fabricName: "Sage Green Bengal Striped Twill",
  },
];

export default function SeeBeforeYouStitchSection() {
  const { products } = useCatalog();
  const content = useContent("finishedLooks");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamically resolve slides: prioritizes custom admin configured looks,
  // falling back to catalog shirts if none configured
  const slides: FinishedLookSlide[] = useMemo(() => {
    if (content?.slides && Array.isArray(content.slides) && content.slides.length > 0) {
      const active = content.slides.filter((s) => s.active !== false);
      if (active.length > 0) return active;
    }

    const shirtProducts = (products || []).filter(
      (p) =>
        (p.category?.includes("formal") || p.category?.includes("shirt") || p.category === "formal_bespoke") &&
        p.image &&
        !p.name.toLowerCase().includes("pant") &&
        !p.name.toLowerCase().includes("trouser") &&
        !p.name.toLowerCase().includes("tee")
    );

    if (shirtProducts.length > 0) {
      return shirtProducts.slice(0, 6).map((p) => {
        const fullShirt =
          (p.gallery && p.gallery.length > 1 ? p.gallery[1] : null) ||
          getMatchingFullShirtImage(p) ||
          p.image;

        return {
          id: `look-prod-${p.id}`,
          fabricImage: p.image,
          lookImage: fullShirt,
          title: `Fabric to bespoke ${p.name.toLowerCase()}`,
          description: "Shown to you in minutes, in store & online",
          fabricName: p.fabric || p.subtitle || p.name,
          active: true,
        };
      });
    }

    return DEFAULT_BACKEND_SLIDES;
  }, [content, products]);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentIndex] || slides[0] || DEFAULT_BACKEND_SLIDES[0];

  return (
    <section 
      aria-label="See Before You Stitch"
      className="relative w-full bg-[#ECEAE5] py-16 sm:py-24 border-b border-[#E5E3DD] select-none overflow-hidden font-sans"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Main Title */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
            {content?.sectionTitle || "Your fabric, as a finished look"}
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main White Card matching reference */}
          <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[36px] p-5 sm:p-8 shadow-xl transition-all duration-500">
            
            {/* Visuals Split: Left Fabric Swatch + Right Finished Look on Model */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-7 items-center">
              
              {/* Left Sub-Card: Fabric Swatch */}
              <div className="md:col-span-4 flex flex-col justify-center">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E5E3DD] shadow-xs group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSlide.fabricImage}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
                  />
                  {/* "Your fabric" Badge */}
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md">
                    Your fabric
                  </span>
                </div>
              </div>

              {/* Right Sub-Card: Finished Look on Model */}
              <div className="md:col-span-8">
                <div className="relative aspect-[4/4.8] sm:aspect-[4/4.5] w-full rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E5E3DD] shadow-sm group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeSlide.lookImage}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-103"
                  />

                  {/* "PREVIEW" Badge */}
                  <span className="absolute top-3.5 right-3.5 bg-black/85 backdrop-blur-xs text-white text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-[6px] shadow-md">
                    PREVIEW
                  </span>

                  {/* Subtle Brand Watermark Emblem in bottom right */}
                  <div className="absolute bottom-3 right-3 opacity-30 pointer-events-none">
                    <span className="text-[10px] font-serif tracking-[0.2em] text-white uppercase drop-shadow-md">
                      SUITOHOLIC
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Card Footer: Title & Description */}
            <div className="mt-6 sm:mt-7 pt-5 border-t border-[#F2EFE9]">
              <h3 className="text-base sm:text-lg font-bold text-[#14110E] leading-snug">
                {activeSlide.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#666666] mt-0.5">
                {activeSlide.description}
              </p>
            </div>

          </div>

          {/* Left Navigation Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous finished look"
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black shadow-xl border border-[#E5E3DD] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Right Navigation Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next finished look"
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black shadow-xl border border-[#E5E3DD] flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>

          {/* Pagination Indicators matching reference (• • • • •) */}
          <div className="flex items-center justify-center gap-2 mt-6 sm:mt-7">
            {slides.map((slide, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                    isActive
                      ? "w-7 bg-black shadow-xs"
                      : "w-2 bg-black/25 hover:bg-black/50"
                  }`}
                />
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
