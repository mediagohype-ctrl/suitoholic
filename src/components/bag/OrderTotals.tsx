"use client";

import React from "react";
import { useContent } from "@/context/SiteDataProvider";
import { formatMoney } from "@/lib/api";

interface Props {
  subtotal: number;
  customizationTotal: number;
  shippingFee: number;
  total: number;
  currencySymbol: string;
  discount?: number;
}

export default function OrderTotals({ subtotal, customizationTotal, shippingFee, total, currencySymbol, discount = 0 }: Props) {
  const c = useContent("bag");
  const money = (n: number) => formatMoney(n, currencySymbol);
  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between">
        <span className="text-[#665749]">{c.subtotalLabel}</span>
        <span className="font-semibold">{money(subtotal)}</span>
      </div>
      {customizationTotal > 0 && (
        <div className="flex justify-between">
          <span className="text-[#665749]">{c.customizationLabel}</span>
          <span className="font-semibold">{money(customizationTotal)}</span>
        </div>
      )}
      {discount > 0 && (
        <div className="flex justify-between text-[#2D6A4F]">
          <span>Discount</span>
          <span className="font-semibold">− {money(discount)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-[#665749]">{c.shippingLabel}</span>
        <span className="font-semibold">{shippingFee > 0 ? money(shippingFee) : c.freeLabel}</span>
      </div>
      <div className="flex justify-between items-baseline border-t border-[#E2D4C3] pt-3 mt-1">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase">{c.totalLabel}</span>
        <span className="font-serif-luxury text-2xl font-bold">{money(total)}</span>
      </div>
      <p className="text-[10px] text-[#7A6B5D] text-right">{c.taxNote}</p>
    </div>
  );
}
