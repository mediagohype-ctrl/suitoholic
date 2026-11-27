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
  eyebrow = "OUR COMMITMENT",
  title = "A Better Fit Starts Here",
  description = "At Suitoholic, we combine craftsmanship, thoughtful details, and a customer-first approach to make finding your fit easier. We believe clothing should feel as good as it looks, and that the right fit makes all the difference.",
  ctaLabel = "EXPLORE COLLECTION",
  ctaHref = "/shop",
  features = [
    "Over two decades of tailoring experience (Estd. 2003)",
    "Convenient online bespoke fitting journey",
    "Personalized customer-first support",
  ],
  image = "/about_commitment_light_banner.jpg",
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
