"use client";

import React from "react";
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
      {/* Subtle Bespoke Grid Pattern Watermark */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(74, 32, 42, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(74, 32, 42, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: STICKY / FIXED DISPLAY (Suitoholic Royal Maroon & Obsidian)  */}
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FAF4EB] border border-[#D8C7B7] text-[#4A202A] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] shadow-2xs mb-4">
              <span>OUR PROVEN METHODOLOGY</span>
            </div>

            {/* Headline with Royal Bespoke Burgundy Accent */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-semibold uppercase tracking-tight text-[#14110E] leading-[1.04] mb-6 sm:mb-8 font-sans">
              HOW WE
              <br />
              TAILOR
              <br />
              <span className="font-serif italic font-normal text-[#4A202A]">
                PERFECTION.
              </span>
            </h2>

            {/* Tagline / Subtitle with Royal Burgundy Left Border Accent */}
            <div className="border-l-2 border-[#4A202A] pl-4 py-1 space-y-1.5 mb-6 sm:mb-8">
              <p className="text-sm sm:text-base font-semibold text-[#14110E]">
                From First Measure to Final Delivery.
              </p>
              <p className="text-xs sm:text-sm text-[#5A4E42] leading-relaxed max-w-sm">
                Clear enough to trust. Exacting enough for timeless bespoke elegance.
              </p>
            </div>

            {/* Signature Suitoholic Luxury Obsidian Button */}
            <div>
              <button
                type="button"
                onClick={handleScrollToConsult}
                className="inline-flex items-center space-x-2.5 px-7 sm:px-8 py-3.5 bg-[#14110E] hover:bg-[#4A202A] active:scale-[0.99] text-[#FAF8F5] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer rounded-lg group"
              >
                <span>Book Consult</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#FAF8F5]"
                />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SCROLLING STEP ROWS (Royal Burgundy Hover Transitions)      */}
          {/* ========================================================================= */}
          <div className="md:col-span-7 border-t border-[#E3D4C4]">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="relative py-10 sm:py-12 lg:py-14 border-b border-[#E3D4C4] transition-colors duration-300 hover:bg-[#FAF4EB]/70 px-3 sm:px-6 group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 lg:gap-8">
                  {/* Step Number (01, 02, etc.) */}
                  <div className="text-xs sm:text-sm font-mono tracking-widest w-10 sm:w-14 flex-shrink-0 text-[#7A6B5D] group-hover:text-[#4A202A] group-hover:font-bold transition-colors duration-200">
                    {item.step}
                  </div>

                  {/* Step Title */}
                  <div className="w-auto sm:w-64 lg:w-72 flex-shrink-0">
                    <h3 className="text-xl sm:text-2xl lg:text-[26px] font-medium tracking-tight whitespace-nowrap sm:whitespace-normal text-[#14110E] group-hover:text-[#4A202A] group-hover:translate-x-1 transition-all duration-200 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 max-w-md pt-1 sm:pt-0">
                    <p className="text-xs sm:text-[13.5px] text-[#5A4E42] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* End-to-End Animated Accent Indicator Line in Suitoholic Royal Maroon */}
                <div className="absolute bottom-[-1px] left-0 h-[2px] w-0 group-hover:w-full bg-[#4A202A] z-10 transition-all duration-700 ease-out pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
