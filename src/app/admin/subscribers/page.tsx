"use client";

import { useEffect, useState } from "react";
import { Download, Mail, Search, Trash2 } from "lucide-react";
import { downloadFile, qs, useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { formatDate, humanize } from "@/lib/admin/format";
import type { Paginated, Subscriber } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { inputClass } from "@/components/admin/fields";
import { Badge, Button, Card, EmptyState, ErrorState, IconButton, PageHeader, Pagination, SkeletonRows, TableWrap, Td, Th, cn } from "@/components/admin/ui";

const LIMIT = 50;

export default function SubscribersPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const { token, isAdmin } = useAdminAuth();
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const { data, error, loading, reload, setData } = useAdminQuery<Paginated<Subscriber>>(`/subscribers${qs({ search: term, page, limit: LIMIT })}`);

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const exportCsv = async () => {
    setExporting(true);
    try {
      await downloadFile("/subscribers/export", token, `suitoholic-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    } catch (err) {
      toast.error(err);
    } finally {
      setExporting(false);
    }
  };

  const remove = async (s: Subscriber) => {
    const ok = await confirm({ title: `Remove ${s.email}?`, message: "They will no longer receive newsletters.", confirmLabel: "Remove", danger: true });
    if (!ok) return;
    try {
      await request(`/subscribers/${s.id}`, { method: "DELETE" });
      setData((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== s.id), total: Number(d.total) - 1 } : d!));
      toast.success("Subscriber removed");
    } catch (err) {
      toast.error(err);
    }
  };

  const total = Number(data?.total ?? 0);

  return (
    <>
      <PageHeader
        title="Subscribers"
        description={data ? `${total} newsletter subscriber${total === 1 ? "" : "s"}.` : "Newsletter signups from the storefront."}
        actions={
          <Button onClick={() => void exportCsv()} loading={exporting} icon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
        }
      />
      <Card>
        <div className="border-b border-[#EEF0F3] p-3 sm:p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search email…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={6} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={<Mail className="h-5 w-5" />} title={term ? "No matching subscribers" : "No subscribers yet"} />
        ) : (
          <TableWrap className={cn("[&_table]:min-w-[480px]", loading && "opacity-60")}>
            <thead>
              <tr>
                <Th>Email</Th>
                <Th>Source</Th>
                <Th>Subscribed</Th>
                {isAdmin && <Th className="text-right" />}
              </tr>
            </thead>
            <tbody>
              {data.items.map((s) => (
                <tr key={s.id} className="hover:bg-[#F9FAFB]">
                  <Td>
                    <a href={`mailto:${s.email}`} className="font-medium hover:text-[#9E774C]">
                      {s.email}
                    </a>
                  </Td>
                  <Td>
                    <Badge>{humanize(s.source || "website")}</Badge>
                  </Td>
                  <Td className="text-xs text-[#6B7280]">{formatDate(s.createdAt, true)}</Td>
                  {isAdmin && (
                    <Td className="text-right">
                      <IconButton label="Remove" onClick={() => void remove(s)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </Td>
                  )}
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
        {data && total > 0 && <Pagination page={page} limit={LIMIT} total={total} onPage={setPage} />}
      </Card>
    </>
  );
}
