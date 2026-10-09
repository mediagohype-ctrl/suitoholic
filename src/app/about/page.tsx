"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import {
  Scissors,
  Ruler,
  ShieldCheck,
  Award,
  ArrowRight,
  Globe2,
  ChevronRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  Truck,
  Layers,
  Shirt,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { useContent } from "@/context/SiteDataProvider";
import { fillTemplate } from "@/content/merge";

// Icon keys usable in the CMS (documented in src/content/sections/aboutPage.ts).
const conciergeIcons: Record<string, LucideIcon> = {
  scissors: Scissors,
  crown: Crown,
  shieldCheck: ShieldCheck,
  ruler: Ruler,
  award: Award,
  globe: Globe2,
  truck: Truck,
  layers: Layers,
  shirt: Shirt,
  clock: Clock,
  phone: Phone,
  mail: Mail,
  calendar: Calendar,
  mapPin: MapPin,
  check: CheckCircle2,
};

// Renders `text`, wrapping the first occurrence of `phrase` in <strong>.
function withHighlight(text: string, phrase: string) {
  const at = phrase ? text.indexOf(phrase) : -1;
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <strong>{phrase}</strong>
      {text.slice(at + phrase.length)}
    </>
  );
}

export default function AboutPage() {
  const c = useContent("aboutPage");
  const [activeBlueprintIndex, setActiveBlueprintIndex] = useState(0);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  const anatomyFeatures = c.anatomy.features;
  const heritageMilestones = c.heritage.milestones;
  // Clamp in case the CMS list is shorter than the remembered index (or empty).
  const blueprintIdx = Math.max(0, Math.min(activeBlueprintIndex, anatomyFeatures.length - 1));
  const milestoneIdx = Math.max(0, Math.min(activeMilestoneIndex, heritageMilestones.length - 1));
  const activeBlueprint = anatomyFeatures[blueprintIdx] as (typeof anatomyFeatures)[number] | undefined;
  const activeMilestone = heritageMilestones[milestoneIdx] as (typeof heritageMilestones)[number] | undefined;

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent text-[#14110E] antialiased">
      {/* Global Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 pt-36 sm:pt-44 lg:pt-48 pb-8 sm:pb-12 lg:pb-16 space-y-12 sm:space-y-16 lg:space-y-20 select-none">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Brand Mission & What Suitoholic Does                     */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] overflow-hidden shadow-[0_20px_50px_rgba(20,17,14,0.06)] p-6 sm:p-10 lg:p-14 xl:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Brand Declaration & Core Business Model */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">

              {/* Main Luxury Serif Heading */}
              <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[52px] xl:text-[60px] font-normal uppercase leading-[1.04] tracking-tight text-[#14110E]">
                {c.hero.titleLine} <br />
                <span className="italic font-light text-[#8C6D47]">
                  {c.hero.titleAccent}
                </span>
              </h1>

              {/* Company Summary */}
              <p className="text-xs sm:text-sm lg:text-[15.5px] text-[#55473A] leading-relaxed font-sans font-normal max-w-xl">
                {withHighlight(c.hero.summary, c.hero.summaryHighlight)}
              </p>

              {/* 4 Core Operational Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-[#D5C2AF]">
                {c.hero.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#14110E] block leading-none">
                      {stat.value}
                    </span>
                    <span className="text-[9.5px] sm:text-[10.5px] text-[#8C6D47] uppercase font-bold tracking-wider block font-sans">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={c.hero.primaryButtonHref}
                  className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-8 sm:px-10 py-4 transition-all duration-300 uppercase shadow-md flex items-center gap-2 group whitespace-nowrap"
                >
                  <span>{c.hero.primaryButtonLabel}</span>
                  <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href={c.hero.secondaryButtonHref}
                  className="bg-transparent hover:bg-black/5 text-[#14110E] border border-[#14110E]/40 hover:border-[#14110E] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-7 sm:px-8 py-4 transition-all duration-300 uppercase whitespace-nowrap"
                >
                  {c.hero.secondaryButtonLabel}
                </Link>
              </div>

            </div>

            {/* Right Column: Authentic Editorial Atelier Cutting Bench Visual (Clean text-free presentation) */}
            <div className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-[#D5C2AF] h-[360px] sm:h-[480px] lg:h-[540px] bg-[#1E1915] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.hero.image}
                alt={c.hero.imageAlt}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                loading="eager"
              />
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. WHAT WE CRAFT: The 4 Core Garment Categories & Services                */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          
          {/* Section Header */}
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              {c.services.titleLine} <br />
              <span className="italic font-light text-[#8C6D47]">{c.services.titleAccent}</span>
            </h2>
          </div>

          {/* 4 Garment Offering Cards Grid matching Home Page Formation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch">
            {c.services.items.map((srv, idx) => (
              <div
                key={`${srv.id}-${idx}`}
                className="group flex flex-col w-full justify-between space-y-3"
              >
                {/* Upper Tall Rounded Image Container - Clean Pure Photography */}
                <div className="relative w-full aspect-[3/4.2] min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#1E1914] shadow-md transition-all duration-500 group-hover:shadow-xl border border-[#D5C2AF]/50">
                  <Link href={srv.link} className="block w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={srv.image}
                      alt={srv.title}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Lower Details Strip: Clean & Short Information */}
                <div className="flex flex-col justify-between space-y-2.5 px-0.5">
                  <div className="space-y-0.5">
                    <Link href={srv.link} className="block">
                      <h3 className="font-serif-luxury text-base sm:text-[17px] font-bold text-[#14110E] group-hover:text-[#9E774C] transition-colors uppercase tracking-tight leading-snug">
                        {srv.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] sm:text-xs text-[#8C6D47] font-medium tracking-wide uppercase font-sans">
                      {srv.tagline}
                    </p>
                  </div>

                  <Link
                    href={srv.link}
                    className="w-full bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[10.5px] sm:text-[11px] font-bold tracking-[0.2em] py-3 rounded-xl transition-all duration-300 uppercase flex items-center justify-center gap-2 shadow-xs group/btn mt-1"
                  >
                    <span>{srv.buttonText}</span>
                    <ArrowRight size={13} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. HOW IT WORKS: The 4-Step Bespoke Journey                               */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#FAF5EF] border border-[#DAC8B6] p-6 sm:p-10 lg:p-14 xl:p-16 space-y-8 lg:space-y-10 shadow-sm">
          
          {/* Section Header */}
          <div className="max-w-2xl space-y-2.5">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              {c.process.titleLine} <br />
              <span className="italic font-light text-[#8C6D47]">{c.process.titleAccent}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D40] font-sans">
              {c.process.intro}
            </p>
          </div>

          {/* 4 Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-2">
            {c.process.steps.map((st, idx) => (
              <div
                key={`${st.step}-${idx}`}
                className="bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl p-6 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl font-bold text-[#9E774C]">
                      {st.step}
                    </span>
                    <span className="text-[9px] font-bold text-[#8C6D47] uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded border border-[#D5C2AF]">
                      {fillTemplate(c.process.phaseLabel, { step: st.step })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm sm:text-[15px] uppercase tracking-wide text-[#14110E]">
                    {st.title}
                  </h3>
                  <div className="text-[11px] font-serif italic text-[#8C6D47]">
                    {st.subtitle}
                  </div>
                  <p className="text-xs text-[#55473A] leading-relaxed font-sans">
                    {st.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D5C2AF] flex items-center gap-1.5 text-[10px] font-bold text-[#14110E] uppercase">
                  <CheckCircle2 size={13} className="text-[#8C6D47]" />
                  <span>{c.process.footerLabel}</span>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. CRAFTSMANSHIP BLUEPRINT: Anatomy of a Bespoke Garment                  */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] p-6 sm:p-10 lg:p-14 xl:p-16 space-y-8">
          
          {/* Section Header */}
          <div className="max-w-2xl space-y-2.5">
            <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
              {c.anatomy.titleLine} <br />
              <span className="italic font-light text-[#8C6D47]">{c.anatomy.titleAccent}</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D40] font-sans">
              {c.anatomy.intro}
            </p>
          </div>

          {/* Blueprint Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch pt-2">
            
            {/* Left Column: 5 Interactive Feature Selectors */}
            <div className="lg:col-span-5 space-y-2.5 flex flex-col justify-between">
              {anatomyFeatures.map((feat, idx) => {
                const isActive = blueprintIdx === idx;
                return (
                  <button
                    key={`${feat.id}-${idx}`}
                    onClick={() => setActiveBlueprintIndex(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border flex items-center justify-between cursor-pointer group ${
                      isActive
                        ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-md scale-[1.01]"
                        : "bg-white/60 hover:bg-white text-[#14110E] border-[#DAC8B6] hover:border-[#9E774C]"
                    }`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <span
                        className={`font-serif text-sm sm:text-base font-bold transition-colors ${
                          isActive ? "text-[#C5A069]" : "text-[#9E774C]"
                        }`}
                      >
                        {feat.number}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-bold tracking-wide uppercase truncate">
                          {feat.title}
                        </h4>
                        <p
                          className={`text-[10px] sm:text-[11px] font-sans truncate ${
                            isActive ? "text-[#D8C7B5]" : "text-[#6B5A4D]"
                          }`}
                        >
                          {feat.subtitle}
                        </p>
                      </div>
                    </div>

                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform ${
                        isActive
                          ? "text-[#C5A069] translate-x-1"
                          : "text-[#9E774C] group-hover:translate-x-0.5 opacity-60"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Blueprint Deep-Dive Display Card */}
            {activeBlueprint && (
            <div className="lg:col-span-7 bg-[#FAF5EF] border border-[#D5C0AB] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 shadow-sm relative overflow-hidden">
              
              {/* Top Row: Metric & Badge */}
              <div className="flex items-center justify-between border-b border-[#D5C0AB] pb-4">
                <span className="inline-flex items-center gap-2 text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.2em] text-[#8C6D47] uppercase bg-white px-3 py-1 rounded-full border border-[#D5C0AB]">
                  {activeBlueprint.detailBadge}
                </span>
                <span className="font-serif font-bold text-sm sm:text-base text-[#14110E]">
                  {fillTemplate(c.anatomy.metricTemplate, { metric: activeBlueprint.metric })}
                </span>
              </div>

              {/* Center Content: Title & Rich Story */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-[#14110E]">
                  {activeBlueprint.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3D31] leading-relaxed font-sans font-normal">
                  {activeBlueprint.description}
                </p>
              </div>

              {/* High-Resolution Macro Craft Visual (Clean text-free presentation) */}
              <div className="relative rounded-xl overflow-hidden h-[200px] sm:h-[240px] border border-[#D5C0AB] bg-[#1E1915] shadow-inner group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeBlueprint.image}
                  alt={activeBlueprint.title}
                  className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                />
              </div>

            </div>
            )}

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 5. HERITAGE CHRONICLE ARCHIVE (Interactive Documentary Exhibition)        */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] overflow-hidden shadow-lg p-6 sm:p-10 lg:p-14 xl:p-16 space-y-8 lg:space-y-10">
          
          {/* Top Row: Section Tag & Editorial Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#D5C2AF]">
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl sm:text-4xl lg:text-5xl font-normal uppercase leading-tight text-[#14110E]">
                {c.heritage.titleLine} <br />
                <span className="italic font-light text-[#8C6D47]">{c.heritage.titleAccent}</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#5C4D40] max-w-md font-sans">
              {c.heritage.intro}
            </p>
          </div>

          {/* Interactive Era Milestone Nav Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            {heritageMilestones.map((ms, idx) => {
              const isActive = milestoneIdx === idx;
              return (
                <button
                  key={`${ms.year}-${idx}`}
                  onClick={() => setActiveMilestoneIndex(idx)}
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 border text-left cursor-pointer group flex flex-col justify-between space-y-2 ${
                    isActive
                      ? "bg-[#14110E] text-[#FAF8F5] border-[#14110E] shadow-md scale-[1.01]"
                      : "bg-white/70 hover:bg-white text-[#14110E] border-[#DAC8B6] hover:border-[#9E774C]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-serif text-lg sm:text-xl font-bold tracking-tight ${
                        isActive ? "text-[#C5A069]" : "text-[#14110E]"
                      }`}
                    >
                      {ms.year}
                    </span>
                    <span
                      className={`text-[8.5px] sm:text-[9.5px] font-bold tracking-widest uppercase ${
                        isActive ? "text-[#D8C7B5]" : "text-[#8C6D47]"
                      }`}
                    >
                      {ms.tag}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider truncate">
                    {ms.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Era Deep-Dive Card with Archival Photo & Historical Story */}
          {activeMilestone && (
          <div className="bg-[#FAF5EF] border border-[#DAC8B6] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Historical Narrative */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Year & Location Header */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal text-[#9E774C] leading-none">
                    {activeMilestone.year}
                  </span>
                  <div className="h-8 w-[1px] bg-[#D5C2AF] hidden sm:block" />
                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#14110E]">
                    <MapPin size={14} className="text-[#8C6D47]" />
                    <span>{activeMilestone.location}</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-1.5">
                  <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-bold uppercase text-[#14110E]">
                    {activeMilestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-serif italic text-[#8C6D47]">
                    &ldquo;{activeMilestone.subtitle}&rdquo;
                  </p>
                </div>

                {/* Full Historical Story */}
                <p className="text-xs sm:text-sm lg:text-[15px] text-[#4A3D31] leading-relaxed font-sans font-normal">
                  {activeMilestone.story}
                </p>

                {/* Archive Metric Badge */}
                <div className="pt-3 border-t border-[#DAC8B6] flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6D47]">
                    {fillTemplate(c.heritage.benchmarkTemplate, { label: activeMilestone.metricLabel })}
                  </span>
                  <span className="font-bold text-[#14110E] tracking-wider uppercase">
                    {activeMilestone.metricValue}
                  </span>
                </div>

              </div>

              {/* Right Column: High-Res Archival Documentary Photo */}
              <div className="lg:col-span-5 space-y-2">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md border border-[#D5C2AF] h-[240px] sm:h-[290px] lg:h-[320px] bg-[#1E1915] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeMilestone.image}
                    alt={activeMilestone.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                {/* Photo Caption Plate (Below image, not on top) */}
                <div className="flex items-center justify-between text-[10.5px] text-[#55473A] px-1">
                  <span>{activeMilestone.photoCaption}</span>
                  <span className="font-mono text-[9.5px] text-[#8C6D47] uppercase font-bold">{c.heritage.archiveLabel}</span>
                </div>
              </div>

            </div>
          </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* 6. COMPANY CONCIERGE & FLAGSHIP SERVICES                                 */}
        {/* ========================================================================= */}
        <section className="bg-[#FAF5EF] border border-[#DAC8B6] rounded-2xl sm:rounded-3xl lg:rounded-[36px] p-6 sm:p-10 lg:p-12 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-normal uppercase text-[#14110E]">
              {c.concierge.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-2">
            {c.concierge.services.map((svc, idx) => {
              const Icon = conciergeIcons[svc.icon] ?? Scissors;
              return (
                <div key={idx} className="bg-[#EFE5D9] border border-[#D5C2AF] rounded-2xl p-6 space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-[#14110E] text-[#FAF8F5] flex items-center justify-center">
                    <Icon size={18} className="text-[#C5A069]" />
                  </div>
                  <h4 className="font-bold text-sm uppercase text-[#14110E] tracking-wider">
                    {svc.title}
                  </h4>
                  <p className="text-xs text-[#55473A] leading-relaxed">
                    {svc.description}
                  </p>
                  <div className="text-[11px] font-medium text-[#8C6D47] pt-1">
                    {svc.note}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. GRAND ATELIER SALON INVITATION (CTA)                                  */}
        {/* ========================================================================= */}
        <section className="relative w-full rounded-2xl sm:rounded-3xl lg:rounded-[36px] bg-[#EFE5D9] border border-[#D5C2AF] overflow-hidden shadow-lg p-6 sm:p-10 lg:p-14 xl:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: CTA Pitch */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif-luxury text-3xl sm:text-5xl lg:text-[54px] font-normal uppercase leading-[1.06] text-[#14110E]">
                {c.cta.titleLine} <br />
                <span className="italic font-light text-[#8C6D47]">{c.cta.titleAccent}</span>
              </h2>
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#55473A] leading-relaxed font-sans max-w-xl">
                {c.cta.description}
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                <Link
                  href={c.cta.primaryButtonHref}
                  className="bg-[#14110E] hover:bg-black text-[#FAF8F5] text-xs font-bold tracking-[0.2em] px-8 sm:px-10 py-4 transition-all duration-300 uppercase shadow-md flex items-center gap-2 group whitespace-nowrap"
                >
                  <span>{c.cta.primaryButtonLabel}</span>
                  <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href={c.cta.secondaryButtonHref}
                  className="bg-[#14110E] hover:bg-black text-white border border-[#14110E] text-xs font-bold tracking-[0.2em] px-7 sm:px-9 py-4 transition-all duration-300 uppercase whitespace-nowrap shadow-md"
                >
                  {c.cta.secondaryButtonLabel}
                </Link>
              </div>
            </div>

            {/* Right Column: Architectural Salon Photograph (Clean text-free presentation) */}
            <div className="lg:col-span-6 relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-[#D5C2AF] h-[320px] sm:h-[400px] lg:h-[440px] bg-[#221B16] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.cta.image}
                alt={c.cta.imageAlt}
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
              />
            </div>

          </div>
        </section>

      </main>

      {/* Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Global Luxury Footer */}
      <Footer />
    </div>
  );
}
