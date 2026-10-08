"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, ImagePlus, Plus, Save, Star, Trash2, X } from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import type { AdminCategory, AdminColorway, AdminProduct, Paginated } from "@/lib/admin/types";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { useConfirm, useToast } from "./feedback";
import { ColorField, ErrorList, NumberField, SelectField, TextAreaField, TextField, Toggle } from "./fields";
import { ImageField, MediaPickerModal, MediaPreview } from "./media";
import { Button, Card, CardHeader, IconButton, Notice, cn } from "./ui";

interface FormState {
  name: string;
  slug: string;
  category: string;
  price: number | "";
  compareAtPrice: number | "";
  subtitle: string;
  description: string;
  fabric: string;
  threadCount: string;
  collar: string;
  cuff: string;
  fit: string;
  image: string;
  gallery: string[];
  colorways: AdminColorway[];
  rating: number | "";
  reviewsCount: number | "";
  tag: string;
  stock: number | "";
  madeToOrder: boolean;
  customizable: boolean;
  featured: boolean;
  active: boolean;
  sortOrder: number | "";
}

function toForm(p?: AdminProduct | null): FormState {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    category: p?.category ?? "",
    price: p?.rawPrice ?? "",
    compareAtPrice: p?.compareAtPrice ?? "",
    subtitle: p?.subtitle ?? "",
    description: p?.description ?? "",
    fabric: p?.fabric ?? "",
    threadCount: p?.threadCount ?? "",
    collar: p?.collar ?? "",
    cuff: p?.cuff ?? "",
    fit: p?.fit ?? "",
    image: p?.image ?? "",
    gallery: p?.gallery ? [...p.gallery] : [],
    colorways: p?.colorways ? p.colorways.map((c) => ({ ...c })) : [],
    rating: p?.rating ?? 5,
    reviewsCount: p?.reviewsCount ?? 0,
    tag: p?.tag ?? "",
    stock: p?.stock ?? "",
    madeToOrder: p ? p.stock === null : true,
    customizable: p?.customizable ?? true,
    featured: p?.featured ?? false,
    active: p?.active ?? true,
    sortOrder: p?.sortOrder ?? 0,
  };
}

function toBody(f: FormState) {
  const int = (v: number | "") => (v === "" ? 0 : Math.round(Number(v)));
  return {
    ...(f.slug.trim() ? { slug: f.slug.trim() } : {}),
    name: f.name.trim(),
    category: f.category,
    price: f.price === "" ? 0 : Number(f.price),
    compareAtPrice: f.compareAtPrice === "" || Number(f.compareAtPrice) === 0 ? null : Number(f.compareAtPrice),
    subtitle: f.subtitle,
    description: f.description,
    fabric: f.fabric,
    threadCount: f.threadCount,
    collar: f.collar,
    cuff: f.cuff,
    fit: f.fit,
    image: f.image.trim(),
    gallery: f.gallery.map((g) => g.trim()).filter(Boolean),
    colorways: f.colorways.map((c) => ({ name: c.name.trim(), hex: c.hex.trim(), productSlug: c.productSlug })),
    rating: f.rating === "" ? 0 : Number(f.rating),
    reviewsCount: int(f.reviewsCount),
    tag: f.tag,
    stock: f.madeToOrder ? null : int(f.stock),
    customizable: f.customizable,
    featured: f.featured,
    active: f.active,
    sortOrder: int(f.sortOrder),
  };
}

export default function ProductForm({ product, onSaved }: { product?: AdminProduct | null; onSaved?: (p: AdminProduct) => void }) {
  const isNew = !product;
  const router = useRouter();
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [baseline, setBaseline] = useState(() => toForm(product));
  const [form, setForm] = useState(baseline);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const categories = useAdminQuery<AdminCategory[]>("/categories");
  const products = useAdminQuery<Paginated<AdminProduct>>("/products?limit=200");

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty && !saving);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const categoryOptions = useMemo(() => {
    const opts = (categories.data ?? []).map((c) => ({ value: c.id, label: `${c.shortTitle || c.title}${c.active ? "" : " (hidden)"}` }));
    if (form.category && !opts.some((o) => o.value === form.category)) opts.unshift({ value: form.category, label: form.category });
    return [{ value: "", label: "Select a category…" }, ...opts];
  }, [categories.data, form.category]);

  const slugOptions = useMemo(() => {
    const opts = (products.data?.items ?? []).map((p) => ({ value: p.slug, label: p.name }));
    return [{ value: "", label: "— No linked product —" }, ...opts];
  }, [products.data]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const local: Record<string, string> = {};
    if (!form.name.trim()) local.name = "Name is required";
    if (!form.category) local.category = "Choose a category";
    if (form.price === "") local.price = "Price is required";
    form.colorways.forEach((c, i) => {
      if (!c.name.trim()) local[`colorways.${i}.name`] = "Name is required";
      if (!/^#[0-9a-fA-F]{3,8}$/.test(c.hex.trim())) local[`colorways.${i}.hex`] = "Use a hex colour like #FFFFFF";
    });
    if (Object.keys(local).length) {
      setErrors(local);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    setErrors({});
    try {
      const body = toBody(form);
      const saved = isNew
        ? await request<AdminProduct>("/products", { method: "POST", body })
        : await request<AdminProduct>(`/products/${product!.id}`, { method: "PATCH", body });
      const next = toForm(saved);
      setBaseline(next);
      setForm(next);
      onSaved?.(saved);
      toast.success(isNew ? "Product created" : "Product saved");
      if (isNew) router.replace(`/admin/products/${saved.id}`);
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(Object.keys(fe).length ? fe : { _: errorMessage(err) });
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product) return;
    const ok = await confirm({ title: `Delete “${product.name}”?`, message: "This can't be undone. Consider hiding the product instead.", confirmLabel: "Delete", danger: true });
    if (!ok) return;
    try {
      await request(`/products/${product.id}`, { method: "DELETE" });
      setBaseline(form);
      toast.success("Product deleted");
      router.replace("/admin/products");
    } catch (err) {
      toast.error(err);
    }
  };

  const moveGallery = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const g = [...f.gallery];
      const j = i + dir;
      if (j < 0 || j >= g.length) return f;
      [g[i], g[j]] = [g[j], g[i]];
      return { ...f, gallery: g };
    });

  const setColorway = (i: number, patch: Partial<AdminColorway>) =>
    setForm((f) => ({ ...f, colorways: f.colorways.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }));

  const moveColorway = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const c = [...f.colorways];
      const j = i + dir;
      if (j < 0 || j >= c.length) return f;
      [c[i], c[j]] = [c[j], c[i]];
      return { ...f, colorways: c };
    });

  return (
    <form onSubmit={submit} className="pb-24">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {errors._ && <Notice tone="red">{errors._}</Notice>}
          {Object.keys(errors).filter((k) => k !== "_").length > 0 && <ErrorList errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k !== "_"))} />}

          <Card>
            <CardHeader title="Basics" />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField label="Name" required value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} className="sm:col-span-2" maxLength={200} />
              <TextField
                label="URL slug"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value.toLowerCase())}
                error={errors.slug}
                hint={isNew ? "Leave empty to generate from the name." : "Changing the slug changes the product URL."}
                placeholder="royal-white-twill-shirt"
                aside={
                  !isNew && form.slug ? (
                    <a href={`/product/${form.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#9E774C] hover:underline">
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : undefined
                }
              />
              <SelectField label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} options={categoryOptions} error={errors.category} />
              <TextField label="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} error={errors.subtitle} className="sm:col-span-2" maxLength={300} />
              <TextAreaField label="Description" rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} className="sm:col-span-2" maxLength={5000} />
              <TextField label="Tag / ribbon" value={form.tag} onChange={(e) => set("tag", e.target.value)} error={errors.tag} placeholder="e.g. FORMAL ICON" maxLength={80} />
              <NumberField label="Sort order" value={form.sortOrder} onValue={(v) => set("sortOrder", v)} error={errors.sortOrder} hint="Lower numbers show first." step={1} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Pricing & inventory" />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <NumberField label="Price" value={form.price} onValue={(v) => set("price", v)} error={errors.price} min={0} step="any" required />
              <NumberField
                label="Compare-at price"
                value={form.compareAtPrice}
                onValue={(v) => set("compareAtPrice", v)}
                error={errors.compareAtPrice}
                min={0}
                step="any"
                hint="Shown struck-through. Leave empty for no sale price."
              />
              <div className="space-y-3 sm:col-span-2">
                <Toggle
                  checked={form.madeToOrder}
                  onChange={(v) => set("madeToOrder", v)}
                  label="Made to order"
                  description="No stock tracking — every piece is cut on demand."
                />
                {!form.madeToOrder && (
                  <NumberField label="Units in stock" value={form.stock} onValue={(v) => set("stock", v)} error={errors.stock} min={0} step={1} className="sm:max-w-xs" />
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Fabric & construction" />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField label="Fabric" value={form.fabric} onChange={(e) => set("fabric", e.target.value)} error={errors.fabric} />
              <TextField label="Thread count" value={form.threadCount} onChange={(e) => set("threadCount", e.target.value)} error={errors.threadCount} />
              <TextField label="Collar" value={form.collar} onChange={(e) => set("collar", e.target.value)} error={errors.collar} />
              <TextField label="Cuff" value={form.cuff} onChange={(e) => set("cuff", e.target.value)} error={errors.cuff} />
              <TextField label="Fit" value={form.fit} onChange={(e) => set("fit", e.target.value)} error={errors.fit} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Images" description="Main image is used on cards; the gallery appears on the product page." />
            <div className="space-y-5 p-4 sm:p-5">
              <ImageField label="Main image" value={form.image} onChange={(v) => set("image", v)} error={errors.image} previewClassName="h-28 w-24" />
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-[#374151]">Gallery ({form.gallery.length}/20)</p>
                  <div className="flex gap-2">
                    {form.image && !form.gallery.includes(form.image) && (
                      <Button size="sm" variant="ghost" onClick={() => set("gallery", [form.image, ...form.gallery])}>
                        Add main image
                      </Button>
                    )}
                    <Button size="sm" onClick={() => setPickerOpen(true)} disabled={form.gallery.length >= 20} icon={<ImagePlus className="h-3.5 w-3.5" />}>
                      Add image
                    </Button>
                  </div>
                </div>
                {errors.gallery && <p className="mb-2 text-xs text-[#B4402F]">{errors.gallery}</p>}
                {form.gallery.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-[#E5E7EB] px-3 py-6 text-center text-xs text-[#8B93A1]">No gallery images yet.</p>
                ) : (
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {form.gallery.map((src, i) => (
                      <li key={`${src}-${i}`} className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                        <MediaPreview src={src} className="aspect-[4/5] rounded-none border-0" />
                        <div className="flex items-center justify-between border-t border-[#EEF0F3] px-1 py-1">
                          <span className="px-1 text-[11px] text-[#8B93A1]">#{i + 1}</span>
                          <div className="flex">
                            <IconButton label="Move left" disabled={i === 0} onClick={() => moveGallery(i, -1)} className="h-7 w-7">
                              <ArrowUp className="h-3.5 w-3.5 -rotate-90" />
                            </IconButton>
                            <IconButton label="Move right" disabled={i === form.gallery.length - 1} onClick={() => moveGallery(i, 1)} className="h-7 w-7">
                              <ArrowDown className="h-3.5 w-3.5 -rotate-90" />
                            </IconButton>
                            <IconButton label="Remove" onClick={() => set("gallery", form.gallery.filter((_, idx) => idx !== i))} className="h-7 w-7 hover:text-[#B4402F]">
                              <X className="h-3.5 w-3.5" />
                            </IconButton>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Colourways"
              description="Swatches shown on the product page; each can link to the product in that colour."
              actions={
                <Button
                  size="sm"
                  onClick={() => set("colorways", [...form.colorways, { name: "", hex: "#FFFFFF", productSlug: product?.slug ?? "" }])}
                  disabled={form.colorways.length >= 20}
                  icon={<Plus className="h-3.5 w-3.5" />}
                >
                  Add colourway
                </Button>
              }
            />
            <div className="space-y-3 p-4 sm:p-5">
              {form.colorways.length === 0 && <p className="text-xs text-[#8B93A1]">No colourways. Add one to show colour swatches.</p>}
              {form.colorways.map((c, i) => (
                <div key={i} className="grid grid-cols-1 gap-3 rounded-lg border border-[#EEF0F3] bg-[#F9FAFB] p-3 sm:grid-cols-[1fr_180px_1fr_auto] sm:items-start">
                  <TextField label="Name" value={c.name} onChange={(e) => setColorway(i, { name: e.target.value })} error={errors[`colorways.${i}.name`]} placeholder="Crisp Royal White" />
                  <ColorField label="Colour" value={c.hex} onChange={(v) => setColorway(i, { hex: v })} error={errors[`colorways.${i}.hex`]} />
                  <SelectField
                    label="Links to product"
                    value={c.productSlug}
                    onChange={(e) => setColorway(i, { productSlug: e.target.value })}
                    options={slugOptions.some((o) => o.value === c.productSlug) ? slugOptions : [...slugOptions, { value: c.productSlug, label: c.productSlug }]}
                    error={errors[`colorways.${i}.productSlug`]}
                  />
                  <div className="flex items-center gap-0.5 sm:pt-6">
                    <IconButton label="Move up" disabled={i === 0} onClick={() => moveColorway(i, -1)}>
                      <ArrowUp className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Move down" disabled={i === form.colorways.length - 1} onClick={() => moveColorway(i, 1)}>
                      <ArrowDown className="h-4 w-4" />
                    </IconButton>
                    <IconButton label="Remove" onClick={() => set("colorways", form.colorways.filter((_, idx) => idx !== i))} className="hover:text-[#B4402F]">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Reviews" description="Displayed rating and review count." />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <NumberField label="Rating (0–5)" value={form.rating} onValue={(v) => set("rating", v)} error={errors.rating} min={0} max={5} step={0.1} />
              <NumberField label="Reviews count" value={form.reviewsCount} onValue={(v) => set("reviewsCount", v)} error={errors.reviewsCount} min={0} step={1} />
            </div>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader title="Visibility" />
            <div className="space-y-4 p-4 sm:p-5">
              <Toggle checked={form.active} onChange={(v) => set("active", v)} label="Visible in store" description="Hidden products can't be bought." />
              <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" description="Highlighted in collections." />
              <Toggle checked={form.customizable} onChange={(v) => set("customizable", v)} label="Bespoke customizable" description="Shows the 6-step fit customizer." />
            </div>
          </Card>
          <Card>
            <CardHeader title="Live preview" />
            <div className="p-4 sm:p-5">
              <PreviewCard form={form} categoryLabel={categoryOptions.find((o) => o.value === form.category)?.label} />
            </div>
          </Card>
        </div>
      </div>

      <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => set("gallery", [...form.gallery, url])} />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur lg:left-64 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B7280]">{dirty ? <span className="font-medium text-[#8A5A00]">Unsaved changes</span> : isNew ? "New product" : "All changes saved"}</p>
          <div className="flex gap-2">
            {!isNew && (
              <Button variant="ghost" onClick={() => void remove()} icon={<Trash2 className="h-4 w-4" />} className="text-[#B4402F] hover:text-[#B4402F]">
                Delete
              </Button>
            )}
            {dirty && (
              <Button onClick={() => setForm(baseline)} disabled={saving}>
                Discard
              </Button>
            )}
            <Button type="submit" variant="primary" loading={saving} disabled={!dirty && !isNew} icon={<Save className="h-4 w-4" />}>
              {isNew ? "Create product" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function PreviewCard({ form, categoryLabel }: { form: FormState; categoryLabel?: string }) {
  const price = form.price === "" ? 0 : Number(form.price);
  const compare = form.compareAtPrice === "" ? 0 : Number(form.compareAtPrice);
  const rating = form.rating === "" ? 0 : Number(form.rating);
  return (
    <div className={cn("overflow-hidden rounded-xl border border-[#E5E7EB] bg-white", !form.active && "opacity-60")}>
      <div className="relative">
        <MediaPreview src={form.image} className="aspect-[4/5] rounded-none border-0" />
        {form.tag && <span className="absolute left-2 top-2 bg-[#14110E] px-2 py-1 text-[9px] font-semibold tracking-[0.15em] text-white">{form.tag}</span>}
        {form.featured && (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[#9E774C]">
            <Star className="h-3.5 w-3.5 fill-current" />
          </span>
        )}
      </div>
      <div className="space-y-1.5 p-3">
        {categoryLabel && form.category && <p className="text-[10px] uppercase tracking-[0.2em] text-[#9E774C]">{categoryLabel}</p>}
        <p className="text-base font-semibold leading-tight">{form.name || "Product name"}</p>
        {form.subtitle && <p className="line-clamp-2 text-xs text-[#6B7280]">{form.subtitle}</p>}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{formatMoney(price)}</span>
          {compare > price && <span className="text-xs text-[#9CA3AF] line-through">{formatMoney(compare)}</span>}
        </div>
        <p className="text-[11px] text-[#6B7280]">
          ★ {rating.toFixed(1)} · {form.reviewsCount || 0} reviews
        </p>
        {form.colorways.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {form.colorways.map((c, i) => (
              <span key={i} title={c.name} className="h-4 w-4 rounded-full border border-[#D1D5DB]" style={{ background: /^#[0-9a-fA-F]{3,8}$/.test(c.hex) ? c.hex : "#fff" }} />
            ))}
          </div>
        )}
        <p className="pt-1 text-[11px] text-[#8B93A1]">{form.madeToOrder ? "Made to order" : `${form.stock || 0} in stock`}</p>
      </div>
    </div>
  );
}
