"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import OrderTotals from "@/components/bag/OrderTotals";
import { useCart } from "@/context/CartProvider";
import { useContent } from "@/context/SiteDataProvider";

export default function CartPage() {
  const c = useContent("bag");
  const { cart, loading, busy, updateQuantity, removeItem, couponCode, discountAmount, applyCoupon, removeCoupon } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

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

  return (
    <PageShell eyebrow={c.eyebrow} title={c.title}>
      {loading ? (
        <div className="max-w-md mx-auto h-40 rounded-2xl bg-white border border-[#E5E3DD] animate-pulse" />
      ) : items.length === 0 ? (
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
      ) : (
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
      )}
    </PageShell>
  );
}
