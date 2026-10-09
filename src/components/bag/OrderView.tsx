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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      <div className="lg:col-span-7 space-y-6">
        <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="text-[11px] font-bold tracking-[0.22em] uppercase">{c.track.statusHeading}</h2>
            <span className="text-[11px] text-[#55473B]">
              {c.confirmation.orderNumberLabel}: <strong className="text-[#14110E]">{order.orderNumber}</strong>
            </span>
          </div>
          {cancelled ? (
            <p className="text-sm font-bold text-[#B23B3B] uppercase tracking-wider">{ORDER_STATUS_LABELS.cancelled}</p>
          ) : (
            <ol className="grid grid-cols-5 gap-1">
              {PROGRESS.map((status, i) => {
                const done = i <= reached;
                return (
                  <li key={status} className="flex flex-col items-center text-center gap-1.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${done ? "bg-[#14110E] border-[#14110E] text-white" : "border-[#D5C2AF] text-[#A89888] bg-white"}`}
                    >
                      {done ? <Check size={13} /> : i + 1}
                    </span>
                    <span className={`text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider leading-tight ${done ? "text-[#14110E]" : "text-[#A89888]"}`}>
                      {ORDER_STATUS_LABELS[status]}
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
          {order.history && order.history.length > 0 && (
            <ul className="border-t border-[#E8DACB] pt-3 space-y-2">
              {[...order.history].reverse().map((h, i) => (
                <li key={i} className="flex justify-between gap-3 text-[11px]">
                  <span>
                    <strong className="uppercase">{ORDER_STATUS_LABELS[h.status as OrderStatus] ?? h.status}</strong>
                    {h.note && <span className="text-[#55473B]"> — {h.note}</span>}
                  </span>
                  <time className="text-[#7A6B5D] whitespace-nowrap">{new Date(h.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6">
          <ul className="divide-y divide-[#E8DACB]">
            {(order.items ?? []).map((item) => (
              <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#241D17] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between gap-2">
                    <p className="text-xs font-bold uppercase leading-snug">
                      {item.name} <span className="text-[#7A6B5D] font-semibold">× {item.quantity}</span>
                    </p>
                    <p className="text-xs font-semibold whitespace-nowrap">{formatMoney(item.lineTotal, symbol)}</p>
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
        </section>
      </div>

      <aside className="lg:col-span-5 space-y-4">
        <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6">
          <OrderTotals
            subtotal={order.subtotal}
            customizationTotal={order.customizationTotal}
            shippingFee={order.shippingFee}
            discount={order.discount}
            total={order.total}
            currencySymbol={symbol}
          />
        </section>
        <section className="bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 text-xs space-y-1">
          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#9E774C] mb-2">{c.checkout.shippingHeading}</h3>
          <p className="font-bold">{order.customer.name}</p>
          <p>{order.shippingAddress.line1}</p>
          {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
          <p className="pt-2 text-[#55473B]">
            {order.paymentMethod === "upi" ? c.checkout.upiLabel : c.checkout.codLabel}
          </p>
        </section>
      </aside>
    </div>
  );
}
