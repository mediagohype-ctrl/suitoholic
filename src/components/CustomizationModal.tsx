"use client";

import React, { useState, useEffect } from "react";
import MannequinShirtViewer from "@/components/MannequinShirtViewer";
import { ArrowLeft, Check, X, Scissors } from "lucide-react";
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

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  initialChestSize?: number;
  onConfirmCustomization: (customFit: CustomFitState) => void;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  productName = "Royal Formal Crisp White Shirt",
  initialChestSize = 38,
  onConfirmCustomization,
}: CustomizationModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customFit, setCustomFit] = useState<CustomFitState>({
    chestSize: initialChestSize,
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

  // Sync initialChestSize when opened
  useEffect(() => {
    if (initialChestSize) {
      handleChestSelect(initialChestSize);
    }
  }, [initialChestSize, isOpen]);

  if (!isOpen) return null;

  const isFullSleeve = customFit.sleeveType === "full";
  const totalSteps = 6;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Step 6: Complete
      triggerCelebration();
      onConfirmCustomization(customFit);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  const stepBreadcrumbs = [
    "CHEST SIZE",
    "BODY TYPE",
    "HEIGHT",
    "SLEEVES",
    "COLLAR & DETAILS",
    "REVIEW & ADD TO BAG",
  ];

  const getHeightCleanTitle = (h: string) => {
    if (h.toLowerCase().includes("extra")) return "Extra Tall";
    if (h.toLowerCase().includes("regular") || h.toLowerCase().includes("5.5") || h.toLowerCase().includes("standard")) return "Regular Height";
    return "Tall Height";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[1240px] bg-[#D7C2AD] border border-[#C6B09B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header Bar */}
        <div className="bg-[#120F0D] text-white px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#3A332C]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#9E774C]/20 border border-[#9E774C] flex items-center justify-center text-[#D7C2AD]">
              <Scissors size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.24em] text-[#9E774C] uppercase block">
                SUITOHOLIC BESPOKE ATELIER
              </span>
              <h2 className="font-serif-luxury text-sm sm:text-base font-normal text-white tracking-wider uppercase">
                CUSTOMIZE {productName}
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close customization modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Breadcrumb Steps Header */}
          <div className="flex items-center justify-between border-b border-[#C6B09B]/60 pb-3">
            <div className="flex items-center text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.2em] uppercase space-x-2 text-[#332B24]">
              <span>BESPOKE CUSTOMIZER</span>
              <span className="text-[#966839] text-xs font-normal">&gt;</span>
              <span className="text-[#8C6D47] font-bold">{stepBreadcrumbs[currentStep - 1]}</span>
            </div>

            {/* Quick Step Switcher Pills */}
            <div className="hidden sm:flex items-center space-x-1.5">
              {[1, 2, 3, 4, 5, 6].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setCurrentStep(stepNum)}
                  className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition-all cursor-pointer ${
                    currentStep === stepNum
                      ? "bg-[#120F0D] text-white shadow-sm ring-1 ring-[#120F0D]"
                      : currentStep > stepNum
                      ? "bg-[#8A6E48] text-white"
                      : "bg-[#E2D0BE] text-[#55473B] hover:bg-[#C6B09B]"
                  }`}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* LEFT COLUMN: 3D Interactive Mannequin Shirt Viewer & Selection Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between relative min-h-[360px] sm:min-h-[460px] bg-[#EFE2D4]/50 border border-[#D0BDA9]/60 rounded-2xl p-4">
              
              {/* Top Row: Inscription & Selection Summary */}
              <div className="flex items-start justify-between relative z-10 pl-1 pr-2 mb-2">
                <div className="select-none">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#14110E] tracking-[0.06em] uppercase leading-tight">
                    BESPOKE <br />
                    TAILORING <br />
                    STUDIO.
                  </h3>
                  <div className="w-12 h-[1.5px] bg-[#9E774C] mt-2 opacity-90" />
                </div>

                {/* Floating "Your Selection" Box */}
                <div className="select-none text-left min-w-[130px] bg-[#EFE2D4]/90 p-2.5 rounded-xl border border-[#D0BDA9] shadow-xs">
                  <h5 className="text-[11px] font-bold tracking-[0.14em] text-[#C68A4C] uppercase mb-1">
                    Your Selection
                  </h5>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[#4A3E33] font-medium">Chest Size</span>
                      <strong className="text-[#14110E] font-bold">{customFit.chestSize}&quot;</strong>
                    </div>
                    {currentStep >= 2 && (
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[#4A3E33] font-medium">Body Type</span>
                        <strong className="text-[#14110E] font-bold capitalize">{customFit.bodyFit} Fit</strong>
                      </div>
                    )}
                    {currentStep >= 3 && (
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[#4A3E33] font-medium">Height</span>
                        <strong className="text-[#14110E] font-bold">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                    )}
                    {currentStep >= 4 && (
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[#4A3E33] font-medium">Sleeve</span>
                        <strong className="text-[#14110E] font-bold capitalize">
                          {customFit.sleeveType === "half" ? "Half Sleeve" : "Full Sleeve"}
                        </strong>
                      </div>
                    )}
                    {currentStep >= 5 && customFit.collarStyle && (
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[#4A3E33] font-medium">Collar</span>
                        <strong className="text-[#14110E] font-bold">{customFit.collarStyle.split(" ")[0]}</strong>
                      </div>
                    )}
                    {currentStep >= 5 && isFullSleeve && customFit.cuffStyle && (
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[#4A3E33] font-medium">Cuff</span>
                        <strong className="text-[#14110E] font-bold">{customFit.cuffStyle.split(" ")[0]}</strong>
                      </div>
                    )}
                    {currentStep >= 5 && customFit.initials && (
                      <div className="flex justify-between items-center gap-3">
                        <span className="text-[#4A3E33] font-medium">Monogram</span>
                        <strong className="text-[#14110E] font-bold uppercase">{customFit.initials}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: 3D Interactive Mannequin Shirt */}
              <div className="relative w-full">
                <MannequinShirtViewer
                  chestSize={customFit.chestSize}
                  bodyFit={customFit.bodyFit}
                  height={customFit.height}
                  sleeveType={customFit.sleeveType}
                  currentStep={currentStep}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: 6-Step Interactive Configurator Box */}
            <div className="lg:col-span-6 relative">
              
              <div className="bg-[#EFE2D4]/90 border border-[#D0BDA9] rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.08)] backdrop-blur-md relative z-10">
                
                {/* Stepper Header */}
                <div className="mb-4 sm:mb-5">
                  <div className="flex items-center justify-center space-x-3 text-[11px] font-bold tracking-[0.24em] text-[#9E774C] uppercase mb-2 select-none">
                    <div className="w-10 sm:w-16 h-[1px] bg-[#CBB49E]" />
                    <span>STEP {currentStep} OF {totalSteps}</span>
                    <div className="w-10 sm:w-16 h-[1px] bg-[#CBB49E]" />
                  </div>

                  <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-normal text-[#14110E] tracking-tight uppercase leading-tight text-center sm:text-left">
                    {currentStep === 1 && "SELECT YOUR CHEST SIZE"}
                    {currentStep === 2 && "CHOOSE YOUR BODY TYPE"}
                    {currentStep === 3 && "SELECT YOUR HEIGHT"}
                    {currentStep === 4 && "SELECT YOUR SLEEVES"}
                    {currentStep === 5 && "COLLAR, CUFFS & DETAILS"}
                    {currentStep === 6 && "REVIEW & CONFIRM BESPOKE FIT"}
                  </h3>

                  <p className="text-[12px] sm:text-[13px] text-[#42372E] font-normal mt-1 leading-relaxed text-center sm:text-left">
                    {currentStep === 1 && "Choose your chest size for the perfect fit."}
                    {currentStep === 2 && "Find the fit that matches your body shape and comfort preference."}
                    {currentStep === 3 && "Choose the height option that fits you."}
                    {currentStep === 4 && "Choose the sleeve type that you prefer."}
                    {currentStep === 5 && "Customize collar style, wrist cuffs, and personalized monogram initials."}
                    {currentStep === 6 && "Verify your bespoke specifications before adding to bag."}
                  </p>
                </div>

                {/* STEP 1: CHEST SIZE */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-2">
                        CHEST SIZE (IN INCHES)
                      </label>
                      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                        {[38, 39, 40, 41, 42, 44, 46, 48].map((size) => {
                          const isSelected = customFit.chestSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => handleChestSelect(size)}
                              className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

                    <div className="bg-[#F5EBE1]/95 border border-[#D8C6B3] rounded-xl p-3 grid grid-cols-3 divide-x divide-[#D8C6B3] text-center shadow-xs">
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">Chest Size</span>
                        <strong className="font-serif-luxury text-sm sm:text-base font-bold text-[#14110E] block mt-0.5">
                          {customFit.chestSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">Collar Size</span>
                        <strong className="font-serif-luxury text-sm sm:text-base font-bold text-[#14110E] block mt-0.5">
                          {customFit.collarSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#665749] tracking-wider block">Shoulder</span>
                        <strong className="font-serif-luxury text-sm sm:text-base font-bold text-[#14110E] block mt-0.5">
                          {customFit.shoulderSize}&quot;
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: BODY TYPE */}
                {currentStep === 2 && (
                  <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                    <button
                      onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: "lean" }))}
                      className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center space-x-3 border cursor-pointer ${
                        customFit.bodyFit === "lean"
                          ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                          : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                        {customFit.bodyFit === "lean" && <div className="w-2 h-2 rounded-full bg-[#7A4B1A]" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#14110E]">LEAN FIT</h4>
                        <p className="text-[11px] text-[#55473B] mt-0.5">
                          Chest is {customFit.chestSize}&quot; and stomach is {customFit.chestSize - 4}&quot;.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: "regular" }))}
                      className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center space-x-3 border cursor-pointer ${
                        customFit.bodyFit === "regular"
                          ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                          : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                        {customFit.bodyFit === "regular" && <div className="w-2 h-2 rounded-full bg-[#7A4B1A]" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#14110E]">REGULAR FIT</h4>
                        <p className="text-[11px] text-[#55473B] mt-0.5">
                          Chest is {customFit.chestSize}&quot; and stomach is {customFit.chestSize - 2}&quot;.
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: "tummy" }))}
                      className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center space-x-3 border cursor-pointer ${
                        customFit.bodyFit === "tummy"
                          ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                          : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                        {customFit.bodyFit === "tummy" && <div className="w-2 h-2 rounded-full bg-[#7A4B1A]" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#14110E]">TUMMY COMFORT FIT</h4>
                        <p className="text-[11px] text-[#55473B] mt-0.5">
                          Chest is {customFit.chestSize}&quot;, Stomach size is {customFit.chestSize + 1}&quot; – {customFit.chestSize + 2}&quot;.
                        </p>
                      </div>
                    </button>
                  </div>
                )}

                {/* STEP 3: HEIGHT */}
                {currentStep === 3 && (
                  <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                    {[
                      {
                        id: "REGULAR HEIGHT (5.5 - 5.7\")",
                        title: "REGULAR HEIGHT",
                        heightRange: "Height: 5.5 – 5.7\"",
                        details: "Shirt Length: 27.5\" | Sleeve: 23.75\"",
                      },
                      {
                        id: "TALL HEIGHT (5.8 - 5.10\")",
                        title: "TALL HEIGHT",
                        heightRange: "Height: 5.8 – 5.10\"",
                        details: "Shirt Length: 29\" | Sleeve: 24.5\"",
                      },
                      {
                        id: "EXTRA TALL (5.11\" & ABOVE)",
                        title: "EXTRA TALL HEIGHT",
                        heightRange: "Height: 5.11 – 6.2\"",
                        details: "Shirt Length: 30.5\" | Sleeve: 26.5\"",
                      },
                    ].map((opt) => {
                      const isSelected = customFit.height === opt.id || (opt.title === "TALL HEIGHT" && customFit.height.includes("5.8"));
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, height: opt.id }))}
                          className={`w-full p-3.5 rounded-xl text-left transition-all flex items-center space-x-3 border cursor-pointer ${
                            isSelected
                              ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                              : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center shrink-0">
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#7A4B1A]" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs tracking-wider uppercase text-[#14110E]">{opt.title}</h4>
                            <p className="text-[11px] text-[#4A3D31] font-medium mt-0.5">{opt.heightRange}</p>
                            <p className="text-[10px] text-[#695847]">{opt.details}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* STEP 4: SLEEVES */}
                {currentStep === 4 && (
                  <div className="space-y-3 pt-1 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "half" }))}
                        className={`p-4 rounded-xl text-center transition-all border flex flex-col justify-between items-center relative cursor-pointer ${
                          customFit.sleeveType === "half"
                            ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                            : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                        }`}
                      >
                        <div className="absolute top-3 left-3 w-4 h-4 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center">
                          {customFit.sleeveType === "half" && <div className="w-2 h-2 rounded-full bg-[#7A4B1A]" />}
                        </div>
                        <div className="my-2 w-16 h-18 text-[#14110E]">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 33 28 L 16 42 L 26 48 L 33 46 L 33 92 L 67 92 L 67 46 L 74 48 L 84 42 L 67 28" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#14110E]">HALF SLEEVE</h4>
                      </button>

                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full" }))}
                        className={`p-4 rounded-xl text-center transition-all border flex flex-col justify-between items-center relative cursor-pointer ${
                          customFit.sleeveType === "full"
                            ? "bg-[#EAE0D3] border-[#8C6D47] shadow-sm ring-1 ring-[#8C6D47]"
                            : "bg-[#E3D2C1]/75 hover:bg-[#EAE0D3] border-[#CBBAA8] text-[#1F1C18]"
                        }`}
                      >
                        <div className="absolute top-3 left-3 w-4 h-4 rounded-full border-2 border-[#7A4B1A] flex items-center justify-center">
                          {customFit.sleeveType === "full" && <div className="w-2 h-2 rounded-full bg-[#7A4B1A]" />}
                        </div>
                        <div className="my-2 w-16 h-18 text-[#14110E]">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 33 28 L 18 38 L 14 78 L 22 78 L 26 50 L 33 50 L 33 92 L 67 92 L 67 50 L 74 50 L 78 78 L 86 78 L 82 38 L 67 28" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#14110E]">FULL SLEEVE</h4>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: COLLAR, CUFFS & MONOGRAM */}
                {currentStep === 5 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-1.5">
                        COLLAR STYLE
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["CUTAWAY COLLAR", "CLASSIC SPREAD", "MANDARIN / BAND", "BUTTON DOWN"].map((c) => (
                          <button
                            key={c}
                            onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: c }))}
                            className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                              customFit.collarStyle === c
                                ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                            }`}
                          >
                            <span>{c}</span>
                            {customFit.collarStyle === c && <Check size={13} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isFullSleeve && (
                      <div>
                        <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-1.5">
                          CUFF DESIGN
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {["CLASSIC CUFF", "FRENCH DOUBLE", "ROUNDED CUFF"].map((cuff) => (
                            <button
                              key={cuff}
                              onClick={() => setCustomFit((prev) => ({ ...prev, cuffStyle: cuff }))}
                              className={`p-2.5 rounded-xl text-center text-[11px] font-bold transition-all cursor-pointer ${
                                customFit.cuffStyle === cuff
                                  ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                                  : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                              }`}
                            >
                              {cuff}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-1">
                          MONOGRAM INITIALS
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={customFit.initials}
                          onChange={(e) => setCustomFit((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                          className="w-full bg-[#F5EBE1]/90 border border-[#D0BDA9] rounded-xl px-3 py-2 text-sm font-bold tracking-widest uppercase text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C]"
                          placeholder="E.G. A K"
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713] block mb-1">
                          THREAD COLOR
                        </label>
                        <select
                          value={customFit.threadColor}
                          onChange={(e) => setCustomFit((prev) => ({ ...prev, threadColor: e.target.value }))}
                          className="w-full bg-[#F5EBE1]/90 border border-[#D0BDA9] rounded-xl px-3 py-2 text-xs font-bold uppercase text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C]"
                        >
                          <option value="black">BLACK THREAD</option>
                          <option value="gold">GOLD THREAD</option>
                          <option value="navy">NAVY THREAD</option>
                          <option value="maroon">MAROON THREAD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: REVIEW */}
                {currentStep === 6 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="bg-[#F5EBE1]/95 border border-[#D8C6B3] rounded-xl p-3.5 space-y-2 text-xs shadow-xs">
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                        <span className="text-[#665749]">Chest / Collar / Shoulder:</span>
                        <strong className="text-[#14110E]">{customFit.chestSize}&quot; / {customFit.collarSize}&quot; / {customFit.shoulderSize}&quot;</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                        <span className="text-[#665749]">Body Fit:</span>
                        <strong className="text-[#14110E] uppercase">{customFit.bodyFit} Fit</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                        <span className="text-[#665749]">Height:</span>
                        <strong className="text-[#14110E]">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                        <span className="text-[#665749]">Sleeves &amp; Collar:</span>
                        <strong className="text-[#14110E] uppercase">{customFit.sleeveType} Sleeve | {customFit.collarStyle}</strong>
                      </div>
                      {isFullSleeve && (
                        <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                          <span className="text-[#665749]">Cuff &amp; Pocket:</span>
                          <strong className="text-[#14110E] uppercase">{customFit.cuffStyle} | {customFit.pocket}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#665749]">Bespoke Monogram:</span>
                        <strong className="text-[#14110E] uppercase">{customFit.initials || "None"} ({customFit.threadColor})</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOTTOM NAVIGATION ACTIONS */}
                <div className="mt-5 pt-3 border-t border-[#D5C2AF]/70 flex items-center justify-between gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-4 py-3 bg-[#E2D0BE] hover:bg-[#120F0D] text-[#332B24] hover:text-white border border-[#C6B09B] rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <ArrowLeft size={13} />
                      <span>BACK</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-[#120F0D] hover:bg-[#2A231D] text-white py-3.5 px-5 rounded-xl text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-md cursor-pointer"
                  >
                    <span>{currentStep === totalSteps ? "ADD TO BAG WITH CUSTOMIZATION ✓" : "CONTINUE →"}</span>
                    <span className="text-[10px] opacity-80 font-normal tracking-widest">{currentStep} OF {totalSteps}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
