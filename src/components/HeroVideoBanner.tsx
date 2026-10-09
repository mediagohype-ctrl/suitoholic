"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useContent } from "@/context/SiteDataProvider";

const swatchGradient = (from: string, to: string) => `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;

export default function HeroVideoBanner() {
  const c = useContent("homeHero");
  const variants = c.variants;
  // Position of a variant on the vertical tracker (0–100%).
  const lastIndex = Math.max(variants.length - 1, 1);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const isSeekingRef = useRef<boolean>(false);

  const currentVariant = variants[Math.min(activeIndex, variants.length - 1)];

  // Apply slow-motion luxury playback rate (0.75x)
  const applyPlaybackRate = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  // Manual Color Selection: user clicks a swatch -> jump to video timestamp immediately
  const selectVariant = useCallback((index: number) => {
    setActiveIndex(index);

    if (videoRef.current) {
      isSeekingRef.current = true;
      videoRef.current.playbackRate = 0.75;
      videoRef.current.currentTime = variants[index]?.startTime ?? 0;
      videoRef.current.play().catch(() => {});
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 150);
    }
  }, [variants]);

  // Single Synchronized Controller for Real-Time Video Timestamp & Color Swatch Sync
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || isSeekingRef.current) return;
    const ct = videoRef.current.currentTime;

    // The active variant is the last one whose start time has been reached.
    let currentIdx = 0;
    variants.forEach((v, i) => {
      if (ct >= v.startTime) currentIdx = i;
    });

    if (activeIndex !== currentIdx) {
      setActiveIndex(currentIdx);
    }
  }, [activeIndex, variants]);

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
    <section className="relative w-full h-[100dvh] min-h-[560px] flex flex-col justify-between overflow-hidden bg-[#DDD1C3] select-none">
      
      {/* 1. Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          src={c.video}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload no-picture-in-picture"
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onTimeUpdate={handleTimeUpdate}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-700 ease-out"
          style={{
            opacity: isVideoLoaded ? 1 : 0.85,
          }}
        />

        {/* Soft natural ambient gradient on left for crystal clear readability */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-[#DDD1C3]/85 via-[#DDD1C3]/35 to-transparent pointer-events-none transition-all duration-700 ${
            variants.length > 1 && activeIndex === variants.length - 1
              ? "w-[45%] sm:w-[40%] md:w-[35%] lg:w-[32%] opacity-60"
              : "w-[85%] sm:w-[70%] md:w-[58%] lg:w-[48%] opacity-100"
          }`}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-[#DDD1C3]/80 via-[#DDD1C3]/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Hero Content Container (flex-1 centers content) */}
      <div className="relative z-20 w-full max-w-[1780px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 flex-1 min-h-0 flex flex-col justify-center">
        
        {/* Left Column: Main Heading + Action Buttons (+ Mobile Range Tracker) */}
        <div className="max-w-[260px] sm:max-w-sm md:max-w-md lg:max-w-[440px] xl:max-w-[480px] flex flex-col items-start pt-4 sm:pt-10 md:pt-0">

          {/* Main Luxury High-Contrast Heading */}
          <h1 className="font-serif-luxury font-normal text-[16px] sm:text-[20px] md:text-[24px] lg:text-[30px] xl:text-[34px] leading-[1.1] sm:leading-[1.08] text-[#14110E] tracking-normal uppercase mb-2.5 sm:mb-4 md:mb-5">
            {c.headingLine1} <br />
            {c.headingLine2}
          </h1>

          {/* Action Buttons: Stacked on Mobile, Side-by-Side on Desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto">
            <Link
              href={c.primaryCtaHref}
              className="bg-[#14110E] hover:bg-[#2A241F] text-[#FAF8F5] text-[9px] sm:text-[10px] lg:text-[11px] font-bold tracking-[0.14em] px-3.5 sm:px-6 lg:px-7 py-2 sm:py-2.5 md:py-3 transition-all duration-300 text-center uppercase shadow-md hover:shadow-lg active:scale-98 w-[115px] sm:w-auto"
            >
              {c.primaryCtaLabel}
            </Link>
            
            <Link
              href={c.secondaryCtaHref}
              className="bg-[#14110E] hover:bg-black text-[#FAF8F5] border border-[#14110E] text-[9px] sm:text-[10px] lg:text-[11px] font-bold tracking-[0.14em] px-3 sm:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 transition-all duration-300 text-center uppercase flex items-center justify-center gap-1.5 group shadow-md active:scale-98 whitespace-nowrap w-[115px] sm:w-auto"
            >
              <span>{c.secondaryCtaLabel}</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-xs sm:text-sm leading-none">→</span>
            </Link>
          </div>

          {/* Color Swatches & 01-05 Range Tracker (Positioned on the Left under Buttons) */}
          <div className="flex items-center gap-3.5 sm:gap-4 mt-4 sm:mt-5 md:mt-6 select-none">
            
            {/* Color Swatches */}
            <div className="flex flex-col items-center gap-2 sm:gap-2.5 bg-transparent p-0">
              {variants.map((variant, idx) => {
                const isActive = activeIndex === idx;
                const isHovered = hoveredIndex === idx;

                return (
                  <div key={`${variant.name}-${idx}`} className="relative flex items-center justify-center group">
                    {/* Tooltip on right side of swatch */}
                    <div
                      className={`absolute left-full ml-3 px-2.5 py-1 bg-[#14110E] text-[#FAF8F5] text-[10px] font-medium tracking-wider uppercase rounded shadow-lg whitespace-nowrap pointer-events-none transition-all duration-200 z-30 ${
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                      }`}
                    >
                      {variant.shortLabel}
                    </div>

                    <div
                      className={`rounded-full p-0.5 transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? "ring-1 ring-[#14110E] ring-offset-1.5 ring-offset-transparent scale-105 shadow-xs"
                          : "ring-0 ring-transparent ring-offset-0"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectVariant(idx)}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full transition-all duration-300 cursor-pointer relative shadow-xs ${
                          isActive
                            ? "opacity-100"
                            : "opacity-75 hover:opacity-100 hover:scale-105"
                        }`}
                        style={{
                          background: swatchGradient(variant.swatchFrom, variant.swatchTo),
                        }}
                        aria-label={`Select ${variant.name}`}
                        title={variant.name}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 01 ... 05 Vertical Range Dynamic Tracker */}
            <div className="flex flex-col items-center select-none py-0.5">
              <span className="text-[9px] sm:text-[9.5px] font-normal text-[#5A4E42]/80 tracking-wider mb-1 font-mono">
                {c.trackerStartLabel}
              </span>
              
              <div className="relative w-3 h-16 sm:h-20 my-0.5">
                <div className="absolute top-0 bottom-0 w-[1px] bg-[#5A4E42]/20 left-1/2 -translate-x-1/2" />
                <div
                  className="absolute top-0 w-[1px] bg-[#5A4E42]/70 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out origin-top"
                  style={{
                    height: `${(activeIndex / lastIndex) * 100}%`,
                  }}
                />

                {variants.map((_, stepIdx) => {
                  const isPastOrActive = activeIndex >= stepIdx;
                  const topPercent = (stepIdx / lastIndex) * 100;
                  return (
                    <button
                      key={stepIdx}
                      type="button"
                      onClick={() => selectVariant(stepIdx)}
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer p-0.5 group flex items-center justify-center focus:outline-none"
                      style={{ top: `${topPercent}%` }}
                      aria-label={`Go to step 0${stepIdx + 1}`}
                    >
                      <span
                        className={`w-0.5 h-0.5 rounded-full transition-all duration-300 ${
                          isPastOrActive ? "bg-[#5A4E42]" : "bg-[#5A4E42]/30"
                        }`}
                      />
                    </button>
                  );
                })}

                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-[#5A4E42] bg-[#FAF5EE]/90 pointer-events-none transition-all duration-500 ease-out z-20 flex items-center justify-center"
                  style={{
                    top: `${(activeIndex / lastIndex) * 100}%`,
                  }}
                >
                  <div className="w-0.5 h-0.5 rounded-full bg-[#5A4E42]" />
                </div>
              </div>

              <span className="text-[9px] sm:text-[9.5px] font-normal text-[#5A4E42]/80 tracking-wider mt-1 font-mono">
                {c.trackerEndLabel}
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
