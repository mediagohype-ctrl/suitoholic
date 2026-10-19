"use client";

import React, { useRef, useEffect } from "react";
import { useContent } from "@/context/SiteDataProvider";

export default function AtelierEditorialBanner() {
  const c = useContent("atelierBanner");
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSource = c.video || "/video/create_a_second_premium_shirt_video.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.playbackRate = 1.0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [videoSource]);

  return (
    <section className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-8 sm:my-12 lg:my-16 select-none">
      {/* Luxury Editorial Heading */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-10 flex flex-col items-center">
        {/* Eyebrow with hairline rules */}
        <div className="inline-flex items-center gap-2.5 mb-2.5 sm:mb-3">
          <span className="w-8 sm:w-12 h-[1px] bg-black/40" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] text-black uppercase font-sans">
            {c.videoBadge || "THE ATELIER ARCHIVE"}
          </span>
          <span className="w-8 sm:w-12 h-[1px] bg-black/40" />
        </div>

        {/* Main Heading */}
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
          {c.videoTitle || "TAILORING IN MOTION"}
        </h2>

        {/* Editorial Subtitle */}
        <p className="mt-2.5 sm:mt-3 text-sm sm:text-base md:text-[17px] text-[#666666] font-normal tracking-normal max-w-xl text-center leading-relaxed">
          {c.videoSubtitle || "Artisanal precision, 360° fluid drape, and bespoke master craftsmanship in motion."}
        </p>
      </div>

      {/* Cinema Video Player */}
      <div
        className="relative w-[90%] mx-auto aspect-[16/9] sm:aspect-[21/9] min-h-[350px] sm:min-h-[440px] lg:min-h-[530px] rounded-[12px] overflow-hidden shadow-lg border border-[#E5E3DD] bg-[#0E0C0A] flex items-center justify-center pointer-events-none"
      >
        <video
          ref={videoRef}
          playsInline
          muted
          loop
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{
            transform: "translate3d(0, 0, 0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <source src={videoSource} type="video/mp4" />
          <source src="/video/create_a_second_premium_shirt_video.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
