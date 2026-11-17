"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Lock, ShieldCheck, Wallet } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import OrderTotals from "@/components/bag/OrderTotals";
import { useCart, isUuid } from "@/context/CartProvider";
import { useContent, useSettings } from "@/context/SiteDataProvider";
import { ApiError, apiFetch, formatMoney } from "@/lib/api";
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
  const { cart, loading, reset, couponCode, discountAmount, applyCoupon, removeCoupon, ensureServerCart } = useCart();
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
  const [step, setStep] = useState<"details" | "payment">("details");
  const [paymentMethod, setPaymentMethod] = useState<"partial_cod" | "upi">("partial_cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const total = Math.max(0, (cart?.total ?? 0) - discountAmount);
  const symbol = cart?.currencySymbol || "₹";
  const advancePercent = Number(settings.advancePaymentPercentage || 20);
  const advanceAmount = Math.round(total * (advancePercent / 100));
  const balanceAmount = Math.max(0, total - advanceAmount);

  // Validate Step 1 delivery details before continuing to payment
  const validateDetails = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim() || !form.email.includes("@")) errs.email = "Please enter a valid email";
    if (!form.phone.trim() || form.phone.trim().length < 8) errs.phone = "Please enter a valid phone number";
    if (!form.line1.trim()) errs.line1 = "Address is required";
    if (!form.city.trim()) errs.city = "City is required";
    if (!form.state.trim()) errs.state = "State is required";
    if (!form.postalCode.trim()) errs.postalCode = "PIN code is required";

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setError("Please complete all required delivery details to continue.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleContinueToPayment = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateDetails()) {
      setStep("payment");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Auto-fill from saved addresses & logged-in profile
  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("suitoholic_client_user");
      let uName = "";
      let uEmail = "";
      let uPhone = "";
      if (userRaw) {
        const u = JSON.parse(userRaw);
        if (u.name) uName = u.name;
        if (u.email) uEmail = u.email;
        if (u.phone) uPhone = u.phone;
      }
      const addrRaw = localStorage.getItem("suitoholic_saved_addresses");
      if (addrRaw) {
        const addrs = JSON.parse(addrRaw);
        const def = addrs.find((a: any) => a.isDefault) || addrs[0];
        if (def) {
          setForm((prev) => ({
            ...prev,
            name: prev.name || def.name || uName,
            email: prev.email || uEmail,
            phone: prev.phone || def.phone || uPhone,
            line1: prev.line1 || def.address || "",
            line2: prev.line2 || def.locality || "",
            city: prev.city || def.city || "",
            state: prev.state || def.state || "",
            postalCode: prev.postalCode || def.pincode || "",
          }));
          return;
        }
      }
      if (uName || uEmail || uPhone) {
        setForm((prev) => ({
          ...prev,
          name: prev.name || uName,
          email: prev.email || uEmail,
          phone: prev.phone || uPhone,
        }));
      }
    } catch { }
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "details") {
      handleContinueToPayment();
      return;
    }
    if (!cart) return;
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      let activeCartId = cart.id;
      if (!isUuid(activeCartId) && ensureServerCart) {
        const syncedId = await ensureServerCart();
        if (syncedId) activeCartId = syncedId;
      }
      const order = await apiFetch<Order>("/orders", {
        method: "POST",
        body: {
          cartId: activeCartId,
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
          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">{c.emptyTitle}</h2>
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
          {/* 2-Step Checkout Stepper */}
          <div className="bg-white border border-[#E5E3DD] rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
            <button
              type="button"
              onClick={() => setStep("details")}
              className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                step === "details" ? "text-black" : "text-[#777777] hover:text-black"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step === "details"
                    ? "bg-black text-white"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {step === "payment" ? "✓" : "1"}
              </span>
              <span>1. Delivery Details</span>
            </button>

            <span className="text-[#D5D2CA] font-light">────────</span>

            <button
              type="button"
              onClick={() => {
                if (step === "details") handleContinueToPayment();
              }}
              className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                step === "payment" ? "text-black" : "text-[#999999]"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  step === "payment"
                    ? "bg-black text-white"
                    : "bg-[#EAE8E2] text-[#888888]"
                }`}
              >
                2
              </span>
              <span>2. Payment Method</span>
            </button>
          </div>

          {/* STEP 1: CONTACT & DELIVERY DETAILS */}
          {step === "details" && (
            <>
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

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className="w-full sm:w-auto px-9 py-4 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === "payment" && (
            <>
              {/* Confirmed Delivery Summary Card */}
              <div className="bg-white border border-[#E5E3DD] rounded-[24px] p-5 sm:p-6 shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
                    <CheckCircle2 size={15} className="text-emerald-700" />
                    <span>Delivery Details</span>
                  </div>
                  <p className="font-bold text-black text-sm">
                    {form.name} <span className="font-normal text-[#666666]">({form.phone})</span>
                  </p>
                  <p className="text-[#666666] leading-relaxed">
                    {form.line1}{form.line2 ? `, ${form.line2}` : ""}, {form.city}, {form.state} {form.postalCode}, {form.country}
                  </p>
                  <p className="text-[11px] text-[#888888] pt-0.5">
                    Order confirmation email: <strong className="text-black font-medium">{form.email}</strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-xs font-bold uppercase tracking-wider text-black hover:underline shrink-0 px-3.5 py-1.5 border border-[#E5E3DD] rounded-full hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Payment Method Selection - Permanent Bespoke Options */}
              <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E3DD] pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-black" />
                    <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase text-black">
                      Select Payment Method
                    </h2>
                  </div>
                  <span className="text-[10px] text-[#888888] font-bold tracking-wider uppercase">
                    Choose Preferred Option
                  </span>
                </div>

                <div className="space-y-3.5">
                  {/* Option 1: Partial Payment (20% Advance Online + Balance on Delivery) */}
                  <div
                    onClick={() => setPaymentMethod("partial_cod")}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === "partial_cod"
                        ? "bg-[#FAF9F6] border-black ring-1 ring-black shadow-xs"
                        : "bg-white hover:bg-[#FAF9F6]/60 border-[#E5E3DD]"
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "partial_cod"}
                        onChange={() => setPaymentMethod("partial_cod")}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-black shrink-0" />
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                            Pay {advancePercent}% Advance + COD Balance
                          </span>
                        </div>
                        <span className="text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wider">
                          Recommended
                        </span>
                      </div>

                      <p className="text-[11px] text-[#666666] mt-1.5 leading-relaxed">
                        Pay <strong className="text-black">{formatMoney(advanceAmount, symbol)}</strong> advance deposit online now to initiate precision tailoring &amp; fabric cutting; remaining balance <strong className="text-black">{formatMoney(balanceAmount, symbol)}</strong> is settled upon delivery.
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#E5E3DD] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#666666]">
                          Advance Due Now: <strong className="text-black font-semibold">{formatMoney(advanceAmount, symbol)}</strong>
                        </span>
                        <span className="text-[#666666]">
                          Balance on Delivery: <strong className="text-black font-semibold">{formatMoney(balanceAmount, symbol)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: 100% Full Online Payment (Instant Prepaid) */}
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === "upi"
                        ? "bg-[#FAF9F6] border-black ring-1 ring-black shadow-xs"
                        : "bg-white hover:bg-[#FAF9F6]/60 border-[#E5E3DD]"
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={16} className="text-black shrink-0" />
                          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                            100% Full Online Payment
                          </span>
                        </div>
                        <span className="text-[9.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#F5F4F0] text-black border border-[#E5E3DD] tracking-wider">
                          Contactless
                        </span>
                      </div>

                      <p className="text-[11px] text-[#666666] mt-1.5 leading-relaxed">
                        Pay complete amount <strong className="text-black">{formatMoney(total, symbol)}</strong> online via UPI (Google Pay, PhonePe, Paytm, BHIM), NetBanking or Cards for priority crafting &amp; 100% contactless delivery.
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-[#E5E3DD] flex items-center justify-between text-xs">
                        <span className="text-[#666666]">Total Due Online:</span>
                        <strong className="text-black font-semibold font-sans">{formatMoney(total, symbol)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#666666] hover:text-black transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Delivery Details</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full sm:w-auto px-9 py-4 bg-black hover:bg-neutral-800 disabled:opacity-60 text-white rounded-full text-xs font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
                >
                  <Lock size={14} />
                  <span>
                    {submitting
                      ? c.checkout.placingLabel
                      : paymentMethod === "partial_cod"
                      ? `Place Order (Pay ${formatMoney(advanceAmount, symbol)} Advance)`
                      : `Place Order (Pay ${formatMoney(total, symbol)} Online)`}
                  </span>
                </button>
              </div>
            </>
          )}
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

          {/* Partial Payment / Online Payment Summary Breakdown ONLY shown once payment step is reached */}
          {step === "payment" && paymentMethod === "partial_cod" && (
            <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E5E3DD] space-y-2 text-xs">
              <div className="flex justify-between items-center text-black font-bold">
                <span>Advance Deposit (Due Now):</span>
                <span className="font-sans text-sm font-extrabold text-black">{formatMoney(advanceAmount, symbol)}</span>
              </div>
              <div className="flex justify-between items-center text-[#666666] pt-1.5 border-t border-[#E5E3DD]">
                <span>Balance Due on Delivery:</span>
                <span className="font-sans font-bold text-black">{formatMoney(balanceAmount, symbol)}</span>
              </div>
            </div>
          )}

          {step === "payment" && paymentMethod === "upi" && (
            <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E5E3DD] space-y-2 text-xs">
              <div className="flex justify-between items-center text-black font-bold">
                <span>Total Online Payment (Due Now):</span>
                <span className="font-sans text-sm font-extrabold text-black">{formatMoney(total, symbol)}</span>
              </div>
            </div>
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
                    className="flex-1 bg-[#F5F4F0] border border-[#E5E3DD] focus:border-black rounded-full px-4 py-2 text-xs outline-none uppercase font-sans font-semibold tracking-wider placeholder:normal-case placeholder:font-sans"
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

          {/* MAIN BUTTON: CONTINUE in Step 1, PLACE ORDER in Step 2 */}
          {step === "details" ? (
            <button
              type="button"
              onClick={handleContinueToPayment}
              disabled={loading}
              className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-white py-4 px-6 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="space-y-2">
              <button
                type="submit"
                disabled={submitting || loading}
                className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-white py-4 px-6 rounded-full text-xs font-bold tracking-[0.16em] uppercase transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Lock size={14} />{" "}
                {submitting
                  ? c.checkout.placingLabel
                  : paymentMethod === "partial_cod"
                  ? `Place Order (Pay ${formatMoney(advanceAmount, symbol)} Advance)`
                  : `Place Order (Pay ${formatMoney(total, symbol)} Online)`}
              </button>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full text-center text-[10.5px] font-bold uppercase tracking-wider text-[#666666] hover:text-black transition-colors cursor-pointer pt-1"
              >
                ← Back to Delivery Details
              </button>
            </div>
          )}

          <Link href="/cart" className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-black hover:text-[#666666] uppercase transition-colors">
            <ArrowLeft size={12} /> {c.checkout.backToBagLabel}
          </Link>
        </aside>
      </form>
    </PageShell>
  );
}
