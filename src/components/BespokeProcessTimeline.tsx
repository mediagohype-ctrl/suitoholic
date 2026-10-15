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
          {/* LEFT COLUMN: STICKY / FIXED DISPLAY (Refined Boldness & Elegance)         */}
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FAF4EB] border border-[#C59B6A]/80 text-[#8C5A28] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] shadow-2xs mb-4">
              <span>OUR PROVEN METHODOLOGY</span>
            </div>

            {/* Refined Headline: Reduced Boldness, Elegant Tailored Letter-spacing */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-semibold uppercase tracking-tight text-[#14110E] leading-[1.04] mb-6 sm:mb-8 font-sans">
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
          {/* RIGHT COLUMN: SCROLLING STEP ROWS (Hover-Only End-to-End Line, Exactly 1) */}
          {/* ========================================================================= */}
          <div className="md:col-span-7 border-t border-[#E3D4C4]">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="relative py-10 sm:py-12 lg:py-14 border-b border-[#E3D4C4] transition-colors duration-300 hover:bg-[#FAF4EB]/80 px-3 sm:px-6 group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 lg:gap-8">
                  {/* Step Number (01, 02, etc.) */}
                  <div className="text-xs sm:text-sm font-mono tracking-widest w-10 sm:w-14 flex-shrink-0 text-[#8C5A28]/70 group-hover:text-[#8C5A28] group-hover:font-bold transition-colors duration-200">
                    {item.step}
                  </div>

                  {/* Step Title: Single-Line, Proper Proportion, Clean Format */}
                  <div className="w-auto sm:w-64 lg:w-72 flex-shrink-0">
                    <h3 className="text-xl sm:text-2xl lg:text-[26px] font-medium tracking-tight whitespace-nowrap sm:whitespace-normal text-[#14110E] group-hover:text-[#8C5A28] group-hover:translate-x-1 transition-all duration-200 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Step Description: Aligned nicely with title */}
                  <div className="flex-1 max-w-md pt-1 sm:pt-0">
                    <p className="text-xs sm:text-[13.5px] text-[#524436] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* End-to-End Animated Accent Indicator Line: ONLY ON HOVER (Exactly 1 Line) */}
                <div className="absolute bottom-[-1px] left-0 h-[2px] w-0 group-hover:w-full bg-[#8C5A28] z-10 transition-all duration-700 ease-out pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
