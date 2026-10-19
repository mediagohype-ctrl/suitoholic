"use client";

import React from "react";

export interface PrincipleItem {
  number: string;
  title: string;
  description: string;
}

export interface PrinciplesSectionProps {
  eyebrow?: string;
  titleLine?: string;
  titleAccent?: string;
  principles?: PrincipleItem[];
  image?: string;
  imageAlt?: string;
}

const DEFAULT_PRINCIPLES: PrincipleItem[] = [
  {
    number: "01",
    title: "Measured Personally",
    description:
      "Up to 30 individual anatomical measurements help us understand posture, movement, and the details that make a garment feel natural.",
  },
  {
    number: "02",
    title: "Crafted By Experience",
    description:
      "Our tailoring team brings 18–32 years of experience across cutting, fitting, finishing, and garment repair.",
  },
  {
    number: "03",
    title: "Natural Materials",
    description:
      "We focus on 100% natural fabrics, with organic and fair-trade materials wherever possible.",
  },
];

export default function PrinciplesSection({
  eyebrow = "WHAT WE VALUE",
  titleLine = "Principles That Guide ",
  titleAccent = "Every Garment.",
  principles = DEFAULT_PRINCIPLES,
  image = "/about_principles_model.jpg",
  imageAlt = "Suitoholic Bespoke Tailored Suit Silhouette",
}: PrinciplesSectionProps) {
  return (
    <section className="relative w-full bg-white text-black py-16 sm:py-24 border-b border-[#E5E3DD] select-none overflow-hidden">
      {/* Subtle minimalist background glow */}
      <div className="pointer-events-none absolute -top-32 right-10 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-10 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: Values Narrative & Numbered Principles */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10 order-2 lg:order-1">
            
            {/* Header Block */}
            <div className="space-y-3">
              {/* Eyebrow Line */}
              <div className="inline-flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-black" />
                <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.26em] text-black uppercase">
                  {eyebrow}
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[46px] font-bold text-black tracking-tight leading-[1.15]">
                {titleLine}
                <span className="italic font-serif font-normal text-black">
                  {titleAccent}
                </span>
              </h2>
            </div>

            {/* Principles Numbered Rows */}
            <div className="space-y-6 sm:space-y-8">
              {principles.map((p, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr] gap-4 sm:gap-6 items-start pt-6 sm:pt-7 first:pt-0 border-t first:border-t-0 border-[#E5E3DD] group"
                >
                  {/* Number (01, 02, 03) */}
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-black group-hover:scale-105 transition-transform inline-block select-none leading-none pt-0.5">
                    {p.number}
                  </span>

                  {/* Principle Content */}
                  <div className="space-y-1.5">
                    <h3 className="font-serif-luxury text-lg sm:text-xl lg:text-[22px] font-bold text-black group-hover:opacity-70 transition-opacity leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs sm:text-[14px] text-[#666666] font-sans leading-relaxed max-w-xl">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: Editorial Bespoke Suit Portrait */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div
              style={{ borderRadius: "11px" }}
              className="relative w-full max-w-[460px] aspect-[3/4.2] rounded-[11px] overflow-hidden border border-[#E5E3DD] bg-[#F5F4F0] shadow-sm group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={imageAlt}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
