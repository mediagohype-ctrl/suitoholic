"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FabricCategoryQuickRow from "@/components/FabricCategoryQuickRow";
import MensFabricShowcaseGrid from "@/components/MensFabricShowcaseGrid";
import { 
  ArrowRight, 
  Check, 
  ZoomIn, 
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Plus,
  Scissors,
  Maximize2,
  X,
  CheckCircle2
} from "lucide-react";

import { apiFetch, ApiError } from "@/lib/api";
import { useContent } from "@/context/SiteDataProvider";

export default function FabricsPage() {
  const c = useContent("fabricsPage");
  const fabrics = c.fabrics ?? [];
  const heroSlides = c.hero?.slides ?? [];
  const studio = c.studio;
  const editorial = c.editorial;
  const zoom = c.zoomModal;
  const swatch = c.swatchRequest;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeFabricId, setActiveFabricId] = useState<string | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [swatchModalOpen, setSwatchModalOpen] = useState<boolean>(false);
  const [swatchRequested, setSwatchRequested] = useState<boolean>(false);
  const [savedFabrics, setSavedFabrics] = useState<Set<string>>(new Set());
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const [swatchName, setSwatchName] = useState("");
  const [swatchAddress, setSwatchAddress] = useState("");
  const [swatchPhone, setSwatchPhone] = useState("");
  const [swatchEmail, setSwatchEmail] = useState("");
  const [swatchSubmitting, setSwatchSubmitting] = useState(false);
  const [swatchError, setSwatchError] = useState<string | null>(null);

  // Falls back to the first fabric; undefined only if the CMS list is empty.
  const activeFabric = fabrics.find((f) => f.id === activeFabricId) ?? fabrics[0];
  const heroSlide = heroSlides.length > 0 ? heroSlides[activeHeroSlide % heroSlides.length] : undefined;
  const customizeBase = studio?.customizeLink || "/custom-shirt";

  const filteredFabrics = selectedCategory === "all"
    ? fabrics
    : fabrics.filter((f) => f.category === selectedCategory);

  const handleHorizontalScroll = (direction: "left" | "right") => {
    if (horizontalScrollRef.current) {
      const scrollAmount = horizontalScrollRef.current.clientWidth * 0.75;
      horizontalScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleSaveFabric = (id: string) => {
    setSavedFabrics((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleSwatchRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFabric || swatchSubmitting) return;
    const phone = swatchPhone.trim();
    const email = swatchEmail.trim();
    if (!phone && !email) {
      setSwatchError(swatch?.contactRequiredMessage ?? null);
      return;
    }
    setSwatchSubmitting(true);
    setSwatchError(null);
    try {
      await apiFetch("/inquiries", {
        method: "POST",
        body: {
          type: "swatch_request",
          name: swatchName.trim(),
          address: swatchAddress.trim(),
          phone,
          ...(email ? { email } : {}),
          subject: activeFabric.name,
          message: "",
        },
      });
      setSwatchRequested(true);
      setSwatchName("");
      setSwatchAddress("");
      setSwatchPhone("");
      setSwatchEmail("");
      setTimeout(() => {
        setSwatchModalOpen(false);
        setSwatchRequested(false);
      }, 2500);
    } catch (err) {
      setSwatchError(err instanceof ApiError && err.message ? err.message : swatch?.errorMessage ?? null);
    } finally {
      setSwatchSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header with active 'fabrics' tab indicator */}
      <Header activeTab="fabrics" />

      {/* ========================================================================= */}
      {/* 1. 100% PURE VISUAL FABRIC HERO BANNER (ZERO TEXT OVERLAYS ON IMAGE)      */}
      {/* ========================================================================= */}
      <section className="relative w-full pt-36 sm:pt-44 lg:pt-48 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1780px] w-full mx-auto space-y-4">
          
          {/* Main Pure Visual Fabric Showcase Frame (100% Clean Image, No Text) */}
          <div className="relative w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[540px] xl:h-[580px] rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden bg-[#1E1914] shadow-xl border border-white/60 group">
            
            {/* Active Hero Image */}
            {heroSlide && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroSlide.image}
                alt={heroSlide.title}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
            )}

            {/* Left & Right Hero Navigation Arrows */}
            <button
              onClick={() => setActiveHeroSlide((prev) => { const n = heroSlides.length; if (n === 0) return 0; const cur = prev % n; return cur === 0 ? n - 1 : cur - 1; })}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label={c.hero?.prevAriaLabel}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setActiveHeroSlide((prev) => { const n = heroSlides.length; if (n === 0) return 0; const cur = prev % n; return cur === n - 1 ? 0 : cur + 1; })}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label={c.hero?.nextAriaLabel}
            >
              <ChevronRight size={20} />
            </button>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. HORIZONTAL FABRIC CATEGORIES ROW (MATCHING REFERENCE SCREENSHOT)       */}
      {/* ========================================================================= */}
      <FabricCategoryQuickRow
        activeCategoryId={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          const studioEl = document.getElementById("swatches-studio");
          if (studioEl) {
            studioEl.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      {/* ========================================================================= */}
      {/* 3. MASTER INTERACTIVE SWATCHES STUDIO & ARCHIVE                           */}
      {/* ========================================================================= */}
      <main id="swatches-studio" className="relative flex-1 w-full max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 space-y-10 sm:space-y-14">
        
        {/* Section Header & Filter Tabs */}
        <div className="space-y-4 border-b border-[#D5C2AF] pb-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal uppercase leading-tight text-[#14110E]">
                {studio?.heading}
              </h2>
              <p className="text-xs sm:text-sm text-[#55473A] font-sans mt-0.5 max-w-xl">
                {studio?.subheading}
              </p>
            </div>

            {/* Refined Filter Tabs Bar */}
            <div className="flex flex-wrap items-center gap-2">
              {(studio?.filterTabs ?? []).map((tab) => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.14em] uppercase px-4 py-2 rounded-xl transition-all duration-200 border cursor-pointer ${
                      isActive
                        ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-sm ring-1 ring-[#14110E]"
                        : "bg-[#FAF5EF] hover:bg-white text-[#14110E] border-[#D5C2AF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Master 12-Column Swatch Inspection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          {/* Left Column (5 Cols): Active Fabric Spec Card */}
          {activeFabric && (
          <div className="lg:col-span-5 bg-[#FAF5EF] border border-[#D5C2AF] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm">
            
            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between border-b border-[#D5C2AF]/80 pb-2.5">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase font-sans">
                  {activeFabric.categoryLabel}
                </span>
                <span className="font-mono text-xs font-bold text-[#14110E] bg-white px-3 py-1 rounded-lg border border-[#D5C2AF] shadow-2xs">
                  {activeFabric.code}
                </span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold uppercase text-[#14110E] leading-snug">
                {activeFabric.name}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#55473A] font-sans leading-relaxed">
                {activeFabric.description}
              </p>
            </div>

            {/* Macro Texture Preview Box with Zoom Feature */}
            <div 
              onClick={() => setZoomModalOpen(true)}
              className="relative rounded-2xl overflow-hidden h-[240px] sm:h-[280px] bg-[#1E1914] border border-[#D5C2AF] shadow-inner cursor-zoom-in group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-3 right-3 bg-[#14110E]/90 backdrop-blur-md text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 shadow-md">
                <ZoomIn size={13} className="text-[#C5A069]" />
                <span>{studio?.magnifyLabel}</span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">{studio?.specLabels?.composition}</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.composition}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">{studio?.specLabels?.yarnCount}</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.yarnCount}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">{studio?.specLabels?.weaveWeight}</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.gsm} • {activeFabric.weight}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#D5C2AF]/70 space-y-0.5 shadow-2xs">
                <span className="text-[9px] uppercase font-bold text-[#8C6D47] block font-sans">{studio?.specLabels?.breathability}</span>
                <span className="font-semibold text-[#14110E] text-[11px] block">{activeFabric.breathability}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <Link
                href={`${customizeBase}?fabric=${encodeURIComponent(activeFabric.code)}`}
                className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-md group/btn"
              >
                <span>{studio?.customizeLabel}</span>
                <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => { setSwatchError(null); setSwatchModalOpen(true); }}
                className="w-full bg-white hover:bg-[#FAF5EF] text-[#14110E] border border-[#D5C2AF] text-[11px] font-bold tracking-[0.16em] py-2.5 rounded-xl transition-all duration-200 uppercase cursor-pointer shadow-2xs"
              >
                {studio?.requestSwatchLabel}
              </button>
            </div>

          </div>
          )}

          {/* Right Column (7 Cols): Swatches Grid Card Gallery */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5 items-stretch">
            {filteredFabrics.map((fabric) => {
              const isSelected = activeFabric?.id === fabric.id;
              return (
                <div
                  key={fabric.id}
                  onClick={() => setActiveFabricId(fabric.id)}
                  className={`rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 transition-all duration-300 border flex flex-col justify-between space-y-3 cursor-pointer group ${
                    isSelected
                      ? "bg-[#14110E] text-white border-[#14110E] shadow-xl ring-2 ring-[#9E774C]/60 scale-[1.02]"
                      : "bg-[#FAF5EF] hover:bg-white text-[#14110E] border-[#D5C2AF] hover:border-[#9E774C] shadow-2xs"
                  }`}
                >
                  {/* Swatch Square Image */}
                  <div className="relative rounded-xl overflow-hidden aspect-square w-full bg-[#221B16] border border-[#D5C2AF]/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Selected Check Pill */}
                    {isSelected && (
                      <div className="absolute top-2.5 right-2.5 bg-[#9E774C] text-white p-1.5 rounded-full shadow-md">
                        <Check size={13} strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Swatch Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9.5px] font-bold tracking-wider uppercase font-mono ${
                          isSelected ? "text-[#D8C7B5]" : "text-[#8C6D47]"
                        }`}
                      >
                        {fabric.code}
                      </span>
                      <span
                        className={`text-[8.5px] font-semibold uppercase ${
                          isSelected ? "text-white/60" : "text-[#6E5D4F]"
                        }`}
                      >
                        {fabric.category.replace("_", " & ").toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-serif-luxury text-xs sm:text-sm font-bold uppercase tracking-tight leading-snug line-clamp-1">
                      {fabric.name}
                    </h4>

                    <p
                      className={`text-[10px] sm:text-[10.5px] font-sans line-clamp-1 ${
                        isSelected ? "text-[#CDBEB0]" : "text-[#55473A]"
                      }`}
                    >
                      {fabric.composition}
                    </p>
                  </div>

                  {/* Click to Inspect Action */}
                  <div className="pt-2 border-t border-current/15 flex items-center justify-between text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider">
                    <span>{isSelected ? studio?.activeSelectionLabel : studio?.inspectLabel}</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. MENSWEAR BESPOKE FABRICS SHOWCASE (MATCHING REFERENCE 4-CARD GRID)     */}
        {/* ========================================================================= */}
        <MensFabricShowcaseGrid
          onSelectCollection={(colId) => {
            const el = document.getElementById("swatches-studio");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* ========================================================================= */}
        {/* 4. MID-PAGE EDITORIAL BANNER: BESPOKE CUTTING TABLE                       */}
        {/* ========================================================================= */}
        <section className="rounded-3xl border border-[#D5C2AF] bg-[#FAF5EF] p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (7 Cols): Narrative & 3 Metric Cards */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-2 bg-[#EFE5D9] px-3.5 py-1.5 rounded-full border border-[#D5C2AF]">
                <Scissors size={13} className="text-[#8C6D47]" />
                <span className="text-[10px] sm:text-[10.5px] font-bold tracking-[0.22em] text-[#8C6D47] uppercase font-mono">
                  {editorial?.eyebrow}
                </span>
              </div>

              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal uppercase leading-[1.08] tracking-tight text-[#14110E]">
                {editorial?.headingLine1}{" "}<br className="hidden sm:inline" />
                {editorial?.headingLine2}
              </h2>

              <p className="text-xs sm:text-sm text-[#55473A] font-sans leading-relaxed">
                {editorial?.body}
              </p>

              {/* 3 Metric Stats Cards */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
                {(editorial?.stats ?? []).map((stat, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-[#D5C2AF]/80 space-y-0.5 shadow-2xs">
                    <span className="font-serif-luxury text-base sm:text-xl font-bold text-[#8C6D47] block">{stat.value}</span>
                    <span className="text-[10px] uppercase font-bold text-[#14110E] block">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5 Cols): Bespoke Cutting Table Photography */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D5C2AF] shadow-md h-[240px] sm:h-[300px] relative bg-[#241D17] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editorial?.image || undefined}
                  alt={editorial?.imageAlt}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* MODAL: HIGH RESOLUTION WEAVE MAGNIFIER                                   */}
      {/* ========================================================================= */}
      {zoomModalOpen && activeFabric && (
        <div 
          onClick={() => setZoomModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#14110E] border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 p-6 text-white"
          >
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <span className="font-mono text-xs text-[#C5A069] font-bold block">{activeFabric.code}</span>
                <h3 className="font-serif-luxury text-2xl font-bold uppercase">{activeFabric.name}</h3>
              </div>
              <button
                onClick={() => setZoomModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label={zoom?.closeAriaLabel}
              >
                <X size={20} />
              </button>
            </div>

            {/* Magnified Image Container */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#221B16] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeFabric.image}
                alt={activeFabric.name}
                className="w-full h-full object-cover object-center scale-125 transition-transform duration-700 cursor-zoom-in"
              />
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider border border-white/20">
                {zoom?.magnificationBadge}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#D8C6B3]">
              <div>
                <span className="block font-semibold text-white">{activeFabric.composition}</span>
                <span>{activeFabric.gsm} • {activeFabric.yarnCount}</span>
              </div>
              <Link
                href={`${customizeBase}?fabric=${encodeURIComponent(activeFabric.code)}`}
                className="bg-[#9E774C] hover:bg-[#B38C5F] text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded-xl transition-all shadow-md"
              >
                {zoom?.configuratorLabel}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PHYSICAL SWATCH BOX REQUEST                                        */}
      {/* ========================================================================= */}
      {swatchModalOpen && activeFabric && (
        <div 
          onClick={() => setSwatchModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FAF5EF] border border-[#D5C2AF] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-[#14110E] space-y-5"
          >
            <div className="flex items-center justify-between border-b border-[#D5C2AF] pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase font-mono block">{swatch?.eyebrow}</span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold uppercase">{swatch?.heading}</h3>
              </div>
              <button
                onClick={() => setSwatchModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-[#14110E] transition-colors cursor-pointer"
                aria-label={swatch?.closeAriaLabel}
              >
                <X size={20} />
              </button>
            </div>

            {swatchRequested ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="font-serif-luxury text-lg font-bold uppercase text-[#14110E]">
                  {swatch?.successHeading}
                </h4>
                <p className="text-xs text-[#55473A] max-w-sm mx-auto">
                  {swatch?.successTextBefore} <strong>{activeFabric.name} ({activeFabric.code})</strong> {swatch?.successTextAfter}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSwatchRequest} className="space-y-4 text-left">
                <p className="text-xs text-[#55473A]">
                  {swatch?.introBefore} <strong>{activeFabric.name}</strong> {swatch?.introAfter}
                </p>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={swatch?.namePlaceholder}
                      value={swatchName}
                      onChange={(e) => setSwatchName(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.addressLabel}
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder={swatch?.addressPlaceholder}
                      value={swatchAddress}
                      onChange={(e) => setSwatchAddress(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder={swatch?.phonePlaceholder}
                      value={swatchPhone}
                      onChange={(e) => setSwatchPhone(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#14110E] uppercase text-[10px] tracking-wider mb-1">
                      {swatch?.emailLabel}
                    </label>
                    <input
                      type="email"
                      placeholder={swatch?.emailPlaceholder}
                      value={swatchEmail}
                      onChange={(e) => setSwatchEmail(e.target.value)}
                      className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs text-[#14110E] focus:outline-none focus:ring-1 focus:ring-[#9E774C]"
                    />
                  </div>
                </div>

                {swatchError && (
                  <p role="alert" className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    {swatchError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={swatchSubmitting}
                  aria-busy={swatchSubmitting}
                  className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-xs font-bold tracking-[0.2em] py-3.5 rounded-xl transition-all duration-300 uppercase shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  {swatchSubmitting ? swatch?.submittingLabel : swatch?.submitLabel}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
