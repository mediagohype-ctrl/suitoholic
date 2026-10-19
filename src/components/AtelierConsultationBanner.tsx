"use client";

import React from "react";
import Link from "next/link";

interface AtelierConsultationBannerProps {
  eyebrow?: string;
  headingPrefix?: string;
  headingHighlight?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function AtelierConsultationBanner({
  eyebrow = "BEGIN YOUR JOURNEY",
  headingPrefix = "Ready to Look and Feel ",
  headingHighlight = "Your Very Best?",
  body = "Book a private consultation with our master tailors today. Whether you are visiting us locally or from abroad, we will guide you through our finest fabrics and design a flawless look crafted just for you.",
  ctaLabel = "BOOK CONSULTATION",
  ctaHref = "/custom-shirt#appointment-booking",
}: AtelierConsultationBannerProps) {
  return (
    <section className="relative w-full bg-white text-[#14110E] py-20 sm:py-28 lg:py-32 border-y border-[#DDD2D8] overflow-hidden select-none">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Eyebrow with Flanking Accent Rules */}
        <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
          <span className="w-8 sm:w-14 h-[1px] bg-[#4A202A]/35" />
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.26em] text-[#4A202A] uppercase font-sans">
            {eyebrow}
          </span>
          <span className="w-8 sm:w-14 h-[1px] bg-[#4A202A]/35" />
        </div>

        {/* Main Headline matching font-serif-luxury and Royal Burgundy accent */}
        <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[58px] font-semibold leading-[1.12] tracking-tight text-[#14110E] mb-5 sm:mb-6">
          {headingPrefix}
          <span className="text-[#4A202A] italic font-normal font-serif-luxury">
            {headingHighlight}
          </span>
        </h2>

        {/* Narrative Paragraph */}
        <p className="text-sm sm:text-base md:text-[17px] text-[#5A4E42] font-sans leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 font-normal">
          {body}
        </p>

        {/* Signature Suitoholic Royal Burgundy CTA Button */}
        <Link
          href={ctaHref}
          style={{ borderRadius: "7px" }}
          className="inline-flex items-center justify-center px-8 sm:px-11 py-3.5 sm:py-4 bg-[#4A202A] hover:bg-[#34141D] active:scale-[0.98] text-[#FAF8F5] text-xs sm:text-[13px] font-extrabold tracking-[0.2em] uppercase transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer group hover:scale-[1.02]"
        >
          <span>{ctaLabel}</span>
        </Link>
      </div>
    </section>
  );
}
