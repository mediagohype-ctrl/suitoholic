"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import PageShell from "@/components/bag/PageShell";
import OrderView from "@/components/bag/OrderView";
import { useContent } from "@/context/SiteDataProvider";
import { fillTemplate } from "@/content/merge";
import { useLastOrder } from "@/lib/orders";

export default function OrderConfirmationPage() {
  const c = useContent("bag");
  const params = useParams();
  const orderNumber = decodeURIComponent(String(params?.orderNumber ?? ""));
  // The order placed in this tab is kept in sessionStorage; anything else goes through tracking.
  const order = useLastOrder(orderNumber);

  const trackHref = `/track-order?order=${encodeURIComponent(orderNumber)}${order ? `&email=${encodeURIComponent(order.customer.email)}` : ""}`;

  return (
    <PageShell eyebrow={c.confirmation.eyebrow} title={c.confirmation.title}>
      <div className="max-w-2xl mx-auto text-center mb-8 space-y-3">
        <CheckCircle2 size={40} className="mx-auto text-[#2D6A4F]" strokeWidth={1.5} />
        <p className="text-sm text-[#55473B]">
          {c.confirmation.orderNumberLabel}: <strong className="text-[#14110E] tracking-wider">{orderNumber}</strong>
        </p>
        {order && <p className="text-sm text-[#55473B]">{fillTemplate(c.confirmation.text, { email: order.customer.email })}</p>}
        <Link
          href={trackHref}
          className="inline-flex items-center gap-2 bg-[#14110E] hover:bg-[#9E774C] text-white px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.16em] transition-all"
        >
          {c.confirmation.trackLabel}
        </Link>
      </div>
      {order && <OrderView order={order} />}
      <div className="text-center mt-8">
        <Link href="/shop" className="text-[11px] font-bold tracking-widest text-[#9E774C] uppercase hover:underline">
          {c.continueShoppingLabel}
        </Link>
      </div>
    </PageShell>
  );
}
