"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import HeroVideoBanner from "@/components/HeroVideoBanner";
import ModernCollectionSection from "@/components/ModernCollectionSection";
import CategoriesRotatingShowcase from "@/components/CategoriesRotatingShowcase";
import AtelierEditorialBanner from "@/components/AtelierEditorialBanner";
import ShopByCategoryGrid from "@/components/ShopByCategoryGrid";
import NewsletterSection from "@/components/NewsletterSection";
import { useCatalog, useContent } from "@/context/SiteDataProvider";

const Divider = ({ wide = false }: { wide?: boolean }) =>
  wide ? (
    <div className="w-full my-4 sm:my-6 lg:my-8">
      <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
    </div>
  ) : (
    <div className="w-full max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-12 my-4 sm:my-6 lg:my-8">
      <div className="w-full h-[1px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
    </div>
  );

// Showcase blocks interleaved after the 1st, 2nd and 3rd collection carousels.
const INTERLUDES = [CategoriesRotatingShowcase, ShopByCategoryGrid, AtelierEditorialBanner];

export default function Home() {
  const { products, homeCollections } = useCatalog();
  const c = useContent("homePage");
  // If there are fewer collections than interludes, the remaining ones follow the last collection.
  const interludesAfter = (index: number) =>
    index === homeCollections.length - 1 ? INTERLUDES.slice(index) : INTERLUDES.slice(index, index + 1);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-transparent text-[#14110E] antialiased">
      {/* Header */}
      <Header />

      {/* Main Interactive Hero Video Banner with 360 Rotating Shirt & Color Picker */}
      <HeroVideoBanner />

      {/* Feature Highlights Bar (Full Width Edge to Edge) */}
      <FeatureHighlightsBar />

      {/* Split Feature Banners (PREMIUM FABRICS & CUSTOM FIT - BRIGHT LUXURY EDITORIAL CARDS) */}
      <section id="fabrics" className="w-full py-2 sm:py-3.5 px-3.5 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-[1780px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {c.splitBanners.map((banner, i) => (
            <Link
              key={`${banner.href}-${i}`}
              href={banner.href}
              className="relative overflow-hidden h-[165px] sm:h-[195px] lg:h-[225px] xl:h-[240px] rounded-xl sm:rounded-2xl flex flex-col justify-end p-3 sm:p-4 lg:p-5 group cursor-pointer shadow-md border border-[#D5C2AF]/80 transition-all duration-500 hover:shadow-2xl bg-[#F5EFE6]"
            >
              {/* Bright Natural High-Res Photography (No Blur) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image}
                alt={banner.alt}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {/* Subtle bottom shadow gradient to elevate card */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

              {/* Floating Luxury Glassmorphism Content Card */}
              <div className="relative z-10 bg-[#FAF6F0]/95 backdrop-blur-md border border-white/80 rounded-lg sm:rounded-xl p-2.5 sm:p-3 sm:px-3.5 shadow-lg max-w-[190px] sm:max-w-[220px] transition-transform duration-300 group-hover:translate-y-[-2px]">
                <h3 className="font-serif-luxury text-xs sm:text-sm lg:text-base font-bold uppercase tracking-tight text-[#14110E] leading-tight mb-0.5 sm:mb-1">
                  {banner.title}
                </h3>
                <div className="inline-flex items-center space-x-1.5 text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em] text-[#14110E] group-hover:text-[#9E774C] uppercase transition-colors">
                  <span>{banner.cta}</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Horizontal Divider */}
      <Divider wide />

      {/* ========================================================================= */}
      {/* 5 BESPOKE CLOTHING SHOWCASE SECTIONS (WITH 3D REVOLVING & ATELIER BANNER) */}
      {/* ========================================================================= */}
      <div className="space-y-2 sm:space-y-4 py-2 sm:py-3">
        {homeCollections.map((collection, index) => (
          <React.Fragment key={collection.id}>
            {index > 0 && <Divider />}
            <ModernCollectionSection
              collection={collection}
              products={products.filter((p) => p.category === collection.id)}
              headerTitle={index === 0 ? c.firstCollectionTitle : collection.title}
            />

            {/* Rotating categories, shop-by-category grid and atelier banner follow the first three collections */}
            {interludesAfter(index).map((Interlude, i) => (
              <React.Fragment key={i}>
                <Divider />
                <Interlude />
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Standalone Compact Newsletter Section */}
      <NewsletterSection />

      {/* Comprehensive E-Commerce Luxury Footer */}
      <Footer />
    </div>
  );
}

