"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Scissors, Crown } from "lucide-react";

interface PillarItem {
  id: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  headingWhite: string;
  headingGold: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
  theme: "dark" | "light";
  imagePosition: "left" | "right";
}

const PILLARS: PillarItem[] = [
  {
    id: "fabrics",
    badge: "HERITAGE TEXTILES",
    badgeIcon: <Sparkles size={12} className="text-[#E5A93B]" />,
    headingWhite: "EXCEPTIONAL FABRICS.",
    headingGold: "THOUGHTFULLY CHOSEN.",
    description:
      "The perfect outfit demands the best fabrics. Wondering where to find fabrics that match your refined taste? Discover a range of fabrics that satisfy even the most sophisticated tastes. High thread count fabrics, pure wools and cashmeres are just a few fabrics among our large collection.",
    ctaText: "EXPLORE FABRICS COLLECTION",
    ctaHref: "/fabrics",
    image: "/banners/banner_exceptional_fabrics.jpg",
    imageAlt: "Master tailor selecting luxury suit fabrics on cutting table",
    theme: "dark",
    imagePosition: "left",
  },
  {
    id: "bespoke-experience",
    badge: "MASTER CRAFTSMANSHIP",
    badgeIcon: <Scissors size={12} className="text-[#E5A93B]" />,
    headingWhite: "BESPOKE",
    headingGold: "EXPERIENCE",
    description:
      "Feel the joy of a personalised menswear shopping experience. But what does a truly personalised experience look like? Every garment you wear is designed to match your look, the occasion, your preferences and skin tone, and is handcrafted to give you the perfect fit.",
    ctaText: "START 3D ATELIER CUSTOMIZER",
    ctaHref: "#configurator-section",
    image: "/banners/banner_bespoke_experience.jpg",
    imageAlt: "Master tailor fitting a bespoke suit jacket onto a client",
    theme: "light",
    imagePosition: "right",
  },
  {
    id: "elite-service",
    badge: "CONCIERGE STYLING",
    badgeIcon: <Crown size={12} className="text-[#E5A93B]" />,
    headingWhite: "ELITE",
    headingGold: "SERVICE",
    description:
      "Confused about what to wear? Our experienced stylists will guide you at every step from suggesting looks and fabric recommendations to expert styling for special events.",
    ctaText: "BOOK A MASTER STYLIST",
    ctaHref: "#appointment-booking",
    image: "/banners/banner_elite_service.jpg",
    imageAlt: "Aristocratic gentleman in bespoke navy bandhgala sitting in leather armchair",
    theme: "dark",
    imagePosition: "left",
  },
];

export default function BespokePillarsBanner() {
  return (
    <section
      id="bespoke-pillars"
      aria-label="The Suitoholic Bespoke Experience"
      className="w-full overflow-hidden select-none"
    >
      <div className="w-full flex flex-col">
        {PILLARS.map((pillar) => {
          const isDark = pillar.theme === "dark";
          const isImageLeft = pillar.imagePosition === "left";

          return (
            <div
              key={pillar.id}
              className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] xl:min-h-[620px]"
            >
              {/* IMAGE COLUMN */}
              <div
                className={`relative w-full h-[340px] sm:h-[420px] lg:h-full overflow-hidden group ${
                  isImageLeft ? "order-1" : "order-1 lg:order-2"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                {/* Subtle vignette sheen */}
                <div className="pointer-events-none absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* CONTENT COLUMN */}
              <div
                className={`w-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20 ${
                  isDark
                    ? "bg-[#232A3D] text-white"
                    : "bg-[#FFFFFF] text-[#1E2433]"
                } ${isImageLeft ? "order-2" : "order-2 lg:order-1"}`}
              >
                <div className="max-w-xl mx-auto lg:mx-0 flex flex-col items-start space-y-4 sm:space-y-5">
                  {/* Eyebrow Badge */}
                  {pillar.badge && (
                    <div className="inline-flex items-center gap-2">
                      {pillar.badgeIcon}
                      <span
                        className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] ${
                          isDark ? "text-[#E5A93B]" : "text-[#8C5A28]"
                        }`}
                      >
                        {pillar.badge}
                      </span>
                    </div>
                  )}

                  {/* Two-Line High Impact Heading matching reference */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold uppercase tracking-tight leading-[1.08] flex flex-col">
                    <span className={isDark ? "text-white" : "text-[#1E2433]"}>
                      {pillar.headingWhite}
                    </span>
                    <span className="text-[#E5A93B]">
                      {pillar.headingGold}
                    </span>
                  </h2>

                  {/* Body Paragraph with professional typography */}
                  <p
                    className={`text-xs sm:text-sm md:text-[14.5px] leading-relaxed font-sans font-normal ${
                      isDark ? "text-[#CBD5E1]" : "text-[#475569]"
                    }`}
                  >
                    {pillar.description}
                  </p>

                  {/* Call-to-action button */}
                  <div className="pt-2 sm:pt-3">
                    <Link
                      href={pillar.ctaHref}
                      className={`inline-flex items-center gap-2.5 text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase py-3 px-6 rounded-[7px] transition-all duration-300 shadow-md ${
                        isDark
                          ? "bg-[#E5A93B] hover:bg-[#D4982A] text-[#14110E] hover:shadow-xl"
                          : "bg-[#1E2433] hover:bg-[#121620] text-white hover:shadow-xl"
                      }`}
                    >
                      <span>{pillar.ctaText}</span>
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
