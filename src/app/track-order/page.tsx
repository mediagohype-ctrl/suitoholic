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
  "w-full bg-[#F5F4F0] border border-[#E5E3DD] rounded-xl px-4 py-3 text-sm text-black focus:outline-none focus:border-black placeholder:text-[#999999]";

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
        className="max-w-2xl mx-auto bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 mb-8 space-y-5 shadow-sm"
      >
        <p className="text-sm text-[#666666] text-center">{c.track.text}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">{c.track.orderNumberLabel}</span>
            <input required className={inputClass} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="SUIT-100001" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black">{c.track.emailLabel}</span>
            <input required type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="client@example.com" />
          </label>
        </div>
        {error && (
          <div role="alert" className="flex items-center gap-2 text-rose-600 text-xs font-semibold">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-neutral-800 disabled:opacity-60 text-white rounded-full py-4 text-xs font-bold tracking-[0.16em] uppercase flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
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
