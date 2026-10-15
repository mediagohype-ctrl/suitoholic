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
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF4EB] border border-[#D8C7B7] text-[#4A202A] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] shadow-2xs mb-4"
              style={{ borderRadius: "7px" }}
            >
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
                style={{ borderRadius: "7px" }}
                className="inline-flex items-center space-x-2.5 px-7 sm:px-8 py-3.5 bg-[#14110E] hover:bg-[#4A202A] active:scale-[0.99] text-[#FAF8F5] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group"
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
          {/* RIGHT COLUMN: SCROLLING STEP ROWS (Original Restored Layout)              */}
          {/* ========================================================================= */}
          <div
            className="md:col-span-7 border-t border-[#E3D4C4]"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {PROCESS_STEPS.map((item, index) => (
              <div
                key={item.step}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => handleOpenModal(index)}
                className="relative py-10 sm:py-12 lg:py-14 border-b border-[#E3D4C4] transition-colors duration-300 hover:bg-[#FAF4EB]/70 px-3 sm:px-6 group cursor-pointer select-none"
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

      {/* ========================================================================= */}
      {/* RIGHT-SIDE FIXED HOVER IMAGE PREVIEW (Near Right Screen Edge, Fixed Spot)  */}
      {/* ========================================================================= */}
      <div
        className={`fixed right-4 sm:right-8 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 z-40 hidden md:block pointer-events-none transition-all duration-300 ease-out ${
          hoveredIndex !== null
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 translate-x-6 pointer-events-none"
        }`}
        style={{ borderRadius: "7px" }}
      >
        {hoveredIndex !== null && (
          <div
            className="w-[300px] sm:w-[350px] lg:w-[380px] overflow-hidden shadow-[0_20px_50px_rgba(20,17,14,0.38)] border border-[#4A202A]/30 bg-[#14110E]"
            style={{ borderRadius: "7px" }}
          >
            {/* Image Container with 7px Border Radius */}
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-[#1D1916]"
              style={{ borderRadius: "7px" }}
            >
              <img
                src={PROCESS_STEPS[hoveredIndex].image}
                alt={PROCESS_STEPS[hoveredIndex].title}
                className="w-full h-full object-cover"
                style={{ borderRadius: "7px" }}
              />

              {/* Luxury Dark Vignette Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"
                style={{ borderRadius: "7px" }}
              />

              {/* Top Step Badge with 7px Border Radius */}
              <div
                className="absolute top-3 left-3 px-2.5 py-1 bg-[#14110E]/85 backdrop-blur-md border border-[#FAF8F5]/20 text-[#FAF8F5] text-[10px] font-mono tracking-widest uppercase"
                style={{ borderRadius: "7px" }}
              >
                Step {PROCESS_STEPS[hoveredIndex].step}
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3.5 left-4 right-4 text-white">
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D8C7B7] mb-0.5">
                  {PROCESS_STEPS[hoveredIndex].tag}
                </div>
                <div className="text-lg font-medium text-[#FAF8F5] leading-snug">
                  {PROCESS_STEPS[hoveredIndex].title}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL-SCREEN LIGHTBOX MODAL (On Step Click / Mobile Tap)                   */}
      {/* ========================================================================= */}
      {modalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FAF8F5] text-[#14110E] overflow-hidden shadow-2xl border border-[#D8C7B7] animate-in zoom-in-95 duration-200"
            style={{ borderRadius: "7px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3D4C4] bg-[#FAF4EB]">
              <div className="flex items-center gap-3">
                <span
                  className="px-2.5 py-1 bg-[#4A202A] text-[#FAF8F5] text-xs font-mono font-bold tracking-widest"
                  style={{ borderRadius: "7px" }}
                >
                  STEP {PROCESS_STEPS[modalIndex].step}
                </span>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#4A202A]">
                  {PROCESS_STEPS[modalIndex].tag}
                </span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 hover:bg-[#E3D4C4]/60 text-[#14110E] transition-colors cursor-pointer"
                style={{ borderRadius: "7px" }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#14110E] overflow-hidden">
              <img
                src={PROCESS_STEPS[modalIndex].image}
                alt={PROCESS_STEPS[modalIndex].title}
                className="w-full h-full object-cover"
              />

              {/* Prev / Next Buttons */}
              <button
                type="button"
                onClick={handlePrevStep}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black/85 text-white backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
                style={{ borderRadius: "7px" }}
                aria-label="Previous step"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/60 hover:bg-black/85 text-white backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
                style={{ borderRadius: "7px" }}
                aria-label="Next step"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Modal Details Footer */}
            <div className="p-6 sm:p-8 bg-[#FAF8F5]">
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#14110E] mb-2 font-sans">
                {PROCESS_STEPS[modalIndex].title}
              </h3>
              <p className="text-sm sm:text-base text-[#5A4E42] leading-relaxed max-w-2xl mb-6">
                {PROCESS_STEPS[modalIndex].description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E3D4C4]">
                <span className="text-xs font-mono text-[#7A6B5D]">
                  Step {modalIndex + 1} of {PROCESS_STEPS.length} in Suitoholic Bespoke Craftsmanship
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    handleScrollToConsult();
                  }}
                  style={{ borderRadius: "7px" }}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#14110E] hover:bg-[#4A202A] text-[#FAF8F5] text-xs font-bold tracking-[0.16em] uppercase transition-all duration-300 shadow-sm"
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
