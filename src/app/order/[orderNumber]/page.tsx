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
      <div className="max-w-2xl mx-auto text-center mb-8 space-y-4 bg-white border border-[#E5E3DD] rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 shadow-sm">
        <CheckCircle2 size={44} className="mx-auto text-emerald-700" strokeWidth={1.5} />
        <p className="text-sm text-[#666666]">
          {c.confirmation.orderNumberLabel}: <strong className="text-black tracking-wider font-semibold">{orderNumber}</strong>
        </p>
        {order && <p className="text-sm text-[#666666]">{fillTemplate(c.confirmation.text, { email: order.customer.email })}</p>}
        <div>
          <Link
            href={trackHref}
            className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.16em] transition-all shadow-sm hover:shadow"
          >
            {c.confirmation.trackLabel}
          </Link>
        </div>
      </div>
      {order && <OrderView order={order} />}
      <div className="text-center mt-8">
        <Link href="/shop" className="text-xs font-bold tracking-widest text-black uppercase hover:underline">
          {c.continueShoppingLabel}
        </Link>
      </div>
    </PageShell>
  );
}
