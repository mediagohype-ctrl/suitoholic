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
    <section className="relative w-full bg-[#ECEAE5] py-10 sm:py-14 select-none">
      <div className="max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[36px] py-16 sm:py-24 px-6 sm:px-12 text-center flex flex-col items-center shadow-sm">
          {/* Eyebrow with Flanking Accent Rules */}
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
            <span className="w-8 sm:w-14 h-[1px] bg-[#E5E3DD]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.26em] text-black uppercase font-sans">
              {eyebrow}
            </span>
            <span className="w-8 sm:w-14 h-[1px] bg-[#E5E3DD]" />
          </div>

          {/* Main Headline */}
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.12] tracking-tight text-black mb-5 sm:mb-6">
            {headingPrefix}
            <span className="text-black italic font-normal font-serif-luxury">
              {headingHighlight}
            </span>
          </h2>

          {/* Narrative Paragraph */}
          <p className="text-sm sm:text-base md:text-[17px] text-[#666666] font-sans leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 font-normal">
            {body}
          </p>

          {/* Black Pill CTA Button */}
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center px-9 sm:px-11 py-4 bg-black hover:bg-neutral-800 active:scale-[0.98] text-white text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-sm hover:shadow cursor-pointer group"
          >
            <span>{ctaLabel}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
