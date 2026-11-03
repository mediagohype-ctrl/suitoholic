"use client";

import React from "react";
import { ChevronRight, ArrowDown } from "lucide-react";
import { useCustomizer } from "@/context/CustomizerModalProvider";
import { USER_CATALOG_SHIRTS } from "@/data/products";

export default function CustomOutfitHero() {
  const { openCustomizer } = useCustomizer();

  const handleStartCustomizing = () => {
    // Open the 6-step customizer modal with the signature bespoke shirting piece
    const sampleShirt = USER_CATALOG_SHIRTS[0] || {
      id: 51,
      slug: "dark-chocolate-brown-satin-twill-shirt",
      name: "Dark Chocolate Brown Satin Twill Shirt",
      category: "formal_shirts",
      price: "₹ 2,600",
      rawPrice: 2600,
      image: "/new_shirts/shirt_19.jpg",
      gallery: ["/new_shirts/shirt_19.jpg"],
    };
    openCustomizer(sampleShirt);
  };

  const handleBookFitting = () => {
    const target =
      document.getElementById("appointment-booking") ||
      document.getElementById("curated-starting-points");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden select-none bg-[#ECEAE5] border-b border-[#E5E3DD] pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16">
      <div className="w-full max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: BESPOKE ATELIER EDITORIAL TEXT & ACTIONS                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left">
            {/* Main Editorial Headline */}
            <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-[40px] lg:text-[44px] xl:text-[48px] font-bold text-black tracking-tight leading-[1.15] mb-5">
              <span>Crafted to Your Measure, </span>
              <span className="italic font-serif text-black">Tailored to Your Posture</span>
            </h1>

            {/* Authentic Atelier Philosophy (Concise, authentic, no AI text) */}
            <p className="text-sm sm:text-[15px] lg:text-base text-[#444444] font-sans font-normal leading-relaxed mb-6 sm:mb-8 max-w-lg">
              Individually hand-drafted patterns, master collar architecture, and pure natural Egyptian cottons tailored to your unique posture and proportions.
            </p>

            {/* Craftsmanship Pillars with Subtle Dividers */}
            <div className="border-t border-[#DEDBD5] divide-y divide-[#DEDBD5] mb-8 max-w-lg">
              <div className="py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-[13px] text-black font-semibold tracking-wide">
                <span>Individual Paper Pattern Drafted to Stance</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
              </div>
              <div className="py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-[13px] text-black font-semibold tracking-wide">
                <span>Hand-Turned Collars & French Seams</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
              </div>
              <div className="py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-[13px] text-black font-semibold tracking-wide">
                <span>100% Fit Guarantee with Free Atelier Alterations</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
              </div>
            </div>

            {/* Action Buttons: START CUSTOMIZING & BOOK ATELIER FITTING */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              {/* Primary Black Button: Opens the 6-Step Customizer */}
              <button
                type="button"
                onClick={handleStartCustomizing}
                className="inline-flex items-center gap-2.5 px-8 sm:px-9 py-4 bg-black hover:bg-neutral-800 active:scale-[0.98] text-white font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-sm hover:shadow cursor-pointer group"
              >
                <span>START CUSTOMIZING</span>
                <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
              </button>

              {/* Secondary Luxury Outline Button: Smooth scroll to Appointment Booking */}
              <button
                type="button"
                onClick={handleBookFitting}
                className="inline-flex items-center gap-2.5 px-8 sm:px-9 py-4 bg-white hover:bg-[#F5F4F0] border border-[#DEDBD5] active:scale-[0.98] text-black font-bold text-xs sm:text-[13px] tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-2xs hover:shadow cursor-pointer group"
              >
                <span>BOOK ATELIER FITTING</span>
                <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: DAYLIGHT LUXURY SHIRTING EDITORIAL PHOTOGRAPHY              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-7 flex justify-center">
            <div className="relative w-full rounded-[12px] overflow-hidden border border-[#DEDBD5] shadow-sm bg-white aspect-[16/10] group">
              {/* High-Resolution Clean Editorial Photography (Zero AI text, Warm Daylight Studio) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/banners/bespoke_shirting_hero_light.jpg"
                alt="Suitoholic Bespoke Handcrafted Shirting"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                loading="eager"
              />

              {/* Subtle ambient lighting vignette overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
