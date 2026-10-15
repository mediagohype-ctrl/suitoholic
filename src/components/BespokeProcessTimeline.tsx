"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Fabric Selection",
    description:
      "Curated swatches matched to your occasion, season, and the garment's purpose — with our guidance on what works.",
  },
  {
    step: "02",
    title: "Style & Design",
    description:
      "Every detail decided — collar, lapel, lining, buttons, embroidery, and length. Documented and confirmed before a single cut.",
  },
  {
    step: "03",
    title: "Measurement",
    description:
      "Taken in person, every time. Never from a size chart. Your posture, your proportions, your unique pattern.",
  },
  {
    step: "04",
    title: "Cut & Stitch",
    description:
      "Cut by hand from your pattern. Assembled with the construction — canvas, interlining, embroidery — the garment needs.",
  },
  {
    step: "05",
    title: "Trial Fitting",
    description:
      "You wear it. We check every point — shoulder, chest, waist, length. Corrections made before final construction.",
  },
  {
    step: "06",
    title: "Final Delivery",
    description:
      "Pressed, inspected, handed over. Your pattern stays on file — every future order is faster, every fit more certain.",
  },
];

export default function BespokeProcessTimeline() {
  const [activeStep, setActiveStep] = useState<string>("01");
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepId = entry.target.getAttribute("data-step");
            if (stepId) setActiveStep(stepId);
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.15,
      }
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToConsult = () => {
    const target =
      document.getElementById("appointment-booking") ||
      document.getElementById("curated-looks") ||
      document.getElementById("fabrics");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-[#FAF8F5] text-[#14110E] py-16 sm:py-24 border-y border-[#E8DFD4]">
      {/* Subtle Bespoke Grid Pattern Watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(140, 105, 68, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(140, 105, 68, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: STICKY / FIXED DISPLAY (Pins as user scrolls, matches ref)   */}
          {/* ========================================================================= */}
          <div
            className="md:col-span-5 md:sticky md:top-24 md:self-start py-2 sm:py-4 z-10"
            style={{
              position: "sticky",
              top: "96px",
              alignSelf: "flex-start",
            }}
          >
            {/* Eyebrow Label */}
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[#C56337] mb-3 sm:mb-4">
              OUR PROVEN METHODOLOGY
            </div>

            {/* Giant Bold Headline matching reference typography */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-black uppercase tracking-tight text-[#14110E] leading-[0.94] mb-6 sm:mb-8 font-sans">
              HOW WE
              <br />
              TAILOR
              <br />
              <span className="font-serif italic font-normal text-[#C56337]">
                PERFECTION.
              </span>
            </h2>

            {/* Tagline / Subtitle with Left Border Accent */}
            <div className="border-l-2 border-[#C56337] pl-4 py-1 space-y-1.5 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base font-semibold text-[#14110E]">
                From First Measure to Final Delivery.
              </p>
              <p className="text-xs sm:text-sm text-[#6E6259] leading-relaxed max-w-sm">
                Clear enough to trust. Exacting enough for timeless bespoke elegance.
              </p>
            </div>

            {/* Book Consult Action Button */}
            <div>
              <button
                type="button"
                onClick={handleScrollToConsult}
                className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#C56337] hover:bg-[#A94F27] text-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer rounded-xs group"
              >
                <span>Book Consult</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SCROLLING STEP ROWS (Spacious rows that scroll freely)      */}
          {/* ========================================================================= */}
          <div className="md:col-span-7 border-t border-[#E5DDD2]">
            {PROCESS_STEPS.map((item, index) => {
              const isActive = activeStep === item.step;

              return (
                <div
                  key={item.step}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  data-step={item.step}
                  className={`relative py-12 sm:py-14 lg:py-18 border-b border-[#E5DDD2] transition-colors duration-300 ${
                    isActive ? "bg-[#F5EFE6]/40" : "hover:bg-[#FAF5ED]/50"
                  } px-2 sm:px-4 group`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 lg:gap-8">
                    {/* Step Number (01, 02, etc.) */}
                    <div
                      className={`text-xs sm:text-sm font-mono tracking-widest w-12 sm:w-16 flex-shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-[#C56337] font-bold"
                          : "text-[#8C6944]/80 group-hover:text-[#C56337]"
                      }`}
                    >
                      {item.step}
                    </div>

                    {/* Step Title (Large, Clean Typography) */}
                    <div className="w-full sm:w-56 lg:w-64 flex-shrink-0">
                      <h3
                        className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight transition-all duration-200 ${
                          isActive
                            ? "text-[#C56337] font-normal translate-x-1"
                            : "text-[#14110E] group-hover:text-[#C56337] group-hover:translate-x-1"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Step Description */}
                    <div className="flex-1 max-w-md">
                      <p className="text-xs sm:text-sm lg:text-[14px] text-[#6E6259] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Active / Hover Left Accent Indicator Line */}
                  <div
                    className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ${
                      isActive
                        ? "w-16 bg-[#C56337]"
                        : "w-0 group-hover:w-12 bg-[#C56337]/60"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
