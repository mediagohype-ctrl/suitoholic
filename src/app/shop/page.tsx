"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { ArrowRight, ChevronRight, Check, Sparkles, Filter, SlidersHorizontal, Heart } from "lucide-react";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("plain");
  const [activeSort, setActiveSort] = useState("NEW ARRIVALS");

  // Category listing matching reference image 2 & 3
  const categories = [
    {
      id: "plain",
      title: "PLAIN SHIRTS",
      subtitle: "Timeless solids for every occasion.",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "stripe",
      title: "STRIPE SHIRTS",
      subtitle: "Classic stripes. Modern elegance.",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "linen",
      title: "LINEN SHIRTS",
      subtitle: "Breathe easy. Stay effortlessly stylish.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "bespoke",
      title: "BESPOKE HAND STITCH SHIRTS",
      subtitle: "Handcrafted luxury. Made just for you.",
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=600&q=80",
    },
  ];

  // Shirt Products for list view (Reference Image 3 - dark container boxes with soft rounded edges)
  const products = [
    {
      id: "shirt-1",
      name: "CLASSIC WHITE SHIRT",
      category: "plain",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
      tag: "Best Seller",
    },
    {
      id: "shirt-2",
      name: "NAVY STRIPE SHIRT",
      category: "stripe",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
      tag: "Popular",
    },
    {
      id: "shirt-3",
      name: "PINK LINEN SHIRT",
      category: "linen",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "shirt-4",
      name: "CHARCOAL STRIPE SHIRT",
      category: "stripe",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "shirt-5",
      name: "SKY BLUE STRIPE SHIRT",
      category: "stripe",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "shirt-6",
      name: "BEIGE STRIPE SHIRT",
      category: "stripe",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689e?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "shirt-7",
      name: "OLIVE STRIPE SHIRT",
      category: "stripe",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "shirt-8",
      name: "MAROON STRIPE SHIRT",
      category: "stripe",
      price: "₹ 2,499",
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE3D2]">
      <Header activeTab="shop" />

      {/* Main Container */}
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-10">
        {/* Breadcrumb navigation */}
        <div className="flex items-center text-xs font-semibold tracking-widest text-[#5C554C] uppercase mb-4 space-x-2">
          <Link href="/" className="hover:text-[#9E7D52]">HOME</Link>
          <ChevronRight size={14} />
          <span className="text-[#1F1C18]">SHOP SHIRTS</span>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#D3C9B4]">
          <div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#1F1C18] tracking-wider uppercase mb-2">
              SHOP <span className="text-[#9E7D52]">SHIRTS</span>
            </h1>
            <p className="text-sm text-[#5C554C] max-w-xl">
              Explore our premium collection of shirts. Designed for every occasion. Tailored for you.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right hidden md:block">
            <span className="font-serif-luxury text-xl text-[#9E7D52] italic tracking-wide">
              SHIRTS FOR A BETTER YOU.
            </span>
          </div>
        </div>

        {/* REFERENCE IMAGE 2: 4 Different Shirt Categories Horizontal Showcase */}
        <section id="shop-categories" className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-wider text-[#1F1C18] uppercase">
              Browse Categories
            </h2>
            <span className="text-xs font-medium text-[#9E7D52]">4 Collections Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`cursor-pointer group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
                    isSelected
                      ? "bg-[#2C2621] text-[#EAE3D2] shadow-2xl scale-[1.02] border-2 border-[#9E7D52]"
                      : "bg-[#E4DCC9] hover:bg-[#DED5BE] text-[#1F1C18] border border-[#D3C9B4]/80 shadow-md"
                  }`}
                >
                  {/* Category Image Box with rounded edges and soft depth shadow */}
                  <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-4 shadow-inner bg-[#DFD7C2]">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  </div>

                  <h3 className={`font-serif-luxury text-lg font-bold tracking-wider uppercase mb-1 ${
                    isSelected ? "text-[#EAE3D2]" : "text-[#1F1C18]"
                  }`}>
                    {cat.title}
                  </h3>
                  <p className={`text-xs mb-4 line-clamp-2 ${
                    isSelected ? "text-[#D4C3A3]" : "text-[#5C554C]"
                  }`}>
                    {cat.subtitle}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-current/10">
                    <span className="text-[11px] font-bold tracking-widest uppercase flex items-center gap-1">
                      EXPLORE <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9E7D52] animate-pulse" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* REFERENCE IMAGE 3: Product Listing Grid with Dark Container Boxes */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#D3C9B4]/60 gap-4">
            <div className="flex items-center space-x-3 text-xs font-semibold tracking-wider text-[#1F1C18] uppercase">
              <span className="bg-[#1F1C18] text-[#EAE3D2] px-3 py-1.5 rounded-md flex items-center gap-2">
                <Filter size={14} /> FILTER BY
              </span>
              <span className="text-[#5C554C]">Showing 24 Products</span>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-[#5C554C] font-medium uppercase tracking-wider">SORT BY:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-[#E4DCC9] border border-[#D3C9B4] px-3 py-1.5 rounded-md font-semibold text-[#1F1C18] focus:outline-none focus:border-[#9E7D52]"
              >
                <option value="NEW ARRIVALS">NEW ARRIVALS</option>
                <option value="PRICE LOW TO HIGH">PRICE: LOW TO HIGH</option>
                <option value="PRICE HIGH TO LOW">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filter Menu */}
            <div className="lg:col-span-1 bg-[#E4DCC9]/90 border border-[#D3C9B4] p-5 rounded-2xl h-fit shadow-sm space-y-6">
              <div>
                <h4 className="text-xs font-bold tracking-widest text-[#1F1C18] uppercase mb-3 pb-2 border-b border-[#D3C9B4]">
                  CATEGORIES
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-[#5C554C]">
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`cursor-pointer flex items-center justify-between py-1 px-2 rounded hover:text-[#1F1C18] transition-colors ${
                        activeCategory === c.id ? "bg-[#9E7D52]/20 text-[#9E7D52] font-bold" : ""
                      }`}
                    >
                      <span>{c.title}</span>
                      {activeCategory === c.id && <ArrowRight size={14} />}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Filter Attributes */}
              {["COLOR", "SIZE", "FABRIC", "FIT", "PRICE"].map((filterName) => (
                <div key={filterName} className="border-t border-[#D3C9B4] pt-4">
                  <div className="flex items-center justify-between text-xs font-bold tracking-widest text-[#1F1C18] cursor-pointer">
                    <span>{filterName}</span>
                    <span>+</span>
                  </div>
                </div>
              ))}

              <button className="w-full bg-[#1F1C18] text-[#EAE3D2] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#9E7D52] transition-colors shadow">
                CLEAR ALL
              </button>
            </div>

            {/* Main Products Grid - Reference Image 3 Dark Boxes */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="suitoholic-dark-card group p-3.5 flex flex-col justify-between transition-all duration-300 hover:transform hover:-translate-y-1.5 hover:shadow-2xl border border-white/10"
                >
                  {/* Image container inside box with rounded corners and darker depth */}
                  <div className="relative w-full h-52 sm:h-56 rounded-xl overflow-hidden mb-3 bg-[#1F1C18]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <button className="absolute top-2.5 right-2.5 p-1.5 bg-black/40 hover:bg-[#9E7D52] text-white rounded-full transition-colors">
                      <Heart size={14} />
                    </button>
                    {p.tag && (
                      <span className="absolute top-2.5 left-2.5 bg-[#9E7D52] text-white text-[9px] font-bold tracking-widest px-2 py-0.5 rounded uppercase">
                        {p.tag}
                      </span>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-sm font-bold tracking-wider text-[#FAF6EE] uppercase line-clamp-1 mb-1">
                        {p.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#C5A069] mb-3">
                        {p.price}
                      </p>
                    </div>

                    <Link
                      href={`/custom-shirt?style=${p.category}&name=${encodeURIComponent(p.name)}`}
                      className="w-full bg-[#3D352E] hover:bg-[#9E7D52] text-[#FAF6EE] py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Sparkles size={12} /> CUSTOM FIT THIS
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#E4DCC9] border border-[#D3C9B4] p-6 rounded-2xl text-center">
          <div className="p-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1F1C18] mb-1">CUSTOM FIT</h5>
            <p className="text-[11px] text-[#5C554C]">Made for Your Body</p>
          </div>
          <div className="p-3 border-l border-[#D3C9B4]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1F1C18] mb-1">PREMIUM FABRICS</h5>
            <p className="text-[11px] text-[#5C554C]">Finest Quality Cotton</p>
          </div>
          <div className="p-3 border-l border-[#D3C9B4]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1F1C18] mb-1">EXPERT TAILORING</h5>
            <p className="text-[11px] text-[#5C554C]">Every Stitch Matters</p>
          </div>
          <div className="p-3 border-l border-[#D3C9B4]">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#1F1C18] mb-1">EASY RETURNS</h5>
            <p className="text-[11px] text-[#5C554C]">Hassle Free Guarantee</p>
          </div>
        </div>
      </main>
    </div>
  );
}
