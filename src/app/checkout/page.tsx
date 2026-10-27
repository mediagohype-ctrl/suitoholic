"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Lock } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import OrderTotals from "@/components/bag/OrderTotals";
import { useCart } from "@/context/CartProvider";
import { useContent, useSettings } from "@/context/SiteDataProvider";
import { ApiError, apiFetch } from "@/lib/api";
import { saveLastOrder } from "@/lib/orders";
import type { Order } from "@/lib/types";

const inputClass =
  "w-full bg-[#F5F4F0] border border-[#E5E3DD] rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black placeholder:text-[#999999]";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666666]">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-red-600">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const c = useContent("bag");
  const settings = useSettings();
  const { cart, loading, reset, couponCode, discountAmount, applyCoupon, removeCoupon } = useCart();
  const router = useRouter();
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    notes: "",
  });
  const paymentMethod = "cod";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart) return;
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const order = await apiFetch<Order>("/orders", {
        method: "POST",
        body: {
          cartId: cart.id,
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postalCode: form.postalCode,
            country: form.country,
          },
          paymentMethod,
          notes: form.notes,
        },
      });
      saveLastOrder(order);
      reset();
      router.push(`/order/${order.orderNumber}`);
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.details?.length) {
        // "customer.email" → "email", "shippingAddress.city" → "city"
        setFieldErrors(Object.fromEntries(apiErr.details.map((d) => [d.path.split(".").pop() ?? d.path, d.message])));
        setError(apiErr.details[0].message);
      } else {
        setError(apiErr.message);
      }
      setSubmitting(false);
    }
  };

  const items = cart?.items ?? [];

  if (!loading && items.length === 0 && !submitting) {
    return (
      <PageShell eyebrow={c.eyebrow} title={c.checkout.title}>
        <div className="max-w-md mx-auto text-center bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-10 space-y-4 shadow-sm">
          <h2 className="font-serif-luxury text-2xl uppercase text-black">{c.emptyTitle}</h2>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] shadow-sm">
            {c.continueShoppingLabel}
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow={c.eyebrow} title={c.checkout.title} showShowcase={false}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase text-black">{c.checkout.contactHeading}</h2>
            <Field label="Full name" error={fieldErrors.name}>
              <input required autoComplete="name" className={inputClass} value={form.name} onChange={set("name")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" error={fieldErrors.email}>
                <input required type="email" autoComplete="email" className={inputClass} value={form.email} onChange={set("email")} />
              </Field>
              <Field label="Phone" error={fieldErrors.phone}>
                <input required type="tel" autoComplete="tel" className={inputClass} value={form.phone} onChange={set("phone")} placeholder="+91 98765 43210" />
              </Field>
            </div>
          </section>

          <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-7 shadow-sm space-y-4">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase text-black">{c.checkout.shippingHeading}</h2>
            <Field label="Address" error={fieldErrors.line1}>
              <input required autoComplete="address-line1" className={inputClass} value={form.line1} onChange={set("line1")} />
            </Field>
            <Field label="Apartment, suite (optional)">
              <input autoComplete="address-line2" className={inputClass} value={form.line2} onChange={set("line2")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="City" error={fieldErrors.city}>
                <input required autoComplete="address-level2" className={inputClass} value={form.city} onChange={set("city")} />
              </Field>
              <Field label="State" error={fieldErrors.state}>
                <input required autoComplete="address-level1" className={inputClass} value={form.state} onChange={set("state")} />
              </Field>
              <Field label="PIN code" error={fieldErrors.postalCode}>
                <input required autoComplete="postal-code" inputMode="numeric" className={inputClass} value={form.postalCode} onChange={set("postalCode")} />
              </Field>
            </div>
            <Field label="Country">
              <input required autoComplete="country-name" className={inputClass} value={form.country} onChange={set("country")} />
            </Field>
          </section>

          <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-7 shadow-sm space-y-3">
            <Field label={c.checkout.notesLabel}>
              <textarea rows={3} className={inputClass} value={form.notes} onChange={set("notes")} placeholder={c.checkout.notesPlaceholder} />
            </Field>
          </section>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-32 bg-white border border-[#E5E3DD] rounded-[24px] p-6 shadow-sm space-y-4">
          <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase border-b border-[#E5E3DD] pb-3 text-black">{c.summaryTitle}</h2>
          <ul className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-[#ECEAE5] shrink-0 border border-[#E5E3DD]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-full h-full object-cover object-top" />
                  <span className="absolute -top-0 -right-0 bg-black text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-bl-md flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-xs font-bold uppercase leading-snug text-black">{item.name}</p>
                    <p className="text-xs font-semibold whitespace-nowrap text-black">{item.lineTotalLabel}</p>
                  </div>
                  {item.customization ? (
                    <CustomizationDetails customization={item.customization} />
                  ) : (
                    item.size && <p className="text-[11px] text-[#666666]">{c.standardSizeLabel}: {item.size}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
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
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      if (couponFeedback) setCouponFeedback(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (!couponInput.trim()) return;
                        const res = applyCoupon(couponInput);
                        setCouponFeedback(res);
                        if (res.success) setCouponInput("");
                      }
                    }}
                    placeholder="Promo Code"
                    className="flex-1 bg-[#F5F4F0] border border-[#E5E3DD] focus:border-black rounded-full px-4 py-2 text-xs outline-none uppercase font-mono placeholder:normal-case placeholder:font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!couponInput.trim()) return;
                      const res = applyCoupon(couponInput);
                      setCouponFeedback(res);
                      if (res.success) setCouponInput("");
                    }}
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
              </div>
            )}
          </div>

          {settings.orderNotice && <p className="text-[11px] text-[#666666] bg-[#F5F4F0] rounded-xl p-3 border border-[#E5E3DD]">{settings.orderNotice}</p>}
          {error && (
            <div role="alert" className="flex items-start gap-2 bg-red-600 text-white text-xs font-semibold rounded-xl px-4 py-3">
              <AlertCircle size={16} className="shrink-0 mt-px" /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-white py-4 px-6 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Lock size={14} />{" "}
            {submitting ? c.checkout.placingLabel : c.checkout.placeOrderLabel}
          </button>
          <Link href="/cart" className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-black hover:text-[#666666] uppercase transition-colors">
            <ArrowLeft size={12} /> {c.checkout.backToBagLabel}
          </Link>
        </aside>
      </form>
    </PageShell>
  );
}
