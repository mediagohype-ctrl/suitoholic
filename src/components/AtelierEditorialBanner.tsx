"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Ruler, Scissors, Award, CheckCircle2 } from "lucide-react";

export default function AtelierEditorialBanner() {
  return (
    <section className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-6 sm:my-10 lg:my-14 select-none">
      <div className="relative w-full min-h-[420px] sm:min-h-[480px] lg:min-h-[540px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(20,17,14,0.18)] border border-white/30 flex items-center group">
        
        {/* Background High-Resolution Studio Imagery */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tailoring_tools.jpg"
          alt="Bespoke Tailoring Atelier Craftsmanship"
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Dramatic Multi-Stop Luxury Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/70 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

        {/* Banner Inner Content Grid */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-14 xl:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white">
          
          {/* Left Column: Editorial Suiting Copy & Actions */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-6 max-w-2xl">
            {/* Atelier Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[9px] sm:text-[11px] font-bold tracking-[0.25em] text-[#C5A069] uppercase bg-black/60 px-3.5 py-1.5 rounded-full border border-[#C5A069]/40 backdrop-blur-md shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A069] animate-pulse" />
                THE SARTORIAL ATELIER • BESPOKE CRAFTSMANSHIP
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal uppercase leading-[1.08] tracking-tight">
              MASTER CRAFTED <br />
              <span className="italic font-light text-[#E5D2BE]">FOR DISTINCTION.</span>
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm lg:text-[15px] text-[#D8C9B9] leading-relaxed font-sans font-normal max-w-xl">
              From hand-stitched canvas chest pieces and Italian horn buttons to precision 40-point custom measurement algorithms — experience luxury menswear tailored exclusively for your silhouette.
            </p>

            {/* 3 Pillars Highlight Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2 border-t border-white/15 max-w-xl">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Ruler size={15} className="text-[#C5A069] shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold text-[#EFE5D8] tracking-wide">
                  40+ Body Data Points
                </span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Scissors size={15} className="text-[#C5A069] shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold text-[#EFE5D8] tracking-wide">
                  Master Artisans
                </span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <ShieldCheck size={15} className="text-[#C5A069] shrink-0" />
                <span className="text-[10px] sm:text-xs font-semibold text-[#EFE5D8] tracking-wide">
                  100% Fit Guarantee
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/custom-shirt"
                className="bg-[#C5A069] hover:bg-white text-[#14110E] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-7 sm:px-9 py-3.5 sm:py-4 rounded-full transition-all duration-300 uppercase shadow-lg flex items-center gap-2 group/btn"
              >
                <span>CUSTOM FIT ATELIER</span>
                <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 text-[11px] sm:text-xs font-bold tracking-[0.2em] px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all duration-300 uppercase backdrop-blur-xs"
              >
                BROWSE LOOKBOOK
              </Link>
            </div>
          </div>

          {/* Right Column: Glassmorphic Atelier Seal Card (Visible on lg+ screens) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 justify-end">
            <div className="bg-black/55 backdrop-blur-xl border border-white/20 p-6 xl:p-8 rounded-2xl sm:rounded-3xl shadow-2xl max-w-sm w-full space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/15">
                <span className="text-[10px] font-bold tracking-[0.22em] text-[#C5A069] uppercase">
                  ATELIER STANDARD
                </span>
                <Award size={18} className="text-[#C5A069]" />
              </div>

              <div className="space-y-3 text-xs sm:text-[13px] text-[#E5D2BE]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#C5A069] shrink-0 mt-0.5" />
                  <span>Individual custom pattern drafted for every order</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#C5A069] shrink-0 mt-0.5" />
                  <span>Giza 140s Egyptian Cotton & Super 150s Merino Wool</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#C5A069] shrink-0 mt-0.5" />
                  <span>Complimentary re-alterations within 30 days</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-[#B8A490]">
                <span>Global Free Shipping</span>
                <span className="font-semibold text-white">Rated 4.98 / 5.0</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
