"use client";

import React from "react";
import Link from "next/link";

interface OurPromiseSectionProps {
  eyebrow?: string;
  headingPrefix?: string;
  headingHighlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function OurPromiseSection({
  eyebrow = "OUR PROMISE",
  headingPrefix = "You Will Always Leave Feeling ",
  headingHighlight = "Understood, Confident, and Cared For.",
  description = "We take time to understand your style and needs, ensuring every step of the process feels personal and considered. Every garment is made with care and attention to detail, so what you wear always feels right for you.",
  ctaLabel = "BOOK A CONSULTATION",
  ctaHref = "/custom-shirt#appointment-booking",
}: OurPromiseSectionProps) {
  return (
    <section className="relative w-full bg-[#ECEAE5] select-none flex items-center justify-center overflow-hidden py-16 sm:py-20 lg:py-24 border-t border-[#E5E3DD]">
      {/* Central Editorial Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        
        {/* Eyebrow: — OUR PROMISE — */}
        <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <span className="w-8 sm:w-12 h-[1px] bg-black/60" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.28em] text-black uppercase">
            {eyebrow}
          </span>
          <span className="w-8 sm:w-12 h-[1px] bg-black/60" />
        </div>

        {/* Main Headline: Two-tone luxury typography matching website color palette */}
        <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal tracking-tight leading-[1.16] mb-5 sm:mb-6 max-w-3xl">
          <span className="text-black">{headingPrefix}</span>
          <span className="text-[#8C6D47] font-serif">{headingHighlight}</span>
        </h2>

        {/* Description Paragraph */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-[17px] text-[#55473A] font-sans font-normal leading-[1.75] mb-8 sm:mb-10">
          {description}
        </p>

        {/* CTA Button in website primary palette */}
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-9 sm:px-11 py-4 bg-black hover:bg-[#222222] active:scale-[0.99] text-white font-bold text-xs sm:text-[13px] tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer rounded-[2px]"
        >
          <span>{ctaLabel}</span>
        </Link>

      </div>
    </section>
  );
}
