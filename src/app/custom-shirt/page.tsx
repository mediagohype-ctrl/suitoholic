"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import MannequinShirtViewer from "@/components/MannequinShirtViewer";
import { ArrowLeft, Check } from "lucide-react";
import confetti from "canvas-confetti";

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
  threadColor: string;
  shirtColor: string;
}

export default function CustomShirtConfigurator() {
  const [currentStep, setCurrentStep] = useState<number>(4); // Default to Step 4 to match user view
  const [customFit, setCustomFit] = useState<CustomFitState>({
    chestSize: 38,
    collarSize: 15,
    shoulderSize: 17.5,
    bodyFit: "lean",
    height: "TALL HEIGHT (5.8 - 5.10\")",
    sleeveType: "full",
    collarStyle: "CUTAWAY COLLAR",
    cuffStyle: "CLASSIC CUFF",
    pocket: "pocket",
    initials: "A K",
    threadColor: "black",
    shirtColor: "white",
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Chest measurement mapping matching authentic luxury bespoke proportions
  const chestMeasurementsMap: Record<number, { collar: number; shoulder: number }> = {
    38: { collar: 15, shoulder: 17.5 },
    39: { collar: 15.25, shoulder: 17.75 },
    40: { collar: 15.5, shoulder: 18 },
    41: { collar: 15.75, shoulder: 18.25 },
    42: { collar: 16, shoulder: 18.5 },
    44: { collar: 16.5, shoulder: 19 },
    46: { collar: 17, shoulder: 19.5 },
    48: { collar: 17.5, shoulder: 20 },
  };

  const handleChestSelect = (size: number) => {
    const calculated = chestMeasurementsMap[size] || { collar: 15, shoulder: 17.5 };
    setCustomFit((prev) => ({
      ...prev,
      chestSize: size,
      collarSize: calculated.collar,
      shoulderSize: calculated.shoulder,
    }));
  };

  const isFullSleeve = customFit.sleeveType === "full";
  const totalSteps = 6;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      triggerCelebration();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const triggerCelebration = () => {
    setOrderSubmitted(true);
    confetti({
      particleCount: 160,
      spread: 85,
      origin: { y: 0.5 },
    });
  };

  const stepBreadcrumbs = [
    "CHEST SIZE",
    "BODY TYPE",
    "HEIGHT",
    "SLEEVES",
    "COLLAR & DETAILS",
    "REVIEW"
  ];

  // Helper for height clean title
  const getHeightCleanTitle = (h: string) => {
    if (h.toLowerCase().includes("extra")) return "Extra Tall";
    if (h.toLowerCase().includes("regular") || h.toLowerCase().includes("5.5") || h.toLowerCase().includes("standard")) return "Regular Height";
    return "Tall Height";
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header */}
      <Header activeTab="custom-fit" />

      {/* Main Studio Content */}
      <div className="relative flex-1 w-full overflow-hidden flex flex-col justify-center">
        <main className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 pt-3 sm:pt-6 pb-6 sm:pb-12">
          
          {/* Breadcrumb Navigation on top left (e.g. HOME > CUSTOM SHIRT > SLEEVES) */}
          <div className="flex items-center text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase mb-3 sm:mb-6 space-x-2">
            <Link href="/" className="text-[#332B24] hover:text-[#966839] transition-colors">HOME</Link>
            <span className="text-[#966839] text-xs font-normal">&gt;</span>
            <button onClick={() => setCurrentStep(1)} className="text-[#332B24] hover:text-[#966839] transition-colors uppercase font-semibold">
              CUSTOM SHIRT
            </button>
            <span className="text-[#966839] text-xs font-normal">&gt;</span>
            <span className="text-[#8C6D47] font-bold">{stepBreadcrumbs[currentStep - 1]}</span>
          </div>

          {/* Main 2-Column Grid: Left 3D Mannequin & Right Configurator Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative">
            
            {/* LEFT COLUMN: Inscription, Studio Floating Selection & 3D Interactive Mannequin Shirt */}
            <div className="lg:col-span-6 flex flex-col justify-between relative min-h-[380px] sm:min-h-[500px]">
              
              {/* Top Row: Left Inscription ("A SHIRT MADE FOR YOU") & Right Studio "Your Selection" Panel */}
              <div className="flex items-start justify-between relative z-10 pl-1 pr-2 mb-2 sm:mb-4">
                {/* Top Left Inscription */}
                <div className="select-none">
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#14110E] tracking-[0.06em] uppercase leading-[1.12]">
                    A SHIRT <br />
                    MADE <br />
                    FOR YOU.
                  </h2>
                  <div className="w-12 sm:w-16 h-[1.5px] bg-[#9E774C] mt-2 sm:mt-2.5 opacity-90" />
                </div>

                {/* Top Right Floating "Your Selection" Panel matching Reference */}
                <div className="select-none text-left min-w-[130px] sm:min-w-[145px] bg-[#EFE2D4]/70 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none backdrop-blur-xs sm:backdrop-blur-none border border-[#D0BDA9]/50 sm:border-0">
                  <h5 className="text-[11.5px] sm:text-[12px] font-bold tracking-[0.14em] text-[#C68A4C] uppercase mb-1.5">
                    Your Selection
                  </h5>
                  <div className="space-y-1 text-[11px] sm:text-[11.5px]">
                    <div className="flex justify-between items-center gap-3 sm:gap-4">
                      <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Chest Size</span>
                      <strong className="text-[#14110E] font-bold">{customFit.chestSize}&quot;</strong>
                    </div>
                    {currentStep >= 2 && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Body Type</span>
                        <strong className="text-[#14110E] font-bold capitalize">{customFit.bodyFit} Fit</strong>
                      </div>
                    )}
                    {currentStep >= 3 && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Height</span>
                        <strong className="text-[#14110E] font-bold">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                    )}
                    {currentStep >= 4 && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Sleeve</span>
                        <strong className="text-[#14110E] font-bold capitalize">
                          {customFit.sleeveType === "half" ? "Half Sleeve" : "Full Sleeve"}
                        </strong>
                      </div>
                    )}
                    {currentStep >= 5 && customFit.collarStyle && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Collar</span>
                        <strong className="text-[#14110E] font-bold">{customFit.collarStyle.split(" ")[0]}</strong>
                      </div>
                    )}
                    {currentStep >= 5 && isFullSleeve && customFit.cuffStyle && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Cuff</span>
                        <strong className="text-[#14110E] font-bold">{customFit.cuffStyle.split(" ")[0]}</strong>
                      </div>
                    )}
                    {currentStep >= 5 && customFit.initials && (
                      <div className="flex justify-between items-center gap-3 sm:gap-4">
                        <span className="text-[#4A3E33] text-[10.5px] sm:text-[11px] font-medium">Monogram</span>
                        <strong className="text-[#14110E] font-bold uppercase">{customFit.initials}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: 3D Bespoke Tailored White Shirt with Dynamic Sleeve & Torso Transformations */}
              <div className="relative w-full">
                <MannequinShirtViewer
                  chestSize={customFit.chestSize}
                  bodyFit={customFit.bodyFit}
                  height={customFit.height}
                  sleeveType={customFit.sleeveType}
                  currentStep={currentStep}
                />
              </div>

              {/* Mobile Step Indicator helper */}
              <div className="lg:hidden text-center text-xs text-[#5C5247] italic mt-2">
                Step {currentStep} of {totalSteps}: {stepBreadcrumbs[currentStep - 1]}
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Configurator Box */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Card Container matching screenshot */}
              <div className="bg-[#EFE2D4]/90 border border-[#D0BDA9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)] backdrop-blur-md relative z-10 transition-all duration-300">
                
                {/* Top Stepper & Header */}
                <div className="mb-5 sm:mb-6">
                  {/* Centered Step Indicator with Gold Accent Lines */}
                  <div className="flex items-center justify-center space-x-3 text-[11px] font-bold tracking-[0.24em] text-[#9E774C] uppercase mb-2.5 select-none">
                    <div className="w-12 sm:w-20 h-[1px] bg-[#CBB49E]" />
                    <span>STEP {currentStep} OF {totalSteps}</span>
                    <div className="w-12 sm:w-20 h-[1px] bg-[#CBB49E]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif-luxury text-2xl sm:text-[32px] lg:text-[36px] font-normal text-[#14110E] tracking-tight uppercase leading-[1.1] text-center sm:text-left">
                    {currentStep === 1 && "SELECT YOUR CHEST SIZE"}
                    {currentStep === 2 && "CHOOSE YOUR BODY TYPE"}
                    {currentStep === 3 && "SELECT YOUR HEIGHT"}
                    {currentStep === 4 && "SELECT YOUR SLEEVES"}
                    {currentStep === 5 && "COLLAR, CUFFS & DETAILS"}
                    {currentStep === 6 && "FINAL FIT REVIEW"}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[12.5px] sm:text-[13.5px] text-[#42372E] font-normal mt-1.5 leading-relaxed text-center sm:text-left">
                    {currentStep === 1 && "Choose your chest size for the perfect fit."}
                    {currentStep === 2 && "Find the fit that matches your body shape and comfort preference."}
                    {currentStep === 3 && "Choose the height option that fits you."}
                    {currentStep === 4 && (
                      <>Choose <span className="text-[#726254]">the sleeve type</span> that you prefer.</>
                    )}
                    {currentStep === 5 && "Customize collar style, wrist cuffs, and personalized monogram initials."}
                    {currentStep === 6 && "Verify your bespoke specifications before tailor dispatch."}
                  </p>
                </div>

                {/* ======================================================== */}
                {/* STEP 1: CHEST SIZE */}
                {/* ======================================================== */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="pt-1">
                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-2.5">
                        CHEST SIZE (IN INCHES)
                      </label>

                      {/* 2 Rows × 4 Columns Size Buttons */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3">
                        {[38, 39, 40, 41, 42, 44, 46, 48].map((size) => {
                          const isSelected = customFit.chestSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => handleChestSelect(size)}
                              className={`py-2.5 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                  : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Measurement Pill Box (Chest, Collar, Shoulder) */}
                    <div className="bg-[#F5EBE1]/95 border border-[#D8C6B3] rounded-xl p-3 sm:p-4 my-4 grid grid-cols-3 divide-x divide-[#D8C6B3] text-center shadow-xs">
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">Chest Size</span>
                        <strong className="font-serif-luxury text-base sm:text-xl font-bold text-[#14110E] block mt-0.5">
                          {customFit.chestSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">Collar Size</span>
                        <strong className="font-serif-luxury text-base sm:text-xl font-bold text-[#14110E] block mt-0.5">
                          {customFit.collarSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">Shoulder</span>
                        <strong className="font-serif-luxury text-base sm:text-xl font-bold text-[#14110E] block mt-0.5">
                          {customFit.shoulderSize}&quot;
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 2: CHOOSE YOUR BODY TYPE */}
                {/* ======================================================== */}
                {currentStep === 2 && (
                  <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                    
                    {/* 1. LEAN FIT */}
                    <button
                      onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: "lean" }))}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center space-x-4 border cursor-pointer ${
                        customFit.bodyFit === "lean"
                          ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                          : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                        {customFit.bodyFit === "lean" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E]">
                          LEAN FIT
                        </h4>
                        <p className="text-[11.5px] text-[#55473B] mt-0.5">
                          Your chest is {customFit.chestSize}&quot; and your stomach is {customFit.chestSize - 4}&quot;.
                        </p>
                      </div>
                    </button>

                    {/* 2. REGULAR FIT */}
                    <button
                      onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: "regular" }))}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center space-x-4 border cursor-pointer ${
                        customFit.bodyFit === "regular"
                          ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                          : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                        {customFit.bodyFit === "regular" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E]">
                          REGULAR FIT
                        </h4>
                        <p className="text-[11.5px] text-[#55473B] mt-0.5">
                          Your chest is {customFit.chestSize}&quot; and your stomach is {customFit.chestSize - 2}&quot;.
                        </p>
                      </div>
                    </button>

                    {/* 3. TUMMY COMFORT FIT */}
                    <button
                      onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: "tummy" }))}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center space-x-4 border cursor-pointer ${
                        customFit.bodyFit === "tummy"
                          ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                          : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                        {customFit.bodyFit === "tummy" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E]">
                          TUMMY COMFORT FIT
                        </h4>
                        <p className="text-[11.5px] text-[#55473B] mt-0.5 leading-tight">
                          Your chest is {customFit.chestSize}&quot; <br />
                          Stomach size is {customFit.chestSize + 1}&quot; – {customFit.chestSize + 2}&quot;.
                        </p>
                      </div>
                    </button>

                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 3: SELECT YOUR HEIGHT */}
                {/* ======================================================== */}
                {currentStep === 3 && (
                  <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                    {[
                      {
                        id: "REGULAR HEIGHT (5.5 - 5.7\")",
                        title: "REGULAR HEIGHT",
                        heightRange: "Height: 5.5 – 5.7\"",
                        details: "Shirt Length: 27.5\" | Sleeve Length: 23.75\"",
                      },
                      {
                        id: "TALL HEIGHT (5.8 - 5.10\")",
                        title: "TALL HEIGHT",
                        heightRange: "Height: 5.8 – 5.10\"",
                        details: "Shirt Length: 29\" | Sleeve Length: 24.5\"",
                      },
                      {
                        id: "EXTRA TALL (5.11\" & ABOVE)",
                        title: "EXTRA TALL HEIGHT",
                        heightRange: "Height: 5.11 – 6.2\"",
                        details: "Shirt Length: 30.5\" | Sleeve Length: 26.5\"",
                      },
                    ].map((opt) => {
                      const isSelected = customFit.height === opt.id || (opt.title === "TALL HEIGHT" && customFit.height.includes("5.8"));

                      return (
                        <button
                          key={opt.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, height: opt.id }))}
                          className={`w-full p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 flex items-center space-x-3.5 sm:space-x-4 border cursor-pointer ${
                            isSelected
                              ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                              : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                          }`}
                        >
                          {/* Radio Dot Indicator */}
                          <div className="w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                            {isSelected && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                            )}
                          </div>

                          {/* Human Silhouette + Vertical Height Arrow Icon */}
                          <div className="w-6 h-9 flex items-center justify-center shrink-0 text-[#14110E]">
                            <svg viewBox="0 0 28 42" fill="none" className="w-full h-full">
                              <circle cx="8.5" cy="6" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                              <path d="M 4 14 C 4 11 13 11 13 14 L 13 25 L 11 25 L 11 37 L 9 37 L 9 25 L 8 25 L 8 37 L 6 37 L 6 25 L 4 25 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                              <line x1="21" y1="6" x2="21" y2="36" stroke="currentColor" strokeWidth="1.4" />
                              <path d="M 18.5 8.5 L 21 5 L 23.5 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M 18.5 33.5 L 21 37 L 23.5 33.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>

                          {/* Height Title & Specifications */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E]">
                              {opt.title}
                            </h4>
                            <p className="text-[11.5px] text-[#4A3D31] font-medium mt-0.5">
                              {opt.heightRange}
                            </p>
                            <p className="text-[10.5px] text-[#695847] mt-0.5">
                              {opt.details}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 4: SELECT YOUR SLEEVES (EXACT MATCH TO 4TH SCREENSHOT) */}
                {/* ======================================================== */}
                {currentStep === 4 && (
                  <div className="space-y-4 pt-1 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
                      
                      {/* 1. HALF SLEEVE CARD */}
                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "half" }))}
                        className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 border flex flex-col justify-between items-center relative cursor-pointer group ${
                          customFit.sleeveType === "half"
                            ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                            : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                        }`}
                      >
                        {/* Radio Dot (Top Left) */}
                        <div className="absolute top-3.5 left-3.5 w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center">
                          {customFit.sleeveType === "half" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                          )}
                        </div>

                        {/* Half Sleeve Shirt Vector Drawing */}
                        <div className="my-3 w-20 h-24 flex items-center justify-center text-[#14110E] group-hover:scale-105 transition-transform duration-300">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            {/* Collar */}
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 40 18 L 33 28 L 47 26" />
                            <path d="M 60 18 L 67 28 L 53 26" />
                            {/* Shoulders & Short Sleeves */}
                            <path d="M 33 28 L 18 36 L 24 54 L 33 50 L 33 92 L 67 92 L 67 50 L 76 54 L 82 36 L 67 28" />
                            {/* Hem Cuts on Arms */}
                            <path d="M 18 36 L 24 54" strokeDasharray="1 1" />
                            <path d="M 76 54 L 82 36" strokeDasharray="1 1" />
                            {/* Button Placket & Buttons */}
                            <line x1="50" y1="26" x2="50" y2="92" strokeDasharray="2 2" />
                            <circle cx="50" cy="40" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="54" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="68" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="82" r="1.2" fill="currentColor" />
                            {/* Curved Bottom */}
                            <path d="M 33 92 Q 50 97 67 92" />
                          </svg>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E] mt-1">
                          HALF SLEEVE
                        </h4>
                      </button>

                      {/* 2. FULL SLEEVE CARD */}
                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full" }))}
                        className={`p-4 sm:p-5 rounded-2xl text-center transition-all duration-300 border flex flex-col justify-between items-center relative cursor-pointer group ${
                          customFit.sleeveType === "full"
                            ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                            : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                        }`}
                      >
                        {/* Radio Dot (Top Left) */}
                        <div className="absolute top-3.5 left-3.5 w-5 h-5 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center">
                          {customFit.sleeveType === "full" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7A4B1A]" />
                          )}
                        </div>

                        {/* Full Sleeve Shirt Vector Drawing */}
                        <div className="my-3 w-20 h-24 flex items-center justify-center text-[#14110E] group-hover:scale-105 transition-transform duration-300">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            {/* Collar */}
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 40 18 L 33 28 L 47 26" />
                            <path d="M 60 18 L 67 28 L 53 26" />
                            {/* Shoulders & Full Sleeves */}
                            <path d="M 33 28 L 18 38 L 14 78 L 22 78 L 26 50 L 33 50 L 33 92 L 67 92 L 67 50 L 74 50 L 78 78 L 86 78 L 82 38 L 67 28" />
                            {/* Cuffs */}
                            <rect x="13" y="78" width="10" height="7" rx="1" />
                            <rect x="77" y="78" width="10" height="7" rx="1" />
                            {/* Button Placket & Buttons */}
                            <line x1="50" y1="26" x2="50" y2="92" strokeDasharray="2 2" />
                            <circle cx="50" cy="40" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="54" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="68" r="1.2" fill="currentColor" />
                            <circle cx="50" cy="82" r="1.2" fill="currentColor" />
                            {/* Curved Bottom */}
                            <path d="M 33 92 Q 50 97 67 92" />
                          </svg>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-[#14110E] mt-1">
                          FULL SLEEVE
                        </h4>
                      </button>

                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 5: COLLAR, CUFFS & MONOGRAM */}
                {/* ======================================================== */}
                {currentStep === 5 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="space-y-3 pt-1">
                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block">
                        COLLAR STYLE
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          "CUTAWAY COLLAR",
                          "CLASSIC SPREAD",
                          "MANDARIN / BAND",
                          "BUTTON DOWN"
                        ].map((c) => (
                          <button
                            key={c}
                            onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: c }))}
                            className={`p-3 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              customFit.collarStyle === c
                                ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                            }`}
                          >
                            <span>{c}</span>
                            {customFit.collarStyle === c && <Check size={14} />}
                          </button>
                        ))}
                      </div>

                      {isFullSleeve && (
                        <>
                          <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                            CUFF DESIGN
                          </label>
                          <div className="grid grid-cols-3 gap-2.5">
                            {["CLASSIC CUFF", "FRENCH DOUBLE", "ROUNDED CUFF"].map((cuff) => (
                              <button
                                key={cuff}
                                onClick={() => setCustomFit((prev) => ({ ...prev, cuffStyle: cuff }))}
                                className={`p-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                                  customFit.cuffStyle === cuff
                                    ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                    : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                                }`}
                              >
                                {cuff}
                              </button>
                            ))}
                          </div>
                        </>
                      )}

                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                        CHEST POCKET
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {(
                          [
                            { id: "pocket", label: "WITH POCKET" },
                            { id: "no-pocket", label: "NO POCKET" },
                          ] as const
                        ).map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setCustomFit((prev) => ({ ...prev, pocket: p.id }))}
                            className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                              customFit.pocket === p.id
                                ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                        YOUR INITIALS (MAX 3 CHARACTERS)
                      </label>
                      <input
                        type="text"
                        maxLength={3}
                        value={customFit.initials}
                        onChange={(e) => setCustomFit((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                        className="w-full bg-[#F5EBE1]/90 border border-[#D0BDA9] rounded-xl px-4 py-3 text-lg font-bold tracking-widest uppercase text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C]"
                        placeholder="E.G. A K"
                      />

                      <label className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block pt-2">
                        EMBROIDERY THREAD COLOR
                      </label>
                      <div className="grid grid-cols-4 gap-2.5">
                        {["black", "gold", "navy", "maroon"].map((clr) => (
                          <button
                            key={clr}
                            onClick={() => setCustomFit((prev) => ({ ...prev, threadColor: clr }))}
                            className={`p-3 rounded-xl text-center text-xs font-bold uppercase transition-all cursor-pointer ${
                              customFit.threadColor === clr
                                ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                : "bg-[#E2D0BE]/90 text-[#1F1C18] border border-[#C6B09B]"
                            }`}
                          >
                            {clr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ======================================================== */}
                {/* STEP 6: FINAL REVIEW */}
                {/* ======================================================== */}
                {currentStep === 6 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="bg-[#F5EBE1]/95 border border-[#D8C6B3] rounded-xl p-4 space-y-2.5 text-xs shadow-xs">
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">Chest / Collar / Shoulder:</span>
                        <strong className="text-[#14110E]">{customFit.chestSize}&quot; / {customFit.collarSize}&quot; / {customFit.shoulderSize}&quot;</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">Body Fit:</span>
                        <strong className="text-[#14110E] uppercase">{customFit.bodyFit} Fit</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">Height:</span>
                        <strong className="text-[#14110E]">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                        <span className="text-[#665749]">Sleeves &amp; Collar:</span>
                        <strong className="text-[#14110E] uppercase">{customFit.sleeveType} Sleeve | {customFit.collarStyle}</strong>
                      </div>
                      {isFullSleeve && (
                        <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                          <span className="text-[#665749]">Cuff &amp; Pocket:</span>
                          <strong className="text-[#14110E] uppercase">{customFit.cuffStyle} | {customFit.pocket}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#665749]">Bespoke Monogram:</span>
                        <strong className="text-[#14110E] uppercase">{customFit.initials || "None"} ({customFit.threadColor})</strong>
                      </div>
                    </div>

                    {orderSubmitted && (
                      <div className="bg-[#2D6A4F] text-white p-3.5 rounded-xl text-center text-xs font-bold tracking-wider animate-bounce shadow-md">
                        ✨ BESPOKE SHIRT CONFIGURED SUCCESSFULLY! TAILOR DISPATCH NOTIFIED.
                      </div>
                    )}
                  </div>
                )}

                {/* ======================================================== */}
                {/* BOTTOM ACTION BUTTON (CONTINUE -> X OF 6) */}
                {/* ======================================================== */}
                <div className="mt-6 pt-4 border-t border-[#D5C2AF]/70 flex items-center justify-between gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-3.5 bg-[#E2D0BE] hover:bg-[#120F0D] text-[#332B24] hover:text-white border border-[#C6B09B] rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <ArrowLeft size={14} />
                      <span>BACK</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-[#120F0D] hover:bg-[#2A231D] text-white py-3.5 sm:py-4 px-6 rounded-xl text-xs font-bold tracking-[0.18em] uppercase transition-all flex items-center justify-between shadow-lg cursor-pointer"
                  >
                    <span>{currentStep === totalSteps ? "CONFIRM & PROCEED →" : "CONTINUE →"}</span>
                    <span className="text-[10.5px] opacity-80 font-normal tracking-widest">{currentStep} OF {totalSteps}</span>
                  </button>
                </div>

                {/* Vertical Gold Mark Accent on Left */}
                <div className="w-[2px] h-6 sm:h-7 bg-[#9E774C] mt-4" />

                {/* Bottom Right Inscription */}
                <div className="text-right -mt-5 select-none opacity-90">
                  <p className="font-serif-luxury text-[13px] sm:text-[14px] text-[#9E774C] font-normal tracking-[0.14em] uppercase leading-tight">
                    TAILORED <br />
                    FOR A BETTER <br />
                    YOU.
                  </p>
                  <div className="w-10 h-[1px] bg-[#9E774C] mt-1.5 ml-auto" />
                </div>

              </div>

            </div>

          </div>

        </main>
      </div>

      {/* Bottom Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />
    </div>
  );
}
