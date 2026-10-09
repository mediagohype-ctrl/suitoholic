"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/format";
import type { AdminBag, AdminOrder, Paginated } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { CustomizationDetails, hasCustomization } from "@/components/admin/Customization";
import { BagStatusBadge } from "@/components/admin/status";
import { Badge, Button, ButtonLink, Card, CardHeader, EmptyState, ErrorState, PageHeader, SkeletonRows, Thumb } from "@/components/admin/ui";

export default function BagDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const valid = /^[0-9a-f-]{36}$/i.test(id ?? "");
  const { data: bag, error, reload } = useAdminQuery<AdminBag>(valid ? `/carts/${id}` : null);
  const linked = useAdminQuery<Paginated<AdminOrder>>(
    bag?.status === "converted" && bag.email ? `/orders?limit=100&search=${encodeURIComponent(bag.email)}` : null,
  );
  const order = linked.data?.items.find((o) => o.cartId === bag?.id);
  const back = { href: "/admin/bags", label: "Bags" };

  if (!valid || error?.status === 404) {
    return (
      <>
        <PageHeader title="Bag not found" back={back} />
        <Card>
          <EmptyState title="This bag doesn't exist" description="It may have been deleted." action={<ButtonLink href="/admin/bags">Back to bags</ButtonLink>} />
        </Card>
      </>
    );
  }
  if (!bag) {
    return (
      <>
        <PageHeader title="Bag" back={back} />
        <Card>{error ? <ErrorState message={error.message} onRetry={reload} /> : <SkeletonRows rows={6} />}</Card>
      </>
    );
  }

  const sym = bag.currencySymbol || "₹";
  const money = (n: number) => formatMoney(n, sym);

  const remove = async () => {
    const ok = await confirm({ title: "Delete this bag?", message: "All items in it are removed. This can't be undone.", confirmLabel: "Delete bag", danger: true });
    if (!ok) return;
    try {
      await request(`/carts/${bag.id}`, { method: "DELETE" });
      toast.success("Bag deleted");
      router.replace("/admin/bags");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            Bag <span className="font-mono text-xl">{bag.id.slice(0, 8)}</span>
            <BagStatusBadge status={bag.status} />
          </span>
        }
        description={
          <>
            {bag.email || "Guest shopper"} · created {formatDate(bag.createdAt, true)} · last activity {formatDate(bag.updatedAt, true)}
          </>
        }
        back={back}
        actions={
          bag.status !== "converted" ? (
            <Button variant="danger" onClick={() => void remove()} icon={<Trash2 className="h-4 w-4" />}>
              Delete bag
            </Button>
          ) : (
            order ? (
            <ButtonLink href={`/admin/orders/${order.id}`} variant="primary">
              View order {order.orderNumber}
            </ButtonLink>
          ) : null
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader title={`Items (${bag.itemCount})`} />
          {bag.items.length === 0 ? (
            <EmptyState title="This bag is empty" />
          ) : (
            <ul className="divide-y divide-[#EEF0F3]">
              {bag.items.map((item) => (
                <li key={item.id} className="space-y-3 px-4 py-4 sm:px-5">
                  <div className="flex gap-3">
                    <Thumb src={item.image} className="h-20 w-16" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link href={`/admin/products/${item.productId}`} className="font-semibold hover:text-[#9E774C]">
                            {item.name}
                          </Link>
                          <p className="text-xs text-[#8B93A1]">/{item.slug}</p>
                        </div>
                        <p className="font-semibold">{item.lineTotalLabel || money(item.lineTotal)}</p>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B7280]">
                        <span>
                          Qty <strong className="text-[#14110E]">{item.quantity}</strong>
                        </span>
                        {item.size && (
                          <span>
                            Size <strong className="text-[#14110E]">{item.size}</strong>
                          </span>
                        )}
                        <span>Unit {money(item.unitPrice)}</span>
                        {item.customizationFee > 0 && <span>Bespoke fee {money(item.customizationFee)}</span>}
                        {hasCustomization(item.customization as Record<string, unknown> | null) ? <Badge tone="purple">Bespoke</Badge> : <Badge>Standard</Badge>}
                        {!item.available && (
                          <Badge tone="red">
                            <AlertTriangle className="h-3 w-3" /> Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CustomizationDetails customization={item.customization as Record<string, unknown> | null} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="xl:self-start">
          <CardHeader title="Totals" description="Calculated with current prices and settings." />
          <dl className="space-y-1.5 px-4 py-4 text-sm sm:px-5">
            <Row label="Subtotal" value={money(bag.subtotal)} />
            <Row label="Bespoke tailoring" value={money(bag.customizationTotal)} />
            <Row label="Shipping" value={bag.shippingFee ? money(bag.shippingFee) : "Free"} />
            <div className="flex justify-between border-t border-[#E5E7EB] pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd>{bag.totalLabel || money(bag.total)}</dd>
            </div>
          </dl>
          {bag.email && (
            <div className="border-t border-[#EEF0F3] px-4 py-3 sm:px-5">
              <a href={`mailto:${bag.email}`} className="text-xs font-medium text-[#9E774C] hover:underline">
                Email {bag.email}
              </a>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#6B7280]">
      <dt>{label}</dt>
      <dd className="text-[#14110E]">{value}</dd>
    </div>
  );
}
