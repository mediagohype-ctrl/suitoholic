"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Search } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import OrderView from "@/components/bag/OrderView";
import { useContent } from "@/context/SiteDataProvider";
import { apiFetch } from "@/lib/api";
import type { Order } from "@/lib/types";

const inputClass =
  "w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-sm text-[#14110E] focus:outline-none focus:ring-2 focus:ring-[#9E774C]";

function TrackOrderContent() {
  const c = useContent("bag");
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(() => Boolean(searchParams.get("order") && searchParams.get("email")));

  const fetchOrder = (num: string, mail: string) =>
    apiFetch<Order>(`/orders/${encodeURIComponent(num.trim().toUpperCase())}?email=${encodeURIComponent(mail.trim())}`);

  const handleResult = useCallback((promise: Promise<Order>) => {
    promise
      .then((found) => {
        setOrder(found);
        setError(null);
      })
      .catch((err: Error) => {
        setOrder(null);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-lookup when arriving from the confirmation page with both values in the URL
  useEffect(() => {
    const num = searchParams.get("order");
    const mail = searchParams.get("email");
    if (num && mail) handleResult(fetchOrder(num, mail));
  }, [searchParams, handleResult]);

  return (
    <PageShell eyebrow={c.track.eyebrow} title={c.track.title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          setError(null);
          handleResult(fetchOrder(orderNumber, email));
        }}
        className="max-w-2xl mx-auto bg-[#FAF5EE] border border-[#E2D4C3] rounded-2xl p-5 sm:p-6 mb-8 space-y-4"
      >
        <p className="text-sm text-[#55473B] text-center">{c.track.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{c.track.orderNumberLabel}</span>
            <input required className={inputClass} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="SUIT-100001" />
          </label>
          <label className="block space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em]">{c.track.emailLabel}</span>
            <input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>
        {error && (
          <div role="alert" className="flex items-center gap-2 text-[#B23B3B] text-xs font-semibold">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#14110E] hover:bg-[#2A231D] disabled:opacity-60 text-white py-3.5 rounded-xl text-xs font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2"
        >
          <Search size={14} /> {c.track.submitLabel}
        </button>
      </form>
      {order && <OrderView order={order} />}
    </PageShell>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={null}>
      <TrackOrderContent />
    </Suspense>
  );
}
