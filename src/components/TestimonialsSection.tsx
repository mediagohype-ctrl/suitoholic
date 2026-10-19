"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

interface TestimonialItem {
  id: number;
  name: string;
  product: string;
  rating: number;
  avatar: string;
  review: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "Aditi Verma",
    product: "for Satin Shirt",
    rating: 5,
    avatar: "/reviews/avatar1.jpg",
    review:
      "“ Honestly surprised by the quality. It's lightweight, soft, and gives that rich satin shine without looking loud. Perfect for office + weekend both. ”",
  },
  {
    id: 2,
    name: "Avni Singh",
    product: "for Co-ords Set",
    rating: 4,
    avatar: "/reviews/avatar2.jpg",
    review:
      "“ So flattering and comfortable! I wore it for a small party and it looked very expensive. The fit is on point and the overall look is super stylish. ”",
  },
  {
    id: 3,
    name: "Priyanka Yadav",
    product: "for Floral Mini Dress",
    rating: 4,
    avatar: "/reviews/avatar3.jpg",
    review:
      "“ This mini dress is adorable. The floral print is pretty, the fit is flattering, and it's very comfy to wear for long hours. Perfect for day outings and vacations. ”",
  },
  {
    id: 4,
    name: "Dia Ajmera",
    product: "for Tiger Printed Shirt",
    rating: 4,
    avatar: "/reviews/avatar4.jpg",
    review:
      "“ This shirt is a total show-stopper. The print looks premium and the fit sits perfectly on the shoulders. I styled it with jeans and everyone asked where it's from. ”",
  },
  {
    id: 5,
    name: "Vikramaditya Singhania",
    product: "for Bespoke Royal Dobby",
    rating: 5,
    avatar: "/reviews/avatar5.jpg",
    review:
      "“ The fit around the shoulders and collar roll is unbelievable. Egyptian Giza 140s drape feels superior in every boardroom meeting. Best tailoring experience. ”",
  },
  {
    id: 6,
    name: "Devendra Kapoor",
    product: "for Italian Banker Stripe",
    rating: 5,
    avatar: "/reviews/avatar6.jpg",
    review:
      "“ Ordered with French double cuffs. The mother-of-pearl buttons and split yoke are true hallmarks of master craftsmanship. Immaculate white-glove finish. ”",
  },
  {
    id: 7,
    name: "Arjun Mehta",
    product: "for Sea Island White Formal",
    rating: 5,
    avatar: "/reviews/avatar7.jpg",
    review:
      "“ Finally a brand that understands sleeve pitch and waist tapering without multiple trial visits. The custom collar spread frames my tie knot like a painting. ”",
  },
  {
    id: 8,
    name: "Siddharth Verma",
    product: "for Austrian Herringbone Sky",
    rating: 5,
    avatar: "/reviews/avatar8.jpg",
    review:
      "“ Exceptional craftsmanship. The fabric texture in hand is vastly superior to off-the-rack luxury fashion houses. Calibrated my exact measurements flawlessly. ”",
  },
];

// Tripled list for seamless infinite loop
const ALL_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Start at the middle set (index = TESTIMONIALS.length = 8)
  const [currentIndex, setCurrentIndex] = useState(TESTIMONIALS.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState(0);

  const lastClickRef = useRef<number>(0);

  // Measure precise step (card width + gap)
  const measureStep = useCallback(() => {
    if (!trackRef.current) return;
    const cards = trackRef.current.children;
    if (cards.length >= 2) {
      const first = cards[0] as HTMLElement;
      const second = cards[1] as HTMLElement;
      const diff = second.offsetLeft - first.offsetLeft;
      if (diff > 0) {
        setStep(diff);
        return;
      }
    }
    if (containerRef.current) {
      const w = containerRef.current.clientWidth;
      if (window.innerWidth >= 1024) {
        setStep((w - 60) / 4 + 20);
      } else if (window.innerWidth >= 640) {
        setStep((w - 16) / 2 + 16);
      } else {
        setStep(w + 16);
      }
    }
  }, []);

  useEffect(() => {
    measureStep();
    const raf = requestAnimationFrame(measureStep);
    window.addEventListener("resize", measureStep);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measureStep);
    };
  }, [measureStep]);

  // Slide forward by 1 review
  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Slide back by 1 review
  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  const handleManualNext = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 350) return;
    lastClickRef.current = now;
    handleNext();
  };

  const handleManualPrev = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 350) return;
    lastClickRef.current = now;
    handlePrev();
  };

  // Seamless jump when reaching either clone boundary
  const handleTransitionEnd = () => {
    if (currentIndex >= TESTIMONIALS.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - TESTIMONIALS.length);
    } else if (currentIndex < TESTIMONIALS.length) {
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + TESTIMONIALS.length);
    }
  };

  // Autoplay: slide 1 card every 3.5 seconds
  useEffect(() => {
    if (isPaused || step === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [handleNext, isPaused, step]);

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-white border-t border-b border-[#E5E3DD] w-full relative overflow-hidden select-none">
      {/* Header: Title + Subtitle */}
      <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 px-4 max-w-4xl mx-auto">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold tracking-[0.14em] text-black uppercase leading-tight">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-[17px] text-[#666666] font-normal tracking-normal max-w-xl">
          Real words from real customers - style, comfort, and bespoke confidence.
        </p>
      </div>

      {/* Reviews Carousel Wrapper */}
      <div
        className="relative w-full max-w-[1580px] mx-auto px-4 sm:px-6 lg:px-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handleManualPrev}
          aria-label="Previous review"
          className="absolute left-1 sm:left-2 lg:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronLeft size={22} className="transform -translate-x-0.5" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleManualNext}
          aria-label="Next review"
          className="absolute right-1 sm:right-2 lg:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black hover:bg-neutral-800 text-white flex items-center justify-center transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
        >
          <ChevronRight size={22} className="transform translate-x-0.5" />
        </button>

        {/* Viewport Window */}
        <div ref={containerRef} className="overflow-hidden w-full py-2">
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${currentIndex * step}px)`,
              transition: isTransitioning
                ? "transform 550ms cubic-bezier(0.25, 1, 0.5, 1)"
                : "none",
            }}
            className="flex items-stretch gap-4 sm:gap-4 lg:gap-5"
          >
            {ALL_ITEMS.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-full sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-60px)/4)] shrink-0 bg-[#F5F4F0] border border-[#E5E3DD] rounded-[16px] p-6 sm:p-7 pt-8 pb-8 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-shadow min-h-[380px]"
              >
                {/* Customer Avatar Circle */}
                <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full p-[2px] border-2 border-black overflow-hidden mx-auto shrink-0 bg-white shadow-xs">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Customer Name */}
                <h3 className="mt-4 font-bold text-black text-base sm:text-[17px] tracking-normal">
                  {item.name}
                </h3>

                {/* Product Subtitle */}
                <span className="italic text-xs sm:text-[13px] text-[#666666] mt-0.5 font-normal tracking-wide">
                  {item.product}
                </span>

                {/* Stars Rating */}
                <div className="flex items-center justify-center gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < item.rating
                          ? "fill-black text-black"
                          : "fill-transparent text-black/30 stroke-[1.5]"
                      }
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="mt-4 text-[#444444] italic text-sm sm:text-[14px] leading-[1.65] max-w-[290px] font-normal">
                  {item.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
