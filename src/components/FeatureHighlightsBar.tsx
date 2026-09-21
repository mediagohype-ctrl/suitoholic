import React from "react";

export default function FeatureHighlightsBar({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full z-30 shrink-0 bg-[#EFE5D9] border-t border-b border-[#D8C7B7]/80 py-3.5 sm:py-4 px-4 sm:px-6 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] select-none transition-all ${className}`}>
      <div className="w-full max-w-7xl mx-auto">
        
        {/* MOBILE VIEW: 2 Columns × 2 Rows with Center Vertical Divider matching screenshot */}
        <div className="grid grid-cols-2 gap-y-4 sm:gap-y-5 md:hidden">
          
          {/* 1. CUSTOM FIT */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 pr-2.5 sm:pr-4 relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M7 11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11Z" />
                <path d="M12 11C12 9.89543 12.8954 9 14 9" />
                <path d="M12 16V22C12 24.2091 13.7909 26 16 26H25C26.6569 26 28 24.6569 28 23C28 21.3431 26.6569 20 25 20H17" />
                <line x1="16" y1="20" x2="16" y2="23" />
                <line x1="19" y1="20" x2="19" y2="22" />
                <line x1="22" y1="20" x2="22" y2="23" />
                <line x1="25" y1="20" x2="25" y2="22" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10.5px] sm:text-xs font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                CUSTOM FIT
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Made for You
              </p>
            </div>
            {/* Center Vertical Divider Line */}
            <div className="absolute right-0 top-1 bottom-1 w-[1px] bg-[#D8C7B7]" />
          </div>

          {/* 2. PREMIUM FABRICS */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 pl-3 sm:pl-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <rect x="6" y="6" width="20" height="20" rx="2" transform="rotate(45 16 16)" strokeWidth="1.7" />
                <line x1="11" y1="11" x2="21" y2="21" strokeWidth="1.4" />
                <line x1="21" y1="11" x2="11" y2="21" strokeWidth="1.4" />
                <line x1="16" y1="7" x2="16" y2="25" strokeWidth="1.4" strokeDasharray="2 2" />
                <line x1="7" y1="16" x2="25" y2="16" strokeWidth="1.4" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10.5px] sm:text-xs font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                PREMIUM FABRICS
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Finest Quality
              </p>
            </div>
          </div>

          {/* 3. PERFECT DETAILS */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 pr-2.5 sm:pr-4 relative">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <circle cx="16" cy="16" r="11" strokeWidth="1.7" />
                <circle cx="16" cy="16" r="3" strokeWidth="1.7" fill="currentColor" fillOpacity="0.1" />
                <line x1="16" y1="2" x2="16" y2="5" />
                <line x1="16" y1="27" x2="16" y2="30" />
                <line x1="2" y1="16" x2="5" y2="16" />
                <line x1="27" y1="16" x2="30" y2="16" />
                <path d="M11 11L21 21M21 11L11 21" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10.5px] sm:text-xs font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
                PERFECT DETAILS
              </h4>
              <p className="text-[9px] sm:text-[10px] font-normal text-[#5A4E42] mt-0.5 leading-tight font-sans">
                Every Stitch
              </p>
            </div>
            {/* Center Vertical Divider Line */}
            <div className="absolute right-0 top-1 bottom-1 w-[1px] bg-[#D8C7B7]" />
          </div>

          {/* 4. EASY RETURNS */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 pl-3 sm:pl-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0 text-[#14110E]">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M16 4L27 9.5V22.5L16 28L5 22.5V9.5L16 4Z" strokeWidth="1.7" />
                <path d="M16 4V16M27 9.5L16 16M5 9.5L16 16" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="10" strokeDasharray="3 2" strokeWidth="1.2" strokeOpacity="0.5" />
                <path d="M21 12L24 9L21 6" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-[10.5px] sm:text-xs font-bold tracking-[0.06em] text-[#14110E] uppercase leading-tight font-sans">
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
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M7 11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11Z" />
                <path d="M12 11C12 9.89543 12.8954 9 14 9" />
                <path d="M12 16V22C12 24.2091 13.7909 26 16 26H25C26.6569 26 28 24.6569 28 23C28 21.3431 26.6569 20 25 20H17" />
                <line x1="16" y1="20" x2="16" y2="23" />
                <line x1="19" y1="20" x2="19" y2="22" />
                <line x1="22" y1="20" x2="22" y2="23" />
                <line x1="25" y1="20" x2="25" y2="22" />
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
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <rect x="6" y="6" width="20" height="20" rx="2" transform="rotate(45 16 16)" strokeWidth="1.7" />
                <line x1="11" y1="11" x2="21" y2="21" strokeWidth="1.4" />
                <line x1="21" y1="11" x2="11" y2="21" strokeWidth="1.4" />
                <line x1="16" y1="7" x2="16" y2="25" strokeWidth="1.4" strokeDasharray="2 2" />
                <line x1="7" y1="16" x2="25" y2="16" strokeWidth="1.4" strokeDasharray="2 2" />
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
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <circle cx="16" cy="16" r="11" strokeWidth="1.7" />
                <circle cx="16" cy="16" r="3" strokeWidth="1.7" fill="currentColor" fillOpacity="0.1" />
                <line x1="16" y1="2" x2="16" y2="5" />
                <line x1="16" y1="27" x2="16" y2="30" />
                <line x1="2" y1="16" x2="5" y2="16" />
                <line x1="27" y1="16" x2="30" y2="16" />
                <path d="M11 11L21 21M21 11L11 21" strokeWidth="1" strokeDasharray="2 2" />
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
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                <path d="M16 4L27 9.5V22.5L16 28L5 22.5V9.5L16 4Z" strokeWidth="1.7" />
                <path d="M16 4V16M27 9.5L16 16M5 9.5L16 16" strokeWidth="1.5" />
                <circle cx="16" cy="16" r="10" strokeDasharray="3 2" strokeWidth="1.2" strokeOpacity="0.5" />
                <path d="M21 12L24 9L21 6" strokeWidth="1.5" />
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
