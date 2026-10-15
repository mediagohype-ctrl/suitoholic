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
    <section className="relative w-full bg-gradient-to-b from-[#FBF8F3] via-[#FAF6F0] to-[#F7F2EB] text-[#14110E] py-16 sm:py-24 border-y border-[#E3D4C4]">
      {/* Subtle Bespoke Pattern Paper Grid (Suitoholic Light Palette) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.20]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(140, 90, 40, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(140, 90, 40, 0.16) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: STICKY / FIXED DISPLAY (Website Tailor Palette)              */}
          {/* ========================================================================= */}
          <div
            className="md:col-span-5 md:sticky md:top-24 md:self-start py-2 sm:py-4 z-10"
            style={{
              position: "sticky",
              top: "96px",
              alignSelf: "flex-start",
            }}
          >
            {/* Eyebrow Label matching Suitoholic Brand Gold */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF4EB] border border-[#C59B6A]/80 text-[#8C5A28] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.24em] shadow-2xs mb-4">
              <span>OUR PROVEN METHODOLOGY</span>
            </div>

            {/* Giant Bold Headline with signature gold accent text */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[68px] font-black uppercase tracking-tight text-[#14110E] leading-[0.94] mb-6 sm:mb-8 font-sans">
              HOW WE
              <br />
              TAILOR
              <br />
              <span className="font-serif italic font-normal text-[#8C5A28]">
                PERFECTION.
              </span>
            </h2>

            {/* Tagline / Subtitle with Suitoholic Gold Border Accent */}
            <div className="border-l-2 border-[#8C5A28] pl-4 py-1 space-y-1.5 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base font-semibold text-[#14110E]">
                From First Measure to Final Delivery.
              </p>
              <p className="text-xs sm:text-sm text-[#524436] leading-relaxed max-w-sm">
                Clear enough to trust. Exacting enough for timeless bespoke elegance.
              </p>
            </div>

            {/* Book Consult Action Button: Website Gold Palette (#C59B6A / #B38753) */}
            <div>
              <button
                type="button"
                onClick={handleScrollToConsult}
                className="inline-flex items-center space-x-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#C59B6A] hover:bg-[#B38753] active:scale-[0.99] text-[#14110E] text-xs sm:text-sm font-bold tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer rounded-lg group"
              >
                <span>Book Consult</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#14110E]"
                />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SCROLLING STEP ROWS (Suitoholic Dividers and Gold Accents)  */}
          {/* ========================================================================= */}
          <div className="md:col-span-7 border-t border-[#E3D4C4]">
            {PROCESS_STEPS.map((item, index) => {
              const isActive = activeStep === item.step;

              return (
                <div
                  key={item.step}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                  data-step={item.step}
                  className={`relative py-12 sm:py-14 lg:py-18 border-b border-[#E3D4C4] transition-colors duration-300 ${
                    isActive ? "bg-[#FAF4EB]/80" : "hover:bg-[#FAF4EB]/40"
                  } px-2 sm:px-4 group`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 lg:gap-8">
                    {/* Step Number (01, 02, etc.) */}
                    <div
                      className={`text-xs sm:text-sm font-mono tracking-widest w-12 sm:w-16 flex-shrink-0 transition-colors duration-200 ${
                        isActive
                          ? "text-[#8C5A28] font-bold"
                          : "text-[#8C5A28]/70 group-hover:text-[#8C5A28]"
                      }`}
                    >
                      {item.step}
                    </div>

                    {/* Step Title */}
                    <div className="w-full sm:w-56 lg:w-64 flex-shrink-0">
                      <h3
                        className={`text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight transition-all duration-200 ${
                          isActive
                            ? "text-[#8C5A28] font-normal translate-x-1"
                            : "text-[#14110E] group-hover:text-[#8C5A28] group-hover:translate-x-1"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Step Description */}
                    <div className="flex-1 max-w-md">
                      <p className="text-xs sm:text-sm lg:text-[14px] text-[#524436] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* End-to-End Animated Accent Indicator Line in Suitoholic Tailor Gold */}
                  <div
                    className={`absolute bottom-[-1px] left-0 h-[2px] z-10 transition-all duration-700 ease-out pointer-events-none ${
                      isActive
                        ? "w-full bg-[#8C5A28]"
                        : "w-0 group-hover:w-full bg-[#8C5A28]"
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
