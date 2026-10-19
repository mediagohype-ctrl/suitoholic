"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  image: string;
  tag: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Fabric Selection",
    description:
      "Curated swatches matched to your occasion, season, and the garment's purpose — with our guidance on what works.",
    image: "/process/01_fabric_selection.jpg",
    tag: "Egyptian Cotton & Luxury Weaves",
  },
  {
    step: "02",
    title: "Style & Design",
    description:
      "Every detail decided — collar, lapel, lining, buttons, embroidery, and length. Documented and confirmed before a single cut.",
    image: "/process/02_style_design.jpg",
    tag: "Collar, Cuffs & Monogram Spec",
  },
  {
    step: "03",
    title: "Measurement",
    description:
      "Taken in person, every time. Never from a size chart. Your posture, your proportions, your unique pattern.",
    image: "/process/03_measurement.jpg",
    tag: "30+ Precision Measurements",
  },
  {
    step: "04",
    title: "Cut & Stitch",
    description:
      "Cut by hand from your pattern. Assembled with the construction — canvas, interlining, embroidery — the garment needs.",
    image: "/process/04_cut_stitch.jpg",
    tag: "Master Hand-Shears & Single Needle",
  },
  {
    step: "05",
    title: "Trial Fitting",
    description:
      "You wear it. We check every point — shoulder, chest, waist, length. Corrections made before final construction.",
    image: "/process/05_trial_fitting.jpg",
    tag: "Basting Silhouette & Mirror Inspection",
  },
  {
    step: "06",
    title: "Final Delivery",
    description:
      "Pressed, inspected, handed over. Your pattern stays on file — every future order is faster, every fit more certain.",
    image: "/process/06_final_delivery.jpg",
    tag: "Signature Monogrammed Box",
  },
];

export default function BespokeProcessTimeline() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const handleScrollToConsult = () => {
    const target =
      document.getElementById("appointment-booking") ||
      document.getElementById("curated-looks") ||
      document.getElementById("fabrics");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else if (typeof window !== "undefined") {
      window.location.href = "/custom-shirt#appointment-booking";
    }
  };

  const handleOpenModal = (index: number) => {
    setModalIndex(index);
  };

  const handleCloseModal = useCallback(() => {
    setModalIndex(null);
  }, []);

  const handlePrevStep = useCallback(() => {
    setModalIndex((prev) =>
      prev === null ? null : prev === 0 ? PROCESS_STEPS.length - 1 : prev - 1
    );
  }, []);

  const handleNextStep = useCallback(() => {
    setModalIndex((prev) =>
      prev === null ? null : prev === PROCESS_STEPS.length - 1 ? 0 : prev + 1
    );
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (modalIndex === null) return;
      if (e.key === "Escape") handleCloseModal();
      if (e.key === "ArrowLeft") handlePrevStep();
      if (e.key === "ArrowRight") handleNextStep();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalIndex, handleCloseModal, handlePrevStep, handleNextStep]);

  return (
    <section className="relative w-full bg-[#ECEAE5] text-black py-16 sm:py-24 border-y border-[#E5E3DD]">
      <div className="relative z-10 max-w-[1740px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: STICKY / FIXED DISPLAY                                       */}
          {/* ========================================================================= */}
          <div
            className="md:col-span-5 sticky top-24 self-start py-2 sm:py-4 z-20"
            style={{
              position: "sticky",
              top: "96px",
              alignSelf: "flex-start",
            }}
          >
            {/* Eyebrow Label */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E3DD] text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] rounded-full shadow-xs mb-4"
            >
              <span>OUR PROVEN METHODOLOGY</span>
            </div>

            {/* Headline */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-bold uppercase tracking-[0.025em] text-black leading-[1.08] mb-6 sm:mb-8">
              HOW WE
              <br />
              TAILOR
              <br />
              <span className="italic font-normal text-neutral-700">
                PERFECTION.
              </span>
            </h2>

            {/* Tagline / Subtitle */}
            <div className="border-l-2 border-black pl-4 py-1 space-y-1.5">
              <p className="text-sm sm:text-base font-semibold text-black">
                From First Measure to Final Delivery.
              </p>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-sm">
                Clear enough to trust. Exacting enough for timeless bespoke elegance.
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: SCROLLING STEP ROWS                                         */}
          {/* ========================================================================= */}
          <div
            className="md:col-span-7 border-t border-[#E5E3DD]"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {PROCESS_STEPS.map((item, index) => (
              <div
                key={item.step}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => handleOpenModal(index)}
                className="relative py-10 sm:py-12 lg:py-14 border-b border-[#E5E3DD] transition-colors duration-300 hover:bg-white/90 rounded-2xl px-4 sm:px-6 group cursor-pointer select-none"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6 lg:gap-8">
                  {/* Step Number (01, 02, etc.) */}
                  <div className="text-xs sm:text-sm font-mono tracking-widest w-10 sm:w-14 flex-shrink-0 text-[#888888] group-hover:text-black group-hover:font-bold transition-colors duration-200">
                    {item.step}
                  </div>

                  {/* Step Title */}
                  <div className="w-auto sm:w-64 lg:w-72 flex-shrink-0">
                    <h3 className="text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight whitespace-nowrap sm:whitespace-normal text-black group-hover:translate-x-1 transition-all duration-200 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 max-w-md pt-1 sm:pt-0">
                    <p className="text-xs sm:text-[13.5px] text-[#666666] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Animated Indicator Line */}
                <div className="absolute bottom-[-1px] left-0 h-[2px] w-0 group-hover:w-full bg-black z-10 transition-all duration-700 ease-out pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT-SIDE FIXED HOVER IMAGE PREVIEW                                      */}
      {/* ========================================================================= */}
      <div
        className={`fixed right-4 sm:right-8 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 z-40 hidden md:block pointer-events-none transition-all duration-300 ease-out ${
          hoveredIndex !== null
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 translate-x-6 pointer-events-none"
        }`}
      >
        {hoveredIndex !== null && (
          <div
            className="w-[300px] sm:w-[350px] lg:w-[380px] overflow-hidden shadow-2xl border border-[#E5E3DD] bg-black rounded-2xl"
          >
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900"
            >
              <img
                src={PROCESS_STEPS[hoveredIndex].image}
                alt={PROCESS_STEPS[hoveredIndex].title}
                className="w-full h-full object-cover"
              />

              {/* Vignette Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
              />

              {/* Top Step Badge */}
              <div
                className="absolute top-3 left-3 px-3 py-1 bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono tracking-widest uppercase rounded-full"
              >
                Step {PROCESS_STEPS[hoveredIndex].step}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300 mb-0.5">
                  {PROCESS_STEPS[hoveredIndex].tag}
                </div>
                <div className="text-lg font-medium text-white leading-snug">
                  {PROCESS_STEPS[hoveredIndex].title}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN LIGHTBOX MODAL                                                */}
      {/* ========================================================================= */}
      {modalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-3xl bg-white text-black overflow-hidden shadow-2xl border border-[#E5E3DD] rounded-[24px] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E3DD] bg-[#F5F4F0]">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 bg-black text-white text-xs font-mono font-bold tracking-widest rounded-full"
                >
                  STEP {PROCESS_STEPS[modalIndex].step}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-black">
                  {PROCESS_STEPS[modalIndex].tag}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 hover:bg-neutral-200 text-black transition-colors rounded-full cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black overflow-hidden">
              <img
                src={PROCESS_STEPS[modalIndex].image}
                alt={PROCESS_STEPS[modalIndex].title}
                className="w-full h-full object-cover"
              />

              {/* Prev / Next Buttons */}
              <button
                type="button"
                onClick={handlePrevStep}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black text-white rounded-full backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
                aria-label="Previous step"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 hover:bg-black text-white rounded-full backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
                aria-label="Next step"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Modal Details Footer */}
            <div className="p-6 sm:p-8 bg-white">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-black mb-2 font-serif-luxury">
                {PROCESS_STEPS[modalIndex].title}
              </h3>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-2xl mb-6">
                {PROCESS_STEPS[modalIndex].description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E5E3DD]">
                <span className="text-xs font-mono text-[#888888]">
                  Step {modalIndex + 1} of {PROCESS_STEPS.length} in Suitoholic Bespoke Craftsmanship
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    handleScrollToConsult();
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-7 py-3 bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.16em] uppercase rounded-full transition-all duration-300 shadow-sm hover:shadow cursor-pointer"
                >
                  <span>Book Consult</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
