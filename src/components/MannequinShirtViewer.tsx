"use client";

import React from "react";

export interface MannequinShirtViewerProps {
  chestSize: number;
  bodyFit: "lean" | "regular" | "tummy";
  height?: string;
  sleeveType?: "full" | "half";
  collarStyle?: string;
  cuffStyle?: string;
  pocket?: "pocket" | "no-pocket";
  initials?: string;
  threadColor?: string;
  currentStep?: number;
}

export default function MannequinShirtViewer({
  chestSize = 38,
  bodyFit = "lean",
  height = "TALL HEIGHT (5.8 - 5.10\")",
  sleeveType = "full",
  currentStep = 4,
}: MannequinShirtViewerProps) {
  // Calculated stomach measurement values
  const stomachSizeLean = chestSize - 4;
  const stomachSizeRegular = chestSize - 2;
  const stomachSizeTummy = `${chestSize + 1}" – ${chestSize + 2}"`;

  const currentStomachValue =
    bodyFit === "lean"
      ? `${stomachSizeLean}"`
      : bodyFit === "regular"
      ? `${stomachSizeRegular}"`
      : `${stomachSizeTummy}`;

  // Dynamic visual parameters based on bodyFit
  const fitConfig = {
    lean: {
      waistScaleX: 1.0,
      stomachArrowWidth: 175,
      label: "LEAN FIT",
      waistDesc: "Slim Tapered Torso",
      stomachGlowOpacity: "0.0",
    },
    regular: {
      waistScaleX: 1.075,
      stomachArrowWidth: 212,
      label: "REGULAR FIT",
      waistDesc: "Classic Natural Drape",
      stomachGlowOpacity: "0.15",
    },
    tummy: {
      waistScaleX: 1.155,
      stomachArrowWidth: 252,
      label: "TUMMY COMFORT FIT",
      waistDesc: "Relaxed Stomach Silhouette",
      stomachGlowOpacity: "0.28",
    },
  }[bodyFit];

  // Dynamic visual height scaling factors
  const heightConfig = height.toLowerCase().includes("extra")
    ? { scaleY: 1.055, length: "30.5\"", sleeve: "26.5\"", label: "Extra Tall" }
    : height.toLowerCase().includes("regular") || height.toLowerCase().includes("5.5") || height.toLowerCase().includes("standard")
    ? { scaleY: 0.96, length: "27.5\"", sleeve: "23.75\"", label: "Regular Height" }
    : { scaleY: 1.0, length: "29\"", sleeve: "24.5\"", label: "Tall Height" };

  const isHalfSleeve = sleeveType === "half";

  return (
    <div className="relative w-full max-w-[480px] mx-auto flex flex-col items-center justify-center select-none py-2 sm:py-4">
      
      {/* 3D Interactive Mannequin Shirt Container */}
      <div className="relative w-full aspect-[4/4.8] sm:aspect-[4/4.5] max-h-[460px] flex items-center justify-center">
        
        {/* Dynamic Studio Ambient Glow behind Mannequin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full bg-[#FAF5EC]/70 blur-2xl transform -translate-y-4 transition-all duration-700"
            style={{
              transform: `scale(${bodyFit === "tummy" ? 1.08 : bodyFit === "regular" ? 1.03 : 1.0})`,
            }}
          />
        </div>

        {/* Photorealistic Mannequin Shirt with Dynamic Stomach, Height & Sleeve Morphing */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          
          {/* Base High-Fidelity Mannequin Shirt Layer */}
          <div
            className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
            style={{
              transformOrigin: "center 50%",
            }}
          >
            {/* SVG ClipPath Definition for Tailored Half Sleeve Cut */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
              <defs>
                <clipPath id="halfSleeveCut" clipPathUnits="objectBoundingBox">
                  <path d="M 0.20 0 L 0.80 0 C 0.86 0.12 0.96 0.22 0.97 0.44 C 0.90 0.48 0.79 0.49 0.74 0.45 L 0.73 0.98 C 0.64 0.99 0.36 0.99 0.27 0.98 L 0.26 0.45 C 0.21 0.49 0.10 0.48 0.03 0.44 C 0.04 0.22 0.14 0.12 0.20 0 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/custom_fit_shirt_hq.png"
              alt="3D Bespoke Tailored Shirt on Mannequin"
              className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(20,17,14,0.28)] transition-all duration-700 ease-out"
              style={{
                filter:
                  bodyFit === "tummy"
                    ? "contrast(1.02) drop-shadow(0 22px 38px rgba(20,17,14,0.32))"
                    : bodyFit === "regular"
                    ? "contrast(1.01) drop-shadow(0 20px 35px rgba(20,17,14,0.28))"
                    : "contrast(1.0) drop-shadow(0 18px 32px rgba(20,17,14,0.25))",
                transform: `scaleX(${fitConfig.waistScaleX}) scaleY(${heightConfig.scaleY})`,
                transformOrigin: "center 55%",
                clipPath: isHalfSleeve ? "url(#halfSleeveCut)" : "none",
              }}
              loading="eager"
            />

            {/* Tailored Short-Sleeve Folded Hem & Cuff Overlays when Half-Sleeve is Selected */}
            {isHalfSleeve && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-500 flex items-center justify-center"
                style={{
                  transform: `scaleX(${fitConfig.waistScaleX}) scaleY(${heightConfig.scaleY})`,
                  transformOrigin: "center 55%",
                }}
              >
                <svg viewBox="0 0 400 480" className="w-full h-full">
                  {/* Left Half-Sleeve Folded Hem Cuff & Tailored Stitching */}
                  <g className="transition-all duration-500">
                    <path
                      d="M 38 208 Q 66 216 94 206"
                      stroke="#B8A896"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      className="drop-shadow-xs"
                    />
                    <path
                      d="M 38 205 Q 66 213 94 203"
                      stroke="#E5DCD0"
                      strokeWidth="1.2"
                      strokeDasharray="2.5 2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 40 212 Q 66 220 92 210"
                      stroke="#7D6954"
                      strokeWidth="0.8"
                      opacity="0.4"
                      fill="none"
                    />
                  </g>

                  {/* Right Half-Sleeve Folded Hem Cuff & Tailored Stitching */}
                  <g className="transition-all duration-500">
                    <path
                      d="M 306 206 Q 334 216 362 208"
                      stroke="#B8A896"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      fill="none"
                      className="drop-shadow-xs"
                    />
                    <path
                      d="M 306 203 Q 334 213 362 205"
                      stroke="#E5DCD0"
                      strokeWidth="1.2"
                      strokeDasharray="2.5 2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d="M 308 210 Q 334 220 360 212"
                      stroke="#7D6954"
                      strokeWidth="0.8"
                      opacity="0.4"
                      fill="none"
                    />
                  </g>
                </svg>
              </div>
            )}

            {/* Subtle natural fabric tension & soft waist shadow expansion for Regular & Tummy fits */}
            {bodyFit !== "lean" && (
              <div
                className="absolute inset-x-0 top-[48%] h-[32%] pointer-events-none transition-opacity duration-700 flex items-center justify-center"
                style={{ opacity: fitConfig.stomachGlowOpacity }}
              >
                <div className="w-[68%] h-full rounded-full bg-gradient-to-r from-transparent via-[#EADCCE]/30 to-transparent blur-md" />
              </div>
            )}
          </div>

          {/* REAL-TIME MEASUREMENT DIMENSION ARROWS (Displayed on Steps 1, 2, 3) */}
          {currentStep <= 3 && (
            <svg
              viewBox="0 0 400 480"
              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
              aria-hidden="true"
            >
              <defs>
                {/* Left Arrow Marker */}
                <marker
                  id="arrowLeft"
                  viewBox="0 0 10 10"
                  refX="2"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 10 1.5 L 1.5 5 L 10 8.5 Z" fill="#14110E" />
                </marker>

                {/* Right Arrow Marker */}
                <marker
                  id="arrowRight"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1.5 L 8.5 5 L 0 8.5 Z" fill="#14110E" />
                </marker>
              </defs>

              {/* 1. CHEST MEASUREMENT ARROW (Across Chest y: ~155) */}
              <g className="transition-all duration-500 ease-out">
                {/* Left segment of chest arrow */}
                <line
                  x1="100"
                  y1="160"
                  x2="162"
                  y2="160"
                  stroke="#14110E"
                  strokeWidth="1.75"
                  markerStart="url(#arrowLeft)"
                  className="transition-all duration-500"
                />

                {/* Chest Dimension Text */}
                <text
                  x="200"
                  y="166"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="800"
                  fontFamily="system-ui, -apple-system, sans-serif"
                  fill="#14110E"
                  className="select-none tracking-tight"
                >
                  {chestSize}&quot;
                </text>

                {/* Right segment of chest arrow */}
                <line
                  x1="238"
                  y1="160"
                  x2="300"
                  y2="160"
                  stroke="#14110E"
                  strokeWidth="1.75"
                  markerEnd="url(#arrowRight)"
                  className="transition-all duration-500"
                />
              </g>

              {/* 2. STOMACH / WAIST MEASUREMENT ARROW (Across Stomach y: ~275) */}
              <g className="transition-all duration-600 ease-out">
                {(() => {
                  const halfWidth = fitConfig.stomachArrowWidth / 2;
                  const textMargin = bodyFit === "tummy" ? 48 : 34;
                  const xLeftStart = 200 - halfWidth;
                  const xLeftEnd = 200 - textMargin;
                  const xRightStart = 200 + textMargin;
                  const xRightEnd = 200 + halfWidth;

                  const stomachY = 275 * heightConfig.scaleY;

                  return (
                    <>
                      {/* Left segment of stomach arrow with smooth transition */}
                      <line
                        x1={xLeftStart}
                        y1={stomachY}
                        x2={xLeftEnd}
                        y2={stomachY}
                        stroke="#14110E"
                        strokeWidth="1.75"
                        markerStart="url(#arrowLeft)"
                        className="transition-all duration-500 ease-out"
                      />

                      {/* Stomach Dimension Text with Real-Time Update */}
                      <text
                        x="200"
                        y={stomachY + 6}
                        textAnchor="middle"
                        fontSize="22"
                        fontWeight="800"
                        fontFamily="system-ui, -apple-system, sans-serif"
                        fill="#14110E"
                        className="select-none tracking-tight transition-all duration-300"
                      >
                        {currentStomachValue}
                      </text>

                      {/* Right segment of stomach arrow with smooth transition */}
                      <line
                        x1={xRightStart}
                        y1={stomachY}
                        x2={xRightEnd}
                        y2={stomachY}
                        stroke="#14110E"
                        strokeWidth="1.75"
                        markerEnd="url(#arrowRight)"
                        className="transition-all duration-500 ease-out"
                      />
                    </>
                  );
                })()}
              </g>
            </svg>
          )}
        </div>

      </div>

      {/* Floating Active Fit, Height & Sleeve Status Pill below mannequin */}
      <div className="mt-1 flex flex-wrap items-center justify-center gap-2 bg-[#EFE2D4]/95 border border-[#D0BDA9] px-3.5 py-1.5 rounded-full shadow-sm text-xs backdrop-blur-xs transition-all duration-300">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#7A4B1A] animate-pulse" />
          <span className="font-bold text-[#14110E] tracking-wider uppercase text-[11px]">
            {fitConfig.label}
          </span>
          <span className="text-[#8C6D47]">({currentStomachValue})</span>
        </div>
        <span className="text-[#8C6D47]">•</span>
        <div className="flex items-center space-x-1 text-[#5A4E42] text-[10.5px]">
          <span>{heightConfig.label}</span>
          <span>•</span>
          <span className="font-semibold uppercase text-[#14110E]">{isHalfSleeve ? "Half Sleeve" : "Full Sleeve"}</span>
        </div>
      </div>

    </div>
  );
}
