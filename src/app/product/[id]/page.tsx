"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import ShopByCategoryGrid from "@/components/ShopByCategoryGrid";
import MannequinShirtViewer from "@/components/MannequinShirtViewer";
import { useCart } from "@/context/CartProvider";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { fillTemplate } from "@/content/merge";
import type { CustomFit, ProductItem } from "@/lib/types";
import {
  AlertCircle,
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
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import CustomizationModal from "@/components/CustomizationModal";

// Icon keys usable in the productPage.badges content
const BADGE_ICONS: Record<string, LucideIcon> = {
  shield: ShieldCheck,
  scissors: Scissors,
  refresh: RefreshCw,
  sparkles: Sparkles,
  check: Check,
  star: Star,
  layers: Layers,
};

/** True for pale swatches that need a dark check mark. */
const isLightHex = (hex: string) => {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((x) => x + x).join("") : h.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return false;
  return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114 > 186;
};

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.7 },
  });
};

export default function ProductDetailPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;
  const { products, getProduct } = useCatalog();
  const c = useContent("productPage");
  const { addItem, busy } = useCart();
  const router = useRouter();

  const [activeProduct, setActiveProduct] = useState<ProductItem | undefined>(() => getProduct(idOrSlug));
  const selectedSize = 38;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"photo" | "3d_mannequin">("photo");
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastError, setToastError] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [buyNowMode, setBuyNowMode] = useState<boolean>(false);

  if (!activeProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
        <Header activeTab="shop" />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-44 pb-20 space-y-5">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl uppercase tracking-wider">{c.notFoundTitle}</h1>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 bg-[#120F0D] hover:bg-[#9E774C] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-[0.16em] uppercase transition-all"
          >
            <span>{c.notFoundCta}</span>
            <ArrowRight size={14} />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const colorways = activeProduct.colorways ?? [];
  const gallery = activeProduct.gallery?.length ? activeProduct.gallery : [activeProduct.image];
  const outOfStock = activeProduct.stock === 0;
  const lowStock = typeof activeProduct.stock === "number" && activeProduct.stock > 0 && activeProduct.stock <= 5;

  const showToast = (message: string, isError = false, ms = 5000) => {
    setToastMessage(message);
    setToastError(isError);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), ms);
  };

  const handleOpenCustomizer = (buyNow: boolean) => {
    if (outOfStock) return;
    setBuyNowMode(buyNow);
    setIsCustomizerOpen(true);
  };

  const handleConfirmCustomization = async (customFit: CustomFit) => {
    try {
      await addItem({
        productId: activeProduct.id,
        quantity: 1,
        size: String(customFit.chestSize),
        customization: customFit,
      });
    } catch (err) {
      setIsCustomizerOpen(false);
      showToast((err as Error).message, true);
      return;
    }
    setIsCustomizerOpen(false);
    triggerConfetti();
    if (buyNowMode) {
      router.push("/checkout");
      return;
    }
    showToast(
      fillTemplate(c.addedToBagTemplate, {
        name: activeProduct.name,
        details: `CHEST ${customFit.chestSize}" • ${customFit.bodyFit.toUpperCase()} FIT • BESPOKE CUSTOMIZED`,
      }),
    );
  };

  const handleAddToOutfit = async (item: ProductItem) => {
    try {
      await addItem({ productId: item.id, quantity: 1, size: String(selectedSize) });
      showToast(fillTemplate(c.addedToOutfitTemplate, { name: item.name }), false, 3500);
      triggerConfetti();
    } catch (err) {
      showToast((err as Error).message, true);
    }
  };

  const completeLookItems = products
    .filter((p) => p.id !== activeProduct.id && p.category !== activeProduct.category)
    .slice(0, 4);
  const moreColorways = products
    .filter((p) => p.category === activeProduct.category && p.id !== activeProduct.id)
    .slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#14110E] antialiased relative overflow-x-hidden">
      {/* Header */}
      <Header activeTab="shop" />

      {/* Main Studio Content */}
      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 sm:pt-44 lg:pt-48 pb-8 sm:pb-16 space-y-10 sm:space-y-14">

          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/shop?category=${activeProduct.category}`}
              className="inline-flex items-center space-x-2 bg-white hover:bg-[#120F0D] text-[#1F1C18] hover:text-white border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs"
            >
              <ArrowLeft size={15} />
              <span>{c.backLabel}</span>
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
                  <span>{c.galleryTabLabel}</span>
                </button>

                <button
                  onClick={() => setViewMode("3d_mannequin")}
                  className={`flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${viewMode === "3d_mannequin"
                    ? "bg-[#120F0D] text-white shadow-md"
                    : "text-[#55473B] hover:text-[#120F0D]"
                    }`}
                >
                  <Layers size={15} className="text-[#C68A4C]" />
                  <span>{c.mannequinTabLabel}</span>
                </button>
              </div>

              {/* Main Display Box */}
              <div className="relative w-full aspect-[4/3.8] sm:aspect-[4/3.6] rounded-3xl overflow-hidden bg-[#241D17] border border-[#C6B09B] shadow-xl flex items-center justify-center group">

                {viewMode === "photo" ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gallery[selectedImageIndex] || activeProduct.image}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      loading="eager"
                    />

                    {/* Zoom Overlay Indicator */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={14} />
                      <span>{c.zoomHint}</span>
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
                  {gallery.map((imgUrl, idx) => (
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
                {c.badges.map((badge, i) => {
                  const Icon = BADGE_ICONS[badge.icon] ?? ShieldCheck;
                  return (
                    <div key={i} className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs">
                      <Icon size={18} className="mx-auto text-[#9E774C] mb-1" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#14110E]">{badge.title}</span>
                      <span className="text-[9px] text-[#665749] block">{badge.subtitle}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Product Specs, Swatches & Action Buttons */}
            <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-6 sm:p-9 shadow-lg space-y-6">

              {/* Brand Title & Price */}
              <div>
                <span className="text-[10.5px] font-extrabold tracking-[0.26em] uppercase text-[#9E774C] block mb-1">
                  {c.brandEyebrow}
                </span>
                <h1 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#14110E] tracking-tight uppercase leading-tight">
                  {activeProduct.name}
                </h1>

                {/* Rating & Review Counter */}
                <div className="flex items-center space-x-2.5 mt-2.5">
                  <div className="flex text-[#C59B27]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className={i < Math.round(activeProduct.rating) ? "fill-current" : ""} />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-[#14110E]">{activeProduct.rating} / 5.0</span>
                  <span className="text-xs text-[#665749] font-medium">({activeProduct.reviewsCount} {c.reviewsSuffix})</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-gray-200 pt-3.5">
                  <span className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#14110E]">
                    {activeProduct.price}
                  </span>
                  {activeProduct.compareAtPrice ? (
                    <span className="text-sm text-[#8C7B6B] line-through">
                      {activeProduct.price.replace(/[\d,.]+/, Number(activeProduct.compareAtPrice).toLocaleString("en-IN"))}
                    </span>
                  ) : null}
                  <span className="text-xs text-[#665749] font-medium">
                    {c.taxNote}
                  </span>
                </div>
                {(outOfStock || lowStock) && (
                  <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${outOfStock ? "text-[#B23B3B]" : "text-[#9E774C]"}`}>
                    {outOfStock ? c.outOfStockLabel : fillTemplate(c.lowStockTemplate, { stock: activeProduct.stock ?? 0 })}
                  </p>
                )}
              </div>

              {/* VISUAL COLORWAY / FABRIC SWATCH SELECTOR */}
              {colorways.length > 0 && (
                <div className="space-y-2.5 border-t border-gray-200 pt-3.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10.5px] font-extrabold tracking-[0.2em] uppercase text-[#14110E]">
                      {c.colorwaysLabel}
                    </label>
                    <span className="text-[11px] font-bold text-[#9E774C] uppercase">{activeProduct.name.split(" ")[0]}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {colorways.map((cw, idx) => {
                      const isSelected = activeProduct.slug === cw.productSlug;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            const target = getProduct(cw.productSlug);
                            if (target) {
                              setActiveProduct(target);
                              setSelectedImageIndex(0);
                              window.history.replaceState(null, "", `/product/${target.slug}`);
                            }
                          }}
                          className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer shadow-sm relative group ${isSelected
                            ? "border-[#120F0D] ring-2 ring-[#C68A4C] scale-110"
                            : "border-gray-300 opacity-80 hover:opacity-100"
                            }`}
                          style={{ backgroundColor: cw.hex }}
                          title={cw.name}
                          aria-label={cw.name}
                        >
                          {isSelected && (
                            <Check size={14} className={isLightHex(cw.hex) ? "text-black" : "text-white"} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* E-COMMERCE ACTION BUTTONS */}
              <div className="space-y-3 pt-3 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleOpenCustomizer(false)}
                    disabled={outOfStock || busy}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-[#120F0D] hover:bg-[#2A231D] text-white py-4 px-5 rounded-2xl text-xs font-extrabold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-xl cursor-pointer group border border-[#9E774C]/50"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ShoppingBag size={17} className="text-[#C68A4C]" />
                      <span>{outOfStock ? c.outOfStockLabel : c.addToBagLabel}</span>
                    </div>
                    <span className="text-[10px] text-[#C68A4C] font-bold tracking-widest">
                      {c.addToBagHint}
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenCustomizer(true)}
                    disabled={outOfStock || busy}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-[#14110E] hover:bg-black border border-white/20 text-white py-4 px-5 rounded-2xl text-xs font-extrabold tracking-[0.16em] uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>{c.buyNowLabel}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Toast Notification */}
                {toastVisible && (
                  <div
                    role="status"
                    className={`${toastError ? "bg-[#9B2C2C]" : "bg-[#2D6A4F]"} text-white p-3.5 rounded-xl text-center text-xs font-bold tracking-wider animate-in slide-in-from-top-2 duration-300 shadow-lg flex flex-wrap items-center justify-center gap-2`}
                  >
                    {toastError ? <AlertCircle size={16} /> : <Check size={16} />}
                    <span>{toastMessage}</span>
                    {!toastError && (
                      <Link href="/cart" className="underline underline-offset-2 hover:text-[#F3E3CF]">
                        {c.viewBagLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Specifications Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4.5 space-y-2 text-xs shadow-xs">
                <h4 className="text-[10.5px] font-extrabold tracking-[0.2em] text-[#9E774C] uppercase mb-2">
                  {c.specsHeading}
                </h4>
                <div className="flex justify-between gap-3 border-b border-[#D8C6B3]/60 pb-2">
                  <span className="text-[#665749]">{c.specLabels.fabric}</span>
                  <strong className="text-[#14110E] text-right">{activeProduct.fabric}</strong>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#D8C6B3]/60 pb-2">
                  <span className="text-[#665749]">{c.specLabels.threadCount}</span>
                  <strong className="text-[#14110E] text-right">{activeProduct.threadCount}</strong>
                </div>
                {activeProduct.collar && (
                  <div className="flex justify-between gap-3 border-b border-[#D8C6B3]/60 pb-2">
                    <span className="text-[#665749]">{c.specLabels.collar}</span>
                    <strong className="text-[#14110E] text-right">{activeProduct.collar}</strong>
                  </div>
                )}
                {activeProduct.cuff && (
                  <div className="flex justify-between gap-3">
                    <span className="text-[#665749]">{c.specLabels.cuff}</span>
                    <strong className="text-[#14110E] text-right">{activeProduct.cuff}</strong>
                  </div>
                )}
              </div>

              {/* Product Description Paragraph (Placed AFTER Specifications) */}
              <div className="pt-2 border-t border-[#D5C2AF]/70">
                <span className="text-[10.5px] font-extrabold tracking-[0.2em] text-[#9E774C] uppercase block mb-1.5">
                  {c.descriptionHeading}
                </span>
                <p className="text-xs sm:text-[13px] text-[#3D332A] font-normal leading-relaxed whitespace-pre-line">
                  {activeProduct.description}
                </p>
              </div>

            </div>

          </div>

          {/* SECTION 2: VISUAL MACRO TEXTURE & CRAFTSMANSHIP SHOWCASE (IMAGE CARDS) */}
          {c.macroCards.length > 0 && (
            <div className="w-full space-y-6 pt-4">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-[10.5px] font-extrabold tracking-[0.28em] text-[#9E774C] uppercase block mb-1">
                  {c.macroEyebrow}
                </span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#14110E] uppercase tracking-wider">
                  {c.macroTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {c.macroCards.map((card, i) => (
                  <div key={i} className="bg-transparent border border-[#C6B09B]/60 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all group">
                    <div className="aspect-[4/3] overflow-hidden bg-[#241D17]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={card.image}
                        alt={card.alt}
                        className={`w-full h-full ${card.contain ? "object-contain p-2" : "object-cover"} group-hover:scale-105 transition-transform duration-700`}
                      />
                    </div>
                    <div className="p-4 sm:p-5 space-y-1 text-left">
                      <span className="text-[10px] font-bold text-[#9E774C] uppercase tracking-widest block">{card.eyebrow}</span>
                      <h3 className="font-serif-luxury text-base font-bold text-[#14110E] uppercase">{card.title}</h3>
                      <p className="text-xs text-[#665749] leading-relaxed">{card.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 3: "COMPLETE THE LOOK" E-COMMERCE OUTFIT GRID */}
          {completeLookItems.length > 0 && (
            <div className="w-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-[10.5px] font-extrabold tracking-[0.28em] text-[#9E774C] uppercase block mb-1">
                    {c.completeLookEyebrow}
                  </span>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-normal text-[#14110E] uppercase tracking-wider">
                    {c.completeLookTitle}
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#665749] uppercase tracking-wider">
                  {c.completeLookSubtitle} {activeProduct.name}
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
                        {item.category.replace(/_/g, " ")}
                      </span>
                      <h4 className="font-serif-luxury text-xs font-bold text-[#14110E] uppercase line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs font-bold text-[#14110E] mt-1">{item.price}</p>
                    </Link>

                    <button
                      onClick={() => handleAddToOutfit(item)}
                      disabled={busy || item.stock === 0}
                      className="w-full mt-3 disabled:opacity-50 bg-[#120F0D] hover:bg-[#C68A4C] text-white py-2 rounded-xl text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>{c.addToOutfitLabel}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: DISCOVER OTHER BESPOKE COLORWAYS */}
          {moreColorways.length > 0 && (
            <div className="w-full space-y-4 pt-2">
              <div className="flex justify-between items-end gap-3">
                <div>
                  <span className="text-[10.5px] font-extrabold tracking-[0.28em] text-[#9E774C] uppercase block mb-1">
                    {c.moreEyebrow}
                  </span>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-normal text-[#14110E] uppercase tracking-wider">
                    {c.moreTitle}
                  </h3>
                </div>
                <Link href="/shop" className="text-xs font-bold tracking-widest text-[#9E774C] hover:underline uppercase flex items-center gap-1 shrink-0">
                  <span>{c.viewAllLabel}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {moreColorways.map((p) => (
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
          )}

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
        submitting={busy}
        onConfirmCustomization={handleConfirmCustomization}
      />
    </div>
  );
}
