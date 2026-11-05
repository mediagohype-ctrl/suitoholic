"use client";

import React, { useRef, useEffect } from "react";
import { useContent } from "@/context/SiteDataProvider";

export default function AtelierEditorialBanner() {
  const c = useContent("atelierBanner");
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSource = c.video || "/video/create_a_second_premium_shirt_video.mp4";

  // Ensure video autoplays smoothly
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

  // Signature ColourPig-Style Scroll Expansion & Parallax Effect
  // Uses direct DOM transform updates for 120fps silky-smooth GPU performance without React re-render overhead
  useEffect(() => {
    let animationFrameId: number;
    let isRunning = false;
    let currentProgress = 0;
    let targetProgress = 0;
    let currentParallaxY = -5;
    let targetParallaxY = -5;

    const applyTransforms = (progress: number, parallaxY: number) => {
      const isDesktop = window.innerWidth >= 768;
      
      const sX = isDesktop ? 0.28 + progress * 0.72 : 1.0;
      const sY = isDesktop ? 0.65 + progress * 0.35 : 1.0;
      const invX = 1 / sX;
      const invY = 1 / sY;

      if (frameRef.current) {
        frameRef.current.style.transform = `scaleX(${sX.toFixed(4)}) scaleY(${sY.toFixed(4)}) translateZ(0)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `scaleX(${invX.toFixed(4)}) scaleY(${invY.toFixed(4)}) translateZ(0)`;
      }
      if (videoWrapperRef.current) {
        videoWrapperRef.current.style.transform = `translate3d(0, ${parallaxY.toFixed(2)}%, 0)`;
      }
    };

    const updateLoop = () => {
      // Smooth lerp (0.12 factor) for a silky, organic spring deceleration
      currentProgress += (targetProgress - currentProgress) * 0.12;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.12;

      applyTransforms(currentProgress, currentParallaxY);

      const diffProgress = Math.abs(targetProgress - currentProgress);
      const diffParallax = Math.abs(targetParallaxY - currentParallaxY);

      if (diffProgress > 0.0005 || diffParallax > 0.01) {
        animationFrameId = requestAnimationFrame(updateLoop);
      } else {
        isRunning = false;
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;

      // Start when section enters viewport, reach 1.0 at sticky anchor
      const stickyTop = 100;
      const enterRange = windowHeight - stickyTop;
      const scrolledIn = windowHeight - rect.top;
      targetProgress = Math.max(0, Math.min(1, scrolledIn / enterRange));

      // Video Y parallax across total scroll length (-5% to +5%)
      const totalDistance = rect.height + windowHeight;
      const scrollRel = Math.max(0, Math.min(1, (windowHeight - rect.top) / totalDistance));
      targetParallaxY = -5 + scrollRel * 10;

      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(updateLoop);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial run
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full select-none py-8 md:py-0 md:h-[160vh] bg-transparent my-6 sm:my-10"
    >
      {/* Sticky Viewport Container (matching ColourPig sticky architecture) */}
      <div className="md:sticky md:top-[90px] w-full aspect-video md:aspect-auto md:h-[calc(100vh-110px)] overflow-hidden flex flex-col justify-start items-center px-4 sm:px-8 lg:px-12 max-w-[1740px] mx-auto">
        
        {/* Luxury Editorial Heading */}
        <div className="text-center max-w-4xl mx-auto mb-4 sm:mb-6 pt-2 flex flex-col items-center shrink-0 z-10">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
            {c.videoTitle || "TAILORING IN MOTION"}
          </h2>
        </div>

        {/* Outer Scaling Frame: Expands symmetrically from both sides (scaleX: 0.28 -> 1.0) */}
        <div
          ref={frameRef}
          className="relative w-full flex-1 overflow-hidden bg-[#0E0C0A] will-change-transform shadow-2xl rounded-2xl border border-[#E5E3DD]"
          style={{
            transform: "scaleX(0.28) scaleY(0.65) translateZ(0)",
            transformOrigin: "center center",
          }}
        >
          {/* Inner Counter-Scaling Container: (1/scaleX, 1/scaleY) keeps video 100% distortion-free */}
          <div
            ref={innerRef}
            className="absolute inset-0 will-change-transform flex items-center justify-center overflow-hidden"
            style={{
              transform: "scaleX(3.5714) scaleY(1.5385) translateZ(0)",
              transformOrigin: "center center",
            }}
          >


            {/* Parallax Video Container with extra vertical bleed */}
            <div
              ref={videoWrapperRef}
              className="absolute inset-x-0 -top-[8%] -bottom-[8%] w-full h-[116%]"
              style={{
                transform: "translate3d(0, -5%, 0)",
                willChange: "transform",
              }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                loop
                autoPlay
                preload="auto"
                className="w-full h-full object-cover object-center bg-[#0E0C0A]"
              >
                <source src={videoSource} type="video/mp4" />
                <source src="/video/create_a_second_premium_shirt_video.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Cinematic Luxury Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}
