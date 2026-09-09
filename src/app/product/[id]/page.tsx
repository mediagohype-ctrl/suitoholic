"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import { allProducts, ProductItem } from "@/data/products";
import { 
  ArrowLeft, 
  ArrowRight,
  Heart, 
  Star, 
  ShoppingBag, 
  Scissors, 
  Ruler, 
  ShieldCheck, 
  RefreshCw, 
  Check 
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ProductDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const product: ProductItem = 
    allProducts.find((p) => String(p.id) === idOrSlug || p.slug === idOrSlug) || 
    allProducts[0];

  const [selectedSize, setSelectedSize] = useState<number>(38);
  const [selectedFit, setSelectedFit] = useState<string>("Slim Fit");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastVisible, setToastVisible] = useState<boolean>(false);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    setToastVisible(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header */}
      <Header activeTab="shop" cartCount={cartCount} />

      {/* Studio Atmosphere Content */}
      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-12 pt-3 sm:pt-6 pb-8 sm:pb-16 space-y-6">
          
          {/* Breadcrumb Navigation on top */}
          <div className="flex items-center text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase space-x-2">
            <Link href="/" className="text-[#332B24] hover:text-[#966839] transition-colors">HOME</Link>
            <span className="text-[#966839] text-xs font-normal">&gt;</span>
            <Link href="/shop" className="text-[#332B24] hover:text-[#966839] transition-colors uppercase">
              SHOP
            </Link>
            <span className="text-[#966839] text-xs font-normal">&gt;</span>
            <Link href={`/shop?category=${product.category}`} className="text-[#332B24] hover:text-[#966839] transition-colors uppercase">
              {product.category}
            </Link>
            <span className="text-[#966839] text-xs font-normal">&gt;</span>
            <span className="text-[#8C6D47] font-bold">{product.name}</span>
          </div>

          {/* Back to Catalog button */}
          <div>
            <Link
              href={`/shop?category=${product.category}`}
              className="inline-flex items-center space-x-2 bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B] px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs"
            >
              <ArrowLeft size={15} />
              <span>BACK TO {product.category.toUpperCase()} CATALOG</span>
            </Link>
          </div>

          {/* Product Details 2-Column Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Multi-Angle High-Resolution Product Gallery */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Large Image on Stone Podium */}
              <div className="relative w-full aspect-[4/3.8] rounded-2xl overflow-hidden bg-[#241D17] border border-[#C6B09B] shadow-lg group flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.gallery[selectedImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="eager"
                />
                
                {/* Wishlist button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={17}
                    className={isWishlisted ? "fill-[#E04B4B] text-[#E04B4B]" : "text-white"}
                  />
                </button>

                {/* Tag badge */}
                <div className="absolute bottom-3 left-3 bg-[#120F0D]/85 backdrop-blur-md text-[#FAF8F5] text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-[#3A332C]">
                  {product.tag || "SUITOHOLIC BESPOKE"}
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-[4/3.2] rounded-xl overflow-hidden border-2 transition-all relative cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-[#120F0D] ring-2 ring-[#120F0D]/20 shadow-md scale-102"
                        : "border-[#C6B09B] opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>

              {/* Assurance Badges Strip */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="bg-[#EFE2D4]/80 border border-[#D0BDA9] rounded-xl p-2.5">
                  <ShieldCheck size={18} className="mx-auto text-[#9E774C] mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-[#14110E]">100% Giza Cotton</span>
                  <span className="text-[9px] text-[#665749] block">120s 2-Ply Fine Weave</span>
                </div>
                <div className="bg-[#EFE2D4]/80 border border-[#D0BDA9] rounded-xl p-2.5">
                  <Scissors size={18} className="mx-auto text-[#9E774C] mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-[#14110E]">Hand Cut &amp; Sewn</span>
                  <span className="text-[9px] text-[#665749] block">Master Tailor Crafted</span>
                </div>
                <div className="bg-[#EFE2D4]/80 border border-[#D0BDA9] rounded-xl p-2.5">
                  <RefreshCw size={18} className="mx-auto text-[#9E774C] mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-[#14110E]">Free Alterations</span>
                  <span className="text-[9px] text-[#665749] block">30-Day Fit Guarantee</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details, Size Selector, & Actions */}
            <div className="lg:col-span-6 bg-[#EFE2D4]/90 border border-[#D0BDA9] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg backdrop-blur-md space-y-5">
              
              {/* Category & Title */}
              <div>
                <span className="text-[10.5px] font-bold tracking-[0.24em] uppercase text-[#9E774C] block mb-1">
                  SUITOHOLIC BESPOKE ATELIER
                </span>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#14110E] tracking-tight uppercase leading-tight">
                  {product.name}
                </h1>
                
                {/* Rating & Reviews */}
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex text-[#C59B27]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#14110E]">{product.rating}</span>
                  <span className="text-xs text-[#665749]">({product.reviewsCount} Bespoke Reviews)</span>
                </div>

                {/* Price */}
                <div className="mt-3.5 flex items-baseline space-x-3">
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#14110E]">
                    {product.price}
                  </span>
                  <span className="text-xs text-[#665749]">
                    (Inclusive of all taxes &amp; complimentary shipping)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-[13px] text-[#42372E] font-normal leading-relaxed border-t border-[#D5C2AF]/70 pt-3.5">
                {product.description}
              </p>

              {/* Fit Silhouette Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713]">
                    FIT SILHOUETTE
                  </label>
                  <span className="text-[10px] text-[#9E774C] font-semibold uppercase">{selectedFit}</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {["Slim Fit", "Regular Fit", "Relaxed Fit"].map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setSelectedFit(fit)}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all ${
                        selectedFit === fit
                          ? "bg-[#120F0D] text-white shadow-md"
                          : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#1B1713]">
                    SELECT CHEST SIZE (INCHES)
                  </label>
                  <Link href="/custom-shirt" className="text-[10px] text-[#9E774C] hover:underline font-bold uppercase flex items-center gap-1">
                    <Ruler size={12} /> Custom Fit Guide
                  </Link>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {[38, 39, 40, 41, 42, 44, 46, 48].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? "bg-[#120F0D] text-white shadow-md ring-1 ring-[#120F0D]"
                          : "bg-[#E2D0BE]/90 hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-3 border-t border-[#D5C2AF]/70">
                
                {/* ADD TO BAG & BUY NOW Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#120F0D] hover:bg-[#2A231D] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-[0.14em] uppercase transition-all flex items-center justify-center space-x-2 shadow-md"
                  >
                    <ShoppingBag size={15} />
                    <span>ADD TO BAG</span>
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#8A6E48] hover:bg-[#725938] text-white py-3.5 px-4 rounded-xl text-xs font-bold tracking-[0.14em] uppercase transition-all flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <span>BUY NOW</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* CUSTOMIZE FIT (BESPOKE) Link */}
                <Link
                  href={`/custom-shirt?product=${product.slug}&chest=${selectedSize}`}
                  className="w-full bg-[#E2D0BE] hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-[#C6B09B] py-3 sm:py-3.5 px-6 rounded-xl text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-xs group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Scissors size={15} className="text-[#8A6E48] group-hover:rotate-12 transition-transform" />
                    <span>CUSTOMIZE FIT ON BESPOKE TAILOR</span>
                  </div>
                  <span className="text-[10px] font-normal tracking-widest">
                    6 STEPS →
                  </span>
                </Link>

                {/* Added to cart toast notification */}
                {toastVisible && (
                  <div className="bg-[#2D6A4F] text-white p-3 rounded-xl text-center text-xs font-bold tracking-wider animate-in slide-in-from-top-2 duration-300 shadow-lg flex items-center justify-center space-x-2">
                    <Check size={16} />
                    <span>{product.name} (SIZE {selectedSize}&quot;) ADDED TO BAG!</span>
                  </div>
                )}
              </div>

              {/* Specifications & Craft Details Accordion */}
              <div className="bg-[#F5EBE1]/90 border border-[#D8C6B3] rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                  <span className="text-[#665749]">Fabric Composition:</span>
                  <strong className="text-[#14110E]">{product.fabric}</strong>
                </div>
                <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                  <span className="text-[#665749]">Thread Count / Weave:</span>
                  <strong className="text-[#14110E]">{product.threadCount}</strong>
                </div>
                {product.fit && (
                  <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                    <span className="text-[#665749]">Tailoring Silhouette:</span>
                    <strong className="text-[#14110E]">{product.fit}</strong>
                  </div>
                )}
                {product.collar && (
                  <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-1.5">
                    <span className="text-[#665749]">Collar Structure:</span>
                    <strong className="text-[#14110E]">{product.collar}</strong>
                  </div>
                )}
                {product.cuff && (
                  <div className="flex justify-between">
                    <span className="text-[#665749]">Cuff Construction:</span>
                    <strong className="text-[#14110E]">{product.cuff}</strong>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Related Bespoke Shirts Section */}
          <div className="pt-8 border-t border-[#D5C2AF]/70">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#14110E] uppercase mb-4 tracking-wider">
              You May Also Admire
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {allProducts.filter(p => p.id !== product.id).slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="bg-[#EEDAC4] border border-[#CEB8A0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-all text-left group block"
                >
                  <div className="aspect-[4/3.5] rounded-lg overflow-hidden bg-[#241D17] mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-serif-luxury text-xs font-bold text-[#14110E] uppercase line-clamp-1">
                    {p.name}
                  </h4>
                  <p className="text-xs font-bold text-[#9E774C] mt-0.5">{p.price}</p>
                </Link>
              ))}
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
