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
    <section className="relative w-full bg-[#FAF8F5] text-[#14110E] py-16 sm:py-20 lg:py-24 border-y border-[#E8DFD4] overflow-hidden">
      {/* Subtle Bespoke Graph / Atelier Grid Watermark (Light Theme) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.20]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(140, 105, 68, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(140, 105, 68, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        {/* Header Block: Eyebrow, Main Title, and Book Consult CTA Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-[#E8DFD4]/70">
          <div>
            {/* Eyebrow with gold square marker */}
            <div className="inline-flex items-center space-x-2.5 mb-3.5">
              <span className="w-2.5 h-2.5 bg-[#8C6944] inline-block shadow-xs" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.26em] text-[#8C6944]">
                HOW IT WORKS
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-serif text-[#14110E] font-medium tracking-tight leading-[1.15]">
              From First Measure
              <br />
              to Final Delivery
            </h2>
          </div>

          {/* Action Button: Book Consult */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handleScrollToConsult}
              className="inline-flex items-center space-x-2 px-7 sm:px-8 py-3.5 bg-[#B38344] hover:bg-[#8C6944] text-[#FAF8F5] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer rounded-xs group"
            >
              <span>Book Consult</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>

        {/* 6-Step Horizontal Process Flow */}
        <div className="relative pt-12 sm:pt-16">
          {/* Connecting Dotted Line across the steps (Desktop LG+) */}
          <div
            className="hidden lg:block absolute top-[79px] left-[7%] right-[7%] h-[1px] border-t border-dashed border-[#8C6944]/45 z-0 pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-5 relative z-10">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="flex flex-col items-center text-center group transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Circular Step Badge */}
                <div className="relative mb-5 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#8C6944]/55 bg-[#FAF8F5] flex items-center justify-center font-serif text-[#8C6944] text-base sm:text-lg font-semibold tracking-wider transition-all duration-300 shadow-xs group-hover:border-[#8C6944] group-hover:bg-[#F4ECE1] group-hover:scale-105 group-hover:shadow-md">
                    {item.step}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="font-serif text-lg sm:text-xl font-medium text-[#14110E] mb-2.5 transition-colors duration-200 group-hover:text-[#8C6944]">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-[13px] text-[#6E6259] leading-relaxed font-sans max-w-[260px] lg:max-w-none">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
