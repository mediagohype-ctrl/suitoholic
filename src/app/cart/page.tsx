"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Minus,
  Plus,
  RefreshCw,
  Scissors,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";
import PageShell from "@/components/bag/PageShell";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import OrderTotals from "@/components/bag/OrderTotals";
import CustomizationModal, { CustomFitState, CustomizationModalProduct } from "@/components/CustomizationModal";
import { useCart } from "@/context/CartProvider";
import { useCatalog, useContent } from "@/context/SiteDataProvider";
import { allProducts, EIGHT_CANONICAL_SISTER_SHIRTS } from "@/data/products";
import { getShirtColorFamily } from "@/components/MannequinShirtViewer";
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
  const fam = getShirtColorFamily(p);
  if (fam === "espresso") return "/new_shirts/shirt_19.jpg";
  if (fam === "bengal_blue") return "/new_shirts/shirt_20.jpg";
  if (fam === "sandstone_linen") return "/new_shirts/shirt_15.jpg";
  if (fam === "coral_stripe") return "/new_shirts/shirt_14.jpg";
  if (fam === "white") return "/new_shirts/shirt_25.jpg";
  if (fam === "skyblue") return "/new_shirts/shirt_21.jpg";
  if (fam === "navy_solid") return "/new_shirts/shirt_22.jpg";
  if (fam === "charcoal") return "/new_shirts/shirt_17.jpg";
  return "/new_shirts/shirt_2.jpg";
}

export default function CartPage() {
  const c = useContent("bag");
  const { products } = useCatalog();
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
            <h2 className="font-serif-luxury text-2xl uppercase text-black">{c.emptyTitle}</h2>
            <p className="text-sm text-[#666666]">{c.emptyText}</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm"
            >
              {c.continueShoppingLabel} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Canonical Shirts for immediate tailoring even when cart is empty */}
          <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-sm space-y-4">
            <div className="border-b border-[#E5E3DD] pb-3">
              <h3 className="font-serif-luxury text-sm sm:text-base font-bold uppercase tracking-wider text-black">
                Tailor A Signature Bespoke Shirt
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                Select any shirt to start bespoke tailoring with interactive 3D mannequin preview.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {sisterProducts.map((shirt) => (
                <div
                  key={shirt.id}
                  onClick={() => handleStartNewCustomization(shirt)}
                  className="group p-3 rounded-2xl border border-[#E5E3DD] hover:border-black bg-white hover:bg-[#F5F4F0]/60 transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#ECEAE5] border border-[#E5E3DD] relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getShirtImage(shirt)}
                      alt={shirt.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="mt-2 min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-black uppercase truncate">{getShortShirtTitle(shirt.name)}</h4>
                    <span className="font-extrabold text-black text-[11px] block mt-0.5">{shirt.price}</span>
                  </div>
                  <button
                    type="button"
                    className="mt-2.5 w-full h-8 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Scissors size={11} /> <span>Tailor (Step 1)</span>
                  </button>
                </div>
              ))}
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
                    <div className="flex items-center gap-1.5 font-mono font-bold">
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
                        className="flex-1 bg-[#F5F4F0] border border-[#E5E3DD] focus:border-black rounded-full px-4 py-2 text-xs outline-none uppercase font-mono placeholder:normal-case placeholder:font-sans"
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

          {/* SISTER FABRICS SELECTION SECTION (NO OUTER BOX) */}
          <div className="space-y-4 pt-4 sm:pt-6">
            <div className="text-center pb-1">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles size={16} className="text-black" />
                <h3 className="text-sm sm:text-base font-extrabold tracking-[0.18em] uppercase text-black font-serif-luxury">
                  ADD MORE SHIRTS IN DIFFERENT FABRICS
                </h3>
              </div>
            </div>

            {/* 4 Cards in a Responsive Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-1">
              {sisterProducts.map((shirt) => {
                const inBagCount = items
                  .filter((item) => item.productId === shirt.id || item.slug === shirt.slug)
                  .reduce((sum, item) => sum + item.quantity, 0);
                const shortTitle = getShortShirtTitle(shirt.name);
                const img = getShirtImage(shirt);

                return (
                  <div
                    key={shirt.id}
                    onClick={() => setChoiceModalProduct(shirt)}
                    className="group p-3 rounded-2xl border border-[#E5E3DD] hover:border-black bg-white hover:bg-[#F5F4F0]/60 transition-all flex flex-col justify-between cursor-pointer relative shadow-xs hover:shadow"
                  >
                    {/* Top: High-Res Shirt Photo */}
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#ECEAE5] border border-[#E5E3DD] relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={shirt.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                      {inBagCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 bg-black text-white text-[8.5px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <Check size={10} strokeWidth={2.5} /> {inBagCount} in bag
                        </span>
                      )}
                    </div>

                    {/* Middle: Details */}
                    <div className="mt-2.5 min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-black uppercase truncate leading-tight" title={shirt.name}>
                        {shortTitle}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] mt-1">
                        <span className="font-extrabold text-black">{shirt.price}</span>
                        <span className="text-[#888888] text-[10px] uppercase truncate max-w-[85px]">
                          {shirt.fabric?.includes("Linen") ? "Linen Blend" : "100% Giza Cotton"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChoiceModalProduct(shirt);
                      }}
                      className="mt-3 w-full h-8 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer bg-[#F5F4F0] group-hover:bg-black group-hover:text-white text-black border border-[#E5E3DD] group-hover:border-black"
                    >
                      <Plus size={12} className="stroke-[2.5]" />
                      <span>Select &amp; Tailor</span>
                    </button>
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
          <div className="relative w-full max-w-xl bg-white border border-[#E5E3DD] rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
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
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <span className="inline-block bg-black text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-0.5">
                        ⚡ 1-Tap Quick Add
                      </span>
                      <h4 className="text-sm font-bold text-black uppercase tracking-wide">
                        Add With Current Bespoke Fit
                      </h4>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-black group-hover:translate-x-1 transition-transform mt-1 shrink-0" />
                </div>

                <p className="text-[11px] text-[#666666] mb-3">
                  Instantly apply your bag&apos;s saved bespoke measurements &amp; styling directly to this shirt:
                </p>

                {/* Live Current Fit Summary */}
                <div className="bg-white rounded-xl p-3 border border-[#E5E3DD]">
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
