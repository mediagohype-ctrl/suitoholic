"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AtelierStoryTimeline from "@/components/AtelierStoryTimeline";
import PrinciplesSection from "@/components/PrinciplesSection";
import CommitmentBannerSection from "@/components/CommitmentBannerSection";
export default function AboutPage() {

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#ECEAE5] text-black antialiased">
      {/* Global Header */}
      <Header activeTab="about" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: "Tailoring with Care and Precision" (Light Atelier Aesthetic) */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex items-center justify-center text-center overflow-hidden border-b border-[#E5E3DD] select-none bg-[#ECEAE5] pt-32 sm:pt-36 pb-20 sm:pb-24">
        {/* Background Tailoring Atelier Photo (Light & Sunlit with Fabric Shelves & Tailor) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/about_hero_light.jpg"
          alt="Suitoholic Master Bespoke Tailoring Atelier"
          className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          loading="eager"
        />

        {/* Top Navbar Scrim for clean header contrast */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        {/* Centered Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          
          {/* Main Headline: Tailoring with Care and Precision */}
          <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-[70px] xl:text-[76px] font-normal leading-[1.08] tracking-tight text-black drop-shadow-[0_2px_14px_rgba(255,255,255,0.85)] max-w-4xl">
            Tailoring with Care and <span className="text-black italic font-serif">Precision</span>
          </h1>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR STORY: Heritage Timeline & Master Tailor Atelier Section           */}
      {/* ========================================================================= */}
      <AtelierStoryTimeline />

      {/* ========================================================================= */}
      {/* 3. WHAT WE VALUE: Principles That Guide Every Garment                     */}
      {/* ========================================================================= */}
      <PrinciplesSection />

      {/* ========================================================================= */}
      {/* 4. OUR COMMITMENT: A Standard We Hold Ourselves To.                       */}
      {/* ========================================================================= */}
      <CommitmentBannerSection />

      {/* Global Luxury Footer */}
      <Footer />
    </div>
  );
}
