"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import PageShell from "@/components/bag/PageShell";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import OrderTotals from "@/components/bag/OrderTotals";
import CustomizationModal, { CustomFitState, CustomizationModalProduct } from "@/components/CustomizationModal";
import { useCart } from "@/context/CartProvider";
import { useWishlist } from "@/context/WishlistProvider";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { allProducts, EIGHT_CANONICAL_SISTER_SHIRTS } from "@/data/products";
import { getShirtId, getShirtColorFamily } from "@/components/MannequinShirtViewer";
import { getMatchingFullShirtImage } from "@/lib/matchingFullShirt";
import type { CustomFit, ProductItem } from "@/lib/types";

function getShortShirtTitle(name: string): string {
  const n = (name || "").toUpperCase();
  if (n.includes("TERRACOTTA") || n.includes("CORAL")) return "Terracotta Coral";
  if (n.includes("ESPRESSO") || n.includes("DARK")) return "Dark Espresso";
  if (n.includes("SANDSTONE") || n.includes("LINEN") || n.includes("OATMEAL")) return "Sandstone Linen";
  if (n.includes("WHITE") || n.includes("CRISP")) return "Crisp White";
  if (n.includes("SKY") || n.includes("OXFORD")) return "Sky Blue Oxford";
  if (n.includes("SOLID") || (n.includes("MIDNIGHT") && n.includes("NAVY"))) return "Midnight Navy";
  if (n.includes("CHARCOAL") || n.includes("ANTHRACITE")) return "Charcoal Twill";
  if (n.includes("PINSTRIPE") || n.includes("BENGAL") || n.includes("NAVY")) return "Navy Pinstripe";
  return name.replace(/FORMAL|SAVILE ROW/gi, "").trim();
}

function getShirtImage(p: ProductItem): string {
  if (p.image) return p.image;
  if (p.gallery && p.gallery.length > 0) return p.gallery[0];
  const shirtId = getShirtId(p);
  return `/new_shirts/shirt_${shirtId}.jpg`;
}

export default function CartPage() {
  const c = useContent("bag");
  const { products } = useCatalog();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const {
    cart,
    loading,
    busy,
    addItem,
    updateQuantity,
    removeItem,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // 2-Option Tailoring Choice Modal & Step 1 Customization Modal state
  const [choiceModalProduct, setChoiceModalProduct] = useState<ProductItem | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<ProductItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const run = async (fn: () => Promise<void>) => {
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const items = cart?.items ?? [];
  const hasUnavailable = items.some((i) => !i.available);

  // Retrieve current active bespoke fit from the bag or default fallback
  const customizedItem = items.find((i) => i.customization != null);
  const currentFit: Partial<CustomFit> = customizedItem?.customization || {
    chestSize: 38,
    collarSize: 15,
    shoulderSize: 17.5,
    bodyFit: "lean",
    height: "tall",
    sleeveType: "full",
    collarStyle: "Cutaway Collar",
    cuffStyle: "Classic Cuff",
    pocket: "none",
    initials: "AK",
    threadColor: "black",
    shirtColor: "navy",
  };

  // The 8 canonical sister shirts
  const sisterProducts: ProductItem[] = React.useMemo(() => {
    if (!products || products.length === 0) return EIGHT_CANONICAL_SISTER_SHIRTS;

    const curated = products.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const slug = (p.slug || "").toLowerCase();
      return (
        cat === "formal_shirts" ||
        cat === "formal_stripes" ||
        cat === "formal_bespoke" ||
        slug.includes("shirt")
      );
    });

    const pool = curated.length > 0 ? curated : products;
    const seenFamilies = new Set<string>();
    const uniqueByFamily: ProductItem[] = [];

    for (const p of pool) {
      const fam = getShirtColorFamily(p);
      if (!seenFamilies.has(fam)) {
        seenFamilies.add(fam);
        uniqueByFamily.push(p);
      }
      if (uniqueByFamily.length === 8) break;
    }

    if (uniqueByFamily.length < 8) {
      for (const canon of EIGHT_CANONICAL_SISTER_SHIRTS) {
        const fam = getShirtColorFamily(canon);
        if (!seenFamilies.has(fam)) {
          seenFamilies.add(fam);
          uniqueByFamily.push(canon);
        }
        if (uniqueByFamily.length === 8) break;
      }
    }

    return uniqueByFamily;
  }, [products]);

  // OPTION 1: Add shirt directly to bag with current customization
  const handleAddWithCurrentFit = async (product: ProductItem) => {
    try {
      setAddingProduct(true);
      setError(null);
      await addItem({
        productId: product.id,
        quantity: 1,
        size: String(currentFit.chestSize || 38),
        customization: {
          ...currentFit,
          shirtColor: product.name,
        },
      });
      setChoiceModalProduct(null);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      showToast(`${getShortShirtTitle(product.name)} added to bag with current bespoke fit!`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAddingProduct(false);
    }
  };

  // OPTION 2: Start new customization from Step 1
  const handleStartNewCustomization = (product: ProductItem) => {
    setChoiceModalProduct(null);
    setCustomizingProduct(product);
    setIsCustomizerOpen(true);
  };

  // Confirm handler from Step 6 CustomizationModal
  const handleConfirmModalCustomization = async (
    newFit: CustomFitState,
    chosenProduct?: CustomizationModalProduct | ProductItem | null
  ) => {
    const prod =
      chosenProduct && chosenProduct.id
        ? allProducts.find((p) => p.id === chosenProduct.id) || customizingProduct
        : customizingProduct;

    if (!prod) return;

    try {
      setModalSubmitting(true);
      setError(null);
      await addItem({
        productId: prod.id,
        quantity: 1,
        size: String(newFit.chestSize || 38),
        customization: newFit,
      });
      setIsCustomizerOpen(false);
      setCustomizingProduct(null);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      showToast(`${getShortShirtTitle(prod.name)} customized & added to your bag!`);
    } catch (err) {
      setError((err as Error).message);
      setIsCustomizerOpen(false);
    } finally {
      setModalSubmitting(false);
    }
  };

  return (
    <PageShell eyebrow={c.eyebrow} title={c.title}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border border-white/20">
          <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center shrink-0">
            <Check size={12} strokeWidth={3} />
          </div>
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="max-w-md mx-auto h-40 rounded-2xl bg-white border border-[#E5E3DD] animate-pulse" />
      ) : items.length === 0 ? (
        <div className="space-y-10">
          <div className="max-w-md mx-auto text-center bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-10 space-y-4 shadow-sm">
            <ShoppingBag size={36} className="mx-auto text-black" strokeWidth={1.5} />
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">{c.emptyTitle}</h2>
            <p className="text-sm text-[#666666]">{c.emptyText}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm"
            >
              {c.continueShoppingLabel} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Canonical Shirts for immediate tailoring even when cart is empty */}
          <div className="space-y-4 pt-10 sm:pt-14">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                TAILOR A SIGNATURE BESPOKE SHIRT
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[10px] gap-y-10 sm:gap-y-14 lg:gap-y-16 w-full items-start px-[5px]">
              {sisterProducts.slice(0, 8).map((shirt) => {
                const hoverFullShirt = getMatchingFullShirtImage(shirt);
                const isSaved = isInWishlist(shirt.id);

                const rawImages = shirt.gallery && shirt.gallery.length > 0 
                  ? shirt.gallery 
                  : [shirt.image];
                const cleanImages = rawImages.map((img) => (img ? img.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/") : ""));
                const activeMainImage = cleanImages[0] || getShirtImage(shirt);
                const activeHoverImage = hoverFullShirt || (cleanImages.length > 1 ? cleanImages[1] : null);

                return (
                  <div
                    key={shirt.id}
                    className="group flex flex-col w-full cursor-pointer"
                    onClick={() => setChoiceModalProduct(shirt)}
                  >
                    {/* Upper Rectangular Image Container - 254:350 Aspect Ratio matching Home Page */}
                    <div className="relative w-full aspect-[254/350] rounded-[10px] overflow-hidden bg-[#ECEAE5] transition-all duration-300">
                      <div className="block relative w-full h-full overflow-hidden rounded-[10px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeMainImage}
                          alt={shirt.name}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-102"
                          loading="lazy"
                        />
                        {activeHoverImage && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={activeHoverImage}
                            alt={`${shirt.name} Full Look`}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-102"
                            loading="lazy"
                          />
                        )}
                      </div>

                      {/* Top Right: Floating Outline Heart Wishlist Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(shirt.id);
                        }}
                        type="button"
                        aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 p-1 transition-transform duration-200 hover:scale-115 active:scale-90 cursor-pointer"
                      >
                        <Heart
                          size={19}
                          strokeWidth={1.5}
                          className={`drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-colors ${
                            isSaved
                              ? "text-red-500 fill-red-500"
                              : "text-white fill-transparent stroke-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Lower Details Strip: Product Name & Price on Left, Plus Icon on Right */}
                    <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2 px-1 pb-2">
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4
                          title={shirt.name}
                          className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
                        >
                          {shirt.name}
                        </h4>
                        <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
                          RS. {shirt.rawPrice ? shirt.rawPrice.toLocaleString("en-IN") : shirt.price.replace("₹", "").trim()}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setChoiceModalProduct(shirt);
                        }}
                        aria-label={`Customise ${shirt.name}`}
                        title="Tailor Shirt"
                        className="shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5"
                      >
                        <ShoppingBag size={12} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10">
          {/* Main Cart Items + Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Bag items */}
            <div className="lg:col-span-8 space-y-4">
              {error && (
                <div role="alert" className="flex items-center gap-2 bg-red-600 text-white text-xs font-semibold rounded-xl px-4 py-3">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`bg-white border rounded-[20px] p-4 sm:p-5 shadow-sm flex gap-3 sm:gap-5 ${item.available ? "border-[#E5E3DD]" : "border-red-300"}`}
                >
                  <Link href={`/product/${item.slug}`} className="w-24 h-28 sm:w-32 sm:h-36 rounded-2xl overflow-hidden bg-[#ECEAE5] shrink-0 border border-[#E5E3DD]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </Link>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/product/${item.slug}`} className="font-serif-luxury text-sm sm:text-base font-bold uppercase leading-snug text-black hover:text-[#666666] transition-colors">
                          {item.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {item.customization ? (
                            <span className="inline-flex items-center gap-1 bg-black text-white text-[9px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-full">
                              <Check size={10} /> {c.bespokeBadge}
                            </span>
                          ) : (
                            item.size && (
                              <span className="text-[11px] text-[#666666]">
                                {c.standardSizeLabel}: <strong className="text-black">{item.size}</strong>
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <p className="font-bold text-sm whitespace-nowrap text-black">{item.lineTotalLabel}</p>
                    </div>

                    {item.customization && (
                      <div className="bg-[#F5F4F0] border border-[#E5E3DD] rounded-xl p-3">
                        <CustomizationDetails customization={item.customization} />
                      </div>
                    )}

                    {!item.available && <p className="text-[11px] font-semibold text-red-600">{c.unavailableText}</p>}

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#666666]">{c.quantityLabel}</span>
                        <div className="flex items-center border border-[#E5E3DD] rounded-full bg-[#F5F4F0] px-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            disabled={busy || item.quantity <= 1}
                            onClick={() => run(() => updateQuantity(item.id, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center disabled:opacity-40 hover:text-black transition-colors"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-black">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            disabled={busy || item.quantity >= 20}
                            onClick={() => run(() => updateQuantity(item.id, item.quantity + 1))}
                            className="w-8 h-8 flex items-center justify-center disabled:opacity-40 hover:text-black transition-colors"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => run(() => removeItem(item.id))}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#666666] hover:text-red-600 disabled:opacity-40 transition-colors"
                      >
                        <Trash2 size={13} /> {c.removeLabel}
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <Link href="/shop" className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-black uppercase hover:underline">
                ← {c.continueShoppingLabel}
              </Link>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-4 lg:sticky lg:top-32 bg-white border border-[#E5E3DD] rounded-[24px] p-6 shadow-sm space-y-5">
              <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase border-b border-[#E5E3DD] pb-3 text-black">{c.summaryTitle}</h2>
              {cart && (
                <OrderTotals
                  subtotal={cart.subtotal}
                  customizationTotal={cart.customizationTotal}
                  shippingFee={cart.shippingFee}
                  discount={discountAmount}
                  total={Math.max(0, cart.total - discountAmount)}
                  currencySymbol={cart.currencySymbol}
                />
              )}

              {/* Promo Code Box */}
              <div className="pt-2 border-t border-[#E5E3DD]">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-sans font-bold tracking-wide">
                      <span>{couponCode}</span>
                      <span className="font-sans font-normal text-[11px]">(-₹{discountAmount.toLocaleString("en-IN")})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-emerald-900 underline font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!couponInput.trim()) return;
                      const res = applyCoupon(couponInput);
                      setCouponFeedback(res);
                      if (res.success) setCouponInput("");
                    }}
                    className="space-y-1.5"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponFeedback) setCouponFeedback(null);
                        }}
                        placeholder="Promo Code (e.g. WELCOME10)"
                        className="flex-1 bg-[#F5F4F0] border border-[#E5E3DD] focus:border-black rounded-full px-4 py-2 text-xs outline-none uppercase font-sans font-semibold tracking-wider placeholder:normal-case placeholder:font-sans"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                      >
                        APPLY
                      </button>
                    </div>
                    {couponFeedback && !couponCode && (
                      <p className={`text-[10px] ${couponFeedback.success ? "text-emerald-700" : "text-rose-600"}`}>
                        {couponFeedback.message}
                      </p>
                    )}
                  </form>
                )}
              </div>
              {hasUnavailable ? (
                <button disabled className="w-full bg-black/40 text-white py-4 text-xs font-bold tracking-[0.16em] uppercase rounded-full cursor-not-allowed">
                  {c.checkoutLabel}
                </button>
              ) : (
                <Link
                  href="/checkout"
                  className="w-full bg-black hover:bg-neutral-800 text-white py-4 px-6 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-sm"
                >
                  <span>{c.checkoutLabel}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
              <ul className="space-y-2 pt-2 border-t border-[#E5E3DD]">
                {c.assurances.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-[#666666]">
                    <Check size={12} className="text-black" /> {a}
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {/* SISTER FABRICS SELECTION SECTION (MATCHING HOME PAGE PATTERN) */}
          <div className="space-y-4 pt-10 sm:pt-14">
            <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-12 max-w-4xl mx-auto px-4">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                ADD MORE SHIRTS IN DIFFERENT FABRICS
              </h2>
            </div>

            {/* 8 Cards in a 4-Column Responsive Grid matching Home Page Pattern */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[10px] gap-y-10 sm:gap-y-14 lg:gap-y-16 w-full items-start px-[5px]">
              {sisterProducts.slice(0, 8).map((shirt) => {
                const inBagCount = items
                  .filter((item) => item.productId === shirt.id || item.slug === shirt.slug)
                  .reduce((sum, item) => sum + item.quantity, 0);
                const hoverFullShirt = getMatchingFullShirtImage(shirt);
                const isSaved = isInWishlist(shirt.id);

                const rawImages = shirt.gallery && shirt.gallery.length > 0 
                  ? shirt.gallery 
                  : [shirt.image];
                const cleanImages = rawImages.map((img) => (img ? img.replace(/^https?:\/\/(localhost|127\.0\.0\.1):4000\/?/i, "/") : ""));
                const activeMainImage = cleanImages[0] || getShirtImage(shirt);
                const activeHoverImage = hoverFullShirt || (cleanImages.length > 1 ? cleanImages[1] : null);

                return (
                  <div
                    key={shirt.id}
                    className="group flex flex-col w-full cursor-pointer"
                    onClick={() => setChoiceModalProduct(shirt)}
                  >
                    {/* Upper Rectangular Image Container - 254:350 Aspect Ratio matching Home Page */}
                    <div className="relative w-full aspect-[254/350] rounded-[10px] overflow-hidden bg-[#ECEAE5] transition-all duration-300">
                      <div className="block relative w-full h-full overflow-hidden rounded-[10px]">
                        {/* Default Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeMainImage}
                          alt={shirt.name}
                          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ease-out group-hover:scale-102"
                          loading="lazy"
                        />

                        {/* Hover Image */}
                        {activeHoverImage && (
                          <div className="absolute inset-0 w-full h-full bg-[#ECEAE5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10 overflow-hidden pointer-events-none">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={activeHoverImage}
                              alt={`${shirt.name} Full Look`}
                              className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-102"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>

                      {/* Top Right: Floating Outline Heart Wishlist Icon */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(shirt.id);
                        }}
                        type="button"
                        aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 p-1 transition-transform duration-200 hover:scale-115 active:scale-90 cursor-pointer"
                      >
                        <Heart
                          size={19}
                          strokeWidth={1.5}
                          className={`drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] transition-colors ${
                            isSaved
                              ? "text-red-500 fill-red-500"
                              : "text-white fill-transparent stroke-white"
                          }`}
                        />
                      </button>

                      {inBagCount > 0 && (
                        <span className="absolute top-2 left-2 z-20 bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Check size={10} strokeWidth={2.5} /> {inBagCount} in bag
                        </span>
                      )}
                    </div>

                    {/* Lower Details Strip: Product Name & Price on Left, Plus Icon on Right */}
                    <div className="mt-2.5 sm:mt-3 flex items-start justify-between gap-2 px-1 pb-2">
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4
                          title={shirt.name}
                          className="font-sans font-bold text-[10.5px] sm:text-xs tracking-[0.16em] text-black hover:opacity-75 uppercase transition-opacity truncate leading-snug"
                        >
                          {shirt.name}
                        </h4>
                        <div className="font-sans text-[10px] sm:text-[11px] font-medium text-[#666666] tracking-[0.08em] uppercase">
                          RS. {shirt.rawPrice ? shirt.rawPrice.toLocaleString("en-IN") : shirt.price.replace("₹", "").trim()}
                        </div>
                      </div>

                      {/* Right: Plus Button -> Opens Tailoring Choice Modal */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setChoiceModalProduct(shirt);
                        }}
                        aria-label={`Customise ${shirt.name}`}
                        title="Tailor Shirt"
                        className="shrink-0 w-6 h-6 rounded-full border border-black/20 hover:border-black bg-white hover:bg-black text-black hover:text-white flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-110 active:scale-95 cursor-pointer mt-0.5"
                      >
                        <ShoppingBag size={12} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2-OPTION TAILORING CHOICE POPUP MODAL */}
      {choiceModalProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white border border-[#E5E3DD] rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setChoiceModalProduct(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#F5F4F0] hover:bg-black text-black hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header With Product Info */}
            <div className="flex items-center gap-4 border-b border-[#E5E3DD] pb-5 pr-10">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#ECEAE5] border border-[#E5E3DD] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getShirtImage(choiceModalProduct)}
                  alt={choiceModalProduct.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#666666] uppercase block">
                  Add To Your Bag
                </span>
                <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-black uppercase leading-tight truncate">
                  {choiceModalProduct.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-extrabold text-black">{choiceModalProduct.price}</span>
                  <span className="text-[11px] text-[#888888]">• {choiceModalProduct.fabric}</span>
                </div>
              </div>
            </div>

            {/* The 2 Tailoring Options */}
            <div className="mt-5 space-y-3.5">
              <p className="text-xs font-semibold text-[#555555]">
                How would you like to tailor this shirt? Please select your preference:
              </p>

              {/* OPTION 1: Add With Current Customization (Direct To Bag) */}
              <div
                onClick={() => handleAddWithCurrentFit(choiceModalProduct)}
                className="group relative p-4 sm:p-5 rounded-2xl border-2 border-black bg-[#F5F4F0] hover:bg-[#ECEAE5] transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-black uppercase tracking-wide">
                      Add With Current Bespoke Fit
                    </h4>
                  </div>
                  <ArrowRight size={18} className="text-black group-hover:translate-x-1 transition-transform mt-0.5 shrink-0" />
                </div>

                <p className="text-[11px] text-[#666666] mb-3">
                  Instantly apply your bag&apos;s saved bespoke measurements &amp; styling directly to this shirt:
                </p>

                {/* Live Current Fit Summary */}
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-[#E5E3DD]">
                  <CustomizationDetails customization={currentFit} />
                </div>

                <button
                  type="button"
                  disabled={addingProduct}
                  className="mt-3.5 w-full bg-black hover:bg-neutral-800 text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  {addingProduct ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Adding to Bag...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="stroke-[2.5]" />
                      <span>Add In Current Fit (Direct To Bag)</span>
                    </>
                  )}
                </button>
              </div>

              {/* OPTION 2: New Customization (Start from Step 1) */}
              <div
                onClick={() => handleStartNewCustomization(choiceModalProduct)}
                className="group relative p-4 sm:p-5 rounded-2xl border border-[#E5E3DD] hover:border-black bg-white hover:bg-[#F5F4F0]/60 transition-all cursor-pointer shadow-xs hover:shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#ECEAE5] group-hover:bg-black text-black group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Scissors size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black uppercase tracking-wide">
                        Customize A New Fit (Start From Step 1)
                      </h4>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#888888] group-hover:text-black group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>

                <p className="text-[11px] text-[#666666] mb-3">
                  Start fresh in the 3D customizer to select custom chest size, body fit, height, sleeve, collar, cuff &amp; initials.
                </p>

                <button
                  type="button"
                  className="w-full bg-[#F5F4F0] group-hover:bg-black text-black group-hover:text-white border border-[#E5E3DD] group-hover:border-black py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Scissors size={13} />
                  <span>Start Step 1 Customization</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6-STEP BESPOKE CUSTOMIZATION MODAL (When Option 2 is chosen) */}
      {isCustomizerOpen && customizingProduct && (
        <CustomizationModal
          isOpen={isCustomizerOpen}
          onClose={() => {
            setIsCustomizerOpen(false);
            setCustomizingProduct(null);
          }}
          productName={customizingProduct.name}
          product={{
            ...customizingProduct,
            image: getShirtImage(customizingProduct),
          }}
          initialChestSize={typeof currentFit?.chestSize === "number" ? currentFit.chestSize : 38}
          submitting={modalSubmitting}
          onConfirmCustomization={handleConfirmModalCustomization}
        />
      )}
    </PageShell>
  );
}
