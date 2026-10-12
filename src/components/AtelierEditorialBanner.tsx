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
      {/* Heading: Behind the scenes */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A202A] tracking-[0.18em] uppercase leading-tight">
          Behind the scenes
        </h2>
      </div>

      {/* Pure, Clean, Ultra-Smooth Cinema Video Player */}
      <div
        className="relative w-[90%] mx-auto aspect-[16/9] sm:aspect-[21/9] min-h-[350px] sm:min-h-[440px] lg:min-h-[530px] rounded-[12px] overflow-hidden shadow-[0_20px_60px_rgba(20,17,14,0.14)] bg-[#0E0C0A] flex items-center justify-center pointer-events-none"
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
