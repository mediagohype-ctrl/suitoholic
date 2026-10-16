"use client";

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import ModernProductCard from "@/components/ModernProductCard";
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";
import ShopNatureHeroBanner from "@/components/ShopNatureHeroBanner";
import {
  RotateCcw,
  ChevronDown,
} from "lucide-react";

type SortKey = "featured" | "priceAsc" | "priceDesc" | "rating";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories } = useCatalog();
  const c = useContent("shopPage");

  const categoryParam = searchParams.get("category");
  const selectedCategory = categoryParam || "all";
  const [sortOption, setSortOption] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory]);

  const handleCategorySelect = (id: string) => {
    setVisibleCount(12);
    router.push(id === "all" ? "/shop" : `/shop?category=${id}`, { scroll: false });
  };

  const resetAll = () => {
    setVisibleCount(12);
    setSortOption("featured");
    handleCategorySelect("all");
  };

  const categoryProducts = useMemo(
    () => (selectedCategory !== "all" ? products.filter((p) => p.category === selectedCategory) : products),
    [products, selectedCategory],
  );

  const sortedProducts = useMemo(() => {
    const sorted = [...categoryProducts];
    if (sortOption === "priceAsc") sorted.sort((a, b) => a.rawPrice - b.rawPrice);
    if (sortOption === "priceDesc") sorted.sort((a, b) => b.rawPrice - a.rawPrice);
    if (sortOption === "rating") sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    return sorted;
  }, [categoryProducts, sortOption]);

  const displayProducts = useMemo(() => {
    return sortedProducts.slice(0, visibleCount);
  }, [sortedProducts, visibleCount]);

  const currentCategoryName = categories.find((cat) => cat.id === selectedCategory)?.title || c.allCategoryName;

  // Starting 3 Editorial Showcase Sections matching the user's reference design
  const showcaseSections = useMemo(() => {
    const latestDrop = products.filter((p) => p.category === "formal_shirts").slice(0, 4);
    const bestSellers = products.filter((p) => p.category === "formal_stripes").slice(0, 4);
    const texturedShirts = products
      .filter((p) => p.category === "formal_bespoke" || p.category === "fabrics")
      .slice(0, 4);

    return [
      {
        id: "latest-drop",
        title: "LATEST DROP",
        categoryId: "formal_shirts",
        products: latestDrop.length >= 4 ? latestDrop : products.slice(0, 4),
      },
      {
        id: "best-sellers",
        title: "BEST SELLERS",
        categoryId: "formal_stripes",
        products: bestSellers.length >= 4 ? bestSellers : products.slice(4, 8),
      },
      {
        id: "textured-shirts",
        title: "TEXTURED SHIRTS",
        categoryId: "formal_bespoke",
        products: texturedShirts.length >= 4 ? texturedShirts : products.slice(8, 12),
      },
    ];
  }, [products]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-clip">
      {/* Transparent Header at top */}
      <Header activeTab="shop" />

      {/* Clean Luxury Editorial Hero Banner: Grown by nature. Guided by restraint. (Full Width End-to-End) */}
      <div className="w-full">
        <ShopNatureHeroBanner />
      </div>

      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-12 sm:pb-20">

          {/* Catalog Section: Full-Width Product Grid at Top */}
          <div id="catalog-section" className="w-full space-y-6 pt-1 mb-14 sm:mb-20">

            {/* Section Heading: Refined Luxury Title */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 w-full pt-1 pb-1">
              <div className="h-[1.5px] w-8 sm:w-16 md:w-24 bg-gradient-to-r from-transparent to-[#4A202A]/40" />
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-[#4A202A] tracking-[0.14em] uppercase leading-tight text-center drop-shadow-xs">
                {selectedCategory === "all" ? (c.title || "THE BESPOKE COLLECTION") : `${currentCategoryName} COLLECTION`}
              </h2>
              <div className="h-[1.5px] w-8 sm:w-16 md:w-24 bg-gradient-to-l from-transparent to-[#4A202A]/40" />
            </div>

            {/* Top Control Bar */}
            <div className="relative bg-[#FAF5EE] border border-[#E2D4C3] rounded-xl px-4 py-3 flex flex-wrap gap-2 items-center justify-between text-[11px] text-[#4A3E33] font-medium shadow-xs">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="font-semibold text-[#14110E] uppercase tracking-wider truncate">{currentCategoryName}</span>
                <span className="text-[#9E774C]">•</span>
                <span className="text-[#7A6B5D] whitespace-nowrap">{displayProducts.length} {c.itemsAvailableLabel}</span>
              </div>

              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                aria-expanded={sortOpen}
                className="flex items-center space-x-2 cursor-pointer hover:text-[#14110E]"
              >
                <span className="uppercase text-[#7A6B5D] font-medium tracking-wider">{c.sortLabel}</span>
                <span className="font-semibold uppercase text-[#14110E] tracking-wider flex items-center gap-1">
                  {c.sortOptions[sortOption]} <ChevronDown size={14} className={`text-[#9E774C] transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {sortOpen && (
                <div className="absolute right-3 top-full mt-1 z-20 bg-white border border-[#E2D4C3] rounded-xl shadow-lg py-1 min-w-[200px]">
                  {(Object.keys(c.sortOptions) as SortKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortOption(key);
                        setSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-[11px] font-semibold uppercase tracking-wider hover:bg-[#FAF5EE] ${sortOption === key ? "text-[#9E774C]" : "text-[#14110E]"}`}
                    >
                      {c.sortOptions[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {displayProducts.length === 0 && (
              <div className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-10 text-center space-y-4">
                <p className="text-sm text-[#55473B]">{c.emptyText}</p>
                <button
                  onClick={resetAll}
                  style={{ borderRadius: "7px" }}
                  className="inline-flex items-center gap-2 bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] px-5 py-2.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  {c.resetAllLabel} <RotateCcw size={13} />
                </button>
              </div>
            )}

            {/* Product Cards Grid: Full-Width 4-Columns matching Showcase */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full items-stretch">
              {displayProducts.map((p) => (
                <div key={p.id} className="w-full">
                  <ModernProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Load More Button if remaining products exist */}
            {visibleCount < sortedProducts.length && (
              <div className="flex items-center justify-center pt-8 sm:pt-10">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  style={{ borderRadius: "7px" }}
                  className="inline-flex items-center justify-center bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] text-xs font-extrabold tracking-[0.22em] px-10 sm:px-14 py-3 sm:py-3.5 transition-all duration-300 uppercase shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                >
                  LOAD MORE ({sortedProducts.length - visibleCount} MORE)
                </button>
              </div>
            )}

          </div>

          {/* Top 3 Showcase Sections (Visible when browsing All Shirts) */}
          {selectedCategory === "all" && (
            <div className="space-y-12 sm:space-y-16 lg:space-y-20 mb-16 sm:mb-20">
              {/* Major Section Divider before Curated Showcases */}
              <div className="w-full pb-4">
                <div className="w-full h-[1.5px] bg-gradient-to-r from-[#8C6944]/25 via-[#6E4822]/80 to-[#8C6944]/25" />
              </div>

              {showcaseSections.map((sec, sIdx) => (
                <section key={sec.id} id={sec.id} className="w-full flex flex-col items-center select-none">
                  {/* Centered Heading in Luxury Uppercase */}
                  <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-base sm:text-lg lg:text-[20px] font-semibold tracking-[0.22em] text-[#4A202A] uppercase leading-tight">
                      {sec.title}
                    </h2>
                  </div>

                  {/* 4-Column Product Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 w-full items-stretch">
                    {sec.products.map((product) => (
                      <div key={product.id} className="w-full">
                        <ModernProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Centered VIEW ALL Button */}
                  <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-12">
                    <button
                      type="button"
                      onClick={() => {
                        handleCategorySelect(sec.categoryId);
                        const catalogEl = document.getElementById("catalog-section");
                        if (catalogEl) {
                          catalogEl.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      style={{ borderRadius: "7px" }}
                      className="inline-flex items-center justify-center bg-[#4A202A] hover:bg-[#34141D] text-[#FAF8F5] text-xs font-extrabold tracking-[0.22em] px-10 sm:px-14 py-3 sm:py-3.5 transition-all duration-300 uppercase shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                    >
                      VIEW ALL
                    </button>
                  </div>

                  {/* Hairline Divider between sections */}
                  {sIdx < showcaseSections.length - 1 && (
                    <div className="w-full mt-12 sm:mt-16 lg:mt-20 h-[1px] bg-gradient-to-r from-[#8C6944]/20 via-[#6E4822]/45 to-[#8C6944]/20" />
                  )}
                </section>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Common Atelier Showcase: Video Banner, Shop By Fabrics & Customer Testimonials */}
      <CommonAtelierShowcase />

      {/* Bottom Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />
    </div>
  );
}

function ShopLoading() {
  const c = useContent("shopPage");
  return (
    <div className="min-h-screen bg-[#D7C2AD] flex items-center justify-center text-sm font-semibold tracking-widest uppercase text-[#14110E]">
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
