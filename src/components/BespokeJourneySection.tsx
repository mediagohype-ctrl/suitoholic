"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface JourneyStep {
  stepNumber: string;
  title: string;
  description: string;
  tag: string;
  tagLink?: string;
  image: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    stepNumber: "1",
    title: "The Consultation",
    description:
      "We begin with a conversation — not measurements. Your occasion, your wardrobe, the way you move and the impression you intend to make. From this we shape the brief for your commission.",
    tag: "BY APPOINTMENT",
    tagLink: "#appointment-booking",
    image: "/journey/step1_consultation.jpg",
  },
  {
    stepNumber: "2",
    title: "Cloth Selection",
    description:
      "Handle the cloth in daylight. Choose from eighty-five exclusive weaves across Vitale Barberis Canonico, Pronto and GA.ZA.BA — then settle linings, buttons and every private detail.",
    tag: "THE COLLECTION",
    tagLink: "/fabrics",
    image: "/journey/step2_cloth_selection.jpg",
  },
  {
    stepNumber: "3",
    title: "Measurement & Pattern",
    description:
      "Over twenty measurements are taken and a paper pattern is cut by hand — unique to you, kept on file, and refined with every garment you commission thereafter.",
    tag: "DRAFTED BY HAND",
    image: "/journey/step3_measurement_pattern.jpg",
  },
  {
    stepNumber: "4",
    title: "Cutting & Fittings",
    description:
      "The cloth is cut and basted, then shaped across a series of fittings. Full-canvas construction — never fused — allows the jacket to mould to you and improve with age.",
    tag: "TWO TO FOUR WEEKS",
    image: "/journey/step4_cutting_fittings.jpg",
  },
  {
    stepNumber: "5",
    title: "Delivery",
    description:
      "Your finished garment is pressed, inspected and presented. It remains in our care for life — alterations and pressing offered for as long as you wear it.",
    tag: "LIFETIME CARE",
    image: "/journey/step5_delivery.jpg",
  },
];

export default function BespokeJourneySection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const [reachedSteps, setReachedSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [lineMetrics, setLineMetrics] = useState({ top: 24, height: 0 });

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const stepThresholdsRef = useRef<number[]>([0, 0.25, 0.5, 0.75, 1]);
  const totalLineHeightRef = useRef(1);

  useEffect(() => {
    let rafId: number;

    const measureLayout = () => {
      const step0 = stepRefs.current[0];
      const step4 = stepRefs.current[4];
      if (!step0 || !step4 || !timelineRef.current) return;

      const isSm = window.innerWidth >= 640;
      const nodeCenter = isSm ? 28 : 24;

      const node1Y = step0.offsetTop + nodeCenter;
      const node5Y = step4.offsetTop + nodeCenter;
      const totalHeight = Math.max(1, node5Y - node1Y);
      totalLineHeightRef.current = totalHeight;

      setLineMetrics({ top: node1Y, height: totalHeight });

      // Calculate relative threshold for each step node center
      const thresholds = stepRefs.current.map((el) => {
        if (!el) return 0;
        const nodeY = el.offsetTop + nodeCenter;
        return Math.max(0, Math.min(1, (nodeY - node1Y) / totalHeight));
      });
      stepThresholdsRef.current = thresholds;
    };

    const updateScrollTarget = () => {
      const step0 = stepRefs.current[0];
      if (!step0 || !timelineRef.current) return;

      const windowHeight = window.innerHeight;
      const triggerY = windowHeight * 0.68;

      const isSm = window.innerWidth >= 640;
      const nodeCenter = isSm ? 28 : 24;

      const rect0 = step0.getBoundingClientRect();
      const node1ViewportY = rect0.top + nodeCenter;

      const currentDistance = triggerY - node1ViewportY;
      const target = Math.max(
        0,
        Math.min(1, currentDistance / totalLineHeightRef.current)
      );
      targetProgressRef.current = target;
    };

    // Continuous 60/120 FPS lerp animation loop for liquid-smooth line descent
    const animate = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0001) {
        // High-precision silky damping factor (0.075 for ultra smooth luxury glide)
        const next = current + diff * 0.075;
        currentProgressRef.current = next;

        if (activeLineRef.current) {
          activeLineRef.current.style.transform = `scaleY(${Math.min(
            1,
            Math.max(0, next)
          )}) translateZ(0)`;
        }

        // Activate step nodes precisely when the line physically reaches them
        const thresholds = stepThresholdsRef.current;
        if (thresholds.length === 5) {
          setReachedSteps((prev) => {
            let changed = false;
            const updated = prev.map((val, idx) => {
              const isReached = next >= thresholds[idx] - 0.015;
              if (isReached !== val) changed = true;
              return isReached;
            });
            return changed ? updated : prev;
          });
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    measureLayout();
    updateScrollTarget();
    rafId = requestAnimationFrame(animate);

    // Re-check measurements on next tick once images or fonts settle
    const timer = setTimeout(() => {
      measureLayout();
      updateScrollTarget();
    }, 120);

    const onScroll = () => {
      updateScrollTarget();
    };

    const onResize = () => {
      measureLayout();
      updateScrollTarget();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const handleScrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("appointment-booking");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="bespoke-journey"
      className="relative w-full py-16 sm:py-24 lg:py-28 bg-[#ECEAE5] border-b border-[#E5E3DD] overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header: Uniform Luxury Serif Headline */}
        <div className="text-center mb-14 sm:mb-18 lg:mb-20">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
            FIVE STEPS TO A SINGULAR SUIT
          </h2>
        </div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative w-full mx-auto">
          {/* Vertical Connecting Line (Starts at Node 1 center, ends at Node 5 center) */}
          <div
            className="absolute left-[23px] sm:left-[27px] w-[2px] pointer-events-none z-0 overflow-hidden"
            style={{
              top: `${lineMetrics.top}px`,
              height: `${lineMetrics.height}px`,
            }}
            aria-hidden="true"
          >
            {/* Background Base Track (subtle muted line) */}
            <div className="absolute inset-0 w-full bg-[#D5D1C8]/60" />

            {/* GPU-Accelerated Silky Smooth Progress Line with Pure Momentum Lerp */}
            <div
              ref={activeLineRef}
              className="absolute top-0 left-0 w-full h-full bg-black origin-top will-change-transform"
              style={{
                transform: "scaleY(0) translateZ(0)",
                transformOrigin: "top center",
              }}
            />
          </div>

          {/* 5 Journey Steps - Opened sequentially on scroll trigger */}
          {JOURNEY_STEPS.map((step, index) => {
            const isReached = reachedSteps[index];

            return (
              <div
                key={step.stepNumber}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                className="relative pl-16 sm:pl-20 md:pl-24 pt-0.5 pb-14 sm:pb-18 lg:pb-22 last:pb-2"
              >
                {/* Circular Node centered on the vertical line - Always anchored at top-0 */}
                <div
                  className={`absolute left-0 top-0 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border z-20 transition-all duration-500 ease-out ${
                    isReached
                      ? "bg-black text-white border-black scale-100 shadow-md"
                      : "bg-white text-[#777777] border-[#D5D1C8] scale-95 shadow-none"
                  }`}
                >
                  <span className="font-sans font-semibold text-[17px] sm:text-[19px] leading-none select-none">
                    {step.stepNumber}
                  </span>
                </div>

                {/* Step Row Content: Left Side Text (Shifted Left), Right Side Photo */}
                <div
                  className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-14 items-center transition-all duration-700 ease-out ${
                    isReached
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8 pointer-events-none"
                  }`}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* Left Column: Text & Narrative */}
                  <div className="md:col-span-7 space-y-2.5 sm:space-y-3.5 pr-2 sm:pr-4">
                    {/* Step Title: Uniform Uppercase Luxury Serif */}
                    <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-[28px] font-bold text-black uppercase tracking-[0.08em] leading-snug">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-[14px] lg:text-[15px] text-[#555555] font-normal leading-[1.8] max-w-xl">
                      {step.description}
                    </p>

                    {/* Sub-label / Tag */}
                    <div className="pt-1.5 font-sans">
                      {step.tagLink ? (
                        step.tagLink.startsWith("#") ? (
                          <a
                            href={step.tagLink}
                            onClick={handleScrollToBooking}
                            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.24em] uppercase text-[#8C7355] hover:text-black transition-colors group/link cursor-pointer"
                          >
                            <span>{step.tag}</span>
                            <ArrowUpRight
                              size={12}
                              className="stroke-[2.2] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                            />
                          </a>
                        ) : (
                          <Link
                            href={step.tagLink}
                            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.24em] uppercase text-[#8C7355] hover:text-black transition-colors group/link cursor-pointer"
                          >
                            <span>{step.tag}</span>
                            <ArrowUpRight
                              size={12}
                              className="stroke-[2.2] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                            />
                          </Link>
                        )
                      ) : (
                        <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.24em] uppercase text-[#8C7355]">
                          {step.tag}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Step Image (Clean Framed Editorial Photo) */}
                  <div className="md:col-span-5 w-full">
                    <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full rounded-[14px] overflow-hidden border border-[#E5E3DD] bg-white shadow-sm group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.image}
                        alt={step.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
