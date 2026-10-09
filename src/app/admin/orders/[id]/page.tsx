"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Mail, MapPin, Phone, Printer, Save, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { formatDate, humanize } from "@/lib/admin/format";
import type { AdminOrder } from "@/lib/admin/types";
import type { OrderStatus } from "@/lib/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { CustomizationDetails, hasCustomization } from "@/components/admin/Customization";
import { ORDER_STATUSES, OrderStatusBadge, PAYMENT_STATUSES, PaymentBadge, orderStatusColor, orderStatusLabel, paymentMethodLabel } from "@/components/admin/status";
import { Badge, Button, ButtonLink, Card, CardHeader, EmptyState, ErrorState, Notice, PageHeader, SkeletonRows, Thumb } from "@/components/admin/ui";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const valid = /^\d+$/.test(id ?? "");
  const { data: order, error, reload, setData } = useAdminQuery<AdminOrder>(valid ? `/orders/${id}` : null);
  const back = { href: "/admin/orders", label: "Orders" };

  if (!valid || error?.status === 404) {
    return (
      <>
        <PageHeader title="Order not found" back={back} />
        <Card>
          <EmptyState title="This order doesn't exist" action={<ButtonLink href="/admin/orders">Back to orders</ButtonLink>} />
        </Card>
      </>
    );
  }
  if (error && !order) {
    return (
      <>
        <PageHeader title="Order" back={back} />
        <Card>
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      </>
    );
  }
  if (!order) {
    return (
      <>
        <PageHeader title="Order" back={back} />
        <Card>
          <SkeletonRows rows={10} />
        </Card>
      </>
    );
  }

  return <OrderView order={order} onChange={setData} />;
}

function OrderView({ order, onChange }: { order: AdminOrder; onChange: (o: AdminOrder) => void }) {
  const sym = order.totalLabel?.split(" ")[0] || "₹";
  const money = (n: number) => formatMoney(n, sym);
  const addr = order.shippingAddress ?? ({} as AdminOrder["shippingAddress"]);
  const items = order.items ?? [];
  const bespokeCount = items.filter((i) => hasCustomization(i.customization as Record<string, unknown> | null)).length;

  return (
    <>
      <PageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            {order.orderNumber}
            <OrderStatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus} />
          </span>
        }
        description={`Placed ${formatDate(order.createdAt, true)} · ${paymentMethodLabel(order.paymentMethod)}`}
        back={{ href: "/admin/orders", label: "Orders" }}
        actions={
          <Button onClick={() => window.print()} icon={<Printer className="h-4 w-4" />}>
            Print job sheet
          </Button>
        }
      />

      {/* Print-only header */}
      <div className="mb-6 hidden border-b-2 border-black pb-3 print:block">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-serif-luxury text-2xl font-bold tracking-[0.2em]">SUITOHOLIC</p>
            <p className="text-xs uppercase tracking-[0.2em]">Tailor job sheet</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-lg font-bold">{order.orderNumber}</p>
            <p>Placed {formatDate(order.createdAt, true)}</p>
            <p>
              Status: {orderStatusLabel(order.status)} · Payment: {humanize(order.paymentStatus)} ({paymentMethodLabel(order.paymentMethod)})
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px] print:block">
        <div className="min-w-0 space-y-6 print:space-y-4">
          <Card className="print:border-black">
            <CardHeader
              title={`Items (${items.reduce((s, i) => s + i.quantity, 0)})`}
              description={bespokeCount ? `${bespokeCount} bespoke line${bespokeCount === 1 ? "" : "s"} — measurements below` : undefined}
            />
            <ul className="divide-y divide-[#EEF0F3]">
              {items.map((item) => (
                <li key={item.id} className="space-y-3 px-4 py-4 sm:px-5 print:break-inside-avoid">
                  <div className="flex gap-3">
                    <Thumb src={item.image} className="h-20 w-16 print:h-16 print:w-12" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          {item.productId ? (
                            <Link href={`/admin/products/${item.productId}`} className="font-semibold hover:text-[#9E774C]">
                              {item.name}
                            </Link>
                          ) : (
                            <p className="font-semibold">{item.name}</p>
                          )}
                          <p className="text-xs text-[#8B93A1]">/{item.slug}</p>
                        </div>
                        <p className="font-semibold">{money(item.lineTotal)}</p>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B7280]">
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
                      </div>
                    </div>
                  </div>
                  <CustomizationDetails customization={item.customization as Record<string, unknown> | null} />
                </li>
              ))}
              {items.length === 0 && <li className="px-5 py-6 text-sm text-[#6B7280]">No line items.</li>}
            </ul>
            <dl className="space-y-1.5 border-t border-[#EEF0F3] bg-[#F9FAFB] px-4 py-4 text-sm sm:px-5 print:bg-white">
              <TotalRow label="Subtotal" value={money(order.subtotal)} />
              <TotalRow label="Bespoke tailoring" value={money(order.customizationTotal)} />
              <TotalRow label="Shipping" value={order.shippingFee ? money(order.shippingFee) : "Free"} />
              {order.discount > 0 && <TotalRow label="Discount" value={`− ${money(order.discount)}`} />}
              <div className="flex justify-between border-t border-[#E5E7EB] pt-2 text-base font-semibold">
                <dt>Total</dt>
                <dd>{order.totalLabel || money(order.total)}</dd>
              </div>
            </dl>
          </Card>

          {order.notes && (
            <Card className="print:border-black">
              <CardHeader title="Customer notes" />
              <p className="whitespace-pre-wrap px-4 py-3 text-sm sm:px-5">{order.notes}</p>
            </Card>
          )}
          {order.adminNotes && (
            <div className="hidden print:block">
              <p className="text-xs font-semibold uppercase">Internal notes</p>
              <p className="whitespace-pre-wrap text-sm">{order.adminNotes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6 print:mt-4 print:grid print:grid-cols-2 print:gap-4 print:space-y-0">
          <Card className="print:border-black">
            <CardHeader title="Customer" />
            <div className="space-y-2 px-4 py-4 text-sm sm:px-5">
              <p className="font-semibold">{order.customer?.name}</p>
              {order.customer?.email && (
                <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 text-[#6B7280] hover:text-[#9E774C]">
                  <Mail className="h-4 w-4 shrink-0 print:hidden" /> {order.customer.email}
                </a>
              )}
              {order.customer?.phone && (
                <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-[#6B7280] hover:text-[#9E774C]">
                  <Phone className="h-4 w-4 shrink-0 print:hidden" /> {order.customer.phone}
                </a>
              )}
            </div>
          </Card>
          <Card className="print:border-black">
            <CardHeader title="Shipping address" />
            <div className="flex gap-2 px-4 py-4 text-sm leading-6 sm:px-5">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#9E774C] print:hidden" />
              <address className="not-italic">
                {addr.line1}
                {addr.line2 && (
                  <>
                    <br />
                    {addr.line2}
                  </>
                )}
                <br />
                {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}
                <br />
                {addr.country}
              </address>
            </div>
          </Card>

          <div className="space-y-6 print:hidden">
            <StatusUpdater order={order} onChange={onChange} />
            <AdminNotes order={order} onChange={onChange} />
            {order.cartId && (
              <Link href={`/admin/bags/${order.cartId}`} className="flex items-center gap-2 text-xs text-[#9E774C] hover:underline">
                <ShoppingBag className="h-3.5 w-3.5" /> View the bag this order came from
              </Link>
            )}
          </div>
          <History order={order} />
        </div>
      </div>
    </>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#6B7280]">
      <dt>{label}</dt>
      <dd className="text-[#14110E]">{value}</dd>
    </div>
  );
}

function StatusUpdater({ order, onChange }: { order: AdminOrder; onChange: (o: AdminOrder) => void }) {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [payment, setPayment] = useState<string>(order.paymentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const isCancelled = order.status === "cancelled";
  const changed = status !== order.status || payment !== order.paymentStatus || note.trim() !== "";

  const save = async () => {
    if (status === "cancelled" && order.status !== "cancelled") {
      const ok = await confirm({
        title: `Cancel ${order.orderNumber}?`,
        message: "Cancelling is final — the order can't be reopened. Stock is returned for tracked products.",
        confirmLabel: "Cancel order",
        danger: true,
      });
      if (!ok) return;
    }
    setSaving(true);
    try {
      const body: Record<string, string> = {};
      if (status !== order.status) body.status = status;
      if (payment !== order.paymentStatus) body.paymentStatus = payment;
      if (note.trim()) body.note = note.trim();
      const updated = await request<AdminOrder>(`/orders/${order.id}`, { method: "PATCH", body });
      onChange(updated);
      setStatus(updated.status);
      setPayment(updated.paymentStatus);
      setNote("");
      toast.success("Order updated");
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Update order" />
      <div className="space-y-4 px-4 py-4 sm:px-5">
        {isCancelled && <Notice tone="red">This order is cancelled. Cancelled orders can&apos;t be reopened.</Notice>}
        <SelectField
          label="Order status"
          value={status}
          disabled={isCancelled}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          options={ORDER_STATUSES.map((s) => ({ value: s, label: orderStatusLabel(s) }))}
        />
        <SelectField label="Payment status" value={payment} onChange={(e) => setPayment(e.target.value)} options={PAYMENT_STATUSES.map((s) => ({ value: s, label: humanize(s) }))} />
        <TextField
          label="Note for the timeline"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={status !== order.status ? "e.g. Measurements verified" : "Optional"}
          hint="Saved to the status history. Customers may see it when tracking."
          maxLength={1000}
        />
        <Button variant="primary" className="w-full" disabled={!changed} loading={saving} onClick={() => void save()} icon={<Save className="h-4 w-4" />}>
          Update order
        </Button>
      </div>
    </Card>
  );
}

function AdminNotes({ order, onChange }: { order: AdminOrder; onChange: (o: AdminOrder) => void }) {
  const request = useAdminApi();
  const toast = useToast();
  const [notes, setNotes] = useState(order.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const dirty = notes !== (order.adminNotes ?? "");

  const save = async () => {
    setSaving(true);
    try {
      const updated = await request<AdminOrder>(`/orders/${order.id}`, { method: "PATCH", body: { adminNotes: notes } });
      onChange(updated);
      toast.success("Notes saved");
    } catch (err) {
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Internal notes" description="Only visible to the team." />
      <div className="space-y-3 px-4 py-4 sm:px-5">
        <TextAreaField value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} maxLength={5000} placeholder="Fitting notes, courier details…" />
        <Button size="sm" disabled={!dirty} loading={saving} onClick={() => void save()}>
          Save notes
        </Button>
      </div>
    </Card>
  );
}

function History({ order }: { order: AdminOrder }) {
  const history = [...(order.history ?? [])].reverse();
  return (
    <Card className="print:hidden">
      <CardHeader title="Status history" />
      {history.length === 0 ? (
        <p className="px-5 py-4 text-sm text-[#6B7280]">No history yet.</p>
      ) : (
        <ol className="relative space-y-4 px-4 py-4 sm:px-5">
          {history.map((h, i) => (
            <li key={i} className="relative flex gap-3">
              {i < history.length - 1 && <span className="absolute left-[5px] top-4 h-[calc(100%+4px)] w-px bg-[#E5E7EB]" aria-hidden />}
              <span className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full ring-2 ring-white" style={{ background: orderStatusColor[h.status] ?? "#9E774C" }} />
              <div className="min-w-0">
                <p className="text-sm font-semibold">{orderStatusLabel(h.status)}</p>
                {h.note && <p className="text-sm text-[#374151]">{h.note}</p>}
                <p className="text-xs text-[#8B93A1]">
                  {formatDate(h.createdAt, true)}
                  {h.changedBy ? ` · ${h.changedBy}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
