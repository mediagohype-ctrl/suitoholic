"use client";

import React from "react";
import Image from "next/image";

export interface TimelineMilestone {
  period: string;
  title: string;
  story: string;
}

export interface AtelierStoryTimelineProps {
  eyebrow?: string;
  titlePrefix?: string;
  titleAccent?: string;
  description?: string;
  image?: string;
  imageCaption?: string;
  milestones?: TimelineMilestone[];
}

export default function AtelierStoryTimeline({
  eyebrow = "OUR STORY",
  titlePrefix = "Two Decades of Craft in ",
  titleAccent = "Delhi NCR.",
  description = "Founded in New Delhi by master bespoke cutters dedicated to heritage tailoring. Reclaiming the art of individual pattern drafting, Suitoholic crafts every garment from a hand-cut paper pattern engineered to your unique posture, drape, and silhouette.",
  image = "/master_tailor_story.jpg",
  imageCaption = "Master Bespoke Cutter • New Delhi Atelier Bench",
  milestones = [
    {
      period: "EST. 2003",
      title: "Founded In New Delhi Atelier",
      story:
        "Suitoholic begins with master bespoke cutters committed to pure bespoke tailoring. Every garment drafted from a hand-cut paper pattern, upholding individual craft standards across two decades of devoted practice.",
    },
    {
      period: "PROVENANCE & CRAFT",
      title: "Direct Textile Mill Alliances, Biella & Giza",
      story:
        "Bypassing industrial middlemen, establishing direct partnerships with heritage looms in Biella, Italy for Super 150s worsted wool and Egypt's Nile Delta for authentic 140s Extra-Long Staple Giza cottons.",
    },
    {
      period: "TODAY & BEYOND",
      title: "Suitoholic Bespoke Atelier, Delhi NCR",
      story:
        "Dressing corporate leaders, dignitaries, and connoisseurs across 42 countries. The same timeless belief: that a garment made well — to your body, for your occasion — is never just clothing.",
    },
  ],
}: AtelierStoryTimelineProps) {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#F7F2EB] via-[#FAF6F0] to-[#FAF8F5] text-[#14110E] py-16 sm:py-20 lg:py-24 border-b border-[#E3D4C4] overflow-hidden">
      {/* Subtle warm luxury backdrop glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-[#C59B6A]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 bg-[#C59B6A]/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Main 2-Column Responsive CSS Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Eyebrow, Title, Narrative & Master Tailor Media Card */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            {/* Eyebrow Badge in website theme */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF4EB] border border-[#C59B6A]/80 text-[#8C5A28] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] shadow-2xs">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#8C5A28] inline-block" />
              <span>{eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#14110E] tracking-tight leading-[1.16]">
              {titlePrefix}
              <span className="italic font-serif font-normal text-[#8C5A28] block sm:inline">
                {titleAccent}
              </span>
            </h2>

            {/* Narrative Story Description */}
            <p className="text-sm sm:text-[15px] text-[#524436] font-sans font-normal leading-[1.8] max-w-xl">
              {description}
            </p>

            {/* Master Tailor Portrait Media Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#D5C2AF] bg-white shadow-md hover:shadow-xl transition-all duration-500 group max-w-md">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE8DF]">
                <Image
                  src={image}
                  alt={imageCaption}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Vertical Golden Timeline & Milestone Cards in CSS Grid */}
          <div className="lg:col-span-7 pt-2 lg:pt-4">
            <div className="relative grid grid-cols-1 gap-6 sm:gap-7">
              
              {/* Continuous Golden Timeline Line (aligned on x = 12px) */}
              <div
                className="pointer-events-none absolute left-3 top-3 bottom-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#8C5A28] via-[#C59B6A] to-[#D5C2AF]"
                aria-hidden="true"
              />

              {/* Milestone Rows in CSS Grid [24px_1fr] */}
              {milestones.map((item, idx) => (
                <div key={idx} className="relative grid grid-cols-[24px_1fr] gap-4 sm:gap-6 items-start group">
                  {/* Column 1: Timeline Circular Target Node */}
                  <div
                    className="w-6 h-6 shrink-0 mt-6 rounded-full border-2 border-[#8C5A28] bg-[#FAF6F0] flex items-center justify-center shadow-xs group-hover:border-[#C59B6A] group-hover:scale-110 transition-all z-10"
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#8C5A28] group-hover:bg-[#C59B6A] transition-colors" />
                  </div>

                  {/* Column 2: Milestone Content Box */}
                  <div className="bg-white/95 backdrop-blur-sm border border-[#D5C2AF] hover:border-[#8C5A28] rounded-xl sm:rounded-2xl p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    {/* Period Eyebrow */}
                    <span className="inline-block text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#8C5A28] mb-2">
                      {item.period}
                    </span>

                    {/* Milestone Title */}
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#14110E] group-hover:text-[#8C5A28] transition-colors mb-2.5 leading-snug">
                      {item.title}
                    </h3>

                    {/* Milestone Story */}
                    <p className="text-xs sm:text-[13.5px] text-[#524436] leading-[1.75] font-sans font-normal">
                      {item.story}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
