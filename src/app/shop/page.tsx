"use client";

import React, { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import {
  ArrowRight,
  Plus,
  RotateCcw,
  ChevronDown,
  Heart,
} from "lucide-react";

type SortKey = "featured" | "priceAsc" | "priceDesc" | "rating";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories } = useCatalog();
  const c = useContent("shopPage");

  const categoryParam = searchParams.get("category");
  const selectedCategory = categoryParam || "all";
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState<SortKey>("featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [fabricFilter, setFabricFilter] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<number | null>(null);

  const handleCategorySelect = (id: string) => {
    router.push(id === "all" ? "/shop" : `/shop?category=${id}`, { scroll: false });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFilter = (filter: string) => {
    setOpenFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const resetAll = () => {
    setFabricFilter(null);
    setPriceFilter(null);
    setSortOption("featured");
    setOpenFilters({});
    handleCategorySelect("all");
  };

  const categoryProducts = useMemo(
    () => (selectedCategory !== "all" ? products.filter((p) => p.category === selectedCategory) : products),
    [products, selectedCategory],
  );

  // Fabric options come from the products in the current collection
  const fabricOptions = useMemo(
    () => Array.from(new Set(categoryProducts.map((p) => p.fabric).filter(Boolean))).sort(),
    [categoryProducts],
  );

  const displayProducts = useMemo(() => {
    const range = priceFilter !== null ? c.priceRanges[priceFilter] : undefined;
    const filtered = categoryProducts.filter(
      (p) =>
        (!fabricFilter || p.fabric === fabricFilter) &&
        (!range || (p.rawPrice >= range.min && p.rawPrice <= range.max)),
    );
    const sorted = [...filtered];
    if (sortOption === "priceAsc") sorted.sort((a, b) => a.rawPrice - b.rawPrice);
    if (sortOption === "priceDesc") sorted.sort((a, b) => b.rawPrice - a.rawPrice);
    if (sortOption === "rating") sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    return sorted;
  }, [categoryProducts, fabricFilter, priceFilter, sortOption, c.priceRanges]);

  const currentCategoryName = categories.find((cat) => cat.id === selectedCategory)?.title || c.allCategoryName;

  const filterGroups = [
    {
      id: "fabric",
      label: c.fabricFilterLabel,
      options: fabricOptions.map((f) => ({ label: f, active: fabricFilter === f, onClick: () => setFabricFilter(fabricFilter === f ? null : f) })),
    },
    {
      id: "price",
      label: c.priceFilterLabel,
      options: c.priceRanges.map((r, i) => ({ label: r.label, active: priceFilter === i, onClick: () => setPriceFilter(priceFilter === i ? null : i) })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header */}
      <Header activeTab="shop" />

      {/* Studio Atmosphere Backdrop */}
      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 sm:pt-44 lg:pt-48 pb-12 sm:pb-20">

          {/* Top Editorial Banner - Clean Luxury Centered Header */}
          <div className="mb-8 sm:mb-10 text-center relative max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center space-x-3 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-[#9E774C] uppercase mb-2">
              <span className="h-[1px] w-8 sm:w-12 bg-[#9E774C]" />
              <span>{c.eyebrowLeft}</span>
              <span>•</span>
              <span>{c.eyebrowRight}</span>
              <span className="h-[1px] w-8 sm:w-12 bg-[#9E774C]" />
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#14110E] tracking-tight uppercase leading-tight">
              {c.title}
            </h1>

            <div className="w-16 h-[1.5px] bg-[#9E774C] mx-auto mt-3" />
          </div>

          {/* Category Quick Selector Filter Pills Bar (Centered Luxury Tabs) */}
          <div className="mb-10 flex items-center justify-center">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none max-w-full px-2">
              <button
                onClick={() => handleCategorySelect("all")}
                className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                  selectedCategory === "all"
                    ? "bg-[#14110E] text-white ring-1 ring-[#14110E]"
                    : "bg-[#FAF5EE] hover:bg-[#14110E] text-[#4A3E33] hover:text-white border border-[#E2D4C3]"
                }`}
              >
                {c.allPillLabel}
              </button>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                      isActive
                        ? "bg-[#14110E] text-white ring-1 ring-[#14110E]"
                        : "bg-[#FAF5EE] hover:bg-[#14110E] text-[#4A3E33] hover:text-white border border-[#E2D4C3]"
                    }`}
                  >
                    {cat.shortTitle || cat.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catalog Layout: Left Sidebar + Right Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Sidebar (Desktop Only) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6 select-none sticky top-32">

              {/* CATEGORIES SECTION */}
              <div className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DACB]">
                  <h3 className="text-[11px] font-bold tracking-[0.22em] text-[#14110E] uppercase">
                    {c.collectionsHeading}
                  </h3>
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className="text-[10px] text-[#9E774C] hover:underline uppercase font-bold tracking-wider"
                  >
                    {c.resetLabel}
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <button
                    onClick={() => handleCategorySelect("all")}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center justify-between cursor-pointer ${
                      selectedCategory === "all"
                        ? "bg-[#14110E] text-white font-bold shadow-sm"
                        : "text-[#4A3E33] hover:text-[#14110E] hover:bg-[#F2E5D5]"
                    }`}
                  >
                    <span>{c.allSidebarLabel}</span>
                    {selectedCategory === "all" && <span className="text-xs">→</span>}
                  </button>

                  {categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-all flex items-center justify-between cursor-pointer ${
                          isActive
                            ? "bg-[#14110E] text-white font-bold shadow-sm"
                            : "text-[#4A3E33] hover:text-[#14110E] hover:bg-[#F2E5D5]"
                        }`}
                      >
                        <span className="truncate pr-2">{cat.title}</span>
                        {isActive && <span className="text-xs shrink-0">→</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FILTER BY SECTION */}
              <div className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-[11px] font-bold tracking-[0.22em] text-[#14110E] uppercase pb-2 border-b border-[#E8DACB]">
                  {c.filterHeading}
                </h3>

                {filterGroups.map((group) => (
                  <div key={group.id} className="border-b border-[#E8DACB]/60 pb-2.5 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFilter(group.id)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-[#3A3028] hover:text-[#14110E] tracking-wider uppercase py-1 cursor-pointer"
                    >
                      <span>{group.label}</span>
                      <Plus size={14} className={`transform transition-transform text-[#9E774C] ${openFilters[group.id] ? "rotate-45" : ""}`} />
                    </button>
                    {openFilters[group.id] && (
                      <div className="pt-2 pl-1 space-y-1.5 text-[11px] text-[#635548]">
                        {group.options.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={opt.onClick}
                            className={`block text-left cursor-pointer hover:text-[#14110E] transition-colors ${opt.active ? "text-[#14110E] font-bold" : ""}`}
                          >
                            {opt.active ? "✓" : "•"} {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CLEAR ALL BUTTON */}
              <button
                onClick={resetAll}
                className="w-full bg-[#EAE0D3] hover:bg-[#14110E] text-[#14110E] hover:text-white border border-[#D5C2AF] rounded-xl py-3 px-4 text-[10.5px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>{c.resetAllLabel}</span>
                <RotateCcw size={13} />
              </button>
            </aside>

            {/* Right Main Catalog: Sort Bar + Products Grid */}
            <div className="col-span-1 lg:col-span-9 space-y-4">

              {/* Top Control Bar */}
              <div className="relative bg-[#FAF5EE] border border-[#E2D4C3] rounded-xl px-4 py-3 flex flex-wrap gap-2 items-center justify-between text-[11px] text-[#4A3E33] font-medium shadow-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="font-bold text-[#14110E] uppercase tracking-wider truncate">{currentCategoryName}</span>
                  <span className="text-[#9E774C]">•</span>
                  <span className="text-[#7A6B5D] whitespace-nowrap">{displayProducts.length} {c.itemsAvailableLabel}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  aria-expanded={sortOpen}
                  className="flex items-center space-x-2 cursor-pointer hover:text-[#14110E]"
                >
                  <span className="uppercase text-[#7A6B5D] font-bold tracking-wider">{c.sortLabel}</span>
                  <span className="font-bold uppercase text-[#14110E] tracking-wider flex items-center gap-1">
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
                        className={`w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-[#FAF5EE] ${sortOption === key ? "text-[#9E774C]" : "text-[#14110E]"}`}
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
                    className="inline-flex items-center gap-2 bg-[#14110E] hover:bg-[#9E774C] text-white px-5 py-2.5 rounded-xl text-[10.5px] font-bold uppercase tracking-[0.16em] transition-all"
                  >
                    {c.resetAllLabel} <RotateCcw size={13} />
                  </button>
                </div>
              )}

              {/* MOBILE VIEW (< lg:): 1 Horizontal Shirt Card Per Row */}
              <div className="lg:hidden space-y-3 mb-6">
                {displayProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-3 shadow-xs hover:shadow-md flex items-center group transition-all"
                  >
                    <div className="w-[125px] h-[140px] rounded-xl overflow-hidden shrink-0 relative bg-[#241D17] shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pl-4 pr-1 py-1">
                      <span className="text-[9.5px] font-bold tracking-[0.16em] text-[#9E774C] uppercase block mb-0.5">
                        {p.fabric}
                      </span>
                      <h3 className="font-serif-luxury text-sm font-bold tracking-[0.03em] text-[#14110E] uppercase leading-snug">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#55473B] font-sans mt-0.5 leading-tight line-clamp-1">
                        {p.subtitle}
                      </p>
                      <p className="text-xs font-bold text-[#14110E] mt-2 font-sans tracking-tight">
                        {p.price}
                      </p>
                    </div>

                    <div className="shrink-0 pr-2 pl-1 text-[#14110E] group-hover:text-[#9E774C] group-hover:translate-x-1 transition-all">
                      <ArrowRight size={20} strokeWidth={1.5} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* DESKTOP VIEW (lg:+): Ultra-Sleek Editorial 3-Column Product Grid */}
              <div className="hidden lg:grid grid-cols-3 gap-6">
                {displayProducts.map((p) => {
                  const isFavorited = wishlist.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-4 shadow-xs hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden"
                    >
                      {/* Product Thumbnail Container with Wishlist Heart */}
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#241D17] flex items-center justify-center shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="eager"
                        />

                        {/* Tag Pill Overlay */}
                        {p.tag && (
                          <div className="absolute top-3.5 left-3.5 bg-[#14110E]/90 backdrop-blur-md text-white text-[9px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 rounded-full border border-white/20 shadow-md">
                            {p.tag}
                          </div>
                        )}

                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(p.id);
                          }}
                          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md cursor-pointer"
                          aria-label="Add to wishlist"
                        >
                          <Heart
                            size={15}
                            className={isFavorited ? "fill-[#E04B4B] text-[#E04B4B]" : "text-white/90"}
                          />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="pt-4 pb-1 text-left flex flex-col flex-1 justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.18em] text-[#9E774C] uppercase block mb-1">
                            {p.fabric}
                          </span>
                          <h4 className="font-serif-luxury text-sm font-bold tracking-[0.04em] text-[#14110E] uppercase leading-snug group-hover:text-[#9E774C] transition-colors">
                            {p.name}
                          </h4>
                          <p className="text-[11.5px] text-[#55473B] font-sans mt-1 line-clamp-1 leading-snug">
                            {p.subtitle}
                          </p>
                        </div>

                        {/* Bottom Row: Price & Customize Button */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8DACB]">
                          <p className="text-sm font-bold text-[#14110E] font-sans tracking-tight">
                            {p.price}
                          </p>
                          <Link
                            href={`/product/${p.slug}`}
                            className="inline-flex items-center space-x-1.5 bg-[#14110E] hover:bg-black text-white px-4 py-2 rounded-xl text-[10.5px] font-bold uppercase tracking-[0.14em] transition-all shadow-sm cursor-pointer"
                          >
                            <span>{c.customizeLabel}</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </main>
      </div>

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
