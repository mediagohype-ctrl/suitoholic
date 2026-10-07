"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Package, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/api";
import { qs, useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { initialParam } from "@/lib/admin/format";
import type { AdminCategory, AdminProduct, Paginated } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { Toggle, inputClass } from "@/components/admin/fields";
import { Badge, ButtonLink, Card, EmptyState, ErrorState, IconButton, PageHeader, Pagination, SkeletonRows, TableWrap, Td, Th, Thumb, cn } from "@/components/admin/ui";

const LIMIT = 50;

export default function ProductsPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState(() => initialParam("category"));
  const [visibility, setVisibility] = useState<"" | "active" | "hidden" | "featured" | "low">("");
  const [page, setPage] = useState(1);
  const categories = useAdminQuery<AdminCategory[]>("/categories");
  const { data, error, loading, reload, setData } = useAdminQuery<Paginated<AdminProduct>>(`/products${qs({ search: term, category, page, limit: LIMIT })}`);

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const catTitle = (key: string) => categories.data?.find((c) => c.id === key)?.shortTitle || categories.data?.find((c) => c.id === key)?.title || key;

  const patchLocal = (p: AdminProduct) => setData((d) => (d ? { ...d, items: d.items.map((x) => (x.id === p.id ? { ...x, ...p } : x)) } : d!));

  const toggleActive = async (p: AdminProduct) => {
    patchLocal({ ...p, active: !p.active });
    try {
      const updated = await request<AdminProduct>(`/products/${p.id}`, { method: "PATCH", body: { active: !p.active } });
      if (updated) patchLocal(updated);
      toast.success(`${p.name} is now ${!p.active ? "visible" : "hidden"}`);
    } catch (err) {
      patchLocal(p);
      toast.error(err);
    }
  };

  const remove = async (p: AdminProduct) => {
    const ok = await confirm({
      title: `Delete “${p.name}”?`,
      message: "The product is removed from the store. Past orders keep their line items. Consider hiding it instead.",
      confirmLabel: "Delete product",
      danger: true,
    });
    if (!ok) return;
    try {
      await request(`/products/${p.id}`, { method: "DELETE" });
      setData((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== p.id), total: Number(d.total) - 1 } : d!));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  const items = (data?.items ?? []).filter((p) => {
    if (visibility === "active") return p.active;
    if (visibility === "hidden") return !p.active;
    if (visibility === "featured") return p.featured;
    if (visibility === "low") return p.stock !== null && p.stock <= 5;
    return true;
  });

  return (
    <>
      <PageHeader
        title="Products"
        description="Every shirt, trouser and polo in the catalog, including hidden ones."
        actions={
          <ButtonLink href="/admin/products/new" variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add product
          </ButtonLink>
        }
      />
      <Card>
        <div className="flex flex-col gap-2 border-b border-[#EFE5D8] p-3 sm:flex-row sm:items-center sm:p-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8998a]" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search name, slug, fabric…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select
            className={cn(inputClass, "sm:w-56")}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.shortTitle || c.title}
              </option>
            ))}
          </select>
          <select className={cn(inputClass, "sm:w-44")} value={visibility} onChange={(e) => setVisibility(e.target.value as typeof visibility)} aria-label="Filter by visibility">
            <option value="">Any status</option>
            <option value="active">Visible</option>
            <option value="hidden">Hidden</option>
            <option value="featured">Featured</option>
            <option value="low">Low stock (≤ 5)</option>
          </select>
        </div>

        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={8} />
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title={term || category || visibility ? "No products match these filters" : "No products yet"}
            action={!term && !category && !visibility ? <ButtonLink href="/admin/products/new" variant="primary">Add your first product</ButtonLink> : undefined}
          />
        ) : (
          <TableWrap className={cn(loading && "opacity-60")}>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Category</Th>
                <Th className="text-right">Price</Th>
                <Th className="text-right">Stock</Th>
                <Th>Badges</Th>
                <Th>Visible</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className={cn("hover:bg-[#FCF9F5]", !p.active && "bg-[#FCFAF7]")}>
                  <Td>
                    <div className="flex min-w-[220px] items-center gap-3">
                      <Thumb src={p.image} className={cn("h-12 w-12", !p.active && "opacity-50")} />
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.id}`} className="block truncate font-medium hover:text-[#9E774C]">
                          {p.name}
                        </Link>
                        <p className="truncate text-xs text-[#8a7a6a]">/{p.slug}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-xs text-[#665749]">{catTitle(p.category)}</Td>
                  <Td className="text-right">
                    <span className="font-medium">{formatMoney(p.rawPrice)}</span>
                    {p.compareAtPrice ? <p className="text-xs text-[#a8998a] line-through">{formatMoney(p.compareAtPrice)}</p> : null}
                  </Td>
                  <Td className="text-right">
                    {p.stock === null ? (
                      <span className="text-xs text-[#665749]">Made to order</span>
                    ) : (
                      <span className={cn("font-medium tabular-nums", p.stock === 0 ? "text-[#B4402F]" : p.stock <= 5 ? "text-[#8A5A00]" : "")}>{p.stock}</span>
                    )}
                  </Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {p.featured && (
                        <Badge tone="bronze">
                          <Star className="h-3 w-3" /> Featured
                        </Badge>
                      )}
                      {p.customizable && <Badge tone="purple">Bespoke</Badge>}
                      {p.tag && <Badge>{p.tag}</Badge>}
                    </div>
                  </Td>
                  <Td>
                    <Toggle checked={p.active} onChange={() => void toggleActive(p)} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end">
                      <Link href={`/admin/products/${p.id}`} title="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#665749] hover:bg-[#F5EFE6] hover:text-[#14110E]">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <IconButton label="Delete" onClick={() => void remove(p)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
        {data && Number(data.total) > LIMIT && <Pagination page={page} limit={LIMIT} total={Number(data.total)} onPage={setPage} />}
      </Card>
    </>
  );
}
