"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";

interface ShirtVariant {
  id: string;
  name: string;
  shortLabel: string;
  colorHex: string;
  swatchGradient: string;
  startTime: number;
  autoEndTime: number; // Duration in 2-second auto-cycle
  loopEndTime: number; // Full clip duration when held manually
}

const SHIRT_VARIANTS: ShirtVariant[] = [
  {
    id: "navy",
    name: "Midnight Navy Stripe",
    shortLabel: "Navy Stripe",
    colorHex: "#1E2A38",
    swatchGradient: "linear-gradient(135deg, #182330 0%, #2A3B4E 100%)",
    startTime: 0.0,
    autoEndTime: 2.2, // ~2.9s real time at 0.75x speed
    loopEndTime: 2.92,
  },
  {
    id: "terracotta",
    name: "Terracotta Rust Stripe",
    shortLabel: "Terracotta Stripe",
    colorHex: "#9C5743",
    swatchGradient: "linear-gradient(135deg, #8E4C38 0%, #B56A54 100%)",
    startTime: 3.0,
    autoEndTime: 5.2, // ~2.9s real time at 0.75x speed
    loopEndTime: 6.45,
  },
  {
    id: "rose",
    name: "Blush Rose Stripe",
    shortLabel: "Blush Rose Stripe",
    colorHex: "#DF9F97",
    swatchGradient: "linear-gradient(135deg, #CF887E 0%, #E8B4AD 100%)",
    startTime: 6.55,
    autoEndTime: 8.75, // ~2.9s real time at 0.75x speed
    loopEndTime: 8.95,
  },
  {
    id: "trio",
    name: "All 3 Colors (Trio Edition)",
    shortLabel: "All 3 Combined",
    colorHex: "multi",
    swatchGradient: "linear-gradient(135deg, #182330 0%, #182330 33.3%, #9C5743 33.3%, #9C5743 66.6%, #DF9F97 66.6%, #DF9F97 100%)",
    startTime: 9.0,
    autoEndTime: 13.0, // ~5.3s real time at 0.75x speed - generous display time
    loopEndTime: 13.9,
  },
];

export default function HeroVideoBanner() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const isManualModeRef = useRef<boolean>(false);
  const manualIndexRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const currentVariant = SHIRT_VARIANTS[activeIndex];

  // Apply slow-motion luxury playback rate (0.75x)
  const applyPlaybackRate = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  // Manual Color Selection: user clicks a swatch
  const selectVariant = useCallback((index: number) => {
    isManualModeRef.current = true;
    manualIndexRef.current = index;
    setActiveIndex(index);

    if (videoRef.current) {
      isSeekingRef.current = true;
      videoRef.current.playbackRate = 0.75;
      videoRef.current.currentTime = SHIRT_VARIANTS[index].startTime;
      videoRef.current.play().catch(() => {});
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 150);
    }
  }, []);

  // Single Synchronized Controller for Smooth Serial Playback & Accurate Swatch Active State
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || isSeekingRef.current) return;
    const ct = videoRef.current.currentTime;

    // MANUAL MODE: Loop only the selected shirt variant smoothly
    if (isManualModeRef.current) {
      const selected = SHIRT_VARIANTS[manualIndexRef.current];
      if (ct >= selected.loopEndTime - 0.05 || ct < selected.startTime - 0.15) {
        isSeekingRef.current = true;
        videoRef.current.currentTime = selected.startTime;
        videoRef.current.playbackRate = 0.75;
        setTimeout(() => {
          isSeekingRef.current = false;
        }, 120);
      }
      return;
    }

    // AUTO SERIAL MODE:
    // Serial sequence: 1 (Navy) -> 2 (Terracotta) -> 3 (Rose) -> 4 (Trio) -> Loop
    if (ct < 3.0) {
      if (activeIndex !== 0) setActiveIndex(0);
      if (ct >= SHIRT_VARIANTS[0].autoEndTime) {
        isSeekingRef.current = true;
        videoRef.current.currentTime = SHIRT_VARIANTS[1].startTime;
        videoRef.current.playbackRate = 0.75;
        setActiveIndex(1);
        setTimeout(() => { isSeekingRef.current = false; }, 120);
      }
    } else if (ct >= 3.0 && ct < 6.55) {
      if (activeIndex !== 1) setActiveIndex(1);
      if (ct >= SHIRT_VARIANTS[1].autoEndTime) {
        isSeekingRef.current = true;
        videoRef.current.currentTime = SHIRT_VARIANTS[2].startTime;
        videoRef.current.playbackRate = 0.75;
        setActiveIndex(2);
        setTimeout(() => { isSeekingRef.current = false; }, 120);
      }
    } else if (ct >= 6.55 && ct < 9.0) {
      if (activeIndex !== 2) setActiveIndex(2);
      if (ct >= SHIRT_VARIANTS[2].autoEndTime) {
        isSeekingRef.current = true;
        videoRef.current.currentTime = SHIRT_VARIANTS[3].startTime;
        videoRef.current.playbackRate = 0.75;
        setActiveIndex(3);
        setTimeout(() => { isSeekingRef.current = false; }, 120);
      }
    } else if (ct >= 9.0) {
      if (activeIndex !== 3) setActiveIndex(3);
      if (ct >= SHIRT_VARIANTS[3].autoEndTime) {
        isSeekingRef.current = true;
        videoRef.current.currentTime = SHIRT_VARIANTS[0].startTime;
        videoRef.current.playbackRate = 0.75;
        setActiveIndex(0);
        setTimeout(() => { isSeekingRef.current = false; }, 120);
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.volume = 0;
      video.playbackRate = 0.75;
      video.currentTime = 0.0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play was prevented:", error);
        });
      }
    }
  }, []);

  return (
    <section className="relative w-full h-[100dvh] min-h-[540px] flex flex-col justify-between overflow-hidden bg-[#E7D6C4] select-none">
      
      {/* 1. Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src="/video/create_a_second_premium_shirt_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-all duration-700 ease-out ${
            activeIndex === 3
              ? "object-[50%_bottom] sm:object-[50%_center] md:object-[52%_center] lg:object-center scale-[1.0] sm:scale-[1.0]"
              : "object-[52%_bottom] sm:object-[54%_center] md:object-[58%_center] lg:object-center scale-[1.01]"
          }`}
          style={{
            opacity: isVideoLoaded ? 1 : 0.85,
          }}
        />

        {/* Soft natural ambient gradient on left for crystal clear readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-[#E7D6C4]/80 via-[#E7D6C4]/30 to-transparent pointer-events-none transition-all duration-700 ${
            activeIndex === 3
              ? "w-[45%] sm:w-[40%] md:w-[35%] lg:w-[32%] opacity-60"
              : "w-[85%] sm:w-[70%] md:w-[58%] lg:w-[48%] opacity-100"
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-[#E2D0BD]/70 via-[#E2D0BD]/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Hero Content Container (flex-1 centers content) */}
      <div className="relative z-20 w-full max-w-[1780px] mx-auto px-4 sm:px-10 lg:px-16 xl:px-20 flex-1 min-h-0 flex flex-col justify-center">
        
        {/* Left Column: Eyebrow + Main Heading + Action Buttons (+ Mobile Range Tracker) */}
        <div className="max-w-[280px] sm:max-w-md md:max-w-xl lg:max-w-[560px] xl:max-w-[620px] flex flex-col items-start pt-10 sm:pt-16 md:pt-0">

          {/* Golden/Tan Eyebrow Subtitle */}
          <div className="mb-1.5 sm:mb-3 flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-[#A57545] text-[10px] sm:text-xs md:text-[13px] font-bold tracking-[0.22em] sm:tracking-[0.28em] uppercase inline-block">
              EFFORTLESSLY ELEGANT
            </span>
            <span className="hidden sm:inline text-[#A57545]/40 font-mono text-xs">|</span>
            <span className="text-[#4A3F35] text-[11px] font-semibold tracking-wider transition-all duration-300">
              {currentVariant.name}
            </span>
            {activeIndex === 3 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold tracking-widest uppercase bg-[#14110E] text-[#FAF8F5] shadow-xs transition-opacity duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DF9F97]" />
                TRIO COLLECTION
              </span>
            )}
          </div>

          {/* Main Luxury High-Contrast Heading */}
          <h1 className="font-serif-luxury font-medium text-[22px] sm:text-[30px] md:text-4xl lg:text-[48px] xl:text-[54px] leading-[1.1] sm:leading-[1.08] text-[#14110E] tracking-tight uppercase mb-3 sm:mb-5 md:mb-8">
            NOT EVERY BODY <br />
            IS THE SAME SIZE.
          </h1>

          {/* Action Buttons: Stacked on Mobile, Side-by-Side on Desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
            <Link
              href="/shop"
              className="bg-[#14110E] hover:bg-[#2A241F] text-[#FAF8F5] text-[10px] sm:text-xs lg:text-[12px] font-bold tracking-[0.16em] px-4 sm:px-8 lg:px-9 py-2.5 sm:py-3.5 md:py-4 transition-all duration-300 text-center uppercase shadow-md hover:shadow-lg active:scale-98 w-[130px] sm:w-auto"
            >
              SHOP SHIRTS
            </Link>
            
            <Link
              href="/custom-shirt"
              className="bg-transparent hover:bg-[#14110E] hover:text-[#FAF8F5] text-[#14110E] border border-[#14110E] text-[10px] sm:text-xs lg:text-[12px] font-bold tracking-[0.16em] px-3.5 sm:px-7 lg:px-8 py-2.5 sm:py-3.5 md:py-4 transition-all duration-300 text-center uppercase flex items-center justify-center gap-1.5 group shadow-xs active:scale-98 whitespace-nowrap w-[130px] sm:w-auto"
            >
              <span>CUSTOM FIT</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-xs sm:text-sm leading-none">→</span>
            </Link>
          </div>

          {/* MOBILE ONLY: 01-05 Range Tracker + 4 Interactive Color Swatches */}
          <div className="flex md:hidden items-center gap-3 mt-3.5 sm:mt-5 select-none">
            {/* 01 ... 05 Vertical Range Tracker for Mobile */}
            <div className="flex flex-col items-center select-none">
              <span className="text-[9.5px] font-semibold text-[#14110E] tracking-wider mb-0.5 font-mono">
                01
              </span>
              
              <div className="relative w-3 h-14 sm:h-18 my-0.5">
                <div className="absolute top-0 bottom-0 w-[1px] bg-[#14110E]/30 left-1/2 -translate-x-1/2" />
                <div
                  className="absolute top-0 w-[1.5px] bg-[#14110E] left-1/2 -translate-x-1/2 transition-all duration-500 ease-out origin-top"
                  style={{
                    height: `${(activeIndex / 3) * 100}%`,
                  }}
                />
                {[0, 1, 2, 3].map((stepIdx) => {
                  const isPastOrActive = activeIndex >= stepIdx;
                  const topPercent = (stepIdx / 3) * 100;
                  return (
                    <button
                      key={stepIdx}
                      type="button"
                      onClick={() => selectVariant(stepIdx)}
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-0.5 focus:outline-none"
                      style={{ top: `${topPercent}%` }}
                      aria-label={`Step 0${stepIdx + 1}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full block transition-all duration-300 ${
                          isPastOrActive ? "bg-[#14110E]" : "bg-[#14110E]/35"
                        }`}
                      />
                    </button>
                  );
                })}

                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-[1.5px] border-[#14110E] bg-[#FAF5EE]/70 pointer-events-none transition-all duration-500 ease-out z-20 flex items-center justify-center"
                  style={{
                    top: `${(activeIndex / 3) * 100}%`,
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-[#14110E]" />
                </div>
              </div>

              <span className="text-[9.5px] font-semibold text-[#14110E] tracking-wider mt-0.5 font-mono">
                05
              </span>
            </div>

            {/* 4 Interactive Color Swatches on Mobile (Navy, Terracotta, Rose, Trio) */}
            <div className="flex flex-col items-center gap-1.5 bg-transparent p-0 ml-1">
              {SHIRT_VARIANTS.map((variant, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={variant.id}
                    className={`rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                      isActive
                        ? "ring-1.5 ring-[#14110E] ring-offset-2 ring-offset-transparent scale-110 shadow-xs"
                        : "ring-0 ring-transparent ring-offset-0"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectVariant(idx)}
                      className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full transition-all duration-300 cursor-pointer shadow-xs ${
                        isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
                      }`}
                      style={{
                        background: variant.swatchGradient,
                      }}
                      aria-label={`Select ${variant.name}`}
                      title={variant.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 3. Bottom Left: "SCROLL DOWN" Indicator */}
      <div className="absolute bottom-28 sm:bottom-20 left-4 sm:left-10 lg:left-16 xl:left-20 z-20 flex flex-col items-start pointer-events-none">
        <span className="text-[#3D352E] text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.22em] uppercase">
          SCROLL DOWN
        </span>
        <div className="w-[1.5px] h-3 sm:h-4 bg-[#3D352E]/90 mt-1 ml-0.5" />
      </div>

      {/* 4. DESKTOP ONLY: Right Side Interactive Color Swatches + 01-05 Range Tracker */}
      <div className="hidden md:flex absolute right-4 sm:right-7 lg:right-10 xl:right-14 top-1/2 -translate-y-1/2 z-30 items-center gap-4 sm:gap-6 select-none">
        
        {/* Transparent Atelier Color Swatches with Active Indicator Circle */}
        <div className="flex flex-col items-center gap-3.5 bg-transparent p-0">
          
          {/* Swatch items */}
          {SHIRT_VARIANTS.map((variant, idx) => {
            const isActive = activeIndex === idx;
            const isHovered = hoveredIndex === idx;

            return (
              <div key={variant.id} className="relative flex items-center justify-center group">
                {/* Floating tooltip with color name */}
                <div
                  className={`absolute right-full mr-3.5 px-2.5 py-1 bg-[#14110E] text-[#FAF8F5] text-[10.5px] font-medium tracking-wider uppercase rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 ${
                    isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                  }`}
                >
                  {variant.shortLabel}
                </div>

                {/* Circular Color Swatch Button with Active Indicator Circle */}
                <div
                  className={`rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? "ring-1.5 ring-[#14110E] ring-offset-2 ring-offset-transparent scale-110 shadow-sm"
                      : "ring-0 ring-transparent ring-offset-0"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => selectVariant(idx)}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-all duration-300 cursor-pointer relative shadow-sm ${
                      isActive
                        ? "opacity-100"
                        : "opacity-75 hover:opacity-100 hover:scale-105"
                    }`}
                    style={{
                      background: variant.swatchGradient,
                    }}
                    aria-label={`Select ${variant.name}`}
                    title={variant.name}
                  />
                </div>
              </div>
            );
          })}

        </div>

        {/* 01 ... 05 Vertical Range Dynamic Tracker (Tracks downward as color changes) */}
        <div className="flex flex-col items-center select-none py-1">
          <span className="text-[11px] sm:text-xs font-semibold text-[#14110E] tracking-wider mb-2.5 font-mono">
            01
          </span>
          
          {/* Vertical Track with Exact Absolute Coordinates */}
          <div className="relative w-4 h-24 sm:h-28 my-1">
            {/* Background static connecting line */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-[#14110E]/30 left-1/2 -translate-x-1/2" />

            {/* Active connecting progress line flowing down */}
            <div
              className="absolute top-0 w-[1.5px] bg-[#14110E] left-1/2 -translate-x-1/2 transition-all duration-500 ease-out origin-top"
              style={{
                height: `${(activeIndex / 3) * 100}%`,
              }}
            />

            {/* Step guide dots located at exact 0%, 33.33%, 66.66%, 100% */}
            {[0, 1, 2, 3].map((stepIdx) => {
              const isPastOrActive = activeIndex >= stepIdx;
              const topPercent = (stepIdx / 3) * 100;
              return (
                <button
                  key={stepIdx}
                  type="button"
                  onClick={() => selectVariant(stepIdx)}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer p-1 group flex items-center justify-center focus:outline-none"
                  style={{ top: `${topPercent}%` }}
                  aria-label={`Go to step 0${stepIdx + 1}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isPastOrActive ? "bg-[#14110E]" : "bg-[#14110E]/35"
                    }`}
                  />
                </button>
              );
            })}

            {/* Active Moving Tracker Ring - Perfectly Centers on Active Dot */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-[1.5px] border-[#14110E] bg-[#FAF5EE]/70 pointer-events-none transition-all duration-500 ease-out z-20 shadow-xs flex items-center justify-center"
              style={{
                top: `${(activeIndex / 3) * 100}%`,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#14110E]" />
            </div>
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-[#14110E] tracking-wider mt-2.5 font-mono">
            05
          </span>
        </div>

      </div>

      {/* 5. Feature Highlights Bar (Docked at the Bottom of Hero Section) */}
      <FeatureHighlightsBar />

    </section>
  );
}
