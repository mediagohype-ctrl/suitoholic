"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartProvider";
import CustomizationDetails from "@/components/bag/CustomizationDetails";

export default function CartDrawer() {
  const {
    cart,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    busy,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const router = useRouter();

  if (!isDrawerOpen) return null;

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput("");
    }
  };

  const handleCheckout = () => {
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-[#ECEAE5] border-l border-[#E5E3DD] shadow-2xl flex flex-col text-black">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4.5 bg-white border-b border-[#E5E3DD]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag size={18} className="text-black" />
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold uppercase tracking-wider text-black">
                YOUR ATELIER BAG ({itemCount})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-[#666666] hover:text-black transition-colors cursor-pointer"
              aria-label="Close Bag"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#E5E3DD] flex items-center justify-center mx-auto shadow-xs">
                  <ShoppingBag size={28} className="text-[#888888]" />
                </div>
                <h3 className="font-serif-luxury text-xl text-black uppercase">Your bag is empty</h3>
                <p className="text-xs text-[#666666] max-w-xs mx-auto">
                  Explore our luxury shirting collection and discover tailor-made perfection.
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-[0.16em] rounded-full hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>EXPLORE SHIRTS</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E5E3DD] rounded-2xl p-4 shadow-2xs flex gap-3.5 relative group"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#F5F4F0] border border-[#E5E3DD] shrink-0"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-serif-luxury text-sm font-bold uppercase text-black hover:text-[#726254] transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={busy}
                          className="text-[#999999] hover:text-red-600 transition-colors cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        {item.customization ? (
                          <span className="inline-flex items-center gap-1 bg-black text-white text-[8.5px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full">
                            <Check size={9} /> BESPOKE FIT
                          </span>
                        ) : (
                          item.size && (
                            <span className="text-[10px] text-[#666666]">
                              Size: <strong className="text-black font-mono">{item.size}</strong>
                            </span>
                          )
                        )}
                      </div>

                      {item.customization && (
                        <div className="mt-2 bg-[#F5F4F0] border border-[#E5E3DD] rounded-lg p-2 text-[10px]">
                          <CustomizationDetails customization={item.customization} />
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#F5F4F0] mt-2">
                      <div className="flex items-center border border-[#E5E3DD] rounded-full bg-[#F5F4F0] px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={busy || item.quantity <= 1}
                          className="p-1 text-[#666666] hover:text-black disabled:opacity-30 cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={busy}
                          className="p-1 text-[#666666] hover:text-black cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-sm text-black">{item.lineTotalLabel}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Coupon & Checkout */}
          {items.length > 0 && (
            <div className="bg-white border-t border-[#E5E3DD] p-5 space-y-4">
              {/* Coupon Form */}
              <div className="space-y-1.5">
                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5 font-mono font-bold">
                      <Tag size={12} />
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
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponFeedback) setCouponFeedback(null);
                      }}
                      placeholder="Promo code (e.g. WELCOME10)"
                      className="flex-1 bg-[#F5F4F0] border border-[#E5E3DD] focus:border-black rounded-full px-4 py-2 text-xs outline-none uppercase font-mono placeholder:normal-case placeholder:font-sans"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                    >
                      APPLY
                    </button>
                  </form>
                )}

                {couponFeedback && !couponCode && (
                  <p
                    className={`text-[10px] flex items-center gap-1 font-medium ${
                      couponFeedback.success ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {couponFeedback.success ? <Check size={11} /> : <AlertCircle size={11} />}
                    <span>{couponFeedback.message}</span>
                  </p>
                )}
              </div>

              {/* Order Totals Summary */}
              <div className="space-y-1.5 text-xs text-[#666666] border-t border-[#F5F4F0] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({couponCode})</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-black font-semibold uppercase tracking-wider text-[10px]">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-black border-t border-[#E5E3DD] pt-2 mt-1">
                  <span>Total</span>
                  <span className="font-serif-luxury text-xl">₹{finalTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout & View Bag CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={busy}
                  className="w-full bg-black hover:bg-neutral-800 text-white rounded-full py-4 text-xs font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={14} />
                </button>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="w-full block text-center py-2 text-[11px] font-bold tracking-wider uppercase text-[#666666] hover:text-black transition-colors"
                >
                  VIEW FULL BAG
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
