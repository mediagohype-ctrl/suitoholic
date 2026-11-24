"use client";

import React from"react";
import Image from "next/image";
import Header from"@/components/Header";
import Footer from"@/components/Footer";
import AtelierStoryTimeline from"@/components/AtelierStoryTimeline";
import PrinciplesSection from"@/components/PrinciplesSection";
import CommitmentBannerSection from"@/components/CommitmentBannerSection";
export default function AboutPage() {

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#ECEAE5] text-black antialiased">
      {/* Global Header */}
      <Header activeTab="about" forceSolid />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION:"Tailoring with Care and Precision" (Light Atelier Aesthetic) */}
      {/* ========================================================================= */}
      <section aria-labelledby="about-hero-heading" className="relative h-svh w-full overflow-hidden bg-[#ECEAE5]">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-110 bg-[url('/banners/tailoring-with-care-and-precision.png')] bg-cover bg-center opacity-50 blur-2xl landscape:hidden"
        />
        <Image
          src="/banners/tailoring-with-care-and-precision.png"
          alt="Suitoholic tailoring atelier with fabric shelves, a measuring tape, and scissors"
          fill
          unoptimized
          loading="eager"
          fetchPriority="high"
          className="object-contain landscape:object-cover"
        />
        <h1 id="about-hero-heading" className="sr-only">Tailoring with Care and Precision</h1>
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
