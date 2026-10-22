"use client";

import React, { useState } from "react";
import MannequinShirtViewer from "@/components/MannequinShirtViewer";
import { CollarIllustration, CuffIllustration } from "@/components/customizer/StyleIllustrations";
import { ArrowLeft, Check, X, Scissors } from "lucide-react";
import confetti from "canvas-confetti";
import { fillTemplate } from "@/content/merge";
import { useContent, useSettings } from "@/context/SiteDataProvider";
import { formatMoney } from "@/lib/api";
import type { CustomFit } from "@/lib/types";

export type CustomFitState = CustomFit;

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  /** The product being customised; its photo drives the fabric chip and the detail/review previews. */
  product?: { name: string; image: string; gallery?: string[] } | null;
  initialChestSize?: number;
  /** Disables the final button while the bag request is in flight. */
  submitting?: boolean;
  onConfirmCustomization: (customFit: CustomFitState) => void | Promise<void>;
}

type MannequinFit = "lean" | "regular" | "tummy";
const asMannequinFit = (fit: string): MannequinFit => (fit === "regular" || fit === "tummy" ? fit : "lean");

export default function CustomizationModal({
  isOpen,
  onClose,
  productName = "Royal Formal Crisp White Shirt",
  product = null,
  initialChestSize,
  submitting = false,
  onConfirmCustomization,
}: CustomizationModalProps) {
  const c = useContent("customizer");
  const { customizationFee, currencySymbol } = useSettings();
  const startChest = initialChestSize ?? c.defaults.chestSize;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customFit, setCustomFit] = useState<CustomFitState>(() => {
    const m = c.chestSizes.find((x) => x.size === startChest);
    return {
      chestSize: startChest,
      collarSize: m?.collar ?? 15,
      shoulderSize: m?.shoulder ?? 17.5,
      bodyFit: c.defaults.bodyFit,
      height: c.defaults.height,
      sleeveType: c.defaults.sleeveType,
      collarStyle: c.defaults.collarStyle,
      cuffStyle: c.defaults.cuffStyle,
      pocket: "pocket",
      initials: c.defaults.initials,
      threadColor: c.defaults.threadColor,
      shirtColor: "white",
    };
  });

  const handleChestSelect = (size: number) => {
    const match = c.chestSizes.find((x) => x.size === size);
    const calculated = match ? { collar: match.collar, shoulder: match.shoulder } : { collar: 15, shoulder: 17.5 };
    setCustomFit((prev) => ({
      ...prev,
      chestSize: size,
      collarSize: calculated.collar,
      shoulderSize: calculated.shoulder,
    }));
  };

  React.useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  // The initial state is seeded from initialChestSize; selections are kept if the modal is closed and reopened.
  if (!isOpen) return null;

  const isFullSleeve = customFit.sleeveType === "full";
  const totalSteps = 6;
  const stepCopy = (n: number) => c.steps[n - 1] ?? { breadcrumb: "", title: "", subtitle: "" };

  // Selections in "YOUR SELECTION" are shown strictly up to the active step;
  // going back (e.g. from Step 6 to Step 2) dynamically hides future step choices.
  const showBodyType = currentStep >= 2;
  const showHeight = currentStep >= 3;
  const showSleeve = currentStep >= 4;
  const showCollar = currentStep >= 5 && !!customFit.collarStyle;
  const showCuff = currentStep >= 5 && isFullSleeve && !!customFit.cuffStyle;
  const showMonogram = currentStep >= 5 && !!customFit.initials?.trim();

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else if (!submitting) {
      // Step 6: Complete — the parent adds the configured shirt to the bag
      triggerCelebration();
      void onConfirmCustomization(customFit);
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

  const getHeightCleanTitle = (h: string) => {
    const match = c.heights.find((opt) => opt.id === h);
    if (match?.shortTitle) return match.shortTitle;
    if (h.toLowerCase().includes("extra")) return "Extra Tall";
    if (h.toLowerCase().includes("regular") || h.toLowerCase().includes("5.5") || h.toLowerCase().includes("standard")) return "Regular Height";
    return "Tall Height";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 lg:p-8 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[1480px] bg-[#ECEAE5] border border-[#E5E3DD] rounded-[24px] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Top Header Bar */}
        <div className="bg-white text-black px-6 sm:px-8 lg:px-10 py-4 flex items-center justify-between border-b border-[#E5E3DD]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
              <Scissors size={15} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold tracking-[0.24em] text-black uppercase block">
                {c.eyebrow}
              </span>
              <h2 className="font-serif-luxury text-sm sm:text-base font-bold text-black tracking-wider uppercase">
                {c.titlePrefix} {productName}
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5F4F0] hover:bg-black text-black hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Close customization modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
          <div className="w-full max-w-[1184px] mx-auto space-y-4 sm:space-y-6">
            
            {/* Breadcrumb Steps Header */}
            <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-3">
              <div className="flex items-center text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.2em] uppercase space-x-2 text-black">
                <span>{c.breadcrumbRoot}</span>
                <span className="text-[#888888] text-xs font-normal">&gt;</span>
                <span className="text-black font-bold">{stepCopy(currentStep).breadcrumb}</span>
              </div>
            </div>

            {/* Main 2-Column Grid with Equal Height Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch min-h-[490px] sm:min-h-[530px] lg:min-h-[560px]">
            
            {/* LEFT COLUMN: 3D Interactive Mannequin Shirt Viewer & Selection Panel */}
            <div className="lg:col-span-6 flex flex-col justify-center relative h-full min-h-[470px] sm:min-h-[520px]">
              
              {/* Top Row: Inscription & Selection Summary (Shown from Step 1 onwards) */}
              <div className="flex items-start justify-between relative z-10 pl-1 pr-2 mb-2 animate-in fade-in duration-300">
                <div className="select-none">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-black tracking-[0.06em] uppercase leading-tight">
                    {c.studioTitleLines.map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </h3>
                  <div className="w-12 h-[2px] bg-black mt-2" />
                </div>

                {/* Floating "Your Selection" Box - Dynamically reveals selections per step */}
                <div className="select-none text-left min-w-[130px] sm:min-w-[155px] bg-white p-3 rounded-2xl border border-[#E5E3DD] shadow-sm transition-all duration-300">
                  <h5 className="text-[11px] font-bold tracking-[0.14em] text-black uppercase mb-1.5 pb-1 border-b border-[#E5E3DD]">
                    {c.selectionTitle}
                  </h5>
                  <div className="space-y-1.5 text-[11px]">
                    {/* Step 1: Chest Size (always shown) */}
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[#666666] font-medium">Chest Size</span>
                      <strong className="text-black font-bold">{customFit.chestSize}&quot;</strong>
                    </div>

                    {/* Step 2: Body Type */}
                    {showBodyType && (
                      <div className="flex justify-between items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-[#666666] font-medium">Body Type</span>
                        <strong className="text-black font-bold capitalize">{customFit.bodyFit} Fit</strong>
                      </div>
                    )}

                    {/* Step 3: Height */}
                    {showHeight && (
                      <div className="flex justify-between items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-[#666666] font-medium">Height</span>
                        <strong className="text-black font-bold">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                    )}

                    {/* Step 4: Sleeve */}
                    {showSleeve && (
                      <div className="flex justify-between items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-[#666666] font-medium">Sleeve</span>
                        <strong className="text-black font-bold capitalize">
                          {customFit.sleeveType === "half" ? "Half Sleeve" : "Full Sleeve"}
                        </strong>
                      </div>
                    )}

                    {/* Step 5: Collar */}
                    {showCollar && (
                      <div className="flex justify-between items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-[#666666] font-medium">Collar</span>
                        <strong className="text-black font-bold">{customFit.collarStyle.split(" ")[0]}</strong>
                      </div>
                    )}

                    {/* Step 5: Cuff */}
                    {showCuff && (
                      <div className="flex justify-between items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-[#666666] font-medium">Cuff</span>
                        <strong className="text-black font-bold">{customFit.cuffStyle.split(" ")[0]}</strong>
                      </div>
                    )}

                    {/* Step 5: Monogram */}
                    {showMonogram && (
                      <div className="flex justify-between items-center gap-3 animate-in fade-in duration-200">
                        <span className="text-[#666666] font-medium">Monogram</span>
                        <strong className="text-black font-bold uppercase">{customFit.initials}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: 3D Interactive Mannequin Shirt */}
              <div className="relative w-full h-full flex flex-col items-center justify-center flex-1">
                <MannequinShirtViewer
                  chestSize={customFit.chestSize}
                  bodyFit={asMannequinFit(customFit.bodyFit)}
                  height={customFit.height}
                  sleeveType={customFit.sleeveType === "half" ? "half" : "full"}
                  collarStyle={customFit.collarStyle}
                  cuffStyle={customFit.cuffStyle}
                  pocket={customFit.pocket === "no-pocket" ? "no-pocket" : "pocket"}
                  initials={customFit.initials}
                  threadColor={customFit.threadColor}
                  currentStep={currentStep}
                  product={product}
                />
              </div>

            </div>

            {/* RIGHT COLUMN: 6-Step Interactive Configurator Box */}
            <div className="lg:col-span-6 relative flex flex-col h-full min-h-[470px] sm:min-h-[520px]">
              
              <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-5 sm:p-7 shadow-sm relative z-10 flex-1 flex flex-col justify-between h-full">
                
                {/* Stepper Header */}
                <div className="mb-4 sm:mb-5">
                  <div className="flex items-center justify-center space-x-3 text-[11px] font-bold tracking-[0.24em] text-black uppercase mb-2 select-none">
                    <div className="w-10 sm:w-16 h-[1px] bg-[#E5E3DD]" />
                    <span>STEP {currentStep} OF {totalSteps}</span>
                    <div className="w-10 sm:w-16 h-[1px] bg-[#E5E3DD]" />
                  </div>

                  <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold text-black tracking-tight uppercase leading-tight text-center sm:text-left">
                    {stepCopy(currentStep).title}
                  </h3>

                  <p className="text-[12px] sm:text-[13px] text-[#666666] font-normal mt-1 leading-relaxed text-center sm:text-left">
                    {stepCopy(currentStep).subtitle}
                  </p>
                </div>

                {/* STEP 1: CHEST SIZE */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div>
                      <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-black block mb-2">
                        {c.chestLabel}
                      </label>
                      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                        {c.chestSizes.map(({ size }) => {
                          const isSelected = customFit.chestSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => handleChestSelect(size)}
                              className={`py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-black text-white shadow-sm ring-1 ring-black"
                                  : "bg-[#F5F4F0] hover:bg-neutral-200 text-black border border-[#E5E3DD]"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#F5F4F0] border border-[#E5E3DD] rounded-2xl p-3.5 grid grid-cols-3 divide-x divide-[#E5E3DD] text-center shadow-xs">
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#666666] tracking-wider block">Chest Size</span>
                        <strong className="font-serif-luxury text-sm sm:text-base font-bold text-black block mt-0.5">
                          {customFit.chestSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#666666] tracking-wider block">Collar Size</span>
                        <strong className="font-serif-luxury text-sm sm:text-base font-bold text-black block mt-0.5">
                          {customFit.collarSize}&quot;
                        </strong>
                      </div>
                      <div className="px-1">
                        <span className="text-[10px] font-semibold text-[#666666] tracking-wider block">Shoulder</span>
                        <strong className="font-serif-luxury text-sm sm:text-base font-bold text-black block mt-0.5">
                          {customFit.shoulderSize}&quot;
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: BODY TYPE */}
                {currentStep === 2 && (
                  <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                    {c.bodyFits.map((fit) => (
                      <button
                        key={fit.id}
                        onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: fit.id }))}
                        className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 border cursor-pointer ${
                          customFit.bodyFit === fit.id
                            ? "bg-white border-black shadow-sm ring-1 ring-black"
                            : "bg-[#F5F4F0] hover:bg-neutral-100 border-[#E5E3DD] text-black"
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                          {customFit.bodyFit === fit.id && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs tracking-wider uppercase text-black">{fit.title}</h4>
                          <p className="text-[11px] text-[#666666] mt-0.5">
                            {fillTemplate(fit.description, { chest: customFit.chestSize })}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* STEP 3: HEIGHT */}
                {currentStep === 3 && (
                  <div className="space-y-2.5 pt-1 animate-in fade-in duration-200">
                    {c.heights.map((opt) => {
                      const isSelected = customFit.height === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, height: opt.id }))}
                          className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center space-x-3 border cursor-pointer ${
                            isSelected
                              ? "bg-white border-black shadow-sm ring-1 ring-black"
                              : "bg-[#F5F4F0] hover:bg-neutral-100 border-[#E5E3DD] text-black"
                          }`}
                        >
                          <div className="w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shrink-0">
                            {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs tracking-wider uppercase text-black">{opt.title}</h4>
                            <p className="text-[11px] text-[#444444] font-medium mt-0.5">{opt.heightRange}</p>
                            <p className="text-[10px] text-[#888888]">{opt.details}</p>
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
                        className={`p-4 rounded-2xl text-center transition-all border flex flex-col justify-between items-center relative cursor-pointer ${
                          customFit.sleeveType === "half"
                            ? "bg-white border-black shadow-sm ring-1 ring-black"
                            : "bg-[#F5F4F0] hover:bg-neutral-100 border-[#E5E3DD] text-black"
                        }`}
                      >
                        <div className="absolute top-3 left-3 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                          {customFit.sleeveType === "half" && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <div className="my-2 w-16 h-18 text-black">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 33 28 L 16 42 L 26 48 L 33 46 L 33 92 L 67 92 L 67 46 L 74 48 L 84 42 L 67 28" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-black">{c.halfSleeveLabel}</h4>
                      </button>

                      <button
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: "full" }))}
                        className={`p-4 rounded-2xl text-center transition-all border flex flex-col justify-between items-center relative cursor-pointer ${
                          customFit.sleeveType === "full"
                            ? "bg-white border-black shadow-sm ring-1 ring-black"
                            : "bg-[#F5F4F0] hover:bg-neutral-100 border-[#E5E3DD] text-black"
                        }`}
                      >
                        <div className="absolute top-3 left-3 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center">
                          {customFit.sleeveType === "full" && <div className="w-2 h-2 rounded-full bg-black" />}
                        </div>
                        <div className="my-2 w-16 h-18 text-black">
                          <svg viewBox="0 0 100 110" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 40 18 L 50 26 L 60 18 L 54 12 L 46 12 Z" />
                            <path d="M 33 28 L 18 38 L 14 78 L 22 78 L 26 50 L 33 50 L 33 92 L 67 92 L 67 50 L 74 50 L 78 78 L 86 78 L 82 38 L 67 28" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-black">{c.fullSleeveLabel}</h4>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 5: COLLAR, CUFFS & MONOGRAM */}
                {currentStep === 5 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div>
                      <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-black block mb-1.5">
                        {c.collarLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {c.collarStyles.map((collar) => {
                          const selected = customFit.collarStyle === collar.name;
                          return (
                            <button
                              key={collar.name}
                              onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: collar.name }))}
                              className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer group ${
                                selected
                                  ? "bg-black text-white shadow-sm ring-1 ring-black"
                                  : "bg-[#F5F4F0] hover:bg-neutral-200 text-black border border-[#E5E3DD]"
                              }`}
                            >
                              <span className="w-10 h-8 shrink-0 flex items-center justify-center">
                                {collar.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={collar.image} alt="" className="w-full h-full object-contain rounded" />
                                ) : (
                                  <CollarIllustration name={collar.name} className="w-full h-full" />
                                )}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-xs font-bold leading-tight">{collar.name}</span>
                                {collar.description && (
                                  <span className={`block text-[9.5px] leading-tight mt-0.5 ${selected ? "text-white/70" : "text-[#666666] group-hover:text-black"}`}>
                                    {collar.description}
                                  </span>
                                )}
                              </span>
                              {selected && <Check size={13} className="shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {isFullSleeve && (
                      <div>
                        <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-black block mb-1.5">
                          {c.cuffLabel}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {c.cuffStyles.map((cuff) => {
                            const selected = customFit.cuffStyle === cuff.name;
                            return (
                              <button
                                key={cuff.name}
                                onClick={() => setCustomFit((prev) => ({ ...prev, cuffStyle: cuff.name }))}
                                className={`p-2 rounded-xl text-center text-[11px] font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                                  selected
                                    ? "bg-black text-white shadow-sm ring-1 ring-black"
                                    : "bg-[#F5F4F0] hover:bg-neutral-200 text-black border border-[#E5E3DD]"
                                }`}
                              >
                                <span className="w-12 h-9 flex items-center justify-center">
                                  {cuff.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={cuff.image} alt="" className="w-full h-full object-contain rounded" />
                                  ) : (
                                    <CuffIllustration name={cuff.name} className="w-full h-full" />
                                  )}
                                </span>
                                <span className="leading-tight">{cuff.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-black block mb-1">
                          {c.monogramLabel}
                        </label>
                        <input
                          type="text"
                          maxLength={3}
                          value={customFit.initials}
                          onChange={(e) => setCustomFit((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                          className="w-full bg-[#F5F4F0] border border-[#E5E3DD] rounded-xl px-3 py-2 text-sm font-bold tracking-widest uppercase text-black focus:outline-none focus:border-black"
                          placeholder={c.monogramPlaceholder}
                        />
                      </div>

                      <div>
                        <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-black block mb-1">
                          {c.threadLabel}
                        </label>
                        <select
                          value={customFit.threadColor}
                          onChange={(e) => setCustomFit((prev) => ({ ...prev, threadColor: e.target.value }))}
                          className="w-full bg-[#F5F4F0] border border-[#E5E3DD] rounded-xl px-3 py-2 text-xs font-bold uppercase text-black focus:outline-none focus:border-black"
                        >
                          {c.threadColors.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 6: REVIEW */}
                {currentStep === 6 && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Selected Garment Summary Strip */}
                    <div className="flex items-center gap-3 bg-[#F5F4F0] border border-[#E5E3DD] rounded-2xl p-3">
                      {product?.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={productName}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E5E3DD] shrink-0"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#666666] block">
                          Tailoring Garment
                        </span>
                        <h4 className="text-xs font-bold uppercase text-black truncate">
                          {productName}
                        </h4>
                      </div>
                    </div>

                    <div className="bg-[#F5F4F0] border border-[#E5E3DD] rounded-2xl p-4 space-y-2 text-xs shadow-xs">
                      <div className="flex justify-between border-b border-[#E5E3DD] pb-1.5">
                        <span className="text-[#666666]">{c.reviewLabels.measurements}</span>
                        <strong className="text-black">{customFit.chestSize}&quot; / {customFit.collarSize}&quot; / {customFit.shoulderSize}&quot;</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#E5E3DD] pb-1.5">
                        <span className="text-[#666666]">{c.reviewLabels.bodyFit}</span>
                        <strong className="text-black uppercase">{customFit.bodyFit} Fit</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#E5E3DD] pb-1.5">
                        <span className="text-[#666666]">{c.reviewLabels.height}</span>
                        <strong className="text-black">{getHeightCleanTitle(customFit.height)}</strong>
                      </div>
                      <div className="flex justify-between border-b border-[#E5E3DD] pb-1.5">
                        <span className="text-[#666666]">{c.reviewLabels.sleevesCollar}</span>
                        <strong className="text-black uppercase">{customFit.sleeveType} Sleeve | {customFit.collarStyle}</strong>
                      </div>
                      {isFullSleeve && (
                        <div className="flex justify-between border-b border-[#E5E3DD] pb-1.5">
                          <span className="text-[#666666]">{c.reviewLabels.cuffPocket}</span>
                          <strong className="text-black uppercase">{customFit.cuffStyle} | {customFit.pocket}</strong>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#666666]">{c.reviewLabels.monogram}</span>
                        <strong className="text-black uppercase">{customFit.initials || "None"} ({customFit.threadColor})</strong>
                      </div>
                      {customizationFee > 0 && (
                        <div className="flex justify-between border-t border-[#E5E3DD] pt-1.5">
                          <span className="text-[#666666]">{c.reviewLabels.customizationFee}</span>
                          <strong className="text-black">+ {formatMoney(customizationFee, currencySymbol)}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BOTTOM NAVIGATION ACTIONS */}
                <div className="mt-5 pt-3 border-t border-[#E5E3DD] flex items-center justify-between gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevStep}
                      className="px-5 py-3.5 bg-white hover:bg-neutral-100 text-black border border-[#E5E3DD] rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <ArrowLeft size={13} />
                      <span>{c.backLabel}</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    disabled={submitting}
                    className="flex-1 disabled:opacity-60 disabled:cursor-wait bg-black hover:bg-neutral-800 text-white py-4 px-6 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-sm hover:shadow cursor-pointer"
                  >
                    <span>{currentStep === totalSteps ? (submitting ? c.addingLabel : c.confirmLabel) : c.continueLabel}</span>
                    <span className="text-[10px] opacity-75 font-normal tracking-widest">{currentStep} OF {totalSteps}</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

          </div>

        </div>

      </div>

    </div>
  );
}
