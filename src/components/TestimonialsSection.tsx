"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, User } from "lucide-react";

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  tagline?: string;
  flag: string;
  location: string;
  rating: number;
  avatar: string;
  review: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1,
    name: "Vikramaditya Singhania",
    role: "Managing Partner, Singhania Capital",
    tagline: "Bespoke Royal Dobby Cotton",
    flag: "🇮🇳",
    location: "New Delhi, India",
    rating: 5,
    avatar: "/reviews/avatar5.jpg",
    review:
      "The fit around the shoulders and collar roll is unbelievable. Egyptian Giza 140s drape feels superior in every boardroom meeting. Best bespoke tailoring experience in India.",
  },
  {
    id: 2,
    name: "Devendra Kapoor",
    role: "Founder & CEO, Horizon Ventures",
    tagline: "Italian Banker Stripe Shirt",
    flag: "🇦🇪",
    location: "Dubai, UAE",
    rating: 5,
    avatar: "/reviews/avatar6.jpg",
    review:
      "Ordered with French double cuffs and mother-of-pearl buttons. The split yoke and chest drape are true hallmarks of master craftsmanship. Immaculate white-glove delivery.",
  },
  {
    id: 3,
    name: "Arjun Mehta",
    role: "Senior Advocate, High Court",
    tagline: "Sea Island White Formal",
    flag: "🇮🇳",
    location: "Mumbai, India",
    rating: 5,
    avatar: "/reviews/avatar7.jpg",
    review:
      "Finally a brand that understands sleeve pitch and waist tapering without multiple trial visits. The custom collar spread frames my tie knot like a painting.",
  },
  {
    id: 4,
    name: "Callum MacLeod",
    role: "Director of Investment Strategy",
    tagline: "Austrian Herringbone Sky Shirt",
    flag: "🇬🇧",
    location: "London, UK",
    rating: 5,
    avatar: "/reviews/avatar8.jpg",
    review:
      "Exceptional craftsmanship. The fabric texture in hand is vastly superior to Savile Row off-the-rack luxury houses. Calibrated my exact measurements flawlessly.",
  },
  {
    id: 5,
    name: "Aditi Verma",
    role: "Creative Director & Stylist",
    tagline: "Pure Satin Silk Bespoke Shirt",
    flag: "🇮🇳",
    location: "Bengaluru, India",
    rating: 5,
    avatar: "/reviews/avatar1.jpg",
    review:
      "Honestly surprised by the fabric quality. It's lightweight, breathable, and gives that rich satin luster without looking loud. Perfect for executive meetings and evening dinners.",
  },
  {
    id: 6,
    name: "Avni Singh",
    role: "Luxury Lifestyle Consultant",
    tagline: "Artisanal Co-ords Silk Set",
    flag: "🇦🇪",
    location: "Abu Dhabi, UAE",
    rating: 5,
    avatar: "/reviews/avatar2.jpg",
    review:
      "So flattering and comfortable! Wore it for an exclusive preview gala in Abu Dhabi and received endless compliments. The fit is on point and the drape is world-class.",
  },
  {
    id: 7,
    name: "Priyanka Yadav",
    role: "Head of Private Wealth",
    tagline: "Pure Mulberry Silk Floral",
    flag: "🇸🇬",
    location: "Singapore",
    rating: 5,
    avatar: "/reviews/avatar3.jpg",
    review:
      "The hand-feel of this bespoke fabric is divine. The print clarity, shoulder structure, and natural fall make it effortless to wear for long days across Asia.",
  },
  {
    id: 8,
    name: "Dia Ajmera",
    role: "Architect & Design Principal",
    tagline: "Tailored Textured Jacquard Shirt",
    flag: "🇮🇳",
    location: "Hyderabad, India",
    rating: 5,
    avatar: "/reviews/avatar4.jpg",
    review:
      "A total masterpiece. The geometric jacquard weave looks regal and the tailored fit sits perfectly on the shoulders. Unmatched attention to detail.",
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
    }, 3800);

    return () => clearInterval(timer);
  }, [handleNext, isPaused, step]);

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#F8F7F4] border-t border-b border-[#E5E3DD] w-full relative overflow-hidden select-none font-sans">
      {/* Header: Title + Subtitle */}
      <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-14 px-4 max-w-4xl mx-auto">
        <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          WHAT OUR CUSTOMERS SAY
        </h2>
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-[16px] text-[#666666] font-normal tracking-normal max-w-xl">
          Real words from gentlemen &amp; patrons across the globe on bespoke fit and fabric luxury.
        </p>
      </div>

      {/* Reviews Carousel Wrapper */}
      <div
        className="relative w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12"
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
                className="w-full sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-60px)/4)] shrink-0 bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[300px] sm:min-h-[320px] text-left group"
              >
                {/* TOP ROW: 5 RED STARS */}
                <div className="flex items-center justify-start w-full mb-4 sm:mb-5">
                  {/* 5 Filled Red Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={
                          i < item.rating
                            ? "fill-[#E53935] text-[#E53935]"
                            : "fill-transparent text-[#E53935]/30 stroke-[1.5]"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* MIDDLE ROW: REVIEW QUOTE IN CLEAN SANS */}
                <p className="text-[13.5px] sm:text-[14px] text-[#1E293B] leading-[1.65] font-normal font-sans mb-6 line-clamp-4">
                  &ldquo;{item.review}&rdquo;
                </p>

                {/* BOTTOM ROW: AVATAR ON LEFT + AUTHOR DETAILS ON RIGHT */}
                <div className="flex items-center gap-3.5 mt-auto pt-4 border-t border-[#F1EFEA]">
                  {/* People / User Logo */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[#E5E3DD] shadow-2xs bg-[#F5F4F0] flex items-center justify-center text-[#222222]">
                    <User size={19} className="text-[#333333] stroke-[1.8]" />
                  </div>

                  {/* Author Details (Name, Role/Product, Location/Tagline) */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[13px] sm:text-[14px] font-bold text-[#0F172A] leading-tight truncate font-sans">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B] leading-tight truncate mt-0.5 font-sans">
                      {item.role}
                    </p>
                    {item.tagline && (
                      <p className="text-[10px] text-[#94A3B8] leading-tight truncate mt-0.5 font-sans">
                        {item.tagline}
                      </p>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
