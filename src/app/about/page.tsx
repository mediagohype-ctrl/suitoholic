"use client";

import React from"react";
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
      <section aria-labelledby="about-hero-heading" className="relative h-[100svh] min-h-[600px] w-full overflow-hidden border-b border-[#E5E3DD] bg-[#ECEAE5]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banners/about-atelier-racks-banner.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-2xl opacity-50"
          loading="eager"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/banners/about-atelier-racks-banner.webp"
          alt="Suitoholic tailoring atelier with fabric shelves on both sides and the words Tailoring with Care and Precision."
          className="absolute inset-0 h-full w-full object-contain object-center"
          loading="eager"
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
