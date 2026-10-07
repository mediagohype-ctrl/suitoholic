"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin, MessageSquare, Phone, Search, Trash2 } from "lucide-react";
import { qs, useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { formatDate, humanize } from "@/lib/admin/format";
import type { Inquiry, InquiryStatus, Paginated } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { inputClass } from "@/components/admin/fields";
import { Badge, Card, EmptyState, ErrorState, IconButton, PageHeader, Pagination, SkeletonRows, TableWrap, Tabs, Td, Th, cn, type BadgeTone } from "@/components/admin/ui";

const LIMIT = 25;
const TYPE_LABELS: Record<string, string> = { swatch_request: "Swatch Request", contact: "Contact", appointment: "Appointment", newsletter: "Newsletter" };
const TYPE_TONES: Record<string, BadgeTone> = { swatch_request: "bronze", contact: "blue", appointment: "purple" };
const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];
const typeLabel = (t: string) => TYPE_LABELS[t] ?? humanize(t);

export default function InquiriesPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [status, setStatus] = useState<"" | InquiryStatus>("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload, setData } = useAdminQuery<Paginated<Inquiry>>(`/inquiries${qs({ status, category: type, search: term, page, limit: LIMIT })}`);

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const types = Array.from(new Set(["swatch_request", "contact", ...(type ? [type] : []), ...(data?.items ?? []).map((i) => i.type)]));

  const updateStatus = async (inq: Inquiry, next: InquiryStatus) => {
    setData((d) => (d ? { ...d, items: d.items.map((x) => (x.id === inq.id ? { ...x, status: next } : x)) } : d!));
    try {
      await request(`/inquiries/${inq.id}`, { method: "PATCH", body: { status: next } });
      toast.success(`Marked as ${humanize(next).toLowerCase()}`);
    } catch (err) {
      toast.error(err);
      reload();
    }
  };

  const remove = async (inq: Inquiry) => {
    const ok = await confirm({ title: "Delete this inquiry?", message: `From ${inq.name || inq.email || "unknown"}. This can't be undone.`, confirmLabel: "Delete", danger: true });
    if (!ok) return;
    try {
      await request(`/inquiries/${inq.id}`, { method: "DELETE" });
      setData((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== inq.id), total: Number(d.total) - 1 } : d!));
      toast.success("Inquiry deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader title="Inquiries" description="Fabric swatch requests and contact messages from the storefront." />
      <div className="mb-4">
        <Tabs
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          tabs={[{ value: "" as const, label: "All" }, ...STATUS_OPTIONS]}
        />
      </div>
      <Card>
        <div className="flex flex-col gap-2 border-b border-[#EFE5D8] p-3 sm:flex-row sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8998a]" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search name, email, subject, message…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className={cn(inputClass, "sm:w-52")}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by type"
          >
            <option value="">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {typeLabel(t)}
              </option>
            ))}
          </select>
        </div>
        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={6} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No inquiries" description={status || type || term ? "Nothing matches these filters." : "Swatch requests and messages will appear here."} />
        ) : (
          <TableWrap className={cn("[&_table]:min-w-[860px]", loading && "opacity-60")}>
            <thead>
              <tr>
                <Th>Received</Th>
                <Th>Type</Th>
                <Th>Contact</Th>
                <Th>Subject &amp; message</Th>
                <Th>Status</Th>
                <Th className="text-right" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((inq) => (
                <tr key={inq.id} className={cn("align-top hover:bg-[#FCF9F5]", inq.status === "new" && "bg-[#FFFCF7]")}>
                  <Td className="whitespace-nowrap align-top text-xs text-[#665749]">{formatDate(inq.createdAt, true)}</Td>
                  <Td className="align-top">
                    <Badge tone={TYPE_TONES[inq.type] ?? "neutral"}>{typeLabel(inq.type)}</Badge>
                  </Td>
                  <Td className="align-top">
                    <p className="font-medium">{inq.name || "—"}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-[#665749]">
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="flex items-center gap-1.5 hover:text-[#9E774C]">
                          <Mail className="h-3 w-3" /> {inq.email}
                        </a>
                      )}
                      {inq.phone && (
                        <a href={`tel:${inq.phone}`} className="flex items-center gap-1.5 hover:text-[#9E774C]">
                          <Phone className="h-3 w-3" /> {inq.phone}
                        </a>
                      )}
                      {inq.address && (
                        <p className="flex items-start gap-1.5">
                          <MapPin className="mt-0.5 h-3 w-3 shrink-0" /> <span className="whitespace-pre-line">{inq.address}</span>
                        </p>
                      )}
                    </div>
                  </Td>
                  <Td className="max-w-md align-top">
                    {inq.subject && <p className="font-medium">{inq.subject}</p>}
                    {inq.message ? <p className="mt-0.5 whitespace-pre-line text-xs leading-5 text-[#3d342b]">{inq.message}</p> : !inq.subject && <span className="text-xs text-[#a8998a]">No message</span>}
                  </Td>
                  <Td className="align-top">
                    <select
                      className={cn(inputClass, "h-8 w-36 py-1 text-xs")}
                      value={inq.status}
                      onChange={(e) => void updateStatus(inq, e.target.value as InquiryStatus)}
                      aria-label="Status"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td className="text-right align-top">
                    <IconButton label="Delete" onClick={() => void remove(inq)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
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
