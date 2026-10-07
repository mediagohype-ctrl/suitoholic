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
  const { cart, loading, busy, updateQuantity, removeItem } = useCart();
  const [error, setError] = useState<string | null>(null);

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
        <div className="max-w-md mx-auto h-40 rounded-2xl bg-[#FAF5EE] border border-[#E2D4C3] animate-pulse" />
      ) : items.length === 0 ? (
        <div className="max-w-md mx-auto text-center bg-[#FAF5EE] border border-[#E2D4C3] rounded-3xl p-10 space-y-4 shadow-sm">
          <ShoppingBag size={36} className="mx-auto text-[#9E774C]" strokeWidth={1.5} />
          <h2 className="font-serif-luxury text-2xl uppercase">{c.emptyTitle}</h2>
          <p className="text-sm text-[#55473B]">{c.emptyText}</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#14110E] hover:bg-[#9E774C] text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all"
          >
            {c.continueShoppingLabel} <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Bag items */}
          <div className="lg:col-span-8 space-y-4">
            {error && (
              <div role="alert" className="flex items-center gap-2 bg-[#9B2C2C] text-white text-xs font-semibold rounded-xl px-4 py-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}
            {items.map((item) => (
              <article
                key={item.id}
                className={`bg-[#FAF5EE] border rounded-2xl p-3 sm:p-4 shadow-xs flex gap-3 sm:gap-5 ${item.available ? "border-[#E2D4C3]" : "border-[#B23B3B]"}`}
              >
                <Link href={`/product/${item.slug}`} className="w-24 h-28 sm:w-32 sm:h-36 rounded-xl overflow-hidden bg-[#241D17] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                </Link>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/product/${item.slug}`} className="font-serif-luxury text-sm sm:text-base font-bold uppercase leading-snug hover:text-[#9E774C]">
                        {item.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {item.customization ? (
                          <span className="inline-flex items-center gap-1 bg-[#14110E] text-white text-[9px] font-bold tracking-[0.16em] uppercase px-2.5 py-1 rounded-full">
                            <Check size={10} /> {c.bespokeBadge}
                          </span>
                        ) : (
                          item.size && (
                            <span className="text-[11px] text-[#55473B]">
                              {c.standardSizeLabel}: <strong className="text-[#14110E]">{item.size}</strong>
                            </span>
                          )
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-sm whitespace-nowrap">{item.lineTotalLabel}</p>
                  </div>

                  {item.customization && (
                    <div className="bg-white/70 border border-[#E8DACB] rounded-xl p-2.5">
                      <CustomizationDetails customization={item.customization} />
                    </div>
                  )}

                  {!item.available && <p className="text-[11px] font-semibold text-[#B23B3B]">{c.unavailableText}</p>}

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A6B5D]">{c.quantityLabel}</span>
                      <div className="flex items-center border border-[#D5C2AF] rounded-lg bg-white">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          disabled={busy || item.quantity <= 1}
                          onClick={() => run(() => updateQuantity(item.id, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center disabled:opacity-40 hover:text-[#9E774C]"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={busy || item.quantity >= 20}
                          onClick={() => run(() => updateQuantity(item.id, item.quantity + 1))}
                          className="w-8 h-8 flex items-center justify-center disabled:opacity-40 hover:text-[#9E774C]"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => run(() => removeItem(item.id))}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#7A6B5D] hover:text-[#B23B3B] disabled:opacity-40"
                    >
                      <Trash2 size={13} /> {c.removeLabel}
                    </button>
                  </div>
                </div>
              </article>
            ))}

            <Link href="/shop" className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#9E774C] uppercase hover:underline">
              ← {c.continueShoppingLabel}
            </Link>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase border-b border-[#E8DACB] pb-2">{c.summaryTitle}</h2>
            {cart && (
              <OrderTotals
                subtotal={cart.subtotal}
                customizationTotal={cart.customizationTotal}
                shippingFee={cart.shippingFee}
                total={cart.total}
                currencySymbol={cart.currencySymbol}
              />
            )}
            {hasUnavailable ? (
              <button disabled className="w-full bg-[#14110E] opacity-50 text-white py-4 rounded-xl text-xs font-bold tracking-[0.16em] uppercase cursor-not-allowed">
                {c.checkoutLabel}
              </button>
            ) : (
              <Link
                href="/checkout"
                className="w-full bg-[#14110E] hover:bg-[#2A231D] text-white py-4 px-5 rounded-xl text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-between shadow-md"
              >
                <span>{c.checkoutLabel}</span>
                <ArrowRight size={16} />
              </Link>
            )}
            <ul className="space-y-1.5 pt-1">
              {c.assurances.map((a, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px] text-[#55473B]">
                  <Check size={12} className="text-[#9E774C]" /> {a}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
