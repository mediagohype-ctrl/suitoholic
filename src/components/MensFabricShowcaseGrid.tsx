"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";

interface MensFabricShowcaseGridProps {
  onSelectCollection?: (collectionId: string) => void;
}

export default function MensFabricShowcaseGrid({
  onSelectCollection,
}: MensFabricShowcaseGridProps) {
  const c = useContent("fabricsPage");
  const grid = c.showcaseGrid;
  const collections = grid?.collections ?? [];

  return (
    <section className="w-full pt-8 sm:pt-12 pb-6 sm:pb-10 space-y-6 sm:space-y-8 select-none">
      
      {/* Top Header Row with Bronze Accent Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5C2AF] pb-4">
        
        {/* Title with Bronze Accent Bar */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 rounded-full bg-[#9E774C]" />
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-serif-luxury font-bold tracking-tight text-[#14110E] leading-snug uppercase">
              {grid?.heading}
            </h2>
            <p className="text-xs sm:text-[13px] text-[#665749] font-sans mt-0.5">
              {grid?.subheading}
            </p>
          </div>
        </div>

        {/* Right Action: Customize Button */}
        <Link
          href={grid?.ctaLink || "/custom-shirt"}
          className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.18em] px-6 py-2.5 rounded-full transition-all duration-300 uppercase shadow-md flex items-center gap-2 group shrink-0 self-start sm:self-auto"
        >
          <span>{grid?.ctaLabel}</span>
          <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* 4-Card Luxury Menswear Fabric Grid (Matching Reference Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {collections.map((card) => {
          
          // Card 4: Detailed List Overlay (Imported Plain)
          if (card.isDetailedList) {
            return (
              <div
                key={card.id}
                onClick={() => onSelectCollection && onSelectCollection(card.id)}
                className="relative aspect-square w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#E8DDD0] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#D5C2AF] group cursor-pointer"
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Ambient Soft Vignette */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

                {/* Centered Large Translucent Info Card Box (Matching Reference) */}
                <div className="absolute inset-4 sm:inset-5 lg:inset-6 bg-[#FAF6F0]/88 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/70 shadow-lg p-4 sm:p-5 flex flex-col justify-center items-center text-center space-y-2.5 sm:space-y-3 transition-transform duration-500 group-hover:scale-[1.02]">
                  
                  {/* Main Header */}
                  <h3 className="font-serif-luxury text-base sm:text-lg lg:text-[19px] font-bold text-[#14110E] tracking-tight uppercase border-b border-[#D5C2AF]/70 pb-1.5 w-full">
                    {card.title}
                  </h3>

                  {/* Sub-list of fabric items */}
                  <div className="space-y-1 sm:space-y-1.5 w-full">
                    {(card.subItems ?? []).map((item, idx) => (
                      <p
                        key={idx}
                        className="text-[11px] sm:text-[12px] font-medium text-[#382F26] leading-tight tracking-wide font-sans hover:text-[#9E774C] transition-colors"
                      >
                        {item.label}
                      </p>
                    ))}
                  </div>

                </div>
              </div>
            );
          }

          // Cards 1, 2, 3: Standard Bottom Banner Overlay (Unstitched Suit, Embroidered, Printed)
          return (
            <div
              key={card.id}
              onClick={() => onSelectCollection && onSelectCollection(card.id)}
              className="relative aspect-square w-full rounded-2xl sm:rounded-[22px] overflow-hidden bg-[#E8DDD0] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#D5C2AF] group cursor-pointer"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                loading="lazy"
              />

              {/* Ambient Soft Vignette */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />

              {/* Bottom Translucent Floating Title Pill (Matching Reference) */}
              <div className="absolute inset-x-4 sm:inset-x-5 bottom-4 sm:bottom-5 z-10">
                <div className="w-full bg-[#FAF6F0]/90 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/70 shadow-md py-2.5 sm:py-3 px-4 text-center transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:scale-[1.02]">
                  <span className="font-serif-luxury text-xs sm:text-sm lg:text-[14px] font-bold text-[#14110E] tracking-wider uppercase">
                    {card.title}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
