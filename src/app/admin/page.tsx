"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  ClipboardList,
  Mail,
  MessageSquare,
  Package,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { useAdminQuery } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/format";
import type { DashboardData } from "@/lib/admin/types";
import { Button, Card, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton, TableWrap, Td, Th, cn } from "@/components/admin/ui";
import { ORDER_STATUSES, OrderStatusBadge, orderStatusColor, orderStatusLabel } from "@/components/admin/status";

export default function DashboardPage() {
  const { user } = useAdminAuth();
  const { data, error, loading, reload } = useAdminQuery<DashboardData>("/dashboard");
  const sym = data?.currencySymbol ?? "₹";
  const money = (n: number) => formatMoney(n, sym);

  return (
    <>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="A snapshot of the atelier: sales, bags, catalog and customer activity."
        actions={
          <Button size="sm" onClick={reload} loading={loading && !!data} icon={<RefreshCw className="h-3.5 w-3.5" />}>
            Refresh
          </Button>
        }
      />

      {error && !data ? (
        <Card>
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      ) : !data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={<Banknote />} label="Total revenue" value={money(data.revenue)} sub="Excludes cancelled orders" />
            <Kpi icon={<TrendingUp />} label="Revenue · 30 days" value={money(data.revenue30d)} sub={`${data.orders30d} orders in 30 days`} />
            <Kpi icon={<ClipboardList />} label="Orders" value={data.orders.toLocaleString("en-IN")} sub="All time" href="/admin/orders" />
            <Kpi icon={<ReceiptText />} label="Average order value" value={money(data.averageOrderValue)} />
            <Kpi
              icon={<ShoppingBag />}
              label="Active bags"
              value={data.bags.active.toLocaleString("en-IN")}
              sub={`${money(data.bags.activeValue)} in bags`}
              href="/admin/bags"
            />
            <Kpi
              icon={<AlertTriangle />}
              label="Abandoned bags"
              value={data.bags.abandoned.toLocaleString("en-IN")}
              sub={`${money(data.bags.abandonedValue)} left behind`}
              href="/admin/bags?status=abandoned"
              tone={data.bags.abandoned ? "amber" : undefined}
            />
            <Kpi
              icon={<Package />}
              label="Products"
              value={`${data.catalog.activeProducts} / ${data.catalog.products}`}
              sub={
                <>
                  Active · {data.catalog.categories} categories ·{" "}
                  <span className={data.catalog.lowStock ? "font-semibold text-[#B4402F]" : ""}>{data.catalog.lowStock} low stock</span>
                </>
              }
              href="/admin/products"
            />
            <Kpi
              icon={<MessageSquare />}
              label="New inquiries"
              value={data.newInquiries.toLocaleString("en-IN")}
              sub={
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {data.subscribers.toLocaleString("en-IN")} subscribers
                </span>
              }
              href="/admin/inquiries"
              tone={data.newInquiries ? "bronze" : undefined}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Card className="xl:col-span-2">
              <CardHeader title="Revenue · last 30 days" description={`${money(data.revenue30d)} from ${data.orders30d} orders`} />
              <div className="p-4 sm:p-5">
                <RevenueChart days={data.revenueByDay} money={money} />
              </div>
            </Card>
            <Card>
              <CardHeader title="Orders by status" />
              <div className="p-4 sm:p-5">
                <StatusBreakdown counts={data.ordersByStatus} />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <Card className="xl:col-span-3">
              <CardHeader
                title="Recent orders"
                actions={
                  <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs font-medium text-[#9E774C] hover:text-[#14110E]">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                }
              />
              {data.recentOrders.length ? (
                <TableWrap className="[&_table]:min-w-[520px]">
                  <thead>
                    <tr>
                      <Th>Order</Th>
                      <Th>Customer</Th>
                      <Th>Status</Th>
                      <Th className="text-right">Total</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FCF9F5]">
                        <Td>
                          <Link href={`/admin/orders/${o.id}`} className="font-medium text-[#14110E] hover:text-[#9E774C]">
                            {o.orderNumber}
                          </Link>
                          <p className="text-xs text-[#665749]">{formatDate(o.createdAt, true)}</p>
                        </Td>
                        <Td>{o.customerName}</Td>
                        <Td>
                          <OrderStatusBadge status={o.status} />
                        </Td>
                        <Td className="text-right font-medium">{money(o.total)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </TableWrap>
              ) : (
                <EmptyState title="No orders yet" description="Orders placed on the storefront will appear here." />
              )}
            </Card>
            <Card className="xl:col-span-2">
              <CardHeader title="Top products" description="By units sold" />
              {data.topProducts.length ? (
                <ol className="divide-y divide-[#F3EBE0]">
                  {data.topProducts.map((p, i) => (
                    <li key={p.slug + i} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F5EFE6] text-xs font-semibold text-[#9E774C]">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-[#665749]">{p.units} units</p>
                      </div>
                      <span className="text-sm font-medium">{money(p.revenue)}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState title="No sales yet" />
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
  href,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
  tone?: "amber" | "bronze";
}) {
  const body = (
    <Card className={cn("h-full p-4 transition-colors", href && "hover:border-[#9E774C]")}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-[#665749]">{label}</p>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg [&_svg]:h-4 [&_svg]:w-4",
            tone === "amber" ? "bg-[#FDF3DC] text-[#8A5A00]" : "bg-[#F5EFE6] text-[#9E774C]",
          )}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 font-serif-luxury text-3xl font-semibold leading-none text-[#14110E]">{value}</p>
      {sub && <p className="mt-2 text-xs text-[#665749]">{sub}</p>}
    </Card>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

function RevenueChart({ days, money }: { days: DashboardData["revenueByDay"]; money: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.revenue));
  const n = days.length || 1;
  const W = 600;
  const H = 180;
  const slot = W / n;
  const barW = Math.max(2, slot - 2);
  const active = hover !== null ? days[hover] : null;
  const shortDate = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  if (!days.length) return <EmptyState title="No data" />;

  return (
    <div>
      <div className="mb-2 flex h-10 items-end justify-between gap-2 text-xs text-[#665749]">
        {active ? (
          <p>
            <span className="font-semibold text-[#14110E]">{shortDate(active.date)}</span> · {money(active.revenue)} · {active.orders} order
            {active.orders === 1 ? "" : "s"}
          </p>
        ) : (
          <p>Hover a bar for the day&apos;s figures. Best day: {money(Math.max(0, ...days.map((d) => d.revenue)))}</p>
        )}
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-48 w-full" preserveAspectRatio="none" role="img" aria-label="Daily revenue for the last 30 days">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={0} x2={W} y1={H - f * (H - 4)} y2={H - f * (H - 4)} stroke="#EFE5D8" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          ))}
          {days.map((d, i) => {
            const h = d.revenue > 0 ? Math.max(3, (d.revenue / max) * (H - 4)) : 0;
            const x = i * slot + (slot - barW) / 2;
            return (
              <g key={d.date}>
                {h > 0 && (
                  <path
                    d={`M${x},${H} L${x},${H - h + Math.min(4, h)} Q${x},${H - h} ${x + Math.min(4, barW / 2)},${H - h} L${x + barW - Math.min(4, barW / 2)},${H - h} Q${x + barW},${H - h} ${x + barW},${H - h + Math.min(4, h)} L${x + barW},${H} Z`}
                    fill={hover === i ? "#14110E" : "#9E774C"}
                  />
                )}
                <rect
                  x={i * slot}
                  y={0}
                  width={slot}
                  height={H}
                  fill="transparent"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => setHover(i)}
                >
                  <title>{`${shortDate(d.date)}: ${money(d.revenue)} (${d.orders} orders)`}</title>
                </rect>
              </g>
            );
          })}
          <line x1={0} x2={W} y1={H - 0.5} y2={H - 0.5} stroke="#D9CBB9" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-[#8a7a6a]">
        <span>{shortDate(days[0].date)}</span>
        <span>{shortDate(days[Math.floor(days.length / 2)].date)}</span>
        <span>{shortDate(days[days.length - 1].date)}</span>
      </div>
    </div>
  );
}

function StatusBreakdown({ counts }: { counts: DashboardData["ordersByStatus"] }) {
  const total = ORDER_STATUSES.reduce((s, k) => s + (counts[k] ?? 0), 0);
  if (!total) return <EmptyState title="No orders yet" />;
  return (
    <div className="space-y-4">
      <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full bg-[#F5EFE6]">
        {ORDER_STATUSES.filter((s) => counts[s]).map((s) => (
          <div key={s} style={{ width: `${((counts[s] ?? 0) / total) * 100}%`, background: orderStatusColor[s] }} title={`${orderStatusLabel(s)}: ${counts[s]}`} />
        ))}
      </div>
      <ul className="space-y-2">
        {ORDER_STATUSES.map((s) => (
          <li key={s}>
            <Link href={`/admin/orders?status=${s}`} className="flex items-center gap-2.5 rounded-md px-1 py-1 text-sm hover:bg-[#FAF5EE]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: orderStatusColor[s] }} />
              <span className="flex-1 text-[#3d342b]">{orderStatusLabel(s)}</span>
              <span className="font-semibold tabular-nums">{counts[s] ?? 0}</span>
              <span className="w-10 text-right text-xs tabular-nums text-[#8a7a6a]">{Math.round(((counts[s] ?? 0) / total) * 100)}%</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Skeleton className="h-72 rounded-xl xl:col-span-2" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
