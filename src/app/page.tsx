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

      {/* Main Hero Section with Authentic Studio Lighting & 3D Floating Shirt (Full Screen Viewport) */}
      <section className="relative w-full min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] flex flex-col justify-between pt-3 pb-5 sm:pt-5 sm:pb-7 lg:pt-6 lg:pb-8 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="max-w-[1720px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center flex-1 relative">
          
          {/* Left Column: Typography & CTAs & Scroll Down */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full z-10 py-2 sm:py-4">
            
            {/* Upper Content: Subtitle, Heading, Action Buttons */}
            <div className="space-y-4 sm:space-y-6 my-auto">
              {/* Subtitle */}
              <div>
                <span className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] text-[#9E774C] uppercase block">
                  EFFORTLESSLY ELEGANT
                </span>
              </div>

              {/* Main Luxury Serif Heading */}
              <h1 className="font-serif-luxury font-normal text-3xl sm:text-5xl lg:text-[54px] xl:text-[62px] leading-[1.08] text-[#14110E] tracking-tight uppercase">
                NOT EVERY BODY <br />
                IS THE SAME SIZE.
              </h1>

              {/* Action Buttons: Row */}
              <div className="flex flex-row items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <Link
                  href="/shop"
                  className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-6 sm:px-8 py-3 sm:py-3.5 transition-all duration-300 text-center uppercase shadow-sm whitespace-nowrap"
                >
                  SHOP SHIRTS
                </Link>
                
                <Link
                  href="/custom-shirt"
                  className="bg-transparent border border-[#14110E]/40 hover:border-[#14110E] hover:bg-black/5 text-[#14110E] text-[11px] sm:text-xs font-bold tracking-[0.2em] px-5 sm:px-7 py-3 sm:py-3.5 transition-all duration-300 text-center uppercase flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>CUSTOM FIT</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>

            {/* Bottom: Scroll Down Indicator */}
            <div className="pt-6 lg:pt-0 flex flex-col items-start space-y-2">
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#14110E] uppercase font-semibold">
                SCROLL DOWN
              </span>
              <div className="w-[1.5px] h-7 sm:h-9 bg-[#14110E] opacity-75" />
            </div>
          </div>

          {/* Right Column: 3D Floating White Shirt on Travertine Stone Podium Card */}
          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end w-full h-full my-auto">
            
            {/* Rounded Hero Studio Card Container */}
            <div className="relative w-full h-[320px] sm:h-[440px] lg:h-[500px] xl:h-[560px] max-h-[75vh] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(20,17,14,0.12)] border border-white/40 bg-[#D4BEA9] flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero_3d_shirt.jpg"
                alt="3D Floating Tailored Shirt on Travertine Stone Podium"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
            </div>

            {/* Right Side Vertical Step / Carousel Indicator */}
            <div className="absolute -right-2 sm:-right-3 lg:-right-5 xl:-right-7 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-2.5 text-[11px] font-medium text-[#14110E]">
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

