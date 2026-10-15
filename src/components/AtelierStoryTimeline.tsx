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
    <section className="relative w-full bg-[#13110E] text-[#FAF5EE] py-16 sm:py-20 lg:py-24 border-b border-[#2A231C] overflow-hidden">
      {/* Subtle ambient luxury backdrop glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 w-96 h-96 bg-[#C59B6A]/5 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 w-96 h-96 bg-[#C59B6A]/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          
          {/* LEFT COLUMN: Eyebrow, Title, Story & Master Tailor Media Card */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-[#C59B6A] inline-block" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-[#C59B6A]">
                {eyebrow}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#FAF5EE] tracking-tight leading-[1.16]">
              {titlePrefix}
              <span className="italic font-serif font-normal text-[#C59B6A] block sm:inline">
                {titleAccent}
              </span>
            </h2>

            {/* Narrative Story Description */}
            <p className="text-sm sm:text-[15px] text-[#A69788] font-sans font-normal leading-[1.8] max-w-xl">
              {description}
            </p>

            {/* Master Tailor Portrait Media Card */}
            <div className="relative rounded-2xl overflow-hidden border border-[#332A22] bg-[#1A1612] shadow-2xl group max-w-md">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#181410]">
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

          {/* RIGHT COLUMN: Vertical Golden Timeline & Milestone Cards */}
          <div className="lg:col-span-7 pt-2 lg:pt-6">
            <div className="relative pl-7 sm:pl-10 space-y-6 sm:space-y-8">
              
              {/* Continuous Golden Timeline Line */}
              <div
                className="pointer-events-none absolute left-3 sm:left-4 top-5 bottom-8 w-[1.5px] bg-gradient-to-b from-[#C59B6A]/80 via-[#C59B6A]/60 to-[#C59B6A]/30"
                aria-hidden="true"
              />

              {/* Milestone Cards */}
              {milestones.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline Circular Node (matches screenshot target ring) */}
                  <div
                    className="absolute -left-7 sm:-left-10 top-7 w-6 h-6 rounded-full border border-[#C59B6A] bg-[#13110E] flex items-center justify-center shadow-[0_0_10px_rgba(197,155,106,0.35)] group-hover:border-[#E8C296] transition-colors"
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#C59B6A] group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Milestone Content Box */}
                  <div className="bg-[#191512]/90 backdrop-blur-sm border border-[#30261E] hover:border-[#C59B6A]/60 rounded-xl sm:rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:-translate-y-0.5">
                    {/* Period Eyebrow */}
                    <span className="inline-block text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#C59B6A] mb-2">
                      {item.period}
                    </span>

                    {/* Milestone Title */}
                    <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-[#FAF5EE] group-hover:text-[#E8C296] transition-colors mb-3 leading-snug">
                      {item.title}
                    </h3>

                    {/* Milestone Story */}
                    <p className="text-xs sm:text-[13.5px] text-[#A69788] leading-[1.75] font-sans font-normal">
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
