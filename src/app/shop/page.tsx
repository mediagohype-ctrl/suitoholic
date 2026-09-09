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

  const selectedCategory = searchParams.get("category");
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
        <main className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-8 sm:pb-16">
          
          {/* Top Section: Breadcrumb & Title */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase mb-2 sm:mb-3 space-x-2">
              <Link href="/" className="text-[#332B24] hover:text-[#966839] transition-colors">HOME</Link>
              <span className="text-[#966839] text-xs font-normal">&gt;</span>
              <span className="text-[#8C6D47] font-bold">SHOP SHIRTS</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-[44px] font-normal text-[#140F0A] tracking-tight uppercase leading-[1.05]">
                  SHOP SHIRTS
                </h1>
                <p className="text-xs sm:text-sm text-[#44372D] font-normal mt-1 leading-relaxed">
                  Explore our premium collection of shirts. <br className="hidden sm:inline" />
                  Designed for every occasion. Tailored for you.
                </p>
              </div>
              
              {/* Right Editorial Slogan on Desktop */}
              <div className="hidden lg:block text-right select-none opacity-85">
                <p className="font-serif-luxury text-[13px] text-[#966839] font-normal tracking-[0.14em] uppercase leading-tight">
                  SHIRTS <br />
                  FOR A BETTER <br />
                  YOU.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW 1: 4 CATEGORIES SHOWCASE (Default Initial View)                       */}
          {/* ========================================================================= */}
          {!selectedCategory && (
            <div className="space-y-6">
              {/* Desktop View: 4 Category Cards in 1 Horizontal Row on Stone Slabs */}
              <div className="hidden lg:grid grid-cols-4 gap-5">
                {mainCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="bg-[#EEDAC4] border border-[#CEB8A0] rounded-2xl p-3.5 shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between text-left group cursor-pointer"
                  >
                    {/* Top: 3D Shirt on Stone Slab Image */}
                    <div className="w-full aspect-[4/3.8] rounded-xl overflow-hidden relative bg-[#241D17] shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                      />
                    </div>

                    {/* Bottom: Title, Subtitle, & Explore Link */}
                    <div className="pt-3.5 pb-1 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif-luxury text-[15px] font-bold tracking-[0.06em] text-[#1F1C18] uppercase leading-tight group-hover:text-[#966839] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-[11.5px] text-[#5C5044] font-sans mt-1 leading-snug">
                          {cat.subtitle}
                        </p>
                      </div>
                      
                      <div className="pt-3 flex items-center justify-between border-t border-[#DAC2AA]/60 mt-3 text-[11px] font-bold text-[#1F1C18] group-hover:text-[#966839] uppercase tracking-wider">
                        <span>EXPLORE COLLECTION</span>
                        <ArrowRight size={15} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View: 4 Stacked Category Cards with Clean Stone Slabs */}
              <div className="lg:hidden space-y-3">
                {mainCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="bg-[#F1E0CE]/95 border border-[#DEC6B0]/75 rounded-[20px] p-2.5 shadow-xs hover:shadow-md flex items-center group transition-all text-left cursor-pointer"
                  >
                    {/* Left: 3D Shirt on Stone Slab */}
                    <div className="w-[125px] h-[95px] rounded-[15px] overflow-hidden shrink-0 relative bg-[#241D17] shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="eager"
                      />
                    </div>

                    {/* Center: Title & Subtitle */}
                    <div className="flex-1 min-w-0 pl-3.5 pr-1 py-0.5">
                      <h3 className="font-serif-luxury text-[15px] font-bold tracking-[0.05em] text-[#140F0A] uppercase leading-[1.12]">
                        {cat.mobileTitle[0]} <br />
                        {cat.mobileTitle[1]}
                      </h3>
                      <p className="text-[10.5px] text-[#524538] font-sans mt-1 leading-tight line-clamp-2">
                        {cat.subtitle}
                      </p>
                    </div>

                    {/* Right: Action Arrow */}
                    <div className="shrink-0 pr-2 pl-1 text-[#140F0A] group-hover:text-[#966839] group-hover:translate-x-1 transition-all">
                      <ArrowRight size={20} strokeWidth={1.5} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: PRODUCT CATALOG (When any category is clicked)                     */}
          {/* ========================================================================= */}
          {selectedCategory && (
            <div>
              {/* Back to All Categories Button on Mobile */}
              <div className="lg:hidden flex items-center justify-between mb-4">
                <button
                  onClick={handleBackToCategories}
                  className="inline-flex items-center space-x-1.5 bg-[#E4D1BC] border border-[#C5AE96] px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-[#1F1C18]"
                >
                  <ArrowLeft size={14} />
                  <span>ALL CATEGORIES</span>
                </button>
              </div>

              {/* Mobile Category Filter Pills */}
              <div className="lg:hidden flex space-x-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
                {mainCategories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap tracking-wider transition-all ${
                        isActive
                          ? "bg-[#1F1C18] text-[#FAF8F5] shadow-xs"
                          : "bg-[#EEDAC4] text-[#44382D] border border-[#CEB8A0]"
                      }`}
                    >
                      {cat.title}
                    </button>
                  );
                })}
              </div>

              {/* Desktop Layout: Left Sidebar + Right 4x2 Catalog Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
                
                {/* Left Sidebar (Desktop Only) */}
                <aside className="hidden lg:block lg:col-span-3 space-y-4 select-none">
                  
                  {/* CATEGORIES SECTION */}
                  <div className="bg-[#EEDAC4]/85 border border-[#D5C0A8] rounded-xl p-3.5 shadow-xs">
                    <div className="flex items-center justify-between mb-2.5 pb-1 border-b border-[#DAC2AA]/60">
                      <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#332B24] uppercase">
                        CATEGORIES
                      </h3>
                      <button 
                        onClick={handleBackToCategories}
                        className="text-[9.5px] text-[#8A6E48] hover:underline uppercase font-bold"
                      >
                        VIEW ALL
                      </button>
                    </div>
                    <div className="space-y-1 text-xs">
                      {mainCategories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-[10.5px] tracking-wider uppercase transition-all flex items-center justify-between ${
                              isActive
                                ? "bg-[#E4CEB8] border border-[#C5AE96] text-[#1A1511] font-bold shadow-2xs"
                                : "text-[#54483C] hover:text-[#1A1511] hover:bg-[#E7D3BF]"
                            }`}
                          >
                            <span>{cat.title}</span>
                            {isActive && <span className="text-xs">→</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* FILTER BY SECTION */}
                  <div className="bg-[#EEDAC4]/85 border border-[#D5C0A8] rounded-xl p-3.5 shadow-xs space-y-2.5">
                    <h3 className="text-[11px] font-bold tracking-[0.2em] text-[#332B24] uppercase pb-1 border-b border-[#DAC2AA]/60">
                      FILTER BY
                    </h3>

                    {["COLOR", "SIZE", "FABRIC", "FIT", "PRICE"].map((filter) => (
                      <div key={filter} className="border-b border-[#DAC2AA]/40 pb-2 last:border-0 last:pb-0">
                        <button
                          onClick={() => toggleFilter(filter)}
                          className="w-full flex items-center justify-between text-[11px] font-semibold text-[#44382D] hover:text-[#110E0B] tracking-wider uppercase py-0.5"
                        >
                          <span>{filter}</span>
                          <Plus size={14} className={`transform transition-transform ${openFilters[filter] ? "rotate-45" : ""}`} />
                        </button>
                        {openFilters[filter] && (
                          <div className="pt-2 pl-1 space-y-1 text-[10px] text-[#635548]">
                            <p className="cursor-pointer hover:text-[#110E0B]">Option 1</p>
                            <p className="cursor-pointer hover:text-[#110E0B]">Option 2</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CLEAR ALL BUTTON */}
                  <button
                    onClick={() => {
                      handleCategorySelect("formal_shirts");
                      setOpenFilters({});
                    }}
                    className="w-full bg-[#E5D2BE] hover:bg-[#1F1C18] text-[#332B24] hover:text-white border border-[#C5AE96] rounded-xl py-2.5 px-3 text-[10px] font-bold tracking-[0.18em] uppercase transition-all flex items-center justify-center space-x-2 shadow-2xs"
                  >
                    <span>CLEAR ALL</span>
                    <RotateCcw size={12} />
                  </button>
                </aside>

                {/* Right Main Catalog: Sort Bar + Products Grid */}
                <div className="col-span-1 lg:col-span-9 space-y-3">
                  
                  {/* Top Sort Bar */}
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-6 text-[11px] text-[#4A3E33] font-medium pb-1 tracking-wider">
                    <span className="lg:hidden text-[#695B4E] font-semibold uppercase">{currentCategoryName}</span>
                    <div className="flex items-center space-x-1.5 cursor-pointer hover:text-[#110E0B]">
                      <span className="uppercase text-[#695B4E] font-semibold">SORT BY:</span>
                      <span className="font-bold uppercase text-[#1F1C18] flex items-center gap-1">
                        {sortOption} <ChevronDown size={14} />
                      </span>
                    </div>
                  </div>

                  {/* MOBILE VIEW (< lg:): 1 Horizontal Shirt Card Per Row (Matching Screenshot) */}
                  <div className="lg:hidden space-y-2.5 mb-6">
                    {displayProducts.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        className="bg-[#F1E0CE]/95 border border-[#DEC6B0]/75 rounded-[20px] p-2 shadow-xs hover:shadow-md flex items-center group transition-all"
                      >
                        {/* Left: Thumbnail with Rounded Edges on Stone Slab */}
                        <div className="w-[125px] h-[90px] rounded-[15px] overflow-hidden shrink-0 relative bg-[#241D17] shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            loading="eager"
                          />
                        </div>

                        {/* Center: Title, Subtitle & Price */}
                        <div className="flex-1 min-w-0 pl-3.5 pr-1 py-0.5">
                          <h3 className="font-serif-luxury text-[13.5px] font-bold tracking-[0.03em] text-[#140F0A] uppercase leading-[1.15]">
                            {p.name}
                          </h3>
                          <p className="text-[10px] text-[#524538] font-sans mt-0.5 leading-tight line-clamp-1">
                            {p.subtitle}
                          </p>
                          <p className="text-[11.5px] font-bold text-[#140F0A] mt-1.5 font-sans tracking-wide">
                            {p.price}
                          </p>
                        </div>

                        {/* Right: Action Arrow */}
                        <div className="shrink-0 pr-2 pl-1 text-[#140F0A] group-hover:text-[#966839] group-hover:translate-x-1 transition-all">
                          <ArrowRight size={20} strokeWidth={1.5} />
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* DESKTOP VIEW (lg:+): 4-Column × 2-Row Product Grid */}
                  <div className="hidden lg:grid grid-cols-4 gap-3.5">
                    {displayProducts.map((p) => {
                      const isFavorited = wishlist.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          className="bg-[#EEDAC4] border border-[#CEB8A0] rounded-xl p-2.5 shadow-2xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                        >
                          {/* Product Thumbnail Container with Wishlist Heart */}
                          <div className="relative w-full aspect-[4/3.7] rounded-lg overflow-hidden bg-[#241D17] flex items-center justify-center shadow-inner">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              loading="eager"
                            />
                            {/* Wishlist Heart Button */}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(p.id);
                              }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/35 hover:bg-black/60 backdrop-blur-xs flex items-center justify-center text-white transition-all shadow-xs"
                              aria-label="Add to wishlist"
                            >
                              <Heart
                                size={13}
                                className={isFavorited ? "fill-[#E04B4B] text-[#E04B4B]" : "text-white/90"}
                              />
                            </button>
                          </div>

                          {/* Product Title & Price Details */}
                          <div className="pt-2.5 pb-0.5 text-center flex flex-col items-center">
                            <h4 className="font-serif-luxury text-[11.5px] font-bold tracking-[0.05em] text-[#1F1C18] uppercase leading-tight line-clamp-1">
                              {p.name}
                            </h4>
                            <p className="text-[11px] font-bold text-[#1F1C18] mt-1 font-sans tracking-wide">
                              {p.price}
                            </p>
                          </div>

                          {/* Explore / Customize Link Button */}
                          <Link
                            href={`/product/${p.slug}`}
                            className="mt-2 w-full bg-[#E5D2BE] hover:bg-[#1F1C18] text-[#1F1C18] hover:text-white border border-[#C5AE96] py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <span>CUSTOMIZE</span>
                            <span>→</span>
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            </div>
          )}

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
