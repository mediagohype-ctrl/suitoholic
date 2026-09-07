"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import InteractiveMannequin from "@/components/InteractiveMannequin";
import { ChevronRight, ArrowRight, Check, Sparkles, Eye, Edit3 } from "lucide-react";
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
  shirtPattern: string;
  humanModelView?: boolean;
}

export default function CustomShirtConfigurator() {
  const [currentStep, setCurrentStep] = useState<number>(1);
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
    shirtPattern: "plain",
    humanModelView: false,
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Chest measurement mapping
  const chestMeasurementsMap: Record<number, { collar: number; shoulder: number }> = {
    38: { collar: 15.0, shoulder: 17.5 },
    39: { collar: 15.25, shoulder: 17.75 },
    40: { collar: 15.5, shoulder: 18.0 },
    41: { collar: 15.75, shoulder: 18.25 },
    42: { collar: 16.0, shoulder: 18.5 },
    44: { collar: 16.5, shoulder: 19.0 },
    46: { collar: 17.0, shoulder: 19.5 },
    48: { collar: 17.5, shoulder: 20.0 },
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
  // Step 8 is the Final Review step matching the last reference image
  const totalSteps = isFullSleeve ? 8 : 7;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
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
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE3D2]">
      <Header activeTab="custom-fit" />

      {/* TOP HEADER SELECTION BAR */}
      <div className="bg-[#1F1C18] text-[#EAE3D2] py-2.5 px-4 shadow-inner border-b border-[#9E7D52]/30 sticky top-[62px] z-40">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="bg-[#9E7D52] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
              YOUR SELECTION
            </span>
            <span className="text-[#C5A069] font-medium hidden sm:inline">Tailored Specs:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-medium text-[11px]">
            <span className="bg-white/10 px-2 py-0.5 rounded">Chest: <strong className="text-white">{customFit.chestSize}&quot;</strong></span>
            <span className="bg-white/10 px-2 py-0.5 rounded capitalize">Fit: <strong className="text-white">{customFit.bodyFit}</strong></span>
            <span className="bg-white/10 px-2 py-0.5 rounded">Height: <strong className="text-white">{customFit.height.split(" ")[0]}</strong></span>
            <span className="bg-white/10 px-2 py-0.5 rounded uppercase">Sleeve: <strong className="text-white">{customFit.sleeveType}</strong></span>
            {isFullSleeve && customFit.initials && (
              <span className="bg-[#9E7D52]/40 text-[#EAE3D2] px-2 py-0.5 rounded border border-[#9E7D52]">
                Initials: <strong className="text-white">{customFit.initials}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10">
        {/* BREADCRUMB HEADER */}
        <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-[#5C554C] uppercase mb-4">
          <div className="flex items-center space-x-2">
            <Link href="/" className="hover:text-[#9E7D52]">HOME</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-[#9E7D52]">CUSTOM SHIRT</Link>
            <ChevronRight size={14} />
            <span className="text-[#1F1C18]">
              {currentStep === totalSteps ? "REVIEW" : `STEP ${currentStep} OF ${totalSteps - 1}`}
            </span>
          </div>

          {/* HUMAN MODEL SWITCHER (Client note: "at finalazition we will keep human model so that they can assume how acutally it looks") */}
          <button
            onClick={() => setCustomFit((prev) => ({ ...prev, humanModelView: !prev.humanModelView }))}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow ${
              customFit.humanModelView
                ? "bg-[#9E7D52] text-white ring-2 ring-[#9E7D52]"
                : "bg-[#E4DCC9] text-[#1F1C18] border border-[#D3C9B4] hover:bg-[#DED5BE]"
            }`}
          >
            <Eye size={14} /> {customFit.humanModelView ? "Human Model View Active" : "Switch to Human Model View"}
          </button>
        </div>

        {/* MAIN 2-COLUMN VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: 3D MANNEQUIN / HUMAN MODEL VISUALIZER */}
          <div className="lg:col-span-7 bg-[#E4DCC9] border border-[#D3C9B4] rounded-2xl p-4 sm:p-6 shadow-lg sticky top-[120px]">
            <div className="text-center mb-2">
              <span className="font-serif-luxury text-sm font-semibold tracking-widest text-[#9E7D52] uppercase">
                {customFit.humanModelView ? "HUMAN MODEL PREVIEW MODE" : "A SHIRT MADE FOR YOU."}
              </span>
            </div>

            <InteractiveMannequin customFit={customFit} currentStep={currentStep} />
          </div>

          {/* RIGHT COLUMN: STEP WIZARD & FINAL REVIEW CARDS */}
          <div className="lg:col-span-5 bg-[#FAF6EE] border border-[#D3C9B4] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[580px]">
            <div>
              {/* Step counter header */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#D3C9B4]">
                <span className="text-xs font-bold tracking-[0.2em] text-[#9E7D52] uppercase">
                  {currentStep === totalSteps ? `STEP ${totalSteps} OF ${totalSteps}` : `STEP ${currentStep} OF ${totalSteps - 1}`}
                </span>
                <div className="flex items-center space-x-1.5">
                  {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
                    <div
                      key={s}
                      onClick={() => setCurrentStep(s)}
                      className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                        s === currentStep ? "bg-[#9E7D52] scale-125 shadow" : s < currentStep ? "bg-[#1F1C18]" : "bg-[#D3C9B4]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* STEP 1: Chest Size */}
              {currentStep === 1 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      SELECT YOUR CHEST SIZE
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Choose your chest size for the perfect fit.
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {[38, 39, 40, 41, 42, 44, 46, 48].map((size) => (
                      <button
                        key={size}
                        onClick={() => handleChestSelect(size)}
                        className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                          customFit.chestSize === size
                            ? "bg-[#1F1C18] text-[#EAE3D2] border-[#1F1C18] shadow-lg scale-105"
                            : "bg-[#E4DCC9] text-[#1F1C18] border-[#D3C9B4] hover:bg-[#DED5BE]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="bg-[#E4DCC9] border border-[#9E7D52]/40 rounded-xl p-4 shadow-md">
                    <div className="grid grid-cols-3 gap-2 text-center divide-x divide-[#D3C9B4]">
                      <div>
                        <span className="block text-[10px] text-[#5C554C] uppercase">Chest Size</span>
                        <strong className="text-base font-bold text-[#1F1C18]">{customFit.chestSize}&quot;</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#5C554C] uppercase">Collar Size</span>
                        <strong className="text-base font-bold text-[#1F1C18]">{customFit.collarSize}&quot;</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-[#5C554C] uppercase">Shoulder</span>
                        <strong className="text-base font-bold text-[#1F1C18]">{customFit.shoulderSize}&quot;</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Body Fit */}
              {currentStep === 2 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      CHOOSE YOUR BODY TYPE
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Select your body fit preference. Mannequin stomach scales in real-time.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: "lean", title: "LEAN FIT", desc: `Your chest is ${customFit.chestSize}" and your stomach is 34".` },
                      { id: "regular", title: "REGULAR FIT", desc: `Your chest is ${customFit.chestSize}" and your stomach is 36".` },
                      { id: "tummy", title: "TUMMY COMFORT FIT", desc: `Your chest is ${customFit.chestSize}" and stomach size is 39" - 40".` },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setCustomFit((prev) => ({ ...prev, bodyFit: opt.id as any }))}
                        className={`cursor-pointer rounded-xl p-4 transition-all border flex items-start space-x-4 ${
                          customFit.bodyFit === opt.id
                            ? "bg-[#E4DCC9] border-[#9E7D52] shadow-md ring-2 ring-[#9E7D52]"
                            : "bg-[#EAE3D2]/50 border-[#D3C9B4] hover:bg-[#E4DCC9]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${
                          customFit.bodyFit === opt.id ? "border-[#9E7D52] bg-[#9E7D52]" : "border-[#5C554C]"
                        }`}>
                          {customFit.bodyFit === opt.id && <Check size={12} className="text-white" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm tracking-wider uppercase text-[#1F1C18]">{opt.title}</h4>
                          <p className="text-xs text-[#5C554C] mt-1">{opt.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Height */}
              {currentStep === 3 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      SELECT YOUR HEIGHT
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Choose the height option that fits you.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: "REGULAR HEIGHT (5.5 - 5.7\")", title: "REGULAR HEIGHT", range: "Height: 5.5 – 5.7\"", specs: "Shirt Length: 27.5\" | Sleeve Length: 23.75\"" },
                      { id: "TALL HEIGHT (5.8 - 5.10\")", title: "TALL HEIGHT", range: "Height: 5.8 – 5.10\"", specs: "Shirt Length: 29\" | Sleeve Length: 24.5\"" },
                      { id: "EXTRA TALL HEIGHT (5.11 - 6.2\")", title: "EXTRA TALL HEIGHT", range: "Height: 5.11 – 6.2\"", specs: "Shirt Length: 30.5\" | Sleeve Length: 26.5\"" },
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCustomFit((prev) => ({ ...prev, height: item.id }))}
                        className={`cursor-pointer rounded-xl p-4 transition-all border flex items-center justify-between ${
                          customFit.height === item.id
                            ? "bg-[#E4DCC9] border-[#9E7D52] ring-2 ring-[#9E7D52] shadow-md"
                            : "bg-[#EAE3D2]/50 border-[#D3C9B4] hover:bg-[#E4DCC9]"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            customFit.height === item.id ? "border-[#9E7D52] bg-[#9E7D52]" : "border-[#5C554C]"
                          }`}>
                            {customFit.height === item.id && <Check size={12} className="text-white" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs tracking-wider uppercase text-[#1F1C18]">{item.title}</h4>
                            <p className="text-[11px] text-[#5C554C]">{item.range}</p>
                            <p className="text-[10px] text-[#9E7D52] font-medium">{item.specs}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Sleeves */}
              {currentStep === 4 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      SELECT YOUR SLEEVES
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Choose the sleeve type that you prefer.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "half", label: "HALF SLEEVE" },
                      { id: "full", label: "FULL SLEEVE" },
                    ].map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setCustomFit((prev) => ({ ...prev, sleeveType: s.id as any }))}
                        className={`cursor-pointer rounded-2xl p-6 border text-center transition-all ${
                          customFit.sleeveType === s.id
                            ? "bg-[#E4DCC9] border-[#9E7D52] ring-2 ring-[#9E7D52] shadow-xl"
                            : "bg-[#EAE3D2]/50 border-[#D3C9B4] hover:bg-[#E4DCC9]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 mx-auto mb-3 flex items-center justify-center ${
                          customFit.sleeveType === s.id ? "border-[#9E7D52] bg-[#9E7D52]" : "border-[#5C554C]"
                        }`}>
                          {customFit.sleeveType === s.id && <Check size={12} className="text-white" />}
                        </div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#1F1C18]">{s.label}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: Collar and Cuff */}
              {currentStep === 5 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      SELECT YOUR COLLAR {isFullSleeve && "AND CUFF"} STYLE
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Choose the collar {isFullSleeve && "and cuff"} style that defines your look.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#1F1C18] uppercase mb-3">
                      COLLAR STYLE
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {["CUTAWAY COLLAR", "MANDARIN COLLAR", "BUTTON DOWN COLLAR"].map((col) => (
                        <button
                          key={col}
                          onClick={() => setCustomFit((prev) => ({ ...prev, collarStyle: col }))}
                          className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border text-center transition-all ${
                            customFit.collarStyle === col
                              ? "bg-[#E4DCC9] border-[#9E7D52] ring-2 ring-[#9E7D52]"
                              : "bg-[#EAE3D2]/50 border-[#D3C9B4]"
                          }`}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isFullSleeve && (
                    <div className="border-t border-[#D3C9B4] pt-4 animate-fade-in">
                      <label className="block text-xs font-bold tracking-wider text-[#1F1C18] uppercase mb-3">
                        CUFF STYLE
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        {["CLASSIC CUFF", "CUFFLINK CUFF"].map((cuff) => (
                          <button
                            key={cuff}
                            onClick={() => setCustomFit((prev) => ({ ...prev, cuffStyle: cuff }))}
                            className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider border text-center transition-all ${
                              customFit.cuffStyle === cuff
                                ? "bg-[#E4DCC9] border-[#9E7D52] ring-2 ring-[#9E7D52]"
                                : "bg-[#EAE3D2]/50 border-[#D3C9B4]"
                            }`}
                          >
                            {cuff}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 6: Pocket */}
              {currentStep === 6 && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      SELECT YOUR POCKET STYLE
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Choose the pocket style that you prefer.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: "pocket", label: "WITH POCKET" },
                      { id: "no-pocket", label: "WITHOUT POCKET" },
                    ].map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setCustomFit((prev) => ({ ...prev, pocket: p.id as any }))}
                        className={`cursor-pointer rounded-2xl p-6 border text-center transition-all ${
                          customFit.pocket === p.id
                            ? "bg-[#E4DCC9] border-[#9E7D52] ring-2 ring-[#9E7D52] shadow-md"
                            : "bg-[#EAE3D2]/50 border-[#D3C9B4]"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 mx-auto mb-3 flex items-center justify-center ${
                          customFit.pocket === p.id ? "border-[#9E7D52] bg-[#9E7D52]" : "border-[#5C554C]"
                        }`}>
                          {customFit.pocket === p.id && <Check size={12} className="text-white" />}
                        </div>
                        <h4 className="font-bold text-xs tracking-wider uppercase text-[#1F1C18]">{p.label}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Initials (Only Full Sleeve) */}
              {currentStep === 7 && isFullSleeve && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      ADD YOUR INITIALS
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Personalize your cuff with up to 3 letters.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-wider text-[#1F1C18] uppercase mb-2">
                      ENTER YOUR INITIALS
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={3}
                        value={customFit.initials}
                        onChange={(e) => setCustomFit((prev) => ({ ...prev, initials: e.target.value.toUpperCase() }))}
                        placeholder="e.g. A K"
                        className="w-full bg-[#E4DCC9] border border-[#D3C9B4] px-4 py-3 rounded-xl font-serif-luxury font-bold text-xl text-[#1F1C18] tracking-widest uppercase focus:outline-none focus:border-[#9E7D52]"
                      />
                      <span className="absolute right-4 top-3 text-xs text-[#5C554C]">
                        {customFit.initials.length}/3
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#D3C9B4] pt-4">
                    <label className="block text-xs font-bold tracking-wider text-[#1F1C18] uppercase mb-3">
                      CHOOSE THREAD COLOUR
                    </label>
                    <div className="flex items-center space-x-4">
                      {[
                        { id: "red", label: "Red", bg: "bg-red-700" },
                        { id: "blue", label: "Blue", bg: "bg-blue-800" },
                        { id: "black", label: "Black", bg: "bg-black" },
                        { id: "rust", label: "Rust", bg: "bg-amber-800" },
                        { id: "grey", label: "Grey", bg: "bg-gray-600" },
                      ].map((tc) => (
                        <button
                          key={tc.id}
                          onClick={() => setCustomFit((prev) => ({ ...prev, threadColor: tc.id }))}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className={`w-8 h-8 rounded-full ${tc.bg} border-2 ${
                            customFit.threadColor === tc.id ? "border-[#9E7D52] scale-110 shadow-lg" : "border-transparent"
                          } transition-all`} />
                          <span className="text-[10px] text-[#5C554C] group-hover:text-[#1F1C18]">{tc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FINAL REVIEW STEP: EXACT MATCH OF LAST REFERENCE IMAGE */}
              {currentStep === totalSteps && (
                <div className="animate-fade-in space-y-5">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-wider text-[#1F1C18] uppercase mb-1">
                      REVIEW YOUR SELECTIONS
                    </h2>
                    <p className="text-xs text-[#5C554C]">
                      Your custom shirt summary. Review and confirm your perfect fit.
                    </p>
                  </div>

                  {orderSubmitted ? (
                    <div className="bg-[#1F1C18] text-[#EAE3D2] p-6 rounded-2xl text-center space-y-3 shadow-2xl">
                      <Sparkles size={36} className="text-[#9E7D52] mx-auto animate-bounce" />
                      <h3 className="font-serif-luxury text-xl font-bold text-[#EAE3D2] uppercase">
                        CUSTOM SHIRT ORDER SAVED!
                      </h3>
                      <p className="text-xs text-[#D4C3A3]">
                        Thank you for trusting the Suitoholic vision. Your specs have been dispatched to master tailors.
                      </p>
                      <button
                        onClick={() => {
                          setOrderSubmitted(false);
                          setCurrentStep(1);
                        }}
                        className="mt-2 inline-block bg-[#9E7D52] text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                      >
                        CREATE ANOTHER FIT
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#9E7D52] block mb-2">
                        YOUR CUSTOM SHIRT SUMMARY
                      </span>

                      {/* 1. FABRIC */}
                      <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">1. FABRIC</span>
                          <strong className="text-xs font-bold text-[#1F1C18]">White Oxford</strong>
                        </div>
                        <button onClick={() => setCurrentStep(1)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                      </div>

                      {/* 2. SIZE & FIT */}
                      <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">2. SIZE & FIT</span>
                          <strong className="text-xs font-bold text-[#1F1C18]">Chest Size: {customFit.chestSize} | {customFit.bodyFit === "lean" ? "Lean Fit" : customFit.bodyFit === "regular" ? "Regular Fit" : "Tummy Comfort Fit"}</strong>
                        </div>
                        <button onClick={() => setCurrentStep(1)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                      </div>

                      {/* 3. HEIGHT */}
                      <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">3. HEIGHT</span>
                          <strong className="text-xs font-bold text-[#1F1C18]">{customFit.height}</strong>
                        </div>
                        <button onClick={() => setCurrentStep(3)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                      </div>

                      {/* 4. SLEEVE */}
                      <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">4. SLEEVE</span>
                          <strong className="text-xs font-bold text-[#1F1C18] uppercase">{customFit.sleeveType} Sleeves</strong>
                        </div>
                        <button onClick={() => setCurrentStep(4)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                      </div>

                      {/* 5. COLLAR & CUFF */}
                      <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">5. COLLAR & CUFF</span>
                          <strong className="text-xs font-bold text-[#1F1C18]">{customFit.collarStyle} {isFullSleeve ? `| ${customFit.cuffStyle}` : ""}</strong>
                        </div>
                        <button onClick={() => setCurrentStep(5)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                      </div>

                      {/* 6. POCKET STYLE */}
                      <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">6. POCKET STYLE</span>
                          <strong className="text-xs font-bold text-[#1F1C18]">{customFit.pocket === "pocket" ? "With Pocket" : "Without Pocket"}</strong>
                        </div>
                        <button onClick={() => setCurrentStep(6)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                      </div>

                      {/* 7. INITIALS (If Full Sleeves) */}
                      {isFullSleeve && (
                        <div className="bg-[#E4DCC9] border border-[#D3C9B4] rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#9E7D52] block">7. INITIALS</span>
                            <strong className="text-xs font-bold text-[#1F1C18]">{customFit.initials || "A K"} ({customFit.threadColor || "Black"} Thread)</strong>
                          </div>
                          <button onClick={() => setCurrentStep(7)} className="text-xs text-[#5C554C] hover:text-[#9E7D52]"><Edit3 size={14} /></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS (GO BACK / CONFIRM & PROCEED) */}
            <div className="pt-6 border-t border-[#D3C9B4] flex items-center justify-between mt-6">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  currentStep === 1
                    ? "opacity-30 cursor-not-allowed bg-gray-300 text-gray-600"
                    : "bg-[#E4DCC9] text-[#1F1C18] hover:bg-[#DED5BE]"
                }`}
              >
                GO BACK
              </button>

              <button
                onClick={currentStep === totalSteps ? triggerCelebration : handleNextStep}
                className="bg-[#1F1C18] hover:bg-[#9E7D52] text-[#EAE3D2] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center space-x-2"
              >
                <span>{currentStep === totalSteps ? "CONFIRM & PROCEED" : "CONTINUE"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
