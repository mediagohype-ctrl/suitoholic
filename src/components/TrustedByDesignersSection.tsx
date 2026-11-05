"use client";

import React from"react";

interface DesignerClient {
  id: string;
  name: string;
  renderLogo: () => React.ReactNode;
}

const DESIGNERS: DesignerClient[] = [
  // 1. KALKI FASHION
  {
    id:"kalki",
    name:"KALKI FASHION",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center whitespace-nowrap">
        <span className="font-serif text-[16px] sm:text-[18px] font-bold tracking-[0.24em] text-[#14110E] uppercase leading-none">
          KALKI
        </span>
        <span className="text-[7.5px] tracking-[0.26em] text-[#7A6B5D] uppercase font-sans mt-1 font-medium">
          FASHION
        </span>
      </div>
    ),
  },

  // 2. RAHUL MISHRA
  {
    id:"rahul-mishra",
    name:"RAHUL MISHRA",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center whitespace-nowrap">
        <span className="font-serif text-[14px] sm:text-[15.5px] font-medium tracking-[0.18em] text-[#14110E] uppercase whitespace-nowrap">
          RAHUL MISHRA
        </span>
      </div>
    ),
  },

  // 3. EJAAZ COUTURE
  {
    id:"ejaaz",
    name:"EJAAZ COUTURE",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center whitespace-nowrap">
        <span className="font-serif text-[18px] sm:text-[20px] font-normal tracking-[0.16em] text-[#C49A45] uppercase leading-none">
          EJAAZ
        </span>
        <span className="text-[7px] tracking-[0.28em] text-[#C49A45] uppercase font-sans mt-0.5 font-medium">
          COUTURE
        </span>
      </div>
    ),
  },

  // 4. MANISH MALHOTRA
  {
    id:"manish-malhotra",
    name:"MANISH MALHOTRA",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center whitespace-nowrap">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="h-[1px] w-2.5 bg-[#C49A45]/60" />
          <span className="font-serif text-[12px] sm:text-[13px] font-semibold tracking-[0.16em] text-[#C49A45] uppercase whitespace-nowrap">
            MANISH MALHOTRA
          </span>
          <span className="h-[1px] w-2.5 bg-[#C49A45]/60" />
        </div>
      </div>
    ),
  },

  // 5. indya
  {
    id:"indya",
    name:"indya",
    renderLogo: () => (
      <div className="flex items-center justify-center whitespace-nowrap">
        <span className="font-sans text-[20px] sm:text-[22px] font-black tracking-[-0.04em] text-[#14110E] lowercase whitespace-nowrap">
          indya
        </span>
      </div>
    ),
  },

  // 6. gaurav gupta
  {
    id:"gaurav-gupta",
    name:"gaurav gupta",
    renderLogo: () => (
      <div className="flex items-center justify-center whitespace-nowrap">
        <span className="font-sans text-[15px] sm:text-[16.5px] font-normal tracking-[-0.02em] text-[#14110E] lowercase whitespace-nowrap">
          gaurav gupta
        </span>
      </div>
    ),
  },

  // 7. BOMBAY SELECTIONS
  {
    id:"bombay-selections",
    name:"BOMBAY SELECTIONS",
    renderLogo: () => (
      <div className="flex flex-col items-center justify-center text-center whitespace-nowrap">
        <svg className="w-5 h-3 text-[#14110E] mb-0.5" viewBox="0 0 24 12" fill="currentColor">
          <path d="M12 0L14 4H18L15 7L16 11L12 9L8 11L9 7L6 4H10L12 0Z" />
        </svg>
        <span className="font-serif text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-[#14110E] uppercase leading-tight whitespace-nowrap">
          BOMBAY
        </span>
        <span className="text-[6.5px] tracking-[0.2em] text-[#666666] uppercase font-sans">
          SELECTIONS
        </span>
      </div>
    ),
  },

  // 8. masaba
  {
    id:"masaba",
    name:"masaba",
    renderLogo: () => (
      <div className="flex items-center justify-center whitespace-nowrap">
        <span className="font-serif italic text-[18px] sm:text-[20px] font-normal tracking-[-0.02em] text-[#B83B5E] lowercase whitespace-nowrap">
          maṣaba
        </span>
      </div>
    ),
  },
];

// Quadrupled items for completely seamless, gap-free infinite scrolling across all screen widths
const MARQUEE_ITEMS = [...DESIGNERS, ...DESIGNERS, ...DESIGNERS, ...DESIGNERS];

export default function TrustedByDesignersSection() {
  return (
    <section 
      aria-label="Trusted by Top Designers"
      className="relative w-full bg-[#ECEAE5] py-14 sm:py-20 border-b border-[#E5E3DD] overflow-hidden"
    >
      <div className="w-full">
        
        {/* Section Header: Main Title + Subtitle */}
        <div className="text-center mb-8 sm:mb-12 px-4 max-w-4xl mx-auto">
          {/* Main Title */}
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold text-black tracking-[0.14em] uppercase leading-tight mb-3">
            TRUSTED BY TOP DESIGNERS
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-[15px] text-[#666666] font-sans font-normal max-w-2xl mx-auto tracking-normal">
            Top India&apos;s Boutique Owners, Designers and Exporters source fabric from us.
          </p>
        </div>

        {/* Continuous Slow-Motion Infinite Marquee */}
        <div className="relative w-full overflow-hidden py-3">
          
          {/* Continuous Autoplay Track (Smooth Slow Luxury Glide) */}
          <div 
            className="flex items-center gap-4 sm:gap-6 animate-marquee-slow hover:[animation-play-state:paused]"
            style={{
              animationDuration:"55s",
            }}
          >
            {MARQUEE_ITEMS.map((designer, idx) => (
              <div
                key={`${designer.id}-${idx}`}
                title={designer.name}
                className="bg-white border border-[#E5E3DD] rounded-xl sm:rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 h-[64px] sm:h-[72px] px-6 sm:px-8 flex items-center justify-center shrink-0 min-w-[160px] sm:min-w-[180px] cursor-pointer hover:-translate-y-0.5 group"
              >
                <div className="transition-transform duration-200 group-hover:scale-105 whitespace-nowrap">
                  {designer.renderLogo()}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
