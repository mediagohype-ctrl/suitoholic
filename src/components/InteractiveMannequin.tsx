"use client";

import React from "react";

export interface CustomFitState {
  chestSize: number;
  collarSize: number;
  shoulderSize: number;
  bodyFit: "lean" | "regular" | "tummy";
  height: string;
  sleeveType: "full" | "half";
  collarStyle: string;
  cuffStyle: string;
  pocket: "pocket" | "no-pocket";
  initials: string;
  threadColor?: string;
  shirtColor: string;
  shirtPattern: string;
  humanModelView?: boolean;
}

interface InteractiveMannequinProps {
  customFit: CustomFitState;
  showRotateControl?: boolean;
  onColorChange?: (color: string) => void;
  currentStep?: number;
}

export default function InteractiveMannequin({ customFit, currentStep }: InteractiveMannequinProps) {
  // Body fit stomach width scaling calculation
  let stomachWidth = 140; // Default lean
  let stomachCurve = 0;
  
  if (customFit.bodyFit === "regular") {
    stomachWidth = 158;
    stomachCurve = 8;
  } else if (customFit.bodyFit === "tummy") {
    stomachWidth = 178;
    stomachCurve = 18;
  }

  // Height & sleeve length dynamic factors
  const isTall = customFit.height?.includes("Tall") || customFit.height?.includes("6'");
  const isShort = customFit.height?.includes("Short") || customFit.height?.includes("5'4") || customFit.height?.includes("5'5");
  
  const shirtLength = isTall ? 320 : isShort ? 270 : 295;
  const sleeveLength = customFit.sleeveType === "half" ? 80 : (isTall ? 220 : isShort ? 185 : 200);

  // Shirt colors mapping matching luxury references
  const colorMap: Record<string, { body: string; shadow: string; stroke: string }> = {
    white: { body: "#FDFDFD", shadow: "#D5CEC4", stroke: "#C2B9AA" },
    navy: { body: "#1B2A4A", shadow: "#0F192E", stroke: "#2C4373" },
    pink: { body: "#E8B4B8", shadow: "#C98E93", stroke: "#D49CA2" },
    sky: { body: "#9BBECB", shadow: "#6F95A3", stroke: "#7BA3B2" },
    charcoal: { body: "#3A3D40", shadow: "#222426", stroke: "#515559" },
    beige: { body: "#D4C3A3", shadow: "#B3A07E", stroke: "#C2AF8C" },
    maroon: { body: "#5C1D24", shadow: "#3D1016", stroke: "#7A2B34" },
  };

  const activeColor = colorMap[customFit.shirtColor || "white"] || colorMap.white;

  // Thread colors mapping for initials preview (Image 10)
  const threadColorMap: Record<string, string> = {
    red: "#A61C1C",
    blue: "#1E40AF",
    black: "#1F1C18",
    rust: "#9A3412",
    grey: "#4B5563",
    gold: "#9E7D52",
  };
  const activeThreadColor = threadColorMap[customFit.threadColor || "blue"] || "#1E40AF";

  return (
    <div className="relative w-full h-full min-h-[420px] sm:min-h-[520px] flex items-center justify-center select-none overflow-hidden rounded-2xl">
      {/* Studio Stage Background Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAE3D2] via-[#E4DCC9] to-[#D8CFA7]/60 flex items-center justify-center">
        <div className="absolute w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] rounded-full bg-[#FAF6EE]/80 blur-2xl transform -translate-y-6" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#9E7D52_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      </div>

      {/* REFERENCE IMAGES 6, 7, 8, 9, 10: "YOUR SELECTION" FLOATING OVERLAY INSIDE THE LEFT VIEWPORT */}
      <div className="absolute top-4 right-4 z-30 bg-[#2C2621]/90 backdrop-blur-md text-[#EAE3D2] p-3 rounded-xl border border-[#9E7D52]/40 shadow-xl min-w-[150px]">
        <h5 className="text-[10px] font-bold tracking-widest text-[#C5A069] uppercase mb-1 border-b border-[#9E7D52]/30 pb-0.5">
          YOUR SELECTION
        </h5>
        <div className="space-y-0.5 text-[10px] font-medium">
          <div className="flex justify-between gap-2">
            <span className="text-[#D4C3A3]">Chest Size</span>
            <strong className="text-white">{customFit.chestSize}&quot;</strong>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-[#D4C3A3]">Body Type</span>
            <strong className="text-white capitalize">{customFit.bodyFit} Fit</strong>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-[#D4C3A3]">Height</span>
            <strong className="text-white">{customFit.height.split(" ")[0]}</strong>
          </div>
          {customFit.sleeveType && (
            <div className="flex justify-between gap-2">
              <span className="text-[#D4C3A3]">Sleeve</span>
              <strong className="text-white capitalize">{customFit.sleeveType} Sleeve</strong>
            </div>
          )}
          {customFit.collarStyle && (
            <div className="flex justify-between gap-2">
              <span className="text-[#D4C3A3]">Collar</span>
              <strong className="text-white">{customFit.collarStyle.split(" ")[0]}</strong>
            </div>
          )}
          {customFit.sleeveType === "full" && customFit.cuffStyle && (
            <div className="flex justify-between gap-2">
              <span className="text-[#D4C3A3]">Cuff</span>
              <strong className="text-white">{customFit.cuffStyle.split(" ")[0]}</strong>
            </div>
          )}
          {customFit.pocket && (
            <div className="flex justify-between gap-2">
              <span className="text-[#D4C3A3]">Pocket</span>
              <strong className="text-white">{customFit.pocket === "pocket" ? "With Pocket" : "Without Pocket"}</strong>
            </div>
          )}
        </div>
      </div>

      {/* REFERENCE IMAGE 10: Special Closeup View for Cuff Initials when on Monogram Step */}
      {currentStep === 6 && customFit.sleeveType === "full" ? (
        <div className="relative z-10 w-full h-[400px] flex flex-col items-center justify-center animate-fade-in p-4">
          {/* Detailed Close-Up Cuff Macro Render */}
          <div className="relative w-full max-w-[340px] h-[300px] bg-[#FAF6EE] rounded-2xl border-2 border-[#9E7D52] shadow-2xl p-6 flex flex-col justify-center items-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#9E7D52_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
            
            {/* 3D Cuff Macro Canvas */}
            <svg viewBox="0 0 200 160" className="w-full h-full filter drop-shadow-md">
              {/* Cuff Fabric Layer */}
              <path d="M 30 20 L 170 20 L 160 140 L 40 140 Z" fill="#FDFDFD" stroke="#C2B9AA" strokeWidth="2" />
              <path d="M 30 25 L 170 25" stroke="#E5E0D8" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Cufflink Button */}
              <circle cx="140" cy="80" r="10" fill="#1F1C18" stroke="#9E7D52" strokeWidth="2" />
              <circle cx="140" cy="80" r="6" fill="#4A453F" />

              {/* Monogram Initials Embroidered directly on cuff */}
              <text
                x="85"
                y="90"
                fontSize="28"
                fontFamily="Georgia, serif"
                fontWeight="bold"
                fill={activeThreadColor}
                textAnchor="middle"
                letterSpacing="4"
                className="uppercase filter drop-shadow-sm"
              >
                {customFit.initials || "A K"}
              </text>
            </svg>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9E7D52] mt-2">
              REAL-TIME MONOGRAM EMBROIDERY PREVIEW
            </span>
          </div>
        </div>
      ) : (
        /* Standard 3D Mannequin Render */
        <div className="relative z-10 w-full max-w-[400px] h-[380px] sm:h-[480px] flex items-center justify-center mannequin-wrapper transition-all duration-500 transform hover:scale-[1.02]">
          <svg viewBox="0 0 400 500" className="w-full h-full filter drop-shadow-[0_25px_25px_rgba(31,28,24,0.3)]">
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeColor.body} />
                <stop offset="50%" stopColor={activeColor.body} />
                <stop offset="100%" stopColor={activeColor.shadow} />
              </linearGradient>
            </defs>

            {/* Mannequin Neck */}
            <ellipse cx="200" cy="92" rx="26" ry="12" fill="#2C2621" stroke="#9E7D52" strokeWidth="1.5" />
            <path d="M 180 92 Q 200 110 220 92 L 216 115 Q 200 120 184 115 Z" fill="#3D352E" />

            {/* Shirt Torso */}
            <path
              d={`
                M 150 120 
                Q 200 135 250 120 
                L ${250 + (customFit.chestSize - 38) * 1.5} 170 
                Q ${240 + stomachCurve} ${220 + (shirtLength - 295) / 2} ${190 + stomachWidth / 2} ${shirtLength - 20}
                L ${210 - stomachWidth / 2} ${shirtLength - 20}
                Q ${160 - stomachCurve} ${220 + (shirtLength - 295) / 2} ${150 - (customFit.chestSize - 38) * 1.5} 170
                Z
              `}
              fill="url(#bodyGradient)"
              stroke={activeColor.stroke}
              strokeWidth="1.5"
              className="transition-all duration-500 ease-out"
            />

            {/* Left Sleeve */}
            {customFit.sleeveType === "full" ? (
              <g className="transition-all duration-300">
                <path
                  d={`M 150 120 C 130 160 115 220 105 ${120 + sleeveLength} L 125 ${120 + sleeveLength} C 135 220 145 170 162 145 Z`}
                  fill="url(#bodyGradient)"
                  stroke={activeColor.stroke}
                  strokeWidth="1.5"
                />
                <rect x="103" y={118 + sleeveLength} width="24" height="16" rx="2" fill={activeColor.body} stroke="#9E7D52" strokeWidth="1.5" />
              </g>
            ) : (
              <path d="M 150 120 C 135 145 125 170 120 190 L 140 195 C 145 175 155 150 162 145 Z" fill="url(#bodyGradient)" stroke={activeColor.stroke} strokeWidth="1.5" />
            )}

            {/* Right Sleeve */}
            {customFit.sleeveType === "full" ? (
              <g className="transition-all duration-300">
                <path
                  d={`M 250 120 C 270 160 285 220 295 ${120 + sleeveLength} L 275 ${120 + sleeveLength} C 265 220 255 170 238 145 Z`}
                  fill="url(#bodyGradient)"
                  stroke={activeColor.stroke}
                  strokeWidth="1.5"
                />
                <g>
                  <rect x="273" y={118 + sleeveLength} width="24" height="16" rx="2" fill={activeColor.body} stroke="#9E7D52" strokeWidth="1.5" />
                  {customFit.initials && (
                    <text x="285" y={130 + sleeveLength} fontSize="7" fontFamily="serif" fontWeight="bold" fill={activeThreadColor} textAnchor="middle" className="tracking-widest uppercase">
                      {customFit.initials}
                    </text>
                  )}
                </g>
              </g>
            ) : (
              <path d="M 250 120 C 265 145 275 170 280 190 L 260 195 C 255 175 245 150 238 145 Z" fill="url(#bodyGradient)" stroke={activeColor.stroke} strokeWidth="1.5" />
            )}

            {/* Button Placket & Buttons */}
            <line x1="200" y1="125" x2="200" y2={shirtLength - 20} stroke={activeColor.stroke} strokeWidth="1.5" strokeDasharray="1,1" />
            <circle cx="200" cy="150" r="2.5" fill="#FAF6EE" stroke="#A89B88" strokeWidth="0.8" />
            <circle cx="200" cy="180" r="2.5" fill="#FAF6EE" stroke="#A89B88" strokeWidth="0.8" />
            <circle cx="200" cy="210" r="2.5" fill="#FAF6EE" stroke="#A89B88" strokeWidth="0.8" />

            {/* Collar */}
            <path d="M 175 110 Q 200 125 225 110 L 235 135 Q 200 148 165 135 Z" fill="#FFFFFF" stroke="#B5AA9A" strokeWidth="1.2" />

            {/* Pocket (Step 6/9 image match) */}
            {customFit.pocket === "pocket" && (
              <g className="animate-fade-in">
                <path d="M 162 175 L 182 175 L 182 200 Q 172 206 162 200 Z" fill="none" stroke={activeColor.stroke} strokeWidth="1.5" />
              </g>
            )}
          </svg>
        </div>
      )}
    </div>
  );
}
