"use client";

import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";
import { humanize } from "@/lib/admin/format";
import { Badge, type BadgeTone } from "./ui";

export const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "in_tailoring", "shipped", "delivered", "cancelled"];
export const PAYMENT_STATUSES = ["pending", "paid", "refunded", "failed"] as const;

const orderTones: Record<string, BadgeTone> = {
  pending: "amber",
  confirmed: "blue",
  in_tailoring: "purple",
  shipped: "bronze",
  delivered: "green",
  cancelled: "red",
};

const paymentTones: Record<string, BadgeTone> = { pending: "amber", paid: "green", refunded: "purple", failed: "red" };
const bagTones: Record<string, BadgeTone> = { active: "green", abandoned: "amber", converted: "blue" };
const inquiryTones: Record<string, BadgeTone> = { new: "bronze", in_progress: "blue", closed: "neutral" };

export const orderStatusLabel = (s: string) => ORDER_STATUS_LABELS[s as OrderStatus] ?? humanize(s);

export function OrderStatusBadge({ status }: { status: string }) {
  return <Badge tone={orderTones[status] ?? "neutral"}>{orderStatusLabel(status)}</Badge>;
}

export function PaymentBadge({ status }: { status: string }) {
  return <Badge tone={paymentTones[status] ?? "neutral"}>{humanize(status)}</Badge>;
}

export function BagStatusBadge({ status }: { status: string }) {
  return <Badge tone={bagTones[status] ?? "neutral"}>{humanize(status)}</Badge>;
}

export function InquiryStatusBadge({ status }: { status: string }) {
  return <Badge tone={inquiryTones[status] ?? "neutral"}>{humanize(status)}</Badge>;
}

export const orderStatusColor: Record<string, string> = {
  pending: "#C9962B",
  confirmed: "#3E78B2",
  in_tailoring: "#7D58A8",
  shipped: "#9E774C",
  delivered: "#3F8A4F",
  cancelled: "#B4402F",
};

export const paymentMethodLabel = (m: string) => (m === "cod" ? "Cash on delivery" : m === "upi" ? "UPI" : humanize(m || ""));
