"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import { allProducts, collectionCategories, ProductItem } from "@/data/products";
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  RotateCcw, 
  ChevronDown, 
  Heart, 
  Star, 
  SlidersHorizontal 
} from "lucide-react";

// Main Categories Showcase Data
const mainCategories = [
  {
    id: "formal_shirts",
    title: "EXCLUSIVE FORMAL SHIRTS",
    mobileTitle: ["EXCLUSIVE", "FORMAL SHIRTS"],
    subtitle: "100% pure Egyptian Giza 140s boardroom dress shirts.",
    image: "/formal_white_twill.jpg",
  },
  {
    id: "formal_stripes",
    title: "EXECUTIVE STRIPED FORMAL SHIRTS",
    mobileTitle: ["STRIPED", "FORMAL SHIRTS"],
    subtitle: "Italian banker stripes, pinstripes & micro-checks.",
    image: "/formal_banker_stripe.jpg",
  },
  {
    id: "formal_bespoke",
    title: "LUXURY TEXTURED & TWILL SHIRTS",
    mobileTitle: ["TEXTURED &", "TWILL SHIRTS"],
    subtitle: "Sea Island cotton, royal dobbies & herringbone weaves.",
    image: "/formal_ivory_herringbone.jpg",
  },
  {
    id: "trousers",
    title: "TAILORED TROUSERS & PANTS",
    mobileTitle: ["TAILORED", "TROUSERS"],
    subtitle: "Italian pleated wool dress pants & Gurkha trousers.",
    image: "/pant_pleated_beige.jpg",
  },
  {
    id: "tshirts",
    title: "PREMIUM POLOS & T-SHIRTS",
    mobileTitle: ["POLOS &", "T-SHIRTS"],
    subtitle: "Heavyweight Supima tees & silk-blend knit polos.",
    image: "/tshirt_knit_navy_polo.jpg",
  },
  {
    id: "blazers",
    title: "BESPOKE SUITS & BLAZERS",
    mobileTitle: ["SUITS &", "BLAZERS"],
    subtitle: "Super 130s Italian wool jackets & dinner tuxedos.",
    image: "/blazer_navy_wool.jpg",
  },
  {
    id: "ceremonial",
    title: "ETHNIC & CEREMONIAL LUXURY",
    mobileTitle: ["CEREMONIAL &", "ROYAL ATELIER"],
    subtitle: "Silk bandhgalas, wedding kurtas & smoking jackets.",
    image: "/ceremonial_bandhgala.jpg",
  },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category");
  const selectedCategory = categoryParam || "all";
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [sortOption] = useState<string>("NEW ARRIVALS");
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});

  const handleCategorySelect = (id: string) => {
    router.push(`/shop?category=${id}`, { scroll: false });
  };

  const handleBackToCategories = () => {
    router.push("/shop", { scroll: false });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleFilter = (filter: string) => {
    setOpenFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const displayProducts = selectedCategory && selectedCategory !== "all"
    ? allProducts.filter((p) => p.category === selectedCategory)
    : allProducts;

  const currentCategoryName = mainCategories.find(c => c.id === selectedCategory)?.title || "ALL SHIRTS";

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
              <span>SUITOHOLIC ATELIER</span>
              <span>•</span>
              <span>BESPOKE COLLECTION</span>
              <span className="h-[1px] w-8 sm:w-12 bg-[#9E774C]" />
            </div>
            
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#14110E] tracking-tight uppercase leading-tight">
              THE SHIRT ATELIER
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
                ALL SHIRTS
              </button>
              {mainCategories.map((cat) => {
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
                    {cat.title.replace("EXCLUSIVE ", "").replace("EXECUTIVE ", "").replace("LUXURY ", "").replace("PREMIUM ", "").replace("BESPOKE ", "").replace("ETHNIC & ", "")}
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
                    COLLECTIONS
                  </h3>
                  <button 
                    onClick={() => handleCategorySelect("all")}
                    className="text-[10px] text-[#9E774C] hover:underline uppercase font-bold tracking-wider"
                  >
                    RESET
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
                    <span>ALL SHIRTS &amp; PRODUCTS</span>
                    {selectedCategory === "all" && <span className="text-xs">→</span>}
                  </button>

                  {mainCategories.map((cat) => {
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
                  FILTER BY
                </h3>

                {["FABRIC WEAVE", "COLLAR STYLE", "CHEST SIZE", "FIT PREFERENCE", "PRICE RANGE"].map((filter) => (
                  <div key={filter} className="border-b border-[#E8DACB]/60 pb-2.5 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFilter(filter)}
                      className="w-full flex items-center justify-between text-[11px] font-semibold text-[#3A3028] hover:text-[#14110E] tracking-wider uppercase py-1 cursor-pointer"
                    >
                      <span>{filter}</span>
                      <Plus size={14} className={`transform transition-transform text-[#9E774C] ${openFilters[filter] ? "rotate-45" : ""}`} />
                    </button>
                    {openFilters[filter] && (
                      <div className="pt-2 pl-1 space-y-1.5 text-[11px] text-[#635548]">
                        <p className="cursor-pointer hover:text-[#14110E] transition-colors">• Egyptian Giza Cotton</p>
                        <p className="cursor-pointer hover:text-[#14110E] transition-colors">• Italian Poplin Weave</p>
                        <p className="cursor-pointer hover:text-[#14110E] transition-colors">• Sea Island Twill</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CLEAR ALL BUTTON */}
              <button
                onClick={() => {
                  handleCategorySelect("all");
                  setOpenFilters({});
                }}
                className="w-full bg-[#EAE0D3] hover:bg-[#14110E] text-[#14110E] hover:text-white border border-[#D5C2AF] rounded-xl py-3 px-4 text-[10.5px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                <span>RESET ALL FILTERS</span>
                <RotateCcw size={13} />
              </button>
            </aside>

            {/* Right Main Catalog: Sort Bar + Products Grid */}
            <div className="col-span-1 lg:col-span-9 space-y-4">
              
              {/* Top Control Bar */}
              <div className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-xl px-4 py-3 flex items-center justify-between text-[11px] text-[#4A3E33] font-medium shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#14110E] uppercase tracking-wider">{currentCategoryName}</span>
                  <span className="text-[#9E774C]">•</span>
                  <span className="text-[#7A6B5D]">{displayProducts.length} Items Available</span>
                </div>

                <div className="flex items-center space-x-2 cursor-pointer hover:text-[#14110E]">
                  <span className="uppercase text-[#7A6B5D] font-bold tracking-wider">SORT BY:</span>
                  <span className="font-bold uppercase text-[#14110E] tracking-wider flex items-center gap-1">
                    {sortOption} <ChevronDown size={14} className="text-[#9E774C]" />
                  </span>
                </div>
              </div>

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
                            className="inline-flex items-center space-x-1.5 bg-[#14110E] hover:bg-[#9E774C] text-white px-4 py-2 rounded-xl text-[10.5px] font-bold uppercase tracking-[0.14em] transition-all shadow-sm cursor-pointer"
                          >
                            <span>CUSTOMIZE</span>
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#D7C2AD] flex items-center justify-center text-sm font-semibold tracking-widest uppercase text-[#14110E]">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
