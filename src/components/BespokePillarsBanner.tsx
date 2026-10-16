"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Scissors, Crown } from "lucide-react";

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
  theme: "tint" | "light";
  imagePosition: "left" | "right";
}

const PILLARS: PillarItem[] = [
  {
    id: "fabrics",
    badge: "HERITAGE TEXTILES",
    headingWhite: "EXCEPTIONAL FABRICS.",
    headingGold: "THOUGHTFULLY CHOSEN.",
    description:
      "The perfect shirt demands the best fabrics. Wondering where to find fabrics that match your refined taste? Discover a curated range of pure Egyptian Giza 140s/160s cottons, Belgian linens, Italian poplins, and Royal Dobby weaves sourced directly from world-renowned heritage mills.",
    ctaText: "EXPLORE FABRICS COLLECTION",
    ctaHref: "/fabrics",
    image: "/banners/banner_exceptional_fabrics.jpg",
    imageAlt: "Master shirtmaker selecting luxury Egyptian Giza cotton shirt fabrics on atelier cutting table",
    theme: "tint",
    imagePosition: "left",
  },
  {
    id: "bespoke-experience",
    badge: "MASTER CRAFTSMANSHIP",
    badgeIcon: <Scissors size={12} className="text-[#9E774C]" />,
    headingWhite: "BESPOKE",
    headingGold: "EXPERIENCE",
    description:
      "Feel the joy of an authentic bespoke shirtmaking experience. Every garment is crafted to match your exact physique, collar architecture, cuff preference, and sleeve drape — drafted from an individual paper pattern to give you the flawless tailor-made fit.",
    ctaText: "BOOK BESPOKE APPOINTMENT",
    ctaHref: "#appointment-booking",
    image: "/banners/banner_bespoke_experience.jpg",
    imageAlt: "Master tailor measuring a bespoke dress shirt onto a gentleman in the atelier salon",
    theme: "light",
    imagePosition: "right",
  },
  {
    id: "elite-service",
    badge: "CONCIERGE STYLING",
    badgeIcon: <Crown size={12} className="text-[#9E774C]" />,
    headingWhite: "ELITE",
    headingGold: "SERVICE",
    description:
      "Confused about collar spreads, cuff designs, or seasonal shirtings? Our experienced master shirtmakers and stylists will guide you at every step — from fabric recommendations and collar pairings to personal event styling.",
    ctaText: "BOOK A MASTER STYLIST",
    ctaHref: "#appointment-booking",
    image: "/banners/banner_elite_service.jpg",
    imageAlt: "Gentleman in bespoke tailored Giza cotton dress shirt reviewing fabric swatches in styling salon",
    theme: "tint",
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
          const isImageLeft = pillar.imagePosition === "left";
          const isTint = pillar.theme === "tint";

          return (
            <div
              key={pillar.id}
              className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] xl:min-h-[620px] border-b border-[#DDD2D8]/70 last:border-b-0"
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
                <div className="pointer-events-none absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* CONTENT COLUMN */}
              <div
                className={`w-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20 ${
                  isTint
                    ? "bg-[#EEE5EA] text-[#14110E]"
                    : "bg-[#FFFFFF] text-[#14110E]"
                } ${isImageLeft ? "order-2" : "order-2 lg:order-1"}`}
              >
                <div className="max-w-xl mx-auto lg:mx-0 flex flex-col items-start space-y-4 sm:space-y-5">
                  {/* Eyebrow Badge */}
                  {pillar.badge && (
                    <div className="inline-flex items-center gap-2">
                      {pillar.badgeIcon}
                      <span className="text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.24em] text-[#9E774C]">
                        {pillar.badge}
                      </span>
                    </div>
                  )}

                  {/* Two-Line Luxury Serif Heading with distinct hierarchy */}
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] xl:text-[40px] font-semibold uppercase tracking-[0.025em] leading-[1.12] flex flex-col space-y-1">
                    <span className="text-[#14110E]">
                      {pillar.headingWhite}
                    </span>
                    <span className="text-[#9E774C]">
                      {pillar.headingGold}
                    </span>
                  </h2>

                  {/* Subtitle / Description Body Paragraph with distinct professional size */}
                  <p className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[1.75] font-sans font-normal text-[#5A4E42] max-w-lg">
                    {pillar.description}
                  </p>

                  {/* Call-to-action button */}
                  <div className="pt-2 sm:pt-3">
                    <Link
                      href={pillar.ctaHref}
                      style={{ borderRadius: "7px" }}
                      className="inline-flex items-center gap-2.5 text-[11px] sm:text-xs font-bold tracking-[0.16em] uppercase py-3.5 px-7 bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer group"
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
