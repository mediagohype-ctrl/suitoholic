"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Scissors, ShoppingBag, SlidersHorizontal, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/api";
import { qs, useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { formatDate, initialParam } from "@/lib/admin/format";
import type { AdminBagRow, AdminSettings, BagStatus, DashboardData, Paginated } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { BagStatusBadge } from "@/components/admin/status";
import { Badge, Card, EmptyState, ErrorState, IconButton, Notice, PageHeader, Pagination, SkeletonRows, TableWrap, Tabs, Td, Th, cn } from "@/components/admin/ui";

const LIMIT = 25;
const STATUSES: BagStatus[] = ["active", "abandoned", "converted"];

export default function BagsPage() {
  const router = useRouter();
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const { isAdmin } = useAdminAuth();
  const [status, setStatus] = useState<BagStatus>(() => {
    const s = initialParam("status") as BagStatus;
    return STATUSES.includes(s) ? s : "active";
  });
  const [page, setPage] = useState(1);
  const { data, error, loading, reload, setData } = useAdminQuery<Paginated<AdminBagRow>>(`/carts${qs({ status, page, limit: LIMIT })}`);
  const settings = useAdminQuery<AdminSettings>("/settings");
  const dash = useAdminQuery<DashboardData>("/dashboard");
  const sym = settings.data?.currencySymbol ?? "₹";
  const hours = settings.data?.abandonedCartHours ?? 24;

  const remove = async (b: AdminBagRow) => {
    const ok = await confirm({
      title: "Delete this bag?",
      message: `The ${b.itemCount} item(s) in this bag will be removed. If the shopper returns, they'll start with an empty bag.`,
      confirmLabel: "Delete bag",
      danger: true,
    });
    if (!ok) return;
    try {
      await request(`/carts/${b.id}`, { method: "DELETE" });
      setData((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== b.id), total: Number(d.total) - 1 } : d!));
      toast.success("Bag deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  const tabs = [
    { value: "active" as BagStatus, label: "Active", count: dash.data?.bags.active },
    { value: "abandoned" as BagStatus, label: "Abandoned", count: dash.data?.bags.abandoned },
    { value: "converted" as BagStatus, label: "Converted" },
  ];

  return (
    <>
      <PageHeader title="Bags (Add to Bag)" description="Shopping bags customers have filled on the storefront, including their bespoke selections." />

      <div className="mb-5 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
        <Notice tone="neutral" className="flex items-center">
          Bags untouched for <strong className="mx-1">{hours} hours</strong> count as abandoned.{" "}
          {isAdmin ? (
            <Link href="/admin/settings" className="ml-1 font-semibold text-[#9E774C] hover:underline">
              Change in Settings
            </Link>
          ) : (
            <span className="ml-1">An admin can change this in Settings.</span>
          )}
        </Notice>
        <Link
          href="/admin/content/customizer"
          className="flex items-center gap-3 rounded-lg border border-[#E2D4C3] bg-white px-4 py-2.5 text-sm transition-colors hover:border-[#9E774C]"
        >
          <SlidersHorizontal className="h-4 w-4 text-[#9E774C]" />
          <span>
            <span className="block font-semibold">Edit customizer options</span>
            <span className="block text-xs text-[#665749]">Chest sizes, fits, collars, cuffs, threads</span>
          </span>
          <ArrowRight className="ml-auto h-4 w-4 text-[#9E774C]" />
        </Link>
      </div>

      <div className="mb-4">
        <Tabs
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
            router.replace(`/admin/bags?status=${v}`, { scroll: false });
          }}
          tabs={tabs}
        />
      </div>

      <Card>
        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={6} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="h-5 w-5" />} title={`No ${status} bags`} description="Only bags with at least one item are listed." />
        ) : (
          <TableWrap className={cn(loading && "opacity-60")}>
            <thead>
              <tr>
                <Th>Bag</Th>
                <Th>Shopper</Th>
                <Th className="text-right">Items</Th>
                <Th>Bespoke</Th>
                <Th className="text-right">Value</Th>
                <Th>Last activity</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((b) => (
                <tr key={b.id} className="cursor-pointer hover:bg-[#FCF9F5]" onClick={() => router.push(`/admin/bags/${b.id}`)}>
                  <Td>
                    <Link href={`/admin/bags/${b.id}`} onClick={(e) => e.stopPropagation()} className="font-mono text-xs font-semibold hover:text-[#9E774C]">
                      {b.id.slice(0, 8)}
                    </Link>
                    <p className="text-[11px] text-[#8a7a6a]">Created {formatDate(b.createdAt)}</p>
                  </Td>
                  <Td className="text-xs">{b.email || <span className="text-[#a8998a]">Guest</span>}</Td>
                  <Td className="text-right tabular-nums">{b.itemCount}</Td>
                  <Td>
                    {Number(b.bespokeLines) > 0 ? (
                      <Badge tone="purple">
                        <Scissors className="h-3 w-3" /> {b.bespokeLines} line{Number(b.bespokeLines) === 1 ? "" : "s"}
                      </Badge>
                    ) : (
                      <span className="text-xs text-[#a8998a]">—</span>
                    )}
                  </Td>
                  <Td className="whitespace-nowrap text-right font-medium">{formatMoney(Number(b.value), sym)}</Td>
                  <Td className="whitespace-nowrap text-xs text-[#665749]">{formatDate(b.updatedAt, true)}</Td>
                  <Td>
                    <div className="flex flex-col items-start gap-1">
                      <BagStatusBadge status={b.status} />
                      {b.orderNumber && <span className="text-[11px] text-[#665749]">{b.orderNumber}</span>}
                    </div>
                  </Td>
                  <Td className="text-right" onClick={(e) => e.stopPropagation()}>
                    {b.status !== "converted" && (
                      <IconButton label="Delete bag" onClick={() => void remove(b)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
        {data && Number(data.total) > 0 && <Pagination page={page} limit={LIMIT} total={Number(data.total)} onPage={setPage} />}
      </Card>
      <p className="mt-3 text-xs text-[#8a7a6a]">Value is the current price of the items in the bag, before bespoke fees and shipping.</p>
    </>
  );
}
