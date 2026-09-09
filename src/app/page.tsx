"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import ModernCollectionSection from "@/components/ModernCollectionSection";
import CategoriesRotatingShowcase from "@/components/CategoriesRotatingShowcase";
import AtelierEditorialBanner from "@/components/AtelierEditorialBanner";
import ShopByCategoryGrid from "@/components/ShopByCategoryGrid";
import NewsletterSection from "@/components/NewsletterSection";
import { allProducts, collectionCategories } from "@/data/products";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(1);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent text-[#14110E] antialiased">
      {/* Header */}
      <Header />

      {/* Main Hero Section with Authentic Studio Lighting & 3D Floating Shirt */}
      <section className="relative w-full min-h-screen flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-6 sm:pb-8 lg:pb-12 xl:pb-14 px-4 sm:px-8 lg:px-12 xl:px-16 bg-gradient-to-br from-[#FAF4EC] via-[#EFE3D5] to-[#E3D1BE] border-b border-[#D6C1AE] overflow-hidden">
        
        {/* Soft Ambient Spotlight Glows */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#C5A069]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/3 w-[400px] h-[400px] bg-[#9E774C]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1780px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-center flex-1 relative my-auto">
          
          {/* Left Column: Typography & CTAs & Scroll Down */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full z-10 py-2 sm:py-6 lg:py-8">
            
            {/* Upper Content: Subtitle, Heading, Action Buttons */}
            <div className="space-y-4 sm:space-y-7 my-auto">
              {/* Subtitle */}
              <div>
                <span className="text-[10px] sm:text-xs lg:text-sm font-semibold tracking-[0.28em] text-[#9E774C] uppercase block">
                  EFFORTLESSLY ELEGANT
                </span>
              </div>

              {/* Main Luxury Serif Heading */}
              <h1 className="font-serif-luxury font-normal text-3xl sm:text-5xl lg:text-[56px] xl:text-[66px] 2xl:text-[74px] leading-[1.05] text-[#14110E] tracking-tight uppercase">
                NOT EVERY BODY <br />
                IS THE SAME SIZE.
              </h1>

              {/* Action Buttons: Row */}
              <div className="flex flex-row items-center gap-3 sm:gap-4 pt-2 sm:pt-3">
                <Link
                  href="/shop"
                  className="bg-[#14110E] hover:bg-[#9E774C] text-[#FAF8F5] text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.2em] px-7 sm:px-9 py-3.5 sm:py-4 transition-all duration-300 text-center uppercase shadow-md whitespace-nowrap"
                >
                  SHOP SHIRTS
                </Link>
                
                <Link
                  href="/custom-shirt"
                  className="bg-transparent border border-[#14110E]/40 hover:border-[#14110E] hover:bg-black/5 text-[#14110E] text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.2em] px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 text-center uppercase flex items-center justify-center gap-2 group whitespace-nowrap"
                >
                  <span>CUSTOM FIT</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </Link>
              </div>
            </div>

            {/* Bottom: Scroll Down Indicator */}
            <div className="pt-8 lg:pt-10 flex flex-col items-start space-y-2">
              <span className="text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.25em] text-[#14110E] uppercase font-semibold">
                SCROLL DOWN
              </span>
              <div className="w-[1.5px] h-8 sm:h-10 lg:h-12 bg-[#14110E] opacity-75" />
            </div>
          </div>

          {/* Right Column: 3D Floating White Shirt on Travertine Stone Podium Card */}
          <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end w-full h-full my-auto">
            
            {/* Rounded Hero Studio Card Container (Expands dynamically to fill tall screen heights) */}
            <div className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] lg:h-[calc(100vh-180px)] xl:h-[calc(100vh-200px)] min-h-[460px] max-h-[850px] 2xl:max-h-[960px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(20,17,14,0.18)] border border-white/50 bg-[#D4BEA9] flex items-center justify-center group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero_3d_shirt.jpg"
                alt="3D Floating Tailored Shirt on Travertine Stone Podium"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
            </div>

            {/* Right Side Vertical Step / Carousel Indicator */}
            <div className="absolute -right-2 sm:-right-3 lg:-right-5 xl:-right-7 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center space-y-3 text-[11px] lg:text-xs font-medium text-[#14110E]">
              <span className="font-bold text-xs lg:text-sm">01</span>
              <div className="w-[1px] h-5 lg:h-6 bg-[#9E774C]" />
              <button 
                onClick={() => setActiveSlide(1)}
                className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all ${activeSlide === 1 ? 'bg-[#14110E] scale-125' : 'bg-[#9E774C] hover:bg-[#14110E]'}`}
                aria-label="Slide 1" 
              />
              <button 
                onClick={() => setActiveSlide(2)}
                className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all ${activeSlide === 2 ? 'bg-[#14110E] scale-125' : 'bg-[#9E774C] hover:bg-[#14110E]'}`}
                aria-label="Slide 2" 
              />
              <button 
                onClick={() => setActiveSlide(3)}
                className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full transition-all ${activeSlide === 3 ? 'bg-[#14110E] scale-125' : 'bg-[#9E774C] hover:bg-[#14110E]'}`}
                aria-label="Slide 3" 
              />
              <div className="w-[1px] h-5 lg:h-6 bg-[#9E774C]" />
              <span className="text-[#5A4E42] text-xs lg:text-sm">05</span>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Bar (Full Width Edge to Edge) */}
      <FeatureHighlightsBar />

      {/* Split Feature Banners (PREMIUM FABRICS & CUSTOM FIT - 100% FULL BLEED EDGE TO EDGE) */}
      <section id="fabrics" className="w-full py-0 px-0 my-0">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Left Banner: PREMIUM FABRICS */}
          <Link 
            href="/shop"
            className="relative overflow-hidden h-[200px] sm:h-[260px] lg:h-[300px] xl:h-[330px] rounded-none flex flex-col justify-end p-6 sm:p-10 lg:p-12 group cursor-pointer shadow-md"
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
              <h3 className="font-serif-luxury text-2xl sm:text-4xl lg:text-[40px] font-normal uppercase tracking-wider leading-tight">
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
            className="relative overflow-hidden h-[200px] sm:h-[260px] lg:h-[300px] xl:h-[330px] rounded-none flex flex-col justify-end p-6 sm:p-10 lg:p-12 group cursor-pointer shadow-md"
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
              <h3 className="font-serif-luxury text-2xl sm:text-4xl lg:text-[40px] font-normal uppercase tracking-wider leading-tight">
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

      {/* Horizontal Divider */}
      <div className="w-full my-4 sm:my-6 lg:my-8">
        <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
      </div>

      {/* ========================================================================= */}
      {/* 5 BESPOKE CLOTHING SHOWCASE SECTIONS (WITH 3D REVOLVING & ATELIER BANNER) */}
      {/* ========================================================================= */}
      <div className="space-y-2 sm:space-y-4 py-2 sm:py-3">
        {collectionCategories.map((collection, index) => {
          const categoryProducts = allProducts.filter((p) => p.category === collection.id);

          return (
            <React.Fragment key={collection.id}>
              {index > 0 && (
                <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-4 sm:my-6 lg:my-8">
                  <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
                </div>
              )}
              <ModernCollectionSection
                collection={collection}
                products={categoryProducts}
                headerTitle={index === 0 ? "Latest drop" : collection.title}
              />

              {/* 3D Revolving Categories Carousel (Inserted right after 1st cloth section) */}
              {index === 0 && (
                <React.Fragment>
                  <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-4 sm:my-6 lg:my-8">
                    <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
                  </div>
                  <CategoriesRotatingShowcase />
                </React.Fragment>
              )}

              {/* SHOP BY CATEGORY GRID (Inserted right after Executive Striped Formal Shirts / formal_stripes) */}
              {collection.id === "formal_stripes" && (
                <React.Fragment>
                  <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-4 sm:my-6 lg:my-8">
                    <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
                  </div>
                  <ShopByCategoryGrid />
                </React.Fragment>
              )}

              {/* Full-Width High Quality Editorial Atelier Banner (Inserted right after Luxury Textured & Twill Shirts / formal_bespoke) */}
              {collection.id === "formal_bespoke" && (
                <React.Fragment>
                  <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-4 sm:my-6 lg:my-8">
                    <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
                  </div>
                  <AtelierEditorialBanner />
                </React.Fragment>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Standalone Compact Newsletter Section */}
      <NewsletterSection />

      {/* Comprehensive E-Commerce Luxury Footer */}
      <Footer />
    </div>
  );
}

