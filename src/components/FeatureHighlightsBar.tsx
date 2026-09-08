import React from "react";

export default function FeatureHighlightsBar({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full z-30 bg-[#EFE5D9]/95 backdrop-blur-md border-t border-b border-[#D8C7B7] py-3.5 sm:py-3.5 px-3 sm:px-6 lg:px-12 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] select-none transition-all ${className}`}>
      <div className="w-full max-w-[1360px] mx-auto">
        
        {/* MOBILE VIEW: 2 Columns × 2 Rows with Vertical Divider between columns matching screenshot */}
        <div className="grid grid-cols-2 gap-y-3.5 md:hidden">
          
          {/* 1. CUSTOM FIT */}
          <div className="flex items-center space-x-2.5 pr-2 border-r border-[#D8C7B7]/70">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <ellipse cx="13.5" cy="12.5" rx="7.5" ry="3.8" />
                <path d="M6 12.5V19C6 21.1 9.4 22.8 13.5 22.8C17.6 22.8 21 21.1 21 19V12.5" />
                <ellipse cx="13.5" cy="12.5" rx="3.5" ry="1.7" />
                <path d="M17.5 22.8H26C27.5 22.8 28.5 21.8 28.5 20.3C28.5 18.8 27.5 17.8 26 17.8H21" />
                <line x1="22.5" y1="17.8" x2="22.5" y2="20.3" />
                <line x1="24.8" y1="17.8" x2="24.8" y2="19.8" />
                <line x1="27" y1="17.8" x2="27" y2="20.3" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                CUSTOM FIT
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Made for You
              </p>
            </div>
          </div>

          {/* 2. PREMIUM FABRICS */}
          <div className="flex items-center space-x-2.5 pl-3">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <rect x="5" y="5" width="22" height="22" rx="4" transform="rotate(45 16 16)" />
                <line x1="16" y1="5" x2="16" y2="27" strokeDasharray="2 1.5" />
                <line x1="5" y1="16" x2="27" y2="16" strokeDasharray="2 1.5" />
                <circle cx="16" cy="16" r="3" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                PREMIUM FABRICS
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Finest Quality
              </p>
            </div>
          </div>

          {/* 3. PERFECT DETAILS */}
          <div className="flex items-center space-x-2.5 pr-2 border-r border-[#D8C7B7]/70">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <line x1="4" y1="24.5" x2="28" y2="24.5" />
                <path d="M5.5 24.5L7.5 27.5H24.5L26.5 24.5" />
                <path d="M8.5 24.5V14C8.5 11 10.5 9 13.5 9H23.5C25 9 26 10 26 11.5V24.5" />
                <line x1="16.5" y1="5.5" x2="16.5" y2="9" />
                <rect x="15" y="6" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.25" />
                <line x1="11" y1="13.5" x2="11" y2="21" />
                <path d="M9.5 21H12.5" />
                <circle cx="26" cy="14" r="2.5" />
                <path d="M5 24.5C8 23 11 25.5 14 24.5" strokeDasharray="1.5 1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                PERFECT DETAILS
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Every Stitch
              </p>
            </div>
          </div>

          {/* 4. EASY RETURNS */}
          <div className="flex items-center space-x-2.5 pl-3">
            <div className="w-7 h-7 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M16 6L26 11V21L16 26L6 21V11L16 6Z" />
                <path d="M16 6V16M26 11L16 16M6 11L16 16" />
                <circle cx="16" cy="16" r="8.5" strokeDasharray="3 3" strokeOpacity="0.4" />
                <path d="M22 13L25 10L22 7" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-[11px] font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                EASY RETURNS
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Hassle Free
              </p>
            </div>
          </div>

        </div>

        {/* DESKTOP VIEW: 1 Row 4 Columns with Vertical Dividers */}
        <div className="hidden md:grid grid-cols-4 w-full divide-x divide-[#D8C7B7]">
          
          {/* 1. CUSTOM FIT */}
          <div className="flex items-center space-x-3.5 px-3 lg:px-6 justify-center lg:justify-start">
            <div className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <ellipse cx="13.5" cy="12.5" rx="7.5" ry="3.8" />
                <path d="M6 12.5V19C6 21.1 9.4 22.8 13.5 22.8C17.6 22.8 21 21.1 21 19V12.5" />
                <ellipse cx="13.5" cy="12.5" rx="3.5" ry="1.7" />
                <path d="M17.5 22.8H26C27.5 22.8 28.5 21.8 28.5 20.3C28.5 18.8 27.5 17.8 26 17.8H21" />
                <line x1="22.5" y1="17.8" x2="22.5" y2="20.3" />
                <line x1="24.8" y1="17.8" x2="24.8" y2="19.8" />
                <line x1="27" y1="17.8" x2="27" y2="20.3" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] lg:text-[12px] font-bold tracking-[0.12em] text-[#14110E] uppercase leading-tight font-sans">
                CUSTOM FIT
              </h4>
              <p className="text-[10px] lg:text-[11px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans whitespace-nowrap">
                Made for You
              </p>
            </div>
          </div>

          {/* 2. PREMIUM FABRICS */}
          <div className="flex items-center space-x-3.5 px-3 lg:px-6 justify-center lg:justify-start">
            <div className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <rect x="5" y="5" width="22" height="22" rx="4" transform="rotate(45 16 16)" />
                <line x1="16" y1="5" x2="16" y2="27" strokeDasharray="2 1.5" />
                <line x1="5" y1="16" x2="27" y2="16" strokeDasharray="2 1.5" />
                <circle cx="16" cy="16" r="3" fill="currentColor" fillOpacity="0.2" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] lg:text-[12px] font-bold tracking-[0.12em] text-[#14110E] uppercase leading-tight font-sans">
                PREMIUM FABRICS
              </h4>
              <p className="text-[10px] lg:text-[11px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans whitespace-nowrap">
                Finest Quality
              </p>
            </div>
          </div>

          {/* 3. PERFECT DETAILS */}
          <div className="flex items-center space-x-3.5 px-3 lg:px-6 justify-center lg:justify-start">
            <div className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <line x1="4" y1="24.5" x2="28" y2="24.5" />
                <path d="M5.5 24.5L7.5 27.5H24.5L26.5 24.5" />
                <path d="M8.5 24.5V14C8.5 11 10.5 9 13.5 9H23.5C25 9 26 10 26 11.5V24.5" />
                <line x1="16.5" y1="5.5" x2="16.5" y2="9" />
                <rect x="15" y="6" width="3" height="3" rx="0.5" fill="currentColor" fillOpacity="0.25" />
                <line x1="11" y1="13.5" x2="11" y2="21" />
                <path d="M9.5 21H12.5" />
                <circle cx="26" cy="14" r="2.5" />
                <path d="M5 24.5C8 23 11 25.5 14 24.5" strokeDasharray="1.5 1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] lg:text-[12px] font-bold tracking-[0.12em] text-[#14110E] uppercase leading-tight font-sans">
                PERFECT DETAILS
              </h4>
              <p className="text-[10px] lg:text-[11px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans whitespace-nowrap">
                Every Stitch
              </p>
            </div>
          </div>

          {/* 4. EASY RETURNS */}
          <div className="flex items-center space-x-3.5 px-3 lg:px-6 justify-center lg:justify-start">
            <div className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M16 6L26 11V21L16 26L6 21V11L16 6Z" />
                <path d="M16 6V16M26 11L16 16M6 11L16 16" />
                <circle cx="16" cy="16" r="8.5" strokeDasharray="3 3" strokeOpacity="0.4" />
                <path d="M22 13L25 10L22 7" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] lg:text-[12px] font-bold tracking-[0.12em] text-[#14110E] uppercase leading-tight font-sans">
                EASY RETURNS
              </h4>
              <p className="text-[10px] lg:text-[11px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans whitespace-nowrap">
                Hassle Free
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
