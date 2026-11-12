"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import ModernProductCard from "@/components/ModernProductCard";
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";
import ShopNatureHeroBanner from "@/components/ShopNatureHeroBanner";
import ShopCollectionsOverview, { SUITOHOLIC_COLLECTIONS } from "@/components/ShopCollectionsOverview";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories } = useCatalog();
  const c = useContent("shopPage");

  const categoryParam = searchParams.get("category");
  const selectedCategory = categoryParam || "all";
  const [visibleCount, setVisibleCount] = useState(14);

  useEffect(() => {
    setVisibleCount(14);
  }, [selectedCategory]);

  const handleCategorySelect = (id: string) => {
    setVisibleCount(14);
    router.push(id === "all" ? "/shop" : `/shop?category=${id}`, { scroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find rich collection metadata (signature hero image, description)
  const collectionData = useMemo(() => {
    return SUITOHOLIC_COLLECTIONS.find((col) => col.id === selectedCategory);
  }, [selectedCategory]);

  const currentCategoryObj = categories.find((cat) => cat.id === selectedCategory);
  const currentCategoryName = collectionData?.title || currentCategoryObj?.title || c.allCategoryName;

  // Filter products strictly for the selected category
  const categoryProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const displayProducts = useMemo(() => {
    return categoryProducts.slice(0, visibleCount);
  }, [categoryProducts, visibleCount]);

  // Chunk products into alternating rows: Row 1 = 4 products, Row 2 = 3 products, Row 3 = 4 products, Row 4 = 3 products...
  // Exactly matching the user's requested SUOS India collection pattern
  const productRows = useMemo(() => {
    const rows: { type: 4 | 3; items: typeof displayProducts }[] = [];
    let i = 0;
    let targetCount: 4 | 3 = 4;
    while (i < displayProducts.length) {
      const chunk = displayProducts.slice(i, i + targetCount);
      rows.push({ type: targetCount, items: chunk });
      i += targetCount;
      targetCount = targetCount === 4 ? 3 : 4;
    }
    return rows;
  }, [displayProducts]);

  const collectionHeroImage =
    collectionData?.images[0]?.src ||
    currentCategoryObj?.bgImage ||
    currentCategoryObj?.image ||
    "/banners/shop_hero_banner_hd.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-clip selection:bg-black selection:text-white">
      {/* Header at top */}
      <Header activeTab="shop" />

      {/* Top Banner: Nature Hero on 'all', or Dedicated Collection Hero on particular category */}
      {selectedCategory === "all" ? (
        <div className="w-full">
          <ShopNatureHeroBanner />
        </div>
      ) : (
        /* Collection Hero Banner - Exactly matching SUOS India Collection Page (h-[62vh] min-h-[380px] sm:h-[70vh]) */
        <section className="relative w-full overflow-hidden bg-[#e7e7e4] h-[55vh] min-h-[360px] sm:h-[65vh] lg:h-[70vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collectionHeroImage}
            alt={currentCategoryName}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]">
            <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-white tracking-[0.14em] uppercase leading-tight max-w-4xl">
              {currentCategoryName}
            </h1>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("collection-products");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-6 sm:mt-8 inline-flex h-10 min-w-[150px] items-center justify-center border border-white bg-white/10 hover:bg-white hover:text-black px-8 text-[12px] sm:text-[13px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-[2px] transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
            >
              Shop now
            </button>
          </div>
        </section>
      )}

      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full pb-12 sm:pb-20">
          {selectedCategory === "all" ? (
            /* ========================================================================= */
            /* ALL COLLECTIONS VIEW (Signature 5-Image Editorial Collage Pattern)        */
            /* Matching https://www.suosindia.com/collections                            */
            /* ========================================================================= */
            <div className="w-full pt-2 sm:pt-4">
              {/* 5-Image Collage Grid Sections (Each with 'Shop now' button) */}
              <ShopCollectionsOverview onSelectCategory={handleCategorySelect} />
            </div>
          ) : (
            /* ========================================================================= */
            /* PARTICULAR CATEGORY VIEW (Opened after clicking 'Shop now' on Collection) */
            /* First row = 4 images, Second row = 3 images pattern (SUOS India format)   */
            /* ========================================================================= */
            <div className="w-full pt-6 sm:pt-10">
              {/* Back to All Collections & Category Quick Switcher */}
              <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleCategorySelect("all")}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#666666] hover:text-black transition-colors cursor-pointer group"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                  <span>ALL COLLECTIONS</span>
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase transition-all cursor-pointer ${
                          isActive
                            ? "bg-black text-white shadow-sm"
                            : "bg-white border border-[#E5E3DD] text-[#555555] hover:text-black hover:border-black"
                        }`}
                      >
                        {cat.shortTitle || cat.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products Section Anchor */}
              <div id="collection-products" className="w-full scroll-mt-24 space-y-6 pt-2 mb-14 sm:mb-20">
                {/* Header with Title & Item Count */}
                <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-2 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E5E3DD]">
                  <div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                      {currentCategoryName}
                    </h2>
                  </div>
                  <span className="text-[12px] sm:text-[13px] font-medium tracking-[0.14em] uppercase text-black/60 shrink-0">
                    {categoryProducts.length} ITEMS
                  </span>
                </div>

                {displayProducts.length === 0 && (
                  <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-10 text-center space-y-4 shadow-sm">
                      <p className="text-sm text-[#666666]">{c.emptyText}</p>
                      <button
                        onClick={() => handleCategorySelect("all")}
                        className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm cursor-pointer"
                      >
                        VIEW ALL COLLECTIONS
                      </button>
                    </div>
                  </div>
                )}

                {/* Alternating Row Pattern: 1st row has 4 images, 2nd row has 2 regular images + 1 double-width span image taking 2 images space (Matching user screenshot) */}
                <div className="w-full flex flex-col gap-8 sm:gap-12 lg:gap-14">
                  {productRows.map((row, rIdx) => {
                    if (row.type === 4) {
                      return (
                        <div
                          key={`row-4-${rIdx}`}
                          className="grid grid-cols-2 lg:grid-cols-4 gap-x-[10px] w-full items-start px-[5px]"
                        >
                          {row.items.map((p) => (
                            <div key={p.id} className="w-full col-span-1">
                              <ModernProductCard product={p} />
                            </div>
                          ))}
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={`row-3-${rIdx}`}
                          className="grid grid-cols-2 lg:grid-cols-4 gap-x-[10px] w-full items-start px-[5px]"
                        >
                          {/* Card 1: 1 column (same size as row 1) */}
                          {row.items[0] && (
                            <div className="w-full col-span-1">
                              <ModernProductCard product={row.items[0]} />
                            </div>
                          )}

                          {/* Card 2: 1 column (same size as row 1) */}
                          {row.items[1] && (
                            <div className="w-full col-span-1">
                              <ModernProductCard product={row.items[1]} />
                            </div>
                          )}

                          {/* Card 3: 2 columns (takes space of 2 images, exactly matching screenshot) */}
                          {row.items[2] && (
                            <div className="w-full col-span-2">
                              <ModernProductCard product={row.items[2]} isWideSpan />
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>

                {/* Load More Button if remaining products exist */}
                {visibleCount < categoryProducts.length && (
                  <div className="flex items-center justify-center pt-8 sm:pt-12 px-4">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 7)}
                      className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.22em] px-10 sm:px-14 py-3.5 sm:py-4 rounded-full transition-all duration-300 uppercase shadow-sm cursor-pointer active:scale-98"
                    >
                      LOAD MORE ({categoryProducts.length - visibleCount} MORE)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Common Atelier Showcase: Video Banner, Shop By Fabrics & Customer Testimonials */}
      <CommonAtelierShowcase />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />
    </div>
  );
}

function ShopLoading() {
  const c = useContent("shopPage");
  return (
    <div className="min-h-screen bg-[#ECEAE5] flex items-center justify-center text-sm font-semibold tracking-widest uppercase text-black">
      {c.loadingText}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopLoading />}>
      <ShopContent />
    </Suspense>
  );
}
