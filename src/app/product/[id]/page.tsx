"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureHighlightsBar from "@/components/FeatureHighlightsBar";
import ShopByCategoryGrid from "@/components/ShopByCategoryGrid";
import ModernProductCard from "@/components/ModernProductCard";
import { useCart } from "@/context/CartProvider";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { useWishlist } from "@/context/WishlistProvider";
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
import CommonAtelierShowcase from "@/components/CommonAtelierShowcase";

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

  useEffect(() => {
    const target = getProduct(idOrSlug);
    if (target) {
      setActiveProduct(target);
      setSelectedImageIndex(0);
    }
  }, [idOrSlug, getProduct]);

  const selectedSize = 38;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = activeProduct ? isInWishlist(activeProduct.id) : false;
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastError, setToastError] = useState<boolean>(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [buyNowMode, setBuyNowMode] = useState<boolean>(false);

  if (!activeProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
        <Header activeTab="shop" />
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-44 pb-20 space-y-5">
          <h1 className="font-serif-luxury text-2xl sm:text-3xl uppercase tracking-wider">{c.notFoundTitle}</h1>
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all shadow-sm"
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
  const macroProducts = products
    .filter((p) => p.category === "formal_stripes")
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#ECEAE5] text-black antialiased relative overflow-x-hidden selection:bg-black selection:text-white">
      {/* Header */}
      <Header activeTab="shop" />

      {/* Main Studio Content */}
      <div className="relative flex-1 w-full">
        <main className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-36 pb-8 sm:pb-16 space-y-8 sm:space-y-10">

          {/* Top Bar Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href={`/shop?category=${activeProduct.category}`}
              className="inline-flex items-center space-x-2 bg-white hover:bg-black text-black hover:text-white border border-[#E5E3DD] px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm"
            >
              <ArrowLeft size={15} />
              <span>{c.backLabel}</span>
            </Link>
          </div>

          {/* SECTION 1: HERO 2-COLUMN VISUAL SHOWCASE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Visual Showcase Gallery */}
            <div className="lg:col-span-6 space-y-4">

              {/* Main Display Box */}
              <div className="relative w-full aspect-[4/4.1] sm:aspect-[4/4.1] lg:aspect-[4/4] max-h-[485px] sm:max-h-[520px] lg:max-h-[540px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-white border border-[#E5E3DD] shadow-sm flex items-center justify-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery[selectedImageIndex] || activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                {/* Wishlist Button */}
                <button
                  onClick={() => activeProduct && toggleWishlist(activeProduct.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md cursor-pointer z-10"
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={18}
                    className={isWishlisted ? "fill-[#E04B4B] text-[#E04B4B]" : "text-white"}
                  />
                </button>
              </div>

              {/* Thumbnail Strip */}
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-[4/3.2] rounded-[16px] overflow-hidden transition-all relative cursor-pointer border ${selectedImageIndex === idx
                        ? "border-black ring-2 ring-black shadow-sm opacity-100"
                        : "border-[#E5E3DD] opacity-60 hover:opacity-100"
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
                    <div key={i} className="bg-white border border-[#E5E3DD] rounded-2xl p-3 shadow-sm">
                      <Icon size={18} className="mx-auto text-black mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider block text-black">{badge.title}</span>
                      <span className="text-[9px] text-[#666666] block">{badge.subtitle}</span>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Product Specs, Swatches & Action Buttons */}
            <div className="lg:col-span-6 bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-9 shadow-sm space-y-6">

              {/* Brand Title & Price */}
              <div>
                <span className="text-[10.5px] font-bold tracking-[0.26em] uppercase text-[#666666] block mb-1">
                  {c.brandEyebrow}
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-[28px] font-normal font-serif-luxury text-black tracking-tight uppercase leading-tight">
                  {activeProduct.name}
                </h1>

                {/* Rating & Review Counter */}
                <div className="flex items-center space-x-2.5 mt-2.5">
                  <div className="flex text-black">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className={i < Math.round(activeProduct.rating) ? "fill-current" : ""} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-black">{activeProduct.rating} / 5.0</span>
                  <span className="text-xs text-[#666666] font-medium">({activeProduct.reviewsCount} {c.reviewsSuffix})</span>
                </div>

                {/* Price Display */}
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#E5E3DD] pt-3.5">
                  <span className="font-serif-luxury text-3xl sm:text-4xl font-normal text-black">
                    {activeProduct.price}
                  </span>
                  {activeProduct.compareAtPrice ? (
                    <span className="text-sm text-[#888888] line-through">
                      {activeProduct.price.replace(/[\d,.]+/, Number(activeProduct.compareAtPrice).toLocaleString("en-IN"))}
                    </span>
                  ) : null}
                  <span className="text-xs text-[#666666] font-medium">
                    {c.taxNote}
                  </span>
                </div>
                {(outOfStock || lowStock) && (
                  <p className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${outOfStock ? "text-red-600" : "text-[#666666]"}`}>
                    {outOfStock ? c.outOfStockLabel : fillTemplate(c.lowStockTemplate, { stock: activeProduct.stock ?? 0 })}
                  </p>
                )}
              </div>

              {/* VISUAL COLORWAY / FABRIC SWATCH SELECTOR */}
              {colorways.length > 0 && (
                <div className="space-y-2.5 border-t border-[#E5E3DD] pt-3.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-black">
                      {c.colorwaysLabel}
                    </label>
                    <span className="text-[11px] font-bold text-[#666666] uppercase">{activeProduct.name.split(" ")[0]}</span>
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
                            ? "border-black ring-2 ring-black scale-110"
                            : "border-[#E5E3DD] opacity-80 hover:opacity-100"
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

              {/* E-COMMERCE ACTION BUTTONS (SOLID BLACK PILLS) */}
              <div className="space-y-3 pt-3 border-t border-[#E5E3DD]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleOpenCustomizer(false)}
                    disabled={outOfStock || busy}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-black hover:bg-neutral-800 text-white rounded-full py-4 px-6 text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <ShoppingBag size={17} className="text-white" />
                      <span>{outOfStock ? c.outOfStockLabel : c.addToBagLabel}</span>
                    </div>
                    <span className="text-[10px] text-white/70 font-bold tracking-widest">
                      {c.addToBagHint}
                    </span>
                  </button>

                  <button
                    onClick={() => handleOpenCustomizer(true)}
                    disabled={outOfStock || busy}
                    className="w-full disabled:opacity-50 disabled:cursor-not-allowed bg-black hover:bg-neutral-800 text-white rounded-full py-4 px-6 text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
                  >
                    <span>{c.buyNowLabel}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Toast Notification */}
                {toastVisible && (
                  <div
                    role="status"
                    className={`${toastError ? "bg-red-600" : "bg-black"} text-white p-3.5 rounded-full text-center text-xs font-bold tracking-wider animate-in slide-in-from-top-2 duration-300 shadow-lg flex flex-wrap items-center justify-center gap-2`}
                  >
                    {toastError ? <AlertCircle size={16} /> : <Check size={16} />}
                    <span>{toastMessage}</span>
                    {!toastError && (
                      <Link href="/cart" className="underline underline-offset-2 hover:text-white/80">
                        {c.viewBagLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Specifications Card */}
              <div className="bg-[#F5F4F0] border border-[#E5E3DD] rounded-2xl p-4.5 space-y-2 text-xs shadow-xs">
                <h4 className="text-[10.5px] font-bold tracking-[0.2em] text-[#666666] uppercase mb-2">
                  {c.specsHeading}
                </h4>
                <div className="flex justify-between gap-3 border-b border-[#E5E3DD] pb-2">
                  <span className="text-[#666666]">{c.specLabels.fabric}</span>
                  <strong className="text-black text-right">{activeProduct.fabric}</strong>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#E5E3DD] pb-2">
                  <span className="text-[#666666]">{c.specLabels.threadCount}</span>
                  <strong className="text-black text-right">{activeProduct.threadCount}</strong>
                </div>
                {activeProduct.collar && (
                  <div className="flex justify-between gap-3 border-b border-[#E5E3DD] pb-2">
                    <span className="text-[#666666]">{c.specLabels.collar}</span>
                    <strong className="text-black text-right">{activeProduct.collar}</strong>
                  </div>
                )}
                {activeProduct.cuff && (
                  <div className="flex justify-between gap-3">
                    <span className="text-[#666666]">{c.specLabels.cuff}</span>
                    <strong className="text-black text-right">{activeProduct.cuff}</strong>
                  </div>
                )}
              </div>

              {/* Product Description Paragraph (Placed AFTER Specifications) */}
              <div className="pt-2 border-t border-[#E5E3DD]">
                <span className="text-[10.5px] font-bold tracking-[0.2em] text-[#666666] uppercase block mb-1.5">
                  {c.descriptionHeading}
                </span>
                <p className="text-xs sm:text-[13px] text-[#444444] font-normal leading-relaxed whitespace-pre-line">
                  {activeProduct.description}
                </p>
              </div>

            </div>

          </div>

          {/* SECTION 2: BEST SELLERS / EXECUTIVE STRIPES (SHOP PAGE STYLING) */}
          {/* SECTION 2: BEST SELLERS / EXECUTIVE STRIPES */}
          <div className="w-full space-y-6 pt-6 sm:pt-8 select-none">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center justify-center space-x-2 text-[10px] sm:text-[11px] font-bold tracking-[0.28em] text-[#666666] uppercase">
                <span className="h-[1px] w-8 sm:w-14 bg-black/30" />
                <span>EXECUTIVE ATELIER</span>
                <span>•</span>
                <span>SIGNATURE EDIT</span>
                <span className="h-[1px] w-8 sm:w-14 bg-black/30" />
              </div>

              <h2 className="text-lg sm:text-xl lg:text-[22px] font-semibold tracking-[0.2em] text-black uppercase leading-tight">
                {c.macroTitle || "BEST SELLERS"}
              </h2>

              {c.macroSubtitle && (
                <p className="text-[11px] sm:text-xs text-[#666666] tracking-wider uppercase font-medium pt-0.5">
                  {c.macroSubtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 pt-2">
              {(macroProducts.length >= 4 ? macroProducts : products.slice(0, 4)).map((item) => (
                <div key={item.id} className="w-full">
                  <ModernProductCard product={item} />
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: "COMPLETE THE LOOK" E-COMMERCE OUTFIT GRID */}
          {completeLookItems.length > 0 && (
            <div className="w-full space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-[10.5px] font-bold tracking-[0.28em] text-[#666666] uppercase block mb-1">
                    {c.completeLookEyebrow}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-normal font-serif-luxury text-black uppercase tracking-wider">
                    {c.completeLookTitle}
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#666666] uppercase tracking-wider">
                  {c.completeLookSubtitle} {activeProduct.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 pt-2">
                {completeLookItems.map((item) => (
                  <div key={item.id} className="w-full">
                    <ModernProductCard product={item} />
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
                  <span className="text-[10.5px] font-bold tracking-[0.28em] text-[#666666] uppercase block mb-1">
                    {c.moreEyebrow}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-normal font-serif-luxury text-black uppercase tracking-wider">
                    {c.moreTitle}
                  </h3>
                </div>
                <Link href="/shop" className="text-xs font-bold tracking-widest text-black hover:text-[#666666] uppercase flex items-center gap-1 shrink-0 transition-colors">
                  <span>{c.viewAllLabel}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 pt-2">
                {moreColorways.map((p) => (
                  <div key={p.id} className="w-full">
                    <ModernProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: SHOP BY CATEGORY GRID */}
          <ShopByCategoryGrid />

        </main>
      </div>

      {/* Common Atelier Showcase: Video Banner, Shop By Fabrics & Customer Testimonials */}
      <CommonAtelierShowcase />

      {/* Bottom Feature Highlights Bar */}
      <FeatureHighlightsBar />

      {/* Comprehensive Luxury E-Commerce Footer */}
      <Footer />

      {/* 6-Step Bespoke Customization Popup Modal */}
      <CustomizationModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        productName={activeProduct.name}
        product={{
          ...activeProduct,
          image: gallery[selectedImageIndex] || activeProduct.image,
        }}
        initialChestSize={selectedSize}
        submitting={busy}
        onConfirmCustomization={handleConfirmCustomization}
      />
    </div>
  );
}
