"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Check, CheckCircle2, Copy, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import { useContent, useSettings } from "@/context/SiteDataProvider";
import { fillTemplate } from "@/content/merge";
import { useLastOrder, saveLastOrder } from "@/lib/orders";
import { formatMoney } from "@/lib/api";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

const PROGRESS: OrderStatus[] = ["pending", "confirmed", "in_tailoring", "shipped", "delivered"];

export default function OrderConfirmationPage() {
  const c = useContent("bag");
  const settings = useSettings();
  const params = useParams();
  const orderNumber = decodeURIComponent(String(params?.orderNumber ?? ""));
  const lastOrder = useLastOrder(orderNumber);

  const [overrideOrder, setOverrideOrder] = useState<Order | null>(null);
  const order = overrideOrder ?? lastOrder;

  const [copied, setCopied] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const trackHref = `/track-order?order=${encodeURIComponent(orderNumber)}${order ? `&email=${encodeURIComponent(order.customer.email)}` : ""}`;

  const symbol = order?.totalLabel?.split(" ")[0] || "₹";
  const total = order?.total || 0;
  const advancePercent = Number(settings.advancePaymentPercentage || 20);
  const advanceAmount = order?.advanceAmount || Math.round(total * (advancePercent / 100));
  const balanceAmount = order?.balanceDue || Math.max(0, total - advanceAmount);
  const upiId = settings.upiId || "suitoholic@okaxis";
  const paymentMethod = order?.paymentMethod || "cod";

  const reached = order ? PROGRESS.indexOf(order.status) : 0;
  const cancelled = order?.status === "cancelled";

  const handleCopyUpi = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmOnlinePayment = () => {
    if (!order) return;
    const isFull = paymentMethod === "upi";
    const updated: Order = {
      ...order,
      paymentStatus: isFull ? "paid" : "partially_paid",
    };
    setOverrideOrder(updated);
    saveLastOrder(updated);
    setPaymentNotice(
      `✓ Payment confirmed! Your ${isFull ? "full online payment" : "20% advance deposit"} has been verified. Master tailoring cutting is priority scheduled!`
    );
  };

  return (
    <PageShell eyebrow={c.confirmation.eyebrow} title={c.confirmation.title}>
      {/* 1. TOP SUCCESS BANNER (Clean, centered, seamless without awkward floating boxed card) */}
      <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 size={32} strokeWidth={1.75} />
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-[0.24em] text-[#888888] uppercase block">
            Order Successfully Placed
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-black uppercase tracking-wider font-bold mt-1">
            Order #{orderNumber}
          </h2>
        </div>
        {order && (
          <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto leading-relaxed">
            {fillTemplate(c.confirmation.text, { email: order.customer.email })}
          </p>
        )}
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            href={trackHref}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-7 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm hover:shadow cursor-pointer"
          >
            {c.confirmation.trackLabel} <ArrowRight size={13} />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full border border-[#D5D2CA] hover:border-black text-[11px] font-bold uppercase tracking-[0.16em] text-black hover:bg-white transition-all bg-transparent cursor-pointer"
          >
            {c.continueShoppingLabel}
          </Link>
        </div>
      </div>

      {/* 2. UNIFIED SINGLE ATELIER RECEIPT CONTAINER (Eliminating disconnected scattered cards) */}
      {order && (
        <div className="max-w-5xl mx-auto bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-sm">
          {/* Top Bar: Progress Stepper */}
          <div className="bg-[#FAF9F6] border-b border-[#E5E3DD] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-black">
                Commission Progress
              </span>
              <span className="text-[11px] text-[#666666]">
                Order Date: <strong className="text-black font-semibold">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
              </span>
            </div>

            {cancelled ? (
              <p className="text-sm font-bold text-rose-600 uppercase tracking-wider">
                {ORDER_STATUS_LABELS.cancelled}
              </p>
            ) : (
              <ol className="grid grid-cols-5 gap-1 pt-1">
                {PROGRESS.map((status, i) => {
                  const done = i <= reached;
                  return (
                    <li key={status} className="flex flex-col items-center text-center gap-2">
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${
                          done
                            ? "bg-black border-black text-white shadow-xs"
                            : "border-[#E5E3DD] text-[#999999] bg-white"
                        }`}
                      >
                        {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight ${
                          done ? "text-black" : "text-[#999999]"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[status]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          {/* Main 2-Column Document Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E5E3DD]">
            {/* Left Column: Garment Items + Payment Method */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              {/* Garment(s) List */}
              <div>
                <h3 className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-black mb-4">
                  Bespoke Garments ({order.items?.length || 1})
                </h3>
                <ul className="divide-y divide-[#E5E3DD]">
                  {(order.items ?? []).map((item) => (
                    <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-[#ECEAE5] border border-[#E5E3DD] shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-black leading-snug">
                            {item.name} <span className="text-[#666666] font-normal">× {item.quantity}</span>
                          </h4>
                          <span className="text-xs sm:text-sm font-bold text-black whitespace-nowrap">
                            {formatMoney(item.lineTotal, symbol)}
                          </span>
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
              </div>

              {/* Payment Summary Section (Seamlessly integrated, not a scattered floating card) */}
              <div className="pt-6 border-t border-[#E5E3DD] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-black" />
                    <h3 className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-black">
                      Payment Details
                    </h3>
                  </div>
                  <span className="text-[9.5px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#F5F4F0] text-black border border-[#E5E3DD]">
                    {paymentMethod === "cod"
                      ? "Cash On Delivery"
                      : paymentMethod === "partial_cod"
                      ? "20% Advance + COD"
                      : "Full Online Payment"}
                  </span>
                </div>

                {paymentNotice && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
                    <Check size={15} className="text-emerald-700 shrink-0" />
                    <span>{paymentNotice}</span>
                  </div>
                )}

                {/* Case 1: COD */}
                {paymentMethod === "cod" && (
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] space-y-1.5 text-xs">
                    <p className="text-[#666666] leading-relaxed">
                      Your commission is confirmed for Cash on Delivery. Please keep <strong className="text-black">{formatMoney(total, symbol)}</strong> ready to pay upon delivery.
                    </p>
                    <div className="pt-2 flex justify-between font-bold text-black">
                      <span>Total Due on Delivery:</span>
                      <span className="font-sans text-sm">{formatMoney(total, symbol)}</span>
                    </div>
                  </div>
                )}

                {/* Case 2: Partial COD */}
                {paymentMethod === "partial_cod" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] space-y-2 text-xs">
                      <div className="flex justify-between items-center text-black font-bold">
                        <span>Advance Deposit Online ({order.paymentStatus === "partially_paid" || order.paymentStatus === "paid" ? "Received ✓" : "Pending"}):</span>
                        <span className="font-sans text-sm font-extrabold">{formatMoney(advanceAmount, symbol)}</span>
                      </div>
                      <div className="flex justify-between items-center text-[#666666] pt-1.5 border-t border-[#E5E3DD]">
                        <span>Balance Due on Delivery (COD):</span>
                        <span className="font-sans font-bold text-black">{formatMoney(balanceAmount, symbol)}</span>
                      </div>
                    </div>

                    {order.paymentStatus !== "partially_paid" && order.paymentStatus !== "paid" && (
                      <div className="border border-[#E5E3DD] rounded-xl p-3.5 space-y-3 bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F5F4F0] p-2.5 rounded-lg border border-[#E5E3DD]">
                          <div>
                            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider block">Atelier UPI ID</span>
                            <strong className="text-xs font-sans font-bold text-black block">{upiId}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            {copied ? <Check size={11} /> : <Copy size={11} />}
                            <span>{copied ? "Copied" : "Copy UPI"}</span>
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                          <p className="text-[10.5px] text-[#666666]">
                            Scan &amp; pay <strong className="text-black">{formatMoney(advanceAmount, symbol)}</strong> via UPI to start pattern cutting.
                          </p>
                          <button
                            type="button"
                            onClick={handleConfirmOnlinePayment}
                            className="w-full sm:w-auto px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                          >
                            ✓ I Have Paid Online
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Case 3: Full UPI */}
                {paymentMethod === "upi" && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E3DD] flex justify-between items-center text-xs">
                      <span className="font-bold text-black">
                        Total Online Payment ({order.paymentStatus === "paid" ? "Received ✓" : "Pending"}):
                      </span>
                      <span className="font-sans text-sm font-extrabold text-black">
                        {formatMoney(total, symbol)}
                      </span>
                    </div>

                    {order.paymentStatus !== "paid" && (
                      <div className="border border-[#E5E3DD] rounded-xl p-3.5 space-y-3 bg-white">
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F5F4F0] p-2.5 rounded-lg border border-[#E5E3DD]">
                          <div>
                            <span className="text-[9px] font-bold text-[#888888] uppercase tracking-wider block">Atelier UPI ID</span>
                            <strong className="text-xs font-sans font-bold text-black block">{upiId}</strong>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-3 py-1 bg-black hover:bg-neutral-800 text-white rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            {copied ? <Check size={11} /> : <Copy size={11} />}
                            <span>{copied ? "Copied" : "Copy UPI"}</span>
                          </button>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                          <p className="text-[10.5px] text-[#666666]">
                            Transfer <strong className="text-black">{formatMoney(total, symbol)}</strong> via UPI to verify your order.
                          </p>
                          <button
                            type="button"
                            onClick={handleConfirmOnlinePayment}
                            className="w-full sm:w-auto px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
                          >
                            ✓ I Have Paid Online
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Shipping Address + Financial Breakdown */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 bg-[#FAF9F6]">
              {/* Financial Totals */}
              <div>
                <h3 className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-black mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#666666]">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-black">{formatMoney(order.subtotal, symbol)}</span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Bespoke Craftsmanship:</span>
                    <span className="font-semibold text-black">
                      {order.customizationTotal > 0 ? formatMoney(order.customizationTotal, symbol) : "Complimentary"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#666666]">
                    <span>Insured Delivery:</span>
                    <span className="font-semibold text-black">
                      {order.shippingFee > 0 ? formatMoney(order.shippingFee, symbol) : "Free"}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promotional Privilege:</span>
                      <span className="font-semibold">-{formatMoney(order.discount, symbol)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#E5E3DD] flex justify-between items-baseline">
                    <span className="text-xs font-bold uppercase tracking-wider text-black">Total Amount:</span>
                    <span className="font-serif-luxury text-xl sm:text-2xl font-bold text-black">
                      {formatMoney(order.total, symbol)}
                    </span>
                  </div>

                  {paymentMethod === "partial_cod" && (
                    <div className="pt-2 space-y-1 text-[11px] text-[#666666]">
                      <div className="flex justify-between">
                        <span>Advance Deposit (Online):</span>
                        <span className="font-semibold text-black">{formatMoney(advanceAmount, symbol)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balance Due on Delivery:</span>
                        <span className="font-semibold text-black">{formatMoney(balanceAmount, symbol)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-5 border-t border-[#E5E3DD] space-y-2 text-xs">
                <h3 className="text-[10.5px] font-bold tracking-[0.2em] uppercase text-black mb-2">
                  Delivery Destination
                </h3>
                <p className="font-bold text-black text-sm">{order.customer.name}</p>
                <p className="text-[#666666] leading-relaxed">
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
                <p className="text-[#666666] pt-1">
                  Contact: <strong className="text-black font-semibold">{order.customer.phone}</strong>
                </p>
              </div>

              {/* Atelier Note */}
              <div className="pt-5 border-t border-[#E5E3DD] text-[11px] text-[#666666] space-y-1.5">
                <p className="leading-relaxed">
                  Every garment is hand-cut to your measurements and dispatched within 7–10 working days.
                </p>
                <p className="text-[#999999]">
                  Questions about your commission? Reach us at{" "}
                  <a href="mailto:care@suitoholic.com" className="text-black underline font-semibold">
                    care@suitoholic.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
