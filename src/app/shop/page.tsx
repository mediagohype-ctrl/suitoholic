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
  SlidersHorizontal,
  X,
  Check,
  Filter,
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

  // Advanced Shop Filters
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const COLOR_OPTIONS = [
    { label: "White", hex: "#FFFFFF", border: "#D1D5DB" },
    { label: "Blue", hex: "#2B4C7E" },
    { label: "Black", hex: "#111111" },
    { label: "Pink", hex: "#E8B4B8" },
    { label: "Brown", hex: "#6E473B" },
    { label: "Green", hex: "#2E523A" },
    { label: "Grey", hex: "#7E8287" },
  ];

  const FABRIC_OPTIONS = ["Giza Cotton", "Supima", "Linen", "Egyptian", "Twill", "Oxford", "Poplin"];

  const PRICE_OPTIONS = [
    { id: "under-3000", label: "Under ₹3,000", min: 0, max: 2999 },
    { id: "3000-5000", label: "₹3,000 – ₹5,000", min: 3000, max: 5000 },
    { id: "above-5000", label: "Above ₹5,000", min: 5001, max: Infinity },
  ];

  const activeFiltersCount = (selectedColor ? 1 : 0) + (selectedFabric ? 1 : 0) + (selectedPriceRange ? 1 : 0);

  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, selectedColor, selectedFabric, selectedPriceRange]);

  const handleCategorySelect = (id: string) => {
    setVisibleCount(12);
    router.push(id === "all" ? "/shop" : `/shop?category=${id}`, { scroll: false });
  };

  const clearFilters = () => {
    setSelectedColor(null);
    setSelectedFabric(null);
    setSelectedPriceRange(null);
    setVisibleCount(12);
  };

  const resetAll = () => {
    setVisibleCount(12);
    setSortOption("featured");
    clearFilters();
    handleCategorySelect("all");
  };

  const categoryProducts = useMemo(() => {
    let list = selectedCategory !== "all" ? products.filter((p) => p.category === selectedCategory) : products;

    if (selectedColor) {
      const q = selectedColor.toLowerCase();
      list = list.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        const inColorways = p.colorways?.some((c) => c.name.toLowerCase().includes(q));
        return inName || inDesc || inColorways;
      });
    }

    if (selectedFabric) {
      const q = selectedFabric.toLowerCase();
      list = list.filter((p) => {
        const inFabric = p.fabric?.toLowerCase().includes(q);
        const inName = p.name?.toLowerCase().includes(q);
        const inDesc = p.description?.toLowerCase().includes(q);
        return inFabric || inName || inDesc;
      });
    }

    if (selectedPriceRange) {
      const tier = PRICE_OPTIONS.find((t) => t.id === selectedPriceRange);
      if (tier) {
        list = list.filter((p) => p.rawPrice >= tier.min && p.rawPrice <= tier.max);
      }
    }

    return list;
  }, [products, selectedCategory, selectedColor, selectedFabric, selectedPriceRange]);

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
    <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-clip selection:bg-black selection:text-white">
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
              <div className="h-[1px] w-8 sm:w-16 md:w-24 bg-black/30" />
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight text-center">
                {selectedCategory === "all" ? (c.title || "THE BESPOKE COLLECTION") : `${currentCategoryName} COLLECTION`}
              </h2>
              <div className="h-[1px] w-8 sm:w-16 md:w-24 bg-black/30" />
            </div>

            {/* Top Control Bar with Filters & Sorting */}
            <div className="bg-white border border-[#E5E3DD] rounded-2xl md:rounded-full px-5 sm:px-6 py-3.5 flex flex-wrap gap-3 items-center justify-between text-[11px] text-[#666666] font-medium shadow-sm">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="font-semibold text-black uppercase tracking-wider truncate">{currentCategoryName}</span>
                <span className="text-black/30">•</span>
                <span className="text-[#666666] whitespace-nowrap">{sortedProducts.length} {c.itemsAvailableLabel}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    filtersOpen || activeFiltersCount > 0
                      ? "bg-black text-white border-black"
                      : "bg-[#F7F6F3] text-black border-[#E5E3DD] hover:border-black"
                  }`}
                >
                  <SlidersHorizontal size={12} />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#8C7355] text-white text-[9px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen((v) => !v)}
                    aria-expanded={sortOpen}
                    className="flex items-center space-x-1.5 cursor-pointer hover:text-black transition-colors px-2 py-1"
                  >
                    <span className="uppercase text-[#666666] font-medium tracking-wider">{c.sortLabel}:</span>
                    <span className="font-semibold uppercase text-black tracking-wider flex items-center gap-1">
                      {c.sortOptions[sortOption]} <ChevronDown size={14} className={`text-black transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                    </span>
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-[#E5E3DD] rounded-2xl shadow-xl py-2 min-w-[210px]">
                      {(Object.keys(c.sortOptions) as SortKey[]).map((key) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSortOption(key);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider hover:bg-[#F5F4F0] transition-colors ${sortOption === key ? "text-black bg-[#F5F4F0]" : "text-[#666666]"}`}
                        >
                          {c.sortOptions[key]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expandable Filter Drawer */}
            {filtersOpen && (
              <div className="bg-white border border-[#E5E3DD] rounded-2xl p-5 sm:p-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEA]">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-[#8C7355]" />
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-black">Refine Selection</span>
                  </div>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-[11px] text-[#8C7355] hover:text-black font-semibold uppercase tracking-wider underline cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Filter */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-3">Price Range</p>
                    <div className="flex flex-wrap gap-2">
                      {PRICE_OPTIONS.map((tier) => {
                        const isSelected = selectedPriceRange === tier.id;
                        return (
                          <button
                            key={tier.id}
                            onClick={() => setSelectedPriceRange(isSelected ? null : tier.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#FAF9F6] text-[#444] border-[#E8E6E0] hover:border-black"
                            }`}
                          >
                            {tier.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fabric / Material Filter */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-3">Fabric & Weave</p>
                    <div className="flex flex-wrap gap-2">
                      {FABRIC_OPTIONS.map((fab) => {
                        const isSelected = selectedFabric === fab;
                        return (
                          <button
                            key={fab}
                            onClick={() => setSelectedFabric(isSelected ? null : fab)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-black text-white border-black shadow-xs"
                                : "bg-[#FAF9F6] text-[#444] border-[#E8E6E0] hover:border-black"
                            }`}
                          >
                            {fab}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Swatch Filter */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#888888] mb-3">Color Shade</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {COLOR_OPTIONS.map((col) => {
                        const isSelected = selectedColor === col.label;
                        return (
                          <button
                            key={col.label}
                            onClick={() => setSelectedColor(isSelected ? null : col.label)}
                            title={col.label}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-black text-white border-black"
                                : "bg-[#FAF9F6] text-[#444] border-[#E8E6E0] hover:border-black"
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shadow-inner inline-block"
                              style={{
                                backgroundColor: col.hex,
                                border: col.border ? `1px solid ${col.border}` : "1px solid rgba(0,0,0,0.15)",
                              }}
                            />
                            <span>{col.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Pill Bar (when filters are active) */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">Active:</span>
                {selectedPriceRange && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E5E3DD] text-black shadow-xs">
                    {PRICE_OPTIONS.find((t) => t.id === selectedPriceRange)?.label}
                    <button onClick={() => setSelectedPriceRange(null)} className="hover:text-red-500 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedFabric && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E5E3DD] text-black shadow-xs">
                    {selectedFabric}
                    <button onClick={() => setSelectedFabric(null)} className="hover:text-red-500 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedColor && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white border border-[#E5E3DD] text-black shadow-xs">
                    Color: {selectedColor}
                    <button onClick={() => setSelectedColor(null)} className="hover:text-red-500 cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#8C7355] hover:text-black font-semibold ml-2 underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}

            {displayProducts.length === 0 && (
              <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-10 text-center space-y-4 shadow-sm">
                <p className="text-sm text-[#666666]">{c.emptyText}</p>
                <button
                  onClick={resetAll}
                  className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white rounded-full px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm cursor-pointer"
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
                  className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.22em] px-10 sm:px-14 py-3.5 sm:py-4 rounded-full transition-all duration-300 uppercase shadow-sm cursor-pointer active:scale-98"
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
                <div className="w-full h-[1px] bg-[#E5E3DD]" />
              </div>

              {showcaseSections.map((sec, sIdx) => (
                <section key={sec.id} id={sec.id} className="w-full flex flex-col items-center select-none">
                  {/* Centered Heading in Luxury Uppercase */}
                  <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                    <h2 className="text-base sm:text-lg lg:text-[20px] font-semibold tracking-[0.22em] text-black uppercase leading-tight">
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
                      className="inline-flex items-center justify-center bg-black hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.22em] px-10 sm:px-14 py-3.5 sm:py-4 rounded-full transition-all duration-300 uppercase shadow-sm cursor-pointer active:scale-98"
                    >
                      VIEW ALL
                    </button>
                  </div>

                  {/* Hairline Divider between sections */}
                  {sIdx < showcaseSections.length - 1 && (
                    <div className="w-full mt-12 sm:mt-16 lg:mt-20 h-[1px] bg-[#E5E3DD]" />
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
