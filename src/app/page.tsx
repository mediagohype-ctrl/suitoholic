"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

      {/* Main Interactive Hero Video Banner (Includes Bottom Feature Highlights Bar Docked at 100dvh) */}
      <HeroVideoBanner />

      {/* Split Feature Banners (PREMIUM FABRICS & CUSTOM FIT - EDITORIAL CARDS MATCHING REFERENCE) */}
      <section id="fabrics" className="w-full py-3 sm:py-4 px-3.5 sm:px-6 lg:px-10 xl:px-12">
        <div className="max-w-[1780px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">

          {c.splitBanners.map((banner, i) => (
            <Link
              key={`${banner.href}-${i}`}
              href={banner.href}
              className="relative overflow-hidden h-[180px] sm:h-[220px] lg:h-[260px] xl:h-[280px] rounded-lg sm:rounded-xl flex flex-col justify-end p-5 sm:p-7 group cursor-pointer shadow-md transition-all duration-500 hover:shadow-2xl bg-[#14110E]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image}
                alt={banner.alt}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
              />
              {/* Ambient Dark Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

              {/* Typography Overlay */}
              <div className="relative z-10 flex flex-col items-start">
                <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-[28px] font-normal uppercase tracking-wide text-[#FAF8F5] leading-tight mb-2">
                  {banner.titleLines.map((line, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                </h3>
                <div className="inline-flex items-center space-x-1.5 text-[11px] sm:text-xs font-semibold tracking-[0.16em] text-[#FAF8F5]/90 group-hover:text-white uppercase transition-colors">
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

