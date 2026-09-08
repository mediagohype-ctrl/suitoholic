"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import ModernCollectionSection from "@/components/ModernCollectionSection";
import { allProducts, collectionCategories } from "@/data/products";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent text-[#14110E] antialiased">
      {/* Header */}
      <Header />

      {/* Main Hero Section with Authentic Studio Lighting & 3D Floating Shirt */}
      <section className="relative w-full overflow-hidden pt-3 pb-3 sm:pt-4 sm:pb-4 lg:pt-6 lg:pb-6 px-3.5 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center relative">
          
          {/* Left Column: Typography & CTAs (Top on Mobile) */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10 space-y-3.5 sm:space-y-5">
            
            {/* Subtitle */}
            <div>
              <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.28em] text-[#9E774C] uppercase block">
                EFFORTLESSLY ELEGANT
              </span>
            </div>

            {/* Main Luxury Serif Heading */}
            <h1 className="font-serif-luxury font-normal text-2xl sm:text-4xl lg:text-[50px] xl:text-[54px] leading-[1.1] text-[#14110E] tracking-tight uppercase">
              NOT EVERY BODY <br />
              IS THE SAME SIZE.
            </h1>

            {/* Action Buttons: Vertically stacked on mobile matching screenshot, row on desktop */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2 w-[155px] sm:w-auto">
              <Link
                href="/shop"
                className="w-full sm:w-auto bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] px-5 sm:px-7 py-2.5 sm:py-3.5 transition-all duration-300 text-center uppercase shadow-sm whitespace-nowrap"
              >
                SHOP SHIRTS
              </Link>
              
              <Link
                href="/custom-shirt"
                className="w-full sm:w-auto bg-transparent border border-[#14110E] hover:border-[#9E774C] hover:text-[#9E774C] text-[#14110E] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] px-4 sm:px-6 py-2.5 sm:py-3.5 transition-all duration-300 text-center uppercase flex items-center justify-center gap-1.5 group whitespace-nowrap"
              >
                <span>CUSTOM FIT</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>

            {/* Desktop Scroll Down Indicator (hidden on mobile) */}
            <div className="hidden lg:flex pt-4 sm:pt-6 flex-col items-start space-y-2">
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#14110E] uppercase font-semibold">
                SCROLL DOWN
              </span>
              <div className="w-[1.5px] h-7 sm:h-9 bg-[#14110E] opacity-80" />
            </div>
          </div>

          {/* Right Column: 3D Floating White Shirt on Travertine Stone Podium */}
          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end mt-2 lg:mt-0 w-full">
            
            {/* Mobile Vertical Step Indicator (left of image on mobile) */}
            <div className="lg:hidden absolute -left-1 sm:left-0 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-1.5 text-[10px] font-semibold text-[#14110E]">
              <span className="text-[9px] font-bold">01</span>
              <div className="w-[1px] h-2.5 bg-[#9E774C]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#14110E]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#9E774C]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#9E774C]" />
              <div className="w-[1px] h-2.5 bg-[#9E774C]" />
              <span className="text-[9px] text-[#5A4E42]">05</span>
            </div>

            {/* Direct Robust Image Display (100% visible on all mobile and desktop devices) */}
            <div className="relative w-full max-w-[620px] rounded-xl overflow-hidden group ml-5 lg:ml-0 shadow-sm flex items-center justify-center bg-transparent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero_3d_shirt_hq.jpg"
                alt="3D Floating Tailored Shirt on Travertine Stone Podium"
                className="w-full h-auto max-h-[280px] sm:max-h-[420px] lg:max-h-[540px] object-cover object-center animate-levitate transition-transform duration-700 block"
                loading="eager"
              />
            </div>

            {/* Desktop Vertical Slide Indicator on far right */}
            <div className="hidden lg:flex absolute -right-2 xl:-right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center space-y-2.5 text-[11px] font-medium text-[#14110E]">
              <span className="font-bold text-xs">01</span>
              <div className="w-[1px] h-4 bg-[#9E774C]" />
              <button 
                onClick={() => setActiveSlide(1)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === 1 ? 'bg-[#14110E] scale-125' : 'bg-[#9E774C] hover:bg-[#14110E]'}`}
                aria-label="Slide 1" 
              />
              <button 
                onClick={() => setActiveSlide(2)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === 2 ? 'bg-[#14110E] scale-125' : 'bg-[#9E774C] hover:bg-[#14110E]'}`}
                aria-label="Slide 2" 
              />
              <button 
                onClick={() => setActiveSlide(3)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${activeSlide === 3 ? 'bg-[#14110E] scale-125' : 'bg-[#9E774C] hover:bg-[#14110E]'}`}
                aria-label="Slide 3" 
              />
              <div className="w-[1px] h-4 bg-[#9E774C]" />
              <span className="text-[#5A4E42] text-xs">05</span>
            </div>
          </div>

          {/* Mobile Scroll Down Indicator (Rendered below shirt on mobile matching mockup) */}
          <div className="lg:hidden col-span-1 pt-2 pb-1 flex flex-col items-start space-y-1.5">
            <span className="text-[9px] tracking-[0.25em] text-[#14110E] uppercase font-semibold">
              SCROLL DOWN
            </span>
            <div className="w-[1.5px] h-5 bg-[#14110E] opacity-80" />
          </div>

        </div>
      </section>

      {/* Feature Highlights Bar (Full Width Edge to Edge) */}
      <FeatureHighlightsBar />

      {/* Split Feature Banners (PREMIUM FABRICS & CUSTOM FIT) */}
      <section id="fabrics" className="py-2 sm:py-3 px-3.5 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Left Banner: PREMIUM FABRICS */}
          <Link 
            href="/shop"
            className="relative overflow-hidden h-[180px] sm:h-[240px] lg:h-[270px] rounded-none flex flex-col justify-end p-5 sm:p-8 group cursor-pointer shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/dark_fabric.jpg"
              alt="Premium Fabric Texture"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="relative z-10 text-white space-y-1.5">
              <h3 className="font-serif-luxury text-xl sm:text-3xl lg:text-[34px] font-normal uppercase tracking-wider leading-tight">
                PREMIUM <br />
                FABRICS
              </h3>
              <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#E8DFD5] group-hover:text-[#D5C1A0] uppercase transition-colors pt-1">
                <span>Explore</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </div>
          </Link>

          {/* Right Banner: CUSTOM FIT */}
          <Link 
            href="/custom-shirt"
            className="relative overflow-hidden h-[180px] sm:h-[240px] lg:h-[270px] rounded-none flex flex-col justify-end p-5 sm:p-8 group cursor-pointer shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/tailoring_tools.jpg"
              alt="Custom Fit Tailoring Atelier"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

            <div className="relative z-10 text-white space-y-1.5">
              <h3 className="font-serif-luxury text-xl sm:text-3xl lg:text-[34px] font-normal uppercase tracking-wider leading-tight">
                CUSTOM <br />
                FIT
              </h3>
              <div className="inline-flex items-center space-x-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#E8DFD5] group-hover:text-[#D5C1A0] uppercase transition-colors pt-1">
                <span>Know More</span>
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5 BESPOKE CLOTHING SHOWCASE SECTIONS (COMPACT GAP & TALL IMAGES)           */}
      {/* ========================================================================= */}
      <div className="space-y-0 py-0">
        {collectionCategories.map((collection, index) => {
          const categoryProducts = allProducts.filter((p) => p.category === collection.id);

          return (
            <ModernCollectionSection
              key={collection.id}
              collection={collection}
              products={categoryProducts}
              headerTitle={index === 0 ? "Latest drop" : collection.title}
            />
          );
        })}
      </div>

      {/* Comprehensive E-Commerce Luxury Footer */}
      <Footer />
    </div>
  );
}

