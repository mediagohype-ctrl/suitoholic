"use client";

import React from"react";
import Link from"next/link";

interface CommitmentBannerSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  features?: string[];
  image?: string;
}

export default function CommitmentBannerSection({
  eyebrow ="OUR COMMITMENT",
  title ="A Standard We Hold Ourselves To",
  description ="Every client who walks through our door receives the same level of attention — whether commissioning a single shirt or a full wardrobe. Precision, honesty, and craft are not reserved for special occasions. They are the baseline.",
  ctaLabel ="BEGIN YOUR CONSULTATION",
  ctaHref ="/custom-shirt#appointment-booking",
  features = ["Expert guidance on fabric selection","Precise measurements and pattern creation","Hand-finished details & custom touches",
  ],
  image ="/about_commitment_light_banner.jpg",
}: CommitmentBannerSectionProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0B09]">
      {/* Background Image: Master Bespoke Tailor Fitting - Full Clarity & Edge-to-Edge */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image}
        alt="Suitoholic Master Bespoke Tailoring Consultation"
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />

      {/* Gentle Cinematic Gradient - Keeps the banner image 100% visible while ensuring perfect text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/40 pointer-events-none" />

      {/* Central Editorial Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28 text-center flex flex-col items-center">
        {/* Main Headline: A Standard We Hold Ourselves To. */}
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-white tracking-[0.14em] uppercase leading-tight mb-5 sm:mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]">
          {title}
        </h2>

        {/* Description Paragraph */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-[18px] text-white/90 font-sans font-normal leading-[1.75] mb-8 sm:mb-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
          {description}
        </p>

        {/* Golden CTA Button: BEGIN YOUR CONSULTATION */}
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center px-9 sm:px-11 py-4 bg-[#D4A537] hover:bg-[#C29329] active:scale-[0.99] text-black font-bold text-xs sm:text-[13px] tracking-[0.2em] uppercase transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer rounded-[2px]"
        >
          <span>{ctaLabel}</span>
        </Link>

      </div>
    </section>
  );
}
