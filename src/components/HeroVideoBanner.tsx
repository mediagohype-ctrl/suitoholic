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

  // Apply native high-definition playback rate (1.0x)
  const applyPlaybackRate = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }
  }, []);

  // Manual Color Selection: user clicks a swatch -> jump to video timestamp immediately
  const selectVariant = useCallback((index: number) => {
    setActiveIndex(index);

    if (videoRef.current) {
      isSeekingRef.current = true;
      videoRef.current.playbackRate = 1.0;
      const targetTime = variants[index]?.startTime ?? 0;
      videoRef.current.currentTime = targetTime;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 350);
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
      video.playbackRate = 1.0;
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
          src={c.video || "/video/Suitoholic%20Approved.mp4"}
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
        >
          <source src={c.video || "/video/Suitoholic%20Approved.mp4"} type="video/mp4" />
          <source src="/video/Suitoholic_Approved.mp4" type="video/mp4" />
          <source src="/video/Suitoholic Approved.mp4" type="video/mp4" />
        </video>

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
        <div className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col items-start pt-4 sm:pt-10 md:pt-0">

          {/* Main Luxury High-Contrast Heading */}
          <h1 className="font-serif-luxury font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[44px] xl:text-[50px] leading-[1.08] text-black tracking-[0.02em] uppercase mb-4 sm:mb-6">
            {c.headingLine1} <br />
            {c.headingLine2}
          </h1>

          {/* Action Buttons: Stacked on Mobile, Side-by-Side on Desktop */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-2.5 md:gap-3 w-full sm:w-auto">
            <Link
              href={c.primaryCtaHref}
              className="bg-black hover:bg-neutral-800 text-white text-[10px] sm:text-[11.5px] lg:text-[12.5px] font-bold tracking-[0.16em] px-6 sm:px-8 lg:px-9 py-3 sm:py-3.5 rounded-full transition-all duration-300 text-center uppercase shadow-sm hover:shadow-md active:scale-98 w-[125px] sm:w-auto"
            >
              {c.primaryCtaLabel}
            </Link>
            
            <Link
              href={c.secondaryCtaHref}
              className="bg-white hover:bg-black text-black hover:text-white border border-black text-[10px] sm:text-[11.5px] lg:text-[12.5px] font-bold tracking-[0.16em] px-5 sm:px-7 lg:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-300 text-center uppercase flex items-center justify-center gap-1.5 group shadow-sm hover:shadow-md active:scale-98 whitespace-nowrap w-[125px] sm:w-auto"
            >
              <span>{c.secondaryCtaLabel}</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-xs sm:text-sm leading-none">→</span>
            </Link>
          </div>

          {/* Color Swatches & 01-04 Range Tracker (Positioned on the Left under Buttons) */}
          <div className="flex items-center gap-3.5 sm:gap-4.5 mt-4 sm:mt-5 md:mt-6 select-none">
            
            {/* Color Swatches (in exact order of video shirts) */}
            <div className="flex flex-col items-center gap-2.5 sm:gap-3 bg-transparent p-0">
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
                          ? "ring-1 ring-black ring-offset-2 ring-offset-[#DDD1C3] scale-105"
                          : "ring-0 ring-transparent ring-offset-0"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => selectVariant(idx)}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full transition-all duration-300 cursor-pointer relative shadow-xs active:scale-90 ${
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

            {/* 01 ... 04 Vertical Range Dynamic Tracker */}
            <div className="flex flex-col items-center select-none py-0.5">
              <span className="text-[9px] sm:text-[9.5px] font-normal text-black/80 tracking-wider mb-1 font-mono">
                {c.trackerStartLabel}
              </span>
              
              <div className="relative w-3 h-20 sm:h-24 my-0.5">
                <div className="absolute top-0 bottom-0 w-[1px] bg-black/20 left-1/2 -translate-x-1/2" />
                <div
                  className="absolute top-0 w-[1px] bg-black/70 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out origin-top"
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
                          isPastOrActive ? "bg-black" : "bg-black/30"
                        }`}
                      />
                    </button>
                  );
                })}

                <div
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-black bg-white/90 pointer-events-none transition-all duration-500 ease-out z-20 flex items-center justify-center shadow-xs"
                  style={{
                    top: `${(activeIndex / lastIndex) * 100}%`,
                  }}
                >
                  <div className="w-0.5 h-0.5 rounded-full bg-black" />
                </div>
              </div>

              <span className="text-[9px] sm:text-[9.5px] font-normal text-black/80 tracking-wider mt-1 font-mono">
                {c.trackerEndLabel}
              </span>
            </div>

            {/* Active Variant Label */}
            <div className="hidden sm:flex flex-col justify-center pl-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-black/70 font-semibold">
                {currentVariant?.shortLabel}
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
