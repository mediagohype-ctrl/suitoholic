"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Package, Clock, ShoppingBag, ArrowRight, ExternalLink, ChevronRight, MessageSquare } from "lucide-react";
import PageShell from "@/components/bag/PageShell";

interface UserOrder {
  orderNumber: string;
  date: string;
  statusLabel: string;
  currentStage: string;
  progressPercent: number;
  estimatedDelivery: string;
  totalLabel: string;
  items: {
    name: string;
    details: string;
    price: string;
    quantity: number;
    image: string;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const list: UserOrder[] = [];
      const lastRaw = sessionStorage.getItem("suitoholic_last_order");
      if (lastRaw) {
        const parsed = JSON.parse(lastRaw);
        if (parsed?.orderNumber) {
          list.push({
            orderNumber: parsed.orderNumber,
            date: new Date(parsed.createdAt || Date.now()).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            statusLabel: parsed.status === "delivered" ? "Delivered" : "Atelier Crafting Phase",
            currentStage: "Hand-Cut & Precision Stitching",
            progressPercent: 65,
            estimatedDelivery: "Estimated in 3-4 Days",
            totalLabel: parsed.totalLabel || `₹ ${(parsed.total || 0).toLocaleString("en-IN")}`,
            items: (parsed.items || []).map((it: { name?: string; size?: string; lineTotal?: number; image?: string }) => ({
              name: it.name || "Bespoke Tailored Shirt",
              details: `Size ${it.size || "Custom Fit"} • Master Cut`,
              price: `₹ ${(it.lineTotal || 2600).toLocaleString("en-IN")}`,
              quantity: 1,
              image: it.image || "/products/shirt-blue-spread.png",
            })),
          });
        }
      }

      const clientOrdersRaw = localStorage.getItem("suitoholic_client_orders");
      if (clientOrdersRaw) {
        const parsedList = JSON.parse(clientOrdersRaw);
        if (Array.isArray(parsedList)) {
          parsedList.forEach((ord) => {
            if (ord?.orderNumber && !list.some((existing) => existing.orderNumber === ord.orderNumber)) {
              list.push(ord);
            }
          });
        }
      }

      setOrders(list);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <PageShell eyebrow="ATELIER COMMISSIONS" title="YOUR ORDERS">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell eyebrow="ATELIER COMMISSIONS" title="YOUR ORDERS">
      <div className="max-w-4xl mx-auto space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.orderNumber}
              className="bg-white border border-[#E5E3DD] rounded-[20px] p-6 sm:p-8 shadow-xs space-y-6"
            >
              {/* Top Bar: Order ID, Date & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1] font-sans">
                <div>
                  <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#888888]">Commission ID</span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-black">{order.orderNumber}</h3>
                  <p className="text-xs text-[#888888] mt-0.5">Placed on {order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] text-xs font-sans font-bold text-[#8C7355] flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>{order.statusLabel}</span>
                  </span>
                  <span className="font-sans text-base font-bold text-black">{order.totalLabel}</span>
                </div>
              </div>

              {/* 4-Stage Visual Tailoring Progress Tracker */}
              <div className="space-y-2 py-2 font-sans">
                <div className="flex justify-between text-[11px] font-sans font-medium text-[#666666]">
                  <span>Progress: {order.currentStage}</span>
                  <span>{order.estimatedDelivery}</span>
                </div>
                <div className="w-full bg-[#FAF8F5] border border-[#E5E3DD] h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-[#14110E] h-full rounded-full transition-all duration-500"
                    style={{ width: `${order.progressPercent}%` }}
                  />
                </div>
                <div className="grid grid-cols-4 text-[10px] font-sans font-medium text-[#888888] pt-1 text-center">
                  <span className="font-bold text-black">1. Pattern Draft</span>
                  <span className="font-bold text-black">2. Hand-Cut</span>
                  <span className="font-bold text-[#8C7355]">3. Stitch &amp; Press</span>
                  <span>4. Dispatch</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2 font-sans">
                <h4 className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#888888]">
                  Commissioned Garments ({order.items.length})
                </h4>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#FAF9F6] border border-[#EFECE6]"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-14 h-14 rounded-lg bg-white border border-[#E5E3DD] flex items-center justify-center shrink-0">
                        <ShoppingBag size={22} className="text-[#8C7355]" />
                      </div>
                      <div>
                        <h5 className="font-sans text-sm font-bold uppercase text-black">{item.name}</h5>
                        <p className="text-xs text-[#666666] mt-0.5">{item.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-xs sm:text-sm font-bold text-black">{item.price}</span>
                      <p className="text-[10px] text-[#888888]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#F0ECE1]">
                <Link
                  href={`/track-order?order=${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black hover:underline"
                >
                  <span>Live Tracking Timeline</span>
                  <ExternalLink size={13} />
                </Link>

                <a
                  href={`https://wa.me/919999999999?text=${encodeURIComponent(
                    `Hello Suitoholic Concierge, I would like an update on my bespoke order ${order.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white border border-[#E5E3DD] hover:border-black text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <MessageSquare size={13} className="text-[#8C7355]" />
                  <span>Atelier Concierge WhatsApp</span>
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-8 sm:p-14 text-center space-y-5 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E5E3DD] flex items-center justify-center text-[#8C7355] mx-auto">
              <Package size={30} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-[38px] font-bold text-black tracking-[0.14em] uppercase leading-tight">
                No Orders Yet
              </h2>
              <p className="text-xs sm:text-sm text-[#666666] leading-relaxed max-w-md mx-auto">
                You haven&apos;t placed any bespoke tailoring orders yet. Explore our handcrafted Egyptian cotton shirts and luxury Italian textiles to commission your first piece.
              </p>
            </div>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all shadow-xs"
              >
                <span>Explore Bespoke Shirts</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/track-order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-[#E5E3DD] hover:border-black text-black text-xs font-bold uppercase tracking-wider rounded-[8px] transition-all"
              >
                <span>Track An Order</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

