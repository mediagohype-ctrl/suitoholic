"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import ShopByCategoryGrid from "@/components/ShopByCategoryGrid";
import MannequinShirtViewer from "@/components/MannequinShirtViewer";
import { allProducts, ProductItem } from "@/data/products";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Star,
  ShoppingBag,
  Scissors,
  ShieldCheck,
  RefreshCw,
  Check,
  Sparkles,
  Eye,
  Layers,
  ZoomIn
} from "lucide-react";
import confetti from "canvas-confetti";
import CustomizationModal, { CustomFitState } from "@/components/CustomizationModal";

export default function ProductDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const initialProduct: ProductItem =
    allProducts.find((p) => String(p.id) === idOrSlug || p.slug === idOrSlug) ||
    allProducts[0];

  const [activeProduct, setActiveProduct] = useState<ProductItem>(initialProduct);
  const [selectedSize, setSelectedSize] = useState<number>(38);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"photo" | "3d_mannequin">("photo");
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  // Available Fabric Swatches
  const colorways = [
    { name: "Crisp Royal White", hex: "#FFFFFF", productSlug: "royal-formal-crisp-white-shirt", image: "/formal_white_twill.jpg" },
    { name: "Boardroom Sky Blue", hex: "#7DA6CE", productSlug: "executive-french-cuff-blue-shirt", image: "/formal_french_cuff_blue.jpg" },
    { name: "Banker Navy Stripe", hex: "#2A3C54", productSlug: "boardroom-banker-pinstripe-formal", image: "/formal_banker_stripe.jpg" },
    { name: "Fine Ivory Herringbone", hex: "#EAE2D8", productSlug: "fine-ivory-herringbone-formal", image: "/formal_ivory_herringbone.jpg" },
    { name: "Executive Charcoal", hex: "#3A3836", productSlug: "midnight-charcoal-formal-shirt", image: "/formal_charcoal_boardroom.jpg" },
  ];

  const handleOpenCustomizer = () => {
    setIsCustomizerOpen(true);
  };

  const handleConfirmCustomization = (customFit: CustomFitState) => {
    setCartCount((prev) => prev + 1);
    setIsCustomizerOpen(false);
    setToastMessage(`${activeProduct.name} (CHEST ${customFit.chestSize}" • ${customFit.bodyFit.toUpperCase()} FIT • BESPOKE CUSTOMIZED) ADDED TO BAG!`);
    setToastVisible(true);
    triggerConfetti();
    setTimeout(() => {
      setToastVisible(false);
    }, 5000);
  };

  const handleQuickAdd = () => {
    setCartCount((prev) => prev + 1);
    setToastMessage(`${activeProduct.name} (STANDARD CHEST ${selectedSize}") ADDED TO BAG!`);
    setToastVisible(true);
    triggerConfetti();
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.7 },
    });
  };

  const completeLookItems = allProducts.filter(p => p.id !== activeProduct.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header */}
      <Header activeTab="shop" cartCount={cartCount} />

      {/* Main Studio Content */}
      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-8 sm:pb-16 space-y-10 sm:space-y-14">

          {/* Breadcrumb Navigation on top */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase space-x-2">
              <Link href="/" className="text-[#332B24] hover:text-[#966839] transition-colors">HOME</Link>
              <span className="text-[#966839] text-xs font-normal">&gt;</span>
              <Link href="/shop" className="text-[#332B24] hover:text-[#966839] transition-colors uppercase">
                SHOP
              </Link>
              <span className="text-[#966839] text-xs font-normal">&gt;</span>
              <span className="text-[#8C6D47] font-bold">{activeProduct.name}</span>
            </div>

            {/* Back to Catalog button */}
            <Link
              href={`/shop?category=${activeProduct.category}`}
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs"
            >
              <ArrowLeft size={15} />
              <span>BACK TO CATALOG</span>
            </Link>
          </div>

          {/* SECTION 1: HERO 2-COLUMN VISUAL SHOWCASE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Visual Showcase Gallery & Interactive 3D View Switcher */}
            <div className="lg:col-span-6 space-y-4">

              {/* Mode Switcher Tabs (High-Res Photo vs. 3D Mannequin Fit) */}
              <div className="flex items-center justify-between bg-white border border-gray-200 p-1.5 rounded-2xl shadow-xs">
                <button
                  onClick={() => setViewMode("photo")}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${viewMode === "photo"
                    ? "bg-[#120F0D] text-white shadow-md"
                    : "text-[#55473B] hover:text-[#120F0D]"
                    }`}
                >
                  <Eye size={15} />
                  <span>HIGH-RES GALLERY</span>
                </button>

                <button
                  onClick={() => setViewMode("3d_mannequin")}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${viewMode === "3d_mannequin"
                    ? "bg-[#120F0D] text-white shadow-md"
                    : "text-[#55473B] hover:text-[#120F0D]"
                    }`}
                >
                  <Layers size={15} className="text-[#C68A4C]" />
                  <span>3D MANNEQUIN FIT</span>
                </button>
              </div>

              {/* Main Display Box */}
              <div className="relative w-full aspect-[4/3.8] sm:aspect-[4/3.6] rounded-3xl overflow-hidden bg-[#241D17] border border-[#C6B09B] shadow-xl flex items-center justify-center group">

                {viewMode === "photo" ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeProduct.gallery[selectedImageIndex] || activeProduct.image}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="eager"
                    />

                    {/* Zoom Overlay Indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={14} />
                      <span>HOVER TO ZOOM</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full p-4 flex items-center justify-center bg-gradient-to-b from-[#F3E8DC] to-[#DFD0C0]">
                    <MannequinShirtViewer
                      chestSize={selectedSize}
                      bodyFit="lean"
                      height='TALL HEIGHT (5.8 - 5.10")'
                      sleeveType="full"
                      currentStep={1}
                    />
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md cursor-pointer z-10"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-[#E04B4B] text-[#E04B4B]" : "text-white"}
                  />
                </button>

              </div>

              {/* Thumbnail Strip (For Photo Mode) */}
              {viewMode === "photo" && (
                <div className="grid grid-cols-4 gap-3">
                  {activeProduct.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-[4/3.2] rounded-2xl overflow-hidden border-2 transition-all relative cursor-pointer ${selectedImageIndex === idx
                        ? "border-[#120F0D] ring-2 ring-[#C68A4C] shadow-md scale-102"
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
              )}

              {/* Visual Assurance Badges Strip */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs">
                  <ShieldCheck size={18} className="mx-auto text-[#9E774C] mb-1" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#14110E]">100% Giza Cotton</span>
                  <span className="text-[9px] text-[#665749] block">140s 2-Ply Fine Weave</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs">
                  <Scissors size={18} className="mx-auto text-[#9E774C] mb-1" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#14110E]">Hand Cut &amp; Sewn</span>
                  <span className="text-[9px] text-[#665749] block">Master Shirtmakers</span>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs">
                  <RefreshCw size={18} className="mx-auto text-[#9E774C] mb-1" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#14110E]">30-Day Fit Guarantee</span>
                  <span className="text-[9px] text-[#665749] block">Free Alterations</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Product Specs, Swatches & Action Buttons */}
            <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-9 shadow-lg space-y-6">

              {/* Brand Title & Price */}
              <div>
                <span className="text-[10.5px] font-extrabold tracking-[0.26em] uppercase text-[#9E774C] block mb-1">
                  SUITOHOLIC BESPOKE ATELIER
                </span>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#14110E] tracking-tight uppercase leading-tight">
                  {activeProduct.name}
                </h1>

                {/* Rating & Review Counter */}
                <div className="flex items-center space-x-2.5 mt-2.5">
                  <div className="flex text-[#C59B27]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-[#14110E]">{activeProduct.rating} / 5.0</span>
                  <span className="text-xs text-[#665749] font-medium">({activeProduct.reviewsCount} Bespoke Client Reviews)</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline space-x-3 border-t border-gray-200 pt-3.5">
                  <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#14110E]">
                    {activeProduct.price}
                  </span>
                  <span className="text-xs text-[#665749] font-medium">
                    (Inclusive of all taxes &amp; complimentary shipping)
                  </span>
                </div>
              </div>

              {/* VISUAL COLORWAY / FABRIC SWATCH SELECTOR */}
              <div className="space-y-2.5 border-t border-gray-200 pt-3.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10.5px] font-extrabold tracking-[0.2em] uppercase text-[#14110E]">
                    AVAILABLE FABRIC COLORWAYS
                  </label>
                  <span className="text-[11px] font-bold text-[#9E774C] uppercase">{activeProduct.name.split(" ")[0]}</span>
                </div>

                <div className="flex items-center space-x-3">
                  {colorways.map((cw, idx) => {
                    const isSelected = activeProduct.slug === cw.productSlug;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          const target = allProducts.find(p => p.slug === cw.productSlug);
                          if (target) {
                            setActiveProduct(target);
                            setSelectedImageIndex(0);
                          }
                        }}
                        className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-sm relative group ${isSelected
                          ? "border-[#120F0D] ring-2 ring-[#C68A4C] scale-110"
                          : "border-gray-300 opacity-80 hover:opacity-100"
                          }`}
                        style={{ backgroundColor: cw.hex }}
                        title={cw.name}
                      >
                        {isSelected && (
                          <Check size={14} className={cw.hex === "#FFFFFF" || cw.hex === "#EAE2D8" ? "text-black" : "text-white"} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* E-COMMERCE ACTION BUTTONS */}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleOpenCustomizer}
                    className="w-full bg-[#120F0D] hover:bg-[#2A231D] text-white py-4 px-5 rounded-2xl text-xs font-extrabold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-xl cursor-pointer group border border-[#9E774C]/50"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ShoppingBag size={17} className="text-[#C68A4C]" />
                      <span>ADD TO BAG</span>
                    </div>
                    <span className="text-[10px] text-[#C68A4C] font-bold tracking-widest">
                      6 STEPS →
                    </span>
                  </button>

                  <button
                    onClick={handleOpenCustomizer}
                    className="w-full bg-gradient-to-r from-[#8A6E48] to-[#6E5030] hover:brightness-110 text-white py-4 px-5 rounded-2xl text-xs font-extrabold tracking-[0.16em] uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>BUY NOW</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Toast Notification */}
                {toastVisible && (
                  <div className="bg-[#2D6A4F] text-white p-3.5 rounded-xl text-center text-xs font-bold tracking-wider animate-in slide-in-from-top-2 duration-300 shadow-lg flex items-center justify-center space-x-2">
                    <Check size={16} />
                    <span>{toastMessage}</span>
                  </div>
                )}
              </div>

              {/* Specifications Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4.5 space-y-2 text-xs shadow-xs">
                <h4 className="text-[10.5px] font-extrabold tracking-[0.2em] text-[#9E774C] uppercase mb-2">
                  PRODUCT SPECIFICATIONS
                </h4>
                <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                  <span className="text-[#665749]">Fabric Composition:</span>
                  <strong className="text-[#14110E]">{activeProduct.fabric}</strong>
                </div>
                <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                  <span className="text-[#665749]">Thread Count / Weave:</span>
                  <strong className="text-[#14110E]">{activeProduct.threadCount}</strong>
                </div>
                {activeProduct.collar && (
                  <div className="flex justify-between border-b border-[#D8C6B3]/60 pb-2">
                    <span className="text-[#665749]">Collar Structure:</span>
                    <strong className="text-[#14110E]">{activeProduct.collar}</strong>
                  </div>
                )}
                {activeProduct.cuff && (
                  <div className="flex justify-between">
                    <span className="text-[#665749]">Cuff Construction:</span>
                    <strong className="text-[#14110E]">{activeProduct.cuff}</strong>
                  </div>
                )}
              </div>

              {/* Product Description Paragraph (Placed AFTER Specifications) */}
              <div className="pt-2 border-t border-[#D5C2AF]/70">
                <span className="text-[10.5px] font-extrabold tracking-[0.2em] text-[#9E774C] uppercase block mb-1.5">
                  DESCRIPTION
                </span>
                <p className="text-xs sm:text-[13px] text-[#3D332A] font-normal leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

            </div>

          </div>

          {/* SECTION 2: VISUAL MACRO TEXTURE & CRAFTSMANSHIP SHOWCASE (IMAGE CARDS) */}
          <div className="w-full space-y-6 pt-4">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-[10.5px] font-extrabold tracking-[0.28em] text-[#9E774C] uppercase block mb-1">
                MACRO DETAIL GALLERY
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#14110E] uppercase tracking-wider">
                Uncompromising Fabric &amp; Finish
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Card 1: Fabric Macro */}
              <div className="bg-transparent border border-[#C6B09B]/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                <div className="aspect-[4/3] overflow-hidden bg-[#241D17]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/detail_fabric_macro.jpg"
                    alt="140s Giza Cotton Macro Texture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 sm:p-5 space-y-1 text-left">
                  <span className="text-[10px] font-bold text-[#9E774C] uppercase tracking-widest block">WEAVE &amp; TEXTURE</span>
                  <h3 className="font-serif-luxury text-base font-bold text-[#14110E] uppercase">140s 2-Ply Fine Twill</h3>
                  <p className="text-xs text-[#665749] leading-relaxed">
                    Double-ply long-staple Egyptian cotton woven for silky touch, natural luster, and crisp drape.
                  </p>
                </div>
              </div>

              {/* Card 2: Cuff & Collar Close up */}
              <div className="bg-transparent border border-[#C6B09B]/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                <div className="aspect-[4/3] overflow-hidden bg-[#241D17]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/detail_cuff_collar.jpg"
                    alt="Collar and Cuff Craftsmanship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 sm:p-5 space-y-1 text-left">
                  <span className="text-[10px] font-bold text-[#9E774C] uppercase tracking-widest block">COLLAR &amp; CUFF</span>
                  <h3 className="font-serif-luxury text-base font-bold text-[#14110E] uppercase">Hand-Cut English Spread</h3>
                  <p className="text-xs text-[#665749] leading-relaxed">
                    German fused interlining ensures permanent collar roll with removable brass stays and convertible French cuffs.
                  </p>
                </div>
              </div>

              {/* Card 3: 3D Bespoke Silhouette */}
              <div className="bg-transparent border border-[#C6B09B]/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                <div className="aspect-[4/3] overflow-hidden bg-[#241D17]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/custom_fit_shirt_hq.png"
                    alt="3D Bespoke Tailored Silhouette"
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-4 sm:p-5 space-y-1 text-left">
                  <span className="text-[10px] font-bold text-[#9E774C] uppercase tracking-widest block">SARTORIAL FIT</span>
                  <h3 className="font-serif-luxury text-base font-bold text-[#14110E] uppercase">Anatomical 3D Morphing</h3>
                  <p className="text-xs text-[#665749] leading-relaxed">
                    Precision pattern cut according to your individual chest, waist, and height proportions.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: "COMPLETE THE LOOK" E-COMMERCE OUTFIT GRID */}
          <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="text-[10.5px] font-extrabold tracking-[0.28em] text-[#9E774C] uppercase block mb-1">
                  SARTORIAL STYLING
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#14110E] uppercase tracking-wider">
                  Complete The Bespoke Look
                </h2>
              </div>
              <span className="text-xs font-bold text-[#665749] uppercase tracking-wider">
                Handpicked items to pair with {activeProduct.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {completeLookItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-transparent border border-[#C6B09B]/60 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <Link href={`/product/${item.slug}`} className="block">
                    <div className="aspect-[4/3.5] rounded-xl overflow-hidden bg-[#241D17] mb-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <span className="text-[9.5px] font-extrabold text-[#9E774C] uppercase tracking-wider block mb-0.5">
                      {item.category.replace("_", " ")}
                    </span>
                    <h4 className="font-serif-luxury text-xs font-bold text-[#14110E] uppercase line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold text-[#14110E] mt-1">{item.price}</p>
                  </Link>

                  <button
                    onClick={() => {
                      setCartCount((prev) => prev + 1);
                      setToastMessage(`${item.name} ADDED TO YOUR OUTFIT!`);
                      setToastVisible(true);
                      triggerConfetti();
                      setTimeout(() => setToastVisible(false), 3500);
                    }}
                    className="w-full mt-3 bg-[#120F0D] hover:bg-[#C68A4C] text-white py-2 rounded-xl text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>+ ADD TO OUTFIT</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: DISCOVER OTHER BESPOKE COLORWAYS */}
          <div className="w-full space-y-4 pt-2">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10.5px] font-extrabold tracking-[0.28em] text-[#9E774C] uppercase block mb-1">
                  CURATED SELECTION
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#14110E] uppercase tracking-wider">
                  More Bespoke Shirt Colorways
                </h3>
              </div>
              <Link href="/shop" className="text-xs font-bold tracking-widest text-[#9E774C] hover:underline uppercase flex items-center gap-1">
                <span>VIEW ALL CATALOG</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {allProducts.filter(p => p.category === "formal_shirts" && p.id !== activeProduct.id).map((p) => (
                <div
                  key={p.id}
                  className="bg-transparent border border-[#C6B09B]/60 rounded-2xl p-3 shadow-xs hover:shadow-md transition-all text-left group block"
                >
                  <Link href={`/product/${p.slug}`}>
                    <div className="aspect-[4/3.5] rounded-xl overflow-hidden bg-[#241D17] mb-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-serif-luxury text-xs font-bold text-[#14110E] uppercase line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-xs font-bold text-[#9E774C] mt-1">{p.price}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: SHOP BY CATEGORY GRID */}
          <ShopByCategoryGrid />

        </main>
      </div>

      {/* Bottom Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />

      {/* 6-Step Bespoke Customization Popup Modal */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        productName={activeProduct.name}
        initialChestSize={selectedSize}
        onConfirmCustomization={handleConfirmCustomization}
      />
    </div>
  );
}
