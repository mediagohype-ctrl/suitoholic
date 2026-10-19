"use client";

import React from "react";
import { Check } from "lucide-react";
import CustomizationDetails from "@/components/bag/CustomizationDetails";
import OrderTotals from "@/components/bag/OrderTotals";
import { useContent } from "@/context/SiteDataProvider";
import { formatMoney } from "@/lib/api";
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";

const PROGRESS: OrderStatus[] = ["pending", "confirmed", "in_tailoring", "shipped", "delivered"];

/** Order status timeline, items and totals — used by the confirmation and tracking pages. */
export default function OrderView({ order }: { order: Order }) {
  const c = useContent("bag");
  const symbol = order.totalLabel?.split(" ")[0] || "₹";
  const cancelled = order.status === "cancelled";
  const reached = PROGRESS.indexOf(order.status);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="lg:col-span-7 space-y-6">
        <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase text-black">{c.track.statusHeading}</h2>
            <span className="text-[11px] text-[#666666]">
              {c.confirmation.orderNumberLabel}: <strong className="text-black font-semibold">{order.orderNumber}</strong>
            </span>
          </div>
          {cancelled ? (
            <p className="text-sm font-bold text-rose-600 uppercase tracking-wider">{ORDER_STATUS_LABELS.cancelled}</p>
          ) : (
            <ol className="grid grid-cols-5 gap-1 pt-2">
              {PROGRESS.map((status, i) => {
                const done = i <= reached;
                return (
                  <li key={status} className="flex flex-col items-center text-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${done ? "bg-black border-black text-white shadow-sm" : "border-[#E5E3DD] text-[#999999] bg-[#F5F4F0]"}`}
                    >
                      {done ? <Check size={14} /> : i + 1}
                    </span>
                    <span className={`text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight ${done ? "text-black" : "text-[#999999]"}`}>
                      {ORDER_STATUS_LABELS[status]}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
          {order.history && order.history.length > 0 && (
            <ul className="border-t border-[#E5E3DD] pt-4 space-y-2.5">
              {[...order.history].reverse().map((h, i) => (
                <li key={i} className="flex justify-between gap-3 text-[11px]">
                  <span>
                    <strong className="uppercase text-black">{ORDER_STATUS_LABELS[h.status as OrderStatus] ?? h.status}</strong>
                    {h.note && <span className="text-[#666666]"> — {h.note}</span>}
                  </span>
                  <time className="text-[#999999] whitespace-nowrap">{new Date(h.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-8 shadow-sm">
          <ul className="divide-y divide-[#E5E3DD]">
            {(order.items ?? []).map((item) => (
              <li key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#F5F4F0] border border-[#E5E3DD] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-black leading-snug">
                      {item.name} <span className="text-[#666666] font-normal">× {item.quantity}</span>
                    </p>
                    <p className="text-xs font-bold text-black whitespace-nowrap">{formatMoney(item.lineTotal, symbol)}</p>
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
        </section>
      </div>

      <aside className="lg:col-span-5 space-y-5">
        <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-8 shadow-sm">
          <OrderTotals
            subtotal={order.subtotal}
            customizationTotal={order.customizationTotal}
            shippingFee={order.shippingFee}
            discount={order.discount}
            total={order.total}
            currencySymbol={symbol}
          />
          {(order.paymentMethod === "partial_cod" || Number(order.advanceAmount) > 0) && (
            <div className="mt-4 pt-3 border-t border-[#E5E3DD] space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-black">
                <span>Advance Paid Online ({order.paymentStatus === "paid" || order.paymentStatus === "partially_paid" ? "Received" : "Pending"}):</span>
                <span>{order.advanceAmountLabel || formatMoney(Number(order.advanceAmount), symbol)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-800 border-t border-dashed border-[#E5E3DD] pt-1.5">
                <span>Balance Due on Delivery (COD):</span>
                <span>{order.balanceDueLabel || formatMoney(Number(order.balanceDue), symbol)}</span>
              </div>
            </div>
          )}
        </section>
        <section className="bg-white border border-[#E5E3DD] rounded-[24px] p-6 sm:p-8 text-xs space-y-1.5 shadow-sm">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-black mb-2">{c.checkout.shippingHeading}</h3>
          <p className="font-bold text-black">{order.customer.name}</p>
          <p className="text-[#666666]">{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p className="text-[#666666]">{order.shippingAddress.line2}</p>}
          <p className="text-[#666666]">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-[#666666]">{order.shippingAddress.country}</p>
          <p className="pt-2 text-black font-medium">
            {order.paymentMethod === "upi"
              ? c.checkout.upiLabel
              : order.paymentMethod === "partial_cod"
              ? "Partial Payment (Advance Paid Online + Balance Cash on Delivery)"
              : c.checkout.codLabel}
          </p>
        </section>
      </aside>
    </div>
  );
}
