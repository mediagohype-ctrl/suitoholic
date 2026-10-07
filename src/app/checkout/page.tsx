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
  "w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-sm text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C] placeholder:text-[#A89888]";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#3A3028]">{label}</span>
      {children}
      {error && <span className="block text-[11px] text-[#B23B3B]">{error}</span>}
    </label>
  );
}

export default function CheckoutPage() {
  const c = useContent("bag");
  const settings = useSettings();
  const { cart, loading, reset } = useCart();
  const router = useRouter();

  const paymentOptions = [
    settings.codEnabled && { id: "cod", label: c.checkout.codLabel, hint: c.checkout.codHint },
    settings.upiEnabled && { id: "upi", label: c.checkout.upiLabel, hint: c.checkout.upiHint },
  ].filter(Boolean) as { id: string; label: string; hint: string }[];

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
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]?.id ?? "cod");
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
        <div className="max-w-md mx-auto text-center bg-[#FAF5EE] border border-[#E2D4C3] rounded-3xl p-10 space-y-4">
          <h2 className="font-serif-luxury text-2xl uppercase">{c.emptyTitle}</h2>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#14110E] hover:bg-[#9E774C] text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.16em]">
            {c.continueShoppingLabel}
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow={c.eyebrow} title={c.checkout.title}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase">{c.checkout.contactHeading}</h2>
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

          <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase">{c.checkout.shippingHeading}</h2>
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

          <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 space-y-3">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase">{c.checkout.paymentHeading}</h2>
            {paymentOptions.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === opt.id ? "border-[#8C6D47] bg-[#EAE0D3] ring-1 ring-[#8C6D47]" : "border-[#D5C2AF] bg-white"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.id}
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                  className="mt-1 accent-[#7A4B1A]"
                />
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider">{opt.label}</span>
                  <span className="block text-[11px] text-[#55473B] mt-0.5">
                    {opt.hint}
                    {opt.id === "upi" && settings.upiId ? ` (${settings.upiId})` : ""}
                  </span>
                </span>
              </label>
            ))}
            <Field label={c.checkout.notesLabel}>
              <textarea rows={3} className={inputClass} value={form.notes} onChange={set("notes")} placeholder={c.checkout.notesPlaceholder} />
            </Field>
          </section>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-32 bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase border-b border-[#E8DACB] pb-2">{c.summaryTitle}</h2>
          <ul className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-[#241D17] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-full h-full object-cover object-top" />
                  <span className="absolute -top-0 -right-0 bg-[#14110E] text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-bl-md flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-xs font-bold uppercase leading-snug">{item.name}</p>
                    <p className="text-xs font-semibold whitespace-nowrap">{item.lineTotalLabel}</p>
                  </div>
                  {item.customization ? (
                    <CustomizationDetails customization={item.customization} />
                  ) : (
                    item.size && <p className="text-[11px] text-[#55473B]">{c.standardSizeLabel}: {item.size}</p>
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
              total={cart.total}
              currencySymbol={cart.currencySymbol}
            />
          )}
          {settings.orderNotice && <p className="text-[11px] text-[#55473B] bg-white/70 rounded-xl p-3 border border-[#E8DACB]">{settings.orderNotice}</p>}
          {error && (
            <div role="alert" className="flex items-start gap-2 bg-[#9B2C2C] text-white text-xs font-semibold rounded-xl px-4 py-3">
              <AlertCircle size={16} className="shrink-0 mt-px" /> {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting || loading || paymentOptions.length === 0}
            className="w-full bg-[#14110E] hover:bg-[#2A231D] disabled:opacity-60 text-white py-4 px-5 rounded-xl text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Lock size={14} /> {submitting ? c.checkout.placingLabel : c.checkout.placeOrderLabel}
          </button>
          <Link href="/cart" className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-[#9E774C] uppercase hover:underline">
            <ArrowLeft size={12} /> {c.checkout.backToBagLabel}
          </Link>
        </aside>
      </form>
    </PageShell>
  );
}
