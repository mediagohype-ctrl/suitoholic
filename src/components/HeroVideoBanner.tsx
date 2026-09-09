"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

export default function HeroVideoBanner() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Ensure video is 100% muted without sound
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.volume = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play was prevented:", error);
        });
      }
    }
  }, []);

  return (
    <section className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[740px] xl:min-h-[800px] flex items-center justify-center overflow-hidden bg-[#EBDCCB] select-none">
      
      {/* 1. Background Video Layer (Shifted right for clear left-side text separation) */}
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
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] sm:object-[74%_center] lg:object-[78%_center] pointer-events-none scale-[1.02] transition-opacity duration-700"
          style={{
            opacity: isVideoLoaded ? 1 : 0.85,
          }}
        />

        {/* Soft Ambient Gradients on Left for Crisp Heading & Button Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF4EC]/95 via-[#FAF4EC]/50 to-transparent w-full md:w-[65%] lg:w-[48%] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#E2D0BD]/75 via-[#E2D0BD]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#FAF4EC]/60 to-transparent pointer-events-none" />
      </div>

      {/* 2. Hero Content Container (Constrained strictly to left side) */}
      <div className="relative z-20 w-full max-w-[1780px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 flex flex-col justify-center">
        
        {/* Left Column: Heading & CTA Action Buttons (Zero Overlap with Shirt) */}
        <div className="max-w-md sm:max-w-lg lg:max-w-[480px] xl:max-w-[540px] flex flex-col items-start space-y-5 sm:space-y-7">

          {/* Main Luxury Heading with Clean Left-Aligned Sizing */}
          <h1 className="font-serif-luxury font-normal text-2xl sm:text-4xl lg:text-[42px] xl:text-[48px] 2xl:text-[54px] leading-[1.08] text-[#14110E] tracking-tight uppercase">
            NOT EVERY BODY <br />
            IS THE SAME SIZE.
          </h1>

          {/* Action Buttons: SHOP SHIRTS & CUSTOM FIT (Moved slightly down with spacious padding) */}
          <div className="flex flex-row items-center gap-3 sm:gap-4 pt-3 sm:pt-5 lg:pt-6">
            <Link
              href="/shop"
              className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.2em] px-7 sm:px-9 py-3.5 sm:py-4 transition-all duration-300 text-center uppercase shadow-md whitespace-nowrap hover:shadow-lg active:scale-98"
            >
              SHOP SHIRTS
            </Link>
            
            <Link
              href="/custom-shirt"
              className="bg-[#FAF4EC]/85 backdrop-blur-sm border border-[#14110E]/70 hover:border-[#14110E] hover:bg-[#14110E] hover:text-[#FAF8F5] text-[#14110E] text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.2em] px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 text-center uppercase flex items-center justify-center gap-2 group whitespace-nowrap shadow-2xs active:scale-98"
            >
              <span>CUSTOM FIT</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
}
