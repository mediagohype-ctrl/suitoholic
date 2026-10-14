"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Layers, Pencil, Plus, Scissors, Search, Trash2 } from "lucide-react";
import { qs, useAdminApi, useAdminQuery } from "@/lib/admin/api";
import type { AdminFabric, Paginated } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { Toggle, inputClass } from "@/components/admin/fields";
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  ErrorState,
  IconButton,
  PageHeader,
  Pagination,
  SkeletonRows,
  TableWrap,
  Td,
  Th,
  Thumb,
  cn,
} from "@/components/admin/ui";
import { CATEGORY_OPTIONS } from "@/components/admin/FabricForm";

const LIMIT = 50;

export default function FabricsPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();

  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [visibility, setVisibility] = useState<"" | "active" | "hidden">("");
  const [page, setPage] = useState(1);

  const { data, error, loading, reload, setData } = useAdminQuery<Paginated<AdminFabric>>(
    `/fabrics${qs({ search: term, category: category !== "all" ? category : undefined, page, limit: LIMIT })}`,
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const patchLocal = (f: AdminFabric) =>
    setData((d) => (d ? { ...d, items: d.items.map((x) => (x.id === f.id ? { ...x, ...f } : x)) } : d!));

  const toggleActive = async (f: AdminFabric) => {
    patchLocal({ ...f, active: !f.active });
    try {
      const updated = await request<AdminFabric>(`/fabrics/${f.id}`, { method: "PATCH", body: { active: !f.active } });
      if (updated) patchLocal(updated);
      toast.success(`${f.name} is now ${!f.active ? "visible" : "hidden"} on website`);
    } catch (err) {
      patchLocal(f);
      toast.error(err);
    }
  };

  const remove = async (f: AdminFabric) => {
    const ok = await confirm({
      title: `Delete fabric "${f.name}"?`,
      message: `Code: ${f.code}. This fabric will be removed from the catalog. Past orders will not be affected.`,
      confirmLabel: "Delete fabric",
      danger: true,
    });
    if (!ok) return;
    try {
      await request(`/fabrics/${f.id}`, { method: "DELETE" });
      setData((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== f.id), total: Number(d.total) - 1 } : d!));
      toast.success("Fabric deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  const allItems = data?.items ?? [];
  const filteredItems = allItems.filter((f) => {
    if (visibility === "active") return f.active;
    if (visibility === "hidden") return !f.active;
    return true;
  });

  const totalCount = Number(data?.total ?? 0);
  const activeCount = allItems.filter((x) => x.active).length;

  return (
    <>
      <PageHeader
        title="Fabrics"
        description="Manage the luxury fabric collection, textures, specifications, and website swatches."
        actions={
          <ButtonLink href="/admin/fabrics/new" variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add fabric
          </ButtonLink>
        }
      />

      {/* Quick summary stats */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF5EE] text-[#9E774C]">
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#6B7280]">Total Fabrics</p>
            <p className="text-xl font-bold text-[#14110E]">{totalCount || allItems.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF7ED] text-[#2E7D32]">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#6B7280]">Visible on Website</p>
            <p className="text-xl font-bold text-[#2E7D32]">{activeCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F5FF] text-[#1D4ED8]">
            <span className="text-sm font-bold">5</span>
          </div>
          <div>
            <p className="text-xs font-medium text-[#6B7280]">Categories</p>
            <p className="text-sm font-semibold text-[#14110E]">Linen, Oxford, Silk, Wool, Stripes</p>
          </div>
        </div>
      </div>

      <Card>
        {/* Search & Filter Toolbar */}
        <div className="flex flex-col gap-2 border-b border-[#EEF0F3] p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              className={cn(inputClass, "pl-9")}
              placeholder="Search by fabric name, code (e.g. OX-140), material…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className={cn(inputClass, "sm:w-52")}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <select
            className={cn(inputClass, "sm:w-44")}
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as typeof visibility)}
            aria-label="Filter by visibility"
          >
            <option value="">Any Status</option>
            <option value="active">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={8} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={<Scissors className="h-5 w-5" />}
            title={term || category !== "all" || visibility ? "No fabrics match your search" : "No fabrics yet"}
            action={
              !term && category === "all" && !visibility ? (
                <ButtonLink href="/admin/fabrics/new" variant="primary" icon={<Plus className="h-4 w-4" />}>
                  Add your first fabric
                </ButtonLink>
              ) : undefined
            }
          />
        ) : (
          <TableWrap className={cn(loading && "opacity-60")}>
            <thead>
              <tr>
                <Th>Fabric</Th>
                <Th>Code / SKU</Th>
                <Th>Category</Th>
                <Th>Material & Weave</Th>
                <Th className="text-right">Price</Th>
                <Th className="text-center">Visible</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((f) => (
                <tr key={f.id} className={cn("hover:bg-[#F9FAFB]", !f.active && "bg-[#F9FAFB]")}>
                  <Td>
                    <div className="flex min-w-[200px] items-center gap-3">
                      <Link
                        href={`/admin/fabrics/${f.id}`}
                        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#D5C2AF] transition-transform hover:scale-105"
                        style={{ backgroundColor: f.accentColor || "#FAF8F5" }}
                        title="Edit fabric"
                      >
                        <Thumb src={f.image} className="h-full w-full object-cover" />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/fabrics/${f.id}`}
                          className="font-semibold text-[#14110E] hover:underline"
                        >
                          {f.name}
                        </Link>
                        <p className="truncate text-xs text-[#8B93A1]">
                          {f.shortInfo || f.categoryLabel || "Bespoke Swatch"}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className="rounded-md bg-[#FAF5EE] px-2 py-1 font-mono text-xs font-semibold text-[#7A4B1A]">
                      {f.code}
                    </span>
                  </Td>
                  <Td>
                    <Badge tone="bronze">
                      {CATEGORY_OPTIONS.find((c) => c.value === f.category)?.label || f.categoryLabel || f.category}
                    </Badge>
                  </Td>
                  <Td>
                    <p className="max-w-[240px] truncate text-xs font-medium text-[#14110E]">{f.composition || "—"}</p>
                    <p className="truncate text-[11px] text-[#6B7280]">
                      {f.gsm ? `${f.gsm} · ` : ""}
                      {f.weave || "Crafted weave"}
                    </p>
                  </Td>
                  <Td className="whitespace-nowrap text-right">
                    <p className="text-xs font-semibold text-[#14110E]">{f.price || "—"}</p>
                    {f.compareAtPrice && (
                      <p className="text-[10px] text-[#9CA3AF] line-through">{f.compareAtPrice}</p>
                    )}
                    <div className="flex items-center justify-end gap-1 pt-0.5 text-[10px] text-[#8A5A00]">
                      <span>★</span>
                      <span>{Number(f.rating ?? 5).toFixed(1)}/5</span>
                      <span className="text-[#9CA3AF]">({f.reviewsCount ?? 0})</span>
                    </div>
                  </Td>
                  <Td className="text-center">
                    <Toggle checked={f.active} onChange={() => void toggleActive(f)} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/fabrics/${f.id}`}
                        title="Edit fabric"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#14110E]"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <IconButton
                        label="Delete fabric"
                        onClick={() => void remove(f)}
                        className="hover:bg-[#FBE9E6] hover:text-[#B4402F]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}

        {data && totalCount > LIMIT && <Pagination page={page} limit={LIMIT} total={totalCount} onPage={setPage} />}
      </Card>
    </>
  );
}
