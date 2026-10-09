"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowDown, ArrowUp, Home, Pencil, Plus, Tags, Trash2 } from "lucide-react";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import type { AdminCategory } from "@/lib/admin/types";
import { Modal, useConfirm, useToast } from "@/components/admin/feedback";
import { ErrorList, NumberField, TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/media";
import { Badge, Button, Card, EmptyState, ErrorState, IconButton, Notice, PageHeader, SkeletonRows, TableWrap, Td, Th, Thumb, cn } from "@/components/admin/ui";

interface CatForm {
  key: string;
  title: string;
  shortTitle: string;
  mobileTitle: string[];
  subtitle: string;
  homeTitle: string;
  description: string;
  tag: string;
  image: string;
  bgImage: string;
  showOnHome: boolean;
  sortOrder: number | "";
  active: boolean;
}

const toForm = (c?: AdminCategory | null, nextSort = 0): CatForm => ({
  key: c?.id ?? "",
  title: c?.title ?? "",
  shortTitle: c?.shortTitle ?? "",
  mobileTitle: c?.mobileTitle?.length ? [...c.mobileTitle] : [""],
  subtitle: c?.subtitle ?? "",
  homeTitle: c?.homeTitle ?? "",
  description: c?.description ?? "",
  tag: c?.tag ?? "",
  image: c?.image ?? "",
  bgImage: c?.bgImage ?? "",
  showOnHome: c?.showOnHome ?? false,
  sortOrder: c?.sortOrder ?? nextSort,
  active: c?.active ?? true,
});

export default function CategoriesPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const { data, error, reload, setData } = useAdminQuery<AdminCategory[]>("/categories");
  const [editing, setEditing] = useState<{ category: AdminCategory | null } | null>(null);

  const sorted = [...(data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

  const replaceLocal = (c: AdminCategory) => setData((list) => (list ?? []).map((x) => (x.id === c.id ? { ...x, ...c } : x)));

  const patch = async (c: AdminCategory, body: Partial<CatForm>, success?: string) => {
    try {
      const updated = await request<AdminCategory>(`/categories/${encodeURIComponent(c.id)}`, { method: "PATCH", body });
      replaceLocal(updated);
      if (success) toast.success(success);
    } catch (err) {
      toast.error(err);
      reload();
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const a = sorted[index];
    const b = sorted[index + dir];
    if (!a || !b) return;
    // Renumber the whole list so equal sort orders can be swapped reliably.
    const order = sorted.map((c) => c.id);
    [order[index], order[index + dir]] = [order[index + dir], order[index]];
    const changes = order.map((id, i) => ({ c: sorted.find((x) => x.id === id)!, sortOrder: i + 1 })).filter(({ c, sortOrder }) => c.sortOrder !== sortOrder);
    setData((list) => (list ?? []).map((x) => ({ ...x, sortOrder: changes.find((ch) => ch.c.id === x.id)?.sortOrder ?? x.sortOrder })));
    try {
      await Promise.all(changes.map(({ c, sortOrder }) => request(`/categories/${encodeURIComponent(c.id)}`, { method: "PATCH", body: { sortOrder } })));
    } catch (err) {
      toast.error(err);
      reload();
    }
  };

  const remove = async (c: AdminCategory) => {
    const ok = await confirm({
      title: `Delete “${c.title}”?`,
      message: c.productCount ? `It still has ${c.productCount} product(s) — move or delete them first.` : "This can't be undone.",
      confirmLabel: "Delete category",
      danger: true,
    });
    if (!ok) return;
    try {
      await request(`/categories/${encodeURIComponent(c.id)}`, { method: "DELETE" });
      setData((list) => (list ?? []).filter((x) => x.id !== c.id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <>
      <PageHeader
        title="Categories"
        description="Shop categories. Categories with “Show on home” appear as homepage collection carousels."
        actions={
          <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setEditing({ category: null })}>
            Add category
          </Button>
        }
      />
      <Card>
        {error && !data ? (
          <ErrorState message={error.message} onRetry={reload} />
        ) : !data ? (
          <SkeletonRows rows={6} />
        ) : sorted.length === 0 ? (
          <EmptyState icon={<Tags className="h-5 w-5" />} title="No categories yet" action={<Button onClick={() => setEditing({ category: null })}>Add category</Button>} />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th className="w-20">Order</Th>
                <Th>Category</Th>
                <Th className="text-right">Products</Th>
                <Th>Homepage</Th>
                <Th>Visible</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={c.id} className="hover:bg-[#F9FAFB]">
                  <Td>
                    <div className="flex items-center">
                      <IconButton label="Move up" disabled={i === 0} onClick={() => void move(i, -1)} className="h-7 w-7">
                        <ArrowUp className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton label="Move down" disabled={i === sorted.length - 1} onClick={() => void move(i, 1)} className="h-7 w-7">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex min-w-[240px] items-center gap-3">
                      <Thumb src={c.image} className={cn("h-12 w-12", !c.active && "opacity-50")} />
                      <div className="min-w-0">
                        <button type="button" onClick={() => setEditing({ category: c })} className="block truncate text-left font-medium hover:text-[#9E774C]">
                          {c.title}
                        </button>
                        <p className="truncate text-xs text-[#8B93A1]">
                          {c.id}
                          {c.shortTitle ? ` · ${c.shortTitle}` : ""}
                        </p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-right">
                    <Link href={`/admin/products?category=${c.id}`} className="font-medium tabular-nums hover:text-[#9E774C]">
                      {c.productCount ?? 0}
                    </Link>
                  </Td>
                  <Td>
                    <button type="button" onClick={() => void patch(c, { showOnHome: !c.showOnHome }, c.showOnHome ? "Removed from homepage" : "Shown on homepage")}>
                      {c.showOnHome ? (
                        <Badge tone="bronze">
                          <Home className="h-3 w-3" /> On homepage
                        </Badge>
                      ) : (
                        <Badge>Not shown</Badge>
                      )}
                    </button>
                  </Td>
                  <Td>
                    <Toggle checked={c.active} onChange={(v) => void patch(c, { active: v }, v ? "Category visible" : "Category hidden")} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end">
                      <IconButton label="Edit" onClick={() => setEditing({ category: c })}>
                        <Pencil className="h-4 w-4" />
                      </IconButton>
                      <IconButton label="Delete" onClick={() => void remove(c)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Card>

      <CategoryModal
        open={!!editing}
        category={editing?.category ?? null}
        nextSort={(sorted.at(-1)?.sortOrder ?? 0) + 1}
        onClose={() => setEditing(null)}
        onSaved={(c, created) => {
          setData((list) => (created ? [...(list ?? []), c] : (list ?? []).map((x) => (x.id === (editing?.category?.id ?? c.id) ? { ...x, ...c } : x))));
          setEditing(null);
        }}
      />
    </>
  );
}

function CategoryModal({
  open,
  category,
  nextSort,
  onClose,
  onSaved,
}: {
  open: boolean;
  category: AdminCategory | null;
  nextSort: number;
  onClose: () => void;
  onSaved: (c: AdminCategory, created: boolean) => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={category ? `Edit ${category.title}` : "New category"} size="lg">
      {open && <CategoryFormBody key={category?.id ?? "new"} category={category} nextSort={nextSort} onClose={onClose} onSaved={onSaved} />}
    </Modal>
  );
}

function CategoryFormBody({
  category,
  nextSort,
  onClose,
  onSaved,
}: {
  category: AdminCategory | null;
  nextSort: number;
  onClose: () => void;
  onSaved: (c: AdminCategory, created: boolean) => void;
}) {
  const request = useAdminApi();
  const toast = useToast();
  const [form, setForm] = useState(() => toForm(category, nextSort));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof CatForm>(k: K, v: CatForm[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) {
      setErrors({ title: "Title is required" });
      return;
    }
    setSaving(true);
    setErrors({});
    const body = {
      ...(form.key.trim() ? { key: form.key.trim() } : {}),
      title: form.title.trim(),
      shortTitle: form.shortTitle,
      mobileTitle: form.mobileTitle.map((s) => s.trim()).filter(Boolean).slice(0, 3),
      subtitle: form.subtitle,
      homeTitle: form.homeTitle,
      description: form.description,
      tag: form.tag,
      image: form.image.trim(),
      bgImage: form.bgImage.trim(),
      showOnHome: form.showOnHome,
      sortOrder: form.sortOrder === "" ? 0 : Math.round(Number(form.sortOrder)),
      active: form.active,
    };
    try {
      const saved = category
        ? await request<AdminCategory>(`/categories/${encodeURIComponent(category.id)}`, { method: "PATCH", body })
        : await request<AdminCategory>("/categories", { method: "POST", body });
      toast.success(category ? "Category saved" : "Category created");
      onSaved({ productCount: category?.productCount ?? 0, ...saved }, !category);
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(Object.keys(fe).length ? fe : { _: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const generalErrors = Object.fromEntries(Object.entries(errors).filter(([k]) => !(k in form)));

  return (
    <div className="space-y-5">
      {errors._ ? <Notice tone="red">{errors._}</Notice> : <ErrorList errors={generalErrors} />}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} error={errors.title} className="sm:col-span-2" placeholder="EXCLUSIVE FORMAL SHIRTS" />
        <TextField
          label="Key"
          value={form.key}
          onChange={(e) => set("key", e.target.value.toLowerCase())}
          error={errors.key}
          hint={category ? "Used in /shop?category=… URLs." : "Lowercase a–z, 0–9, - and _. Leave empty to generate from the title."}
          placeholder="formal_shirts"
        />
        <NumberField label="Sort order" value={form.sortOrder} onValue={(v) => set("sortOrder", v)} error={errors.sortOrder} step={1} />
      </section>

      <fieldset className="space-y-4 rounded-xl border border-[#EEF0F3] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-[#9E774C]">Shop page</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Short title" value={form.shortTitle} onChange={(e) => set("shortTitle", e.target.value)} error={errors.shortTitle} placeholder="FORMAL SHIRTS" />
          <TextField label="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} error={errors.subtitle} />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-[#374151]">Mobile title lines (up to 3)</p>
          <div className="space-y-2">
            {form.mobileTitle.map((line, i) => (
              <div key={i} className="flex gap-2">
                <TextField
                  value={line}
                  onChange={(e) => set("mobileTitle", form.mobileTitle.map((l, idx) => (idx === i ? e.target.value : l)))}
                  error={errors[`mobileTitle.${i}`]}
                  className="flex-1"
                  placeholder={`Line ${i + 1}`}
                />
                <IconButton label="Remove line" onClick={() => set("mobileTitle", form.mobileTitle.filter((_, idx) => idx !== i))} className="mt-1">
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </div>
            ))}
            {form.mobileTitle.length < 3 && (
              <Button size="sm" variant="ghost" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => set("mobileTitle", [...form.mobileTitle, ""])}>
                Add line
              </Button>
            )}
          </div>
        </div>
        <ImageField label="Card image" value={form.image} onChange={(v) => set("image", v)} error={errors.image} />
      </fieldset>

      <fieldset className="space-y-4 rounded-xl border border-[#EEF0F3] p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-[#9E774C]">Homepage collection</legend>
        <Toggle checked={form.showOnHome} onChange={(v) => set("showOnHome", v)} label="Show on homepage" description="Adds a collection carousel for this category to the homepage." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Homepage title" value={form.homeTitle} onChange={(e) => set("homeTitle", e.target.value)} error={errors.homeTitle} />
          <TextField label="Tag line" value={form.tag} onChange={(e) => set("tag", e.target.value)} error={errors.tag} placeholder="COLLECTION 01 • …" />
        </div>
        <TextAreaField label="Description" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} />
        <ImageField label="Background image" value={form.bgImage} onChange={(v) => set("bgImage", v)} error={errors.bgImage} />
      </fieldset>

      <Toggle checked={form.active} onChange={(v) => set("active", v)} label="Visible in store" />

      <div className="flex justify-end gap-2 border-t border-[#EEF0F3] pt-4">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="primary" loading={saving} onClick={() => void save()}>
          {category ? "Save category" : "Create category"}
        </Button>
      </div>
    </div>
  );
}
