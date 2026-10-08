"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Search } from "lucide-react";
import { formatMoney } from "@/lib/api";
import { qs, useAdminQuery } from "@/lib/admin/api";
import { formatDate, initialParam } from "@/lib/admin/format";
import type { AdminOrder, DashboardData, Paginated } from "@/lib/admin/types";
import { inputClass } from "@/components/admin/fields";
import { ORDER_STATUSES, OrderStatusBadge, PaymentBadge, orderStatusLabel, paymentMethodLabel } from "@/components/admin/status";
import { Card, EmptyState, ErrorState, PageHeader, Pagination, SkeletonRows, TableWrap, Tabs, Td, Th, cn } from "@/components/admin/ui";

const LIMIT = 25;

export default function OrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState(() => initialParam("status"));
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAdminQuery<Paginated<AdminOrder>>(`/orders${qs({ status, search: term, page, limit: LIMIT })}`);
  const dash = useAdminQuery<DashboardData>("/dashboard");

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const counts = dash.data?.ordersByStatus ?? {};
  const totalCount = ORDER_STATUSES.reduce((s, k) => s + (counts[k] ?? 0), 0);
  const tabs = [
    { value: "", label: "All", count: dash.data ? totalCount : undefined },
    ...ORDER_STATUSES.map((s) => ({ value: s as string, label: orderStatusLabel(s), count: dash.data ? (counts[s] ?? 0) : undefined })),
  ];

  return (
    <>
      <PageHeader title="Orders" description="Every order placed on the storefront. Open one for the tailor's job sheet." />
      <div className="mb-4">
        <Tabs
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
            router.replace(v ? `/admin/orders?status=${v}` : "/admin/orders", { scroll: false });
          }}
          tabs={tabs}
        />
      </div>
      <Card>
        <div className="border-b border-[#EEF0F3] p-3 sm:p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search order number, name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={8} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<ClipboardList className="h-5 w-5" />} title={term || status ? "No orders match" : "No orders yet"} description={status ? `No orders with status “${orderStatusLabel(status)}”.` : undefined} />
        ) : (
          <TableWrap className={cn(loading && "opacity-60")}>
            <thead>
              <tr>
                <Th>Order</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th className="text-right">Items</Th>
                <Th className="text-right">Total</Th>
                <Th>Payment</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((o) => (
                <tr key={o.id} className="cursor-pointer hover:bg-[#F9FAFB]" onClick={() => router.push(`/admin/orders/${o.id}`)}>
                  <Td>
                    <Link href={`/admin/orders/${o.id}`} onClick={(e) => e.stopPropagation()} className="font-semibold hover:text-[#9E774C]">
                      {o.orderNumber}
                    </Link>
                  </Td>
                  <Td className="whitespace-nowrap text-xs text-[#6B7280]">{formatDate(o.createdAt, true)}</Td>
                  <Td>
                    <p className="font-medium">{o.customer?.name}</p>
                    <p className="text-xs text-[#8B93A1]">{o.customer?.email}</p>
                  </Td>
                  <Td className="text-right tabular-nums">{o.itemCount ?? "—"}</Td>
                  <Td className="whitespace-nowrap text-right font-medium">{o.totalLabel || formatMoney(o.total)}</Td>
                  <Td>
                    <div className="flex flex-col items-start gap-1">
                      <PaymentBadge status={o.paymentStatus} />
                      <span className="text-[10px] uppercase tracking-wider text-[#8B93A1]">{paymentMethodLabel(o.paymentMethod)}</span>
                    </div>
                  </Td>
                  <Td>
                    <OrderStatusBadge status={o.status} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
        {data && Number(data.total) > 0 && <Pagination page={page} limit={LIMIT} total={Number(data.total)} onPage={setPage} />}
      </Card>
    </>
  );
}
