"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, CheckCircle2, Copy, CreditCard, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import OrderView from "@/components/bag/OrderView";
import { useContent, useSettings } from "@/context/SiteDataProvider";
import { fillTemplate } from "@/content/merge";
import { useLastOrder, saveLastOrder } from "@/lib/orders";
import { formatMoney } from "@/lib/api";
import type { Order } from "@/lib/types";

export default function OrderConfirmationPage() {
  const c = useContent("bag");
  const settings = useSettings();
  const params = useParams();
  const orderNumber = decodeURIComponent(String(params?.orderNumber ?? ""));
  const lastOrder = useLastOrder(orderNumber);

  const [overrideOrder, setOverrideOrder] = useState<Order | null>(null);
  const order = overrideOrder ?? lastOrder;

  const [selectedMethod, setSelectedMethod] = useState<"cod" | "partial_cod" | "upi">(() => {
    if (lastOrder?.paymentMethod === "partial_cod" || lastOrder?.paymentMethod === "upi") {
      return lastOrder.paymentMethod;
    }
    return "cod";
  });
  const [copied, setCopied] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const trackHref = `/track-order?order=${encodeURIComponent(orderNumber)}${order ? `&email=${encodeURIComponent(order.customer.email)}` : ""}`;

  const symbol = order?.totalLabel?.split(" ")[0] || "₹";
  const total = order?.total || 0;
  const advancePercent = Number(settings.advancePaymentPercentage || 20);
  const advanceAmount = Math.round(total * (advancePercent / 100));
  const balanceAmount = Math.max(0, total - advanceAmount);
  const upiId = settings.upiId || "suitoholic@okaxis";

  const handleSelectMethod = (method: "cod" | "partial_cod" | "upi") => {
    setSelectedMethod(method);
    if (!order) return;

    const advance = method === "partial_cod" ? advanceAmount : method === "upi" ? total : 0;
    const balance = method === "partial_cod" ? balanceAmount : method === "cod" ? total : 0;

    const updated: Order = {
      ...order,
      paymentMethod: method,
      advanceAmount: advance,
      advanceAmountLabel: formatMoney(advance, symbol),
      balanceDue: balance,
      balanceDueLabel: formatMoney(balance, symbol),
      paymentStatus: method === "cod" ? "pending" : order.paymentStatus,
    };

    setOverrideOrder(updated);
    saveLastOrder(updated);

    if (method === "cod") {
      setPaymentNotice("✓ Cash on Delivery confirmed. You can pay when your tailored order arrives!");
    } else {
      setPaymentNotice(null);
    }
  };

  const handleCopyUpi = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      void navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleConfirmOnlinePayment = () => {
    if (!order) return;
    const isFull = selectedMethod === "upi";
    const updated: Order = {
      ...order,
      paymentStatus: isFull ? "paid" : "partially_paid",
    };
    setOverrideOrder(updated);
    saveLastOrder(updated);
    setPaymentNotice(
      `✓ Payment confirmed! Your ${isFull ? "full online payment" : "20% advance deposit"} has been verified. Master tailoring cutting is now priority scheduled!`
    );
  };

  return (
    <PageShell eyebrow={c.confirmation.eyebrow} title={c.confirmation.title}>
      {/* 1. Top Order Confirmation Header Card */}
      <div className="max-w-3xl mx-auto text-center mb-8 space-y-4 bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-sm">
        <CheckCircle2 size={44} className="mx-auto text-emerald-700" strokeWidth={1.5} />
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#888888] uppercase block mb-1">
            Order Successfully Placed
          </span>
          <p className="font-serif-luxury text-xl sm:text-2xl text-black uppercase">
            {c.confirmation.orderNumberLabel}: <strong className="font-bold tracking-wider">{orderNumber}</strong>
          </p>
        </div>
        {order && (
          <p className="text-xs sm:text-sm text-[#666666] max-w-lg mx-auto">
            {fillTemplate(c.confirmation.text, { email: order.customer.email })}
          </p>
        )}
        <div className="pt-2">
          <Link
            href={trackHref}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] transition-all shadow-sm hover:shadow"
          >
            {c.confirmation.trackLabel}
          </Link>
        </div>
      </div>

      {/* 2. POST-ORDER PAYMENT METHOD SELECTION (Presented AFTER order placement) */}
      {order && (
        <div className="max-w-3xl mx-auto mb-10 bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E5E3DD] pb-4">
            <div className="flex items-center space-x-2 text-black mb-1">
              <CreditCard size={18} />
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase">
                Payment Option
              </span>
            </div>
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold uppercase text-black">
              Select How You Wish To Pay
            </h3>
            <p className="text-xs text-[#666666] mt-1">
              Your bespoke tailoring order is confirmed! Choose your payment preference below:
            </p>
          </div>

          {/* Feedback Notice Banner */}
          {paymentNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
              <Check size={16} className="text-emerald-700 shrink-0" />
              <span>{paymentNotice}</span>
            </div>
          )}

          {/* 3 Payment Cards */}
          <div className="space-y-3">
            {/* OPTION 1: CASH ON DELIVERY */}
            <div
              onClick={() => handleSelectMethod("cod")}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                selectedMethod === "cod"
                  ? "bg-[#F5F4F0] border-black ring-1 ring-black shadow-xs"
                  : "bg-white hover:bg-[#F5F4F0]/60 border-[#E5E3DD]"
              }`}
            >
              <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E3DD] flex items-center justify-center shrink-0 mt-0.5">
                  <Wallet size={18} className="text-black" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                      Cash On Delivery (COD)
                    </h4>
                    {selectedMethod === "cod" && (
                      <span className="bg-black text-white text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                    Pay full amount of <strong className="text-black">{formatMoney(total, symbol)}</strong> in cash or UPI when your tailored garment arrives at your doorstep.
                  </p>
                </div>
              </div>

              <div className="shrink-0 sm:text-right">
                <span className="font-serif-luxury text-sm font-bold text-black block">
                  {formatMoney(total, symbol)}
                </span>
                <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Due on Delivery</span>
              </div>
            </div>

            {/* OPTION 2: PAY 20% ADVANCE ONLINE + REMAINING 80% ON DELIVERY */}
            <div
              onClick={() => handleSelectMethod("partial_cod")}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                selectedMethod === "partial_cod"
                  ? "bg-[#F5F4F0] border-black ring-1 ring-black shadow-xs"
                  : "bg-white hover:bg-[#F5F4F0]/60 border-[#E5E3DD]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E3DD] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={18} className="text-black" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                        Pay {advancePercent}% Advance ({formatMoney(advanceAmount, symbol)}) + COD
                      </h4>
                      {selectedMethod === "partial_cod" && (
                        <span className="bg-black text-white text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                      Pay <strong className="text-black">{formatMoney(advanceAmount, symbol)}</strong> deposit online now to fast-track immediate pattern cutting; pay remaining <strong className="text-black">{formatMoney(balanceAmount, symbol)}</strong> on delivery.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span className="font-serif-luxury text-sm font-bold text-black block">
                    {formatMoney(advanceAmount, symbol)} Now
                  </span>
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">
                    + {formatMoney(balanceAmount, symbol)} on COD
                  </span>
                </div>
              </div>

              {/* Expanded Payment Details for Advance */}
              {selectedMethod === "partial_cod" && (
                <div className="pt-3 border-t border-[#E5E3DD] bg-white rounded-xl p-4 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F5F4F0] border border-[#E5E3DD] p-3 rounded-xl">
                    <div>
                      <span className="text-[9.5px] font-bold text-[#888888] uppercase tracking-wider block">Atelier UPI ID</span>
                      <strong className="text-xs font-mono font-bold text-black block mt-0.5">{upiId}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUpi();
                      }}
                      className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? "Copied UPI" : "Copy UPI ID"}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-[#666666]">
                      Scan &amp; pay <strong className="text-black">{formatMoney(advanceAmount, symbol)}</strong> using Google Pay, PhonePe, Paytm, or BHIM.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmOnlinePayment();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-[10.5px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm cursor-pointer"
                    >
                      ✓ I Have Paid {formatMoney(advanceAmount, symbol)} Online
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* OPTION 3: PAY 100% FULL AMOUNT ONLINE */}
            <div
              onClick={() => handleSelectMethod("upi")}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                selectedMethod === "upi"
                  ? "bg-[#F5F4F0] border-black ring-1 ring-black shadow-xs"
                  : "bg-white hover:bg-[#F5F4F0]/60 border-[#E5E3DD]"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start space-x-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E3DD] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={18} className="text-black" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                        Pay Full Amount Online (100% Prepaid)
                      </h4>
                      {selectedMethod === "upi" && (
                        <span className="bg-black text-white text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#666666] mt-1 leading-relaxed">
                      Instant settlement for 100% contactless doorstep delivery via UPI, GPay, PhonePe, Cards, or NetBanking.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <span className="font-serif-luxury text-sm font-bold text-black block">
                    {formatMoney(total, symbol)}
                  </span>
                  <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Full Payment</span>
                </div>
              </div>

              {/* Expanded Payment Details for Full UPI */}
              {selectedMethod === "upi" && (
                <div className="pt-3 border-t border-[#E5E3DD] bg-white rounded-xl p-4 space-y-3.5 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F5F4F0] border border-[#E5E3DD] p-3 rounded-xl">
                    <div>
                      <span className="text-[9.5px] font-bold text-[#888888] uppercase tracking-wider block">Atelier UPI ID</span>
                      <strong className="text-xs font-mono font-bold text-black block mt-0.5">{upiId}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyUpi();
                      }}
                      className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? "Copied UPI" : "Copy UPI ID"}</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                    <p className="text-[11px] text-[#666666]">
                      Transfer <strong className="text-black">{formatMoney(total, symbol)}</strong> and confirm to flag order as fully paid.
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmOnlinePayment();
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-full text-[10.5px] font-bold uppercase tracking-[0.16em] transition-all shadow-sm cursor-pointer"
                    >
                      ✓ I Have Paid {formatMoney(total, symbol)} Online
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Order Details & History */}
      {order && <OrderView order={order} />}

      <div className="text-center mt-8">
        <Link href="/shop" className="text-xs font-bold tracking-widest text-black uppercase hover:underline">
          {c.continueShoppingLabel}
        </Link>
      </div>
    </PageShell>
  );
}
