"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ExternalLink,
  ImagePlus,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import type { AdminCategory, AdminColorway, AdminProduct, Paginated } from "@/lib/admin/types";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { useConfirm, useToast } from "./feedback";
import { ColorField, ErrorList, NumberField, SelectField, TextAreaField, TextField, Toggle, inputClass } from "./fields";
import { ImageField, MediaPickerModal, MediaPreview, cleanMediaUrl } from "./media";
import { Button, Card, CardHeader, IconButton, Notice, cn } from "./ui";

export const CHEST_SIZE_OPTIONS = [
  { size: 38, collar: '15.0"', shoulder: '17.5"' },
  { size: 39, collar: '15.25"', shoulder: '17.75"' },
  { size: 40, collar: '15.5"', shoulder: '18.0"' },
  { size: 41, collar: '15.75"', shoulder: '18.25"' },
  { size: 42, collar: '16.0"', shoulder: '18.5"' },
  { size: 44, collar: '16.5"', shoulder: '19.0"' },
  { size: 46, collar: '17.0"', shoulder: '19.5"' },
  { size: 48, collar: '17.5"', shoulder: '20.0"' },
];

export const BODY_TYPE_OPTIONS = [
  { id: "lean", title: "LEAN FIT", desc: "Tapered waist, form-fitting chest & slim sleeves" },
  { id: "regular", title: "REGULAR FIT", desc: "Classic British tailoring with comfortable ease" },
  { id: "tummy", title: "TUMMY COMFORT FIT", desc: "Relaxed midsection with clean shoulder drape" },
];

export const HEIGHT_OPTIONS = [
  { id: "regular", title: "REGULAR HEIGHT (5.5 – 5.7\")", desc: 'Shirt Length: 27.5" · Sleeve: 23.75"' },
  { id: "tall", title: "TALL HEIGHT (5.8 – 5.10\")", desc: 'Shirt Length: 29.0" · Sleeve: 24.5"' },
  { id: "extra_tall", title: "EXTRA TALL (5.11 – 6.2\")", desc: 'Shirt Length: 30.5" · Sleeve: 25.25"' },
];

export const SLEEVE_OPTIONS = [
  { id: "full", title: "FULL SLEEVES", desc: "Classic formal tailored sleeves with barrel or French cuffs" },
  { id: "half", title: "HALF SLEEVES", desc: "Bespoke short sleeves with clean tailored hem" },
];

export const COLLAR_OPTIONS = [
  "English Semi-Spread Collar",
  "Classic Cutaway Collar",
  "Savile Row Point Collar",
  "Button-Down Executive Collar",
  "Mandarin Band Collar",
];

export const CUFF_OPTIONS = [
  "2-Button Rounded Barrel Cuff",
  "French Double Cuff (Cufflinks)",
  "Mitred Executive Single Cuff",
  "Single-Button Classic Cuff",
];

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
  selectedChest: number;
  selectedBodyType: string;
  selectedHeight: string;
  selectedSleeve: string;
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
    fabric: p?.fabric ?? "100% Egyptian Giza Cotton (2-Ply)",
    threadCount: p?.threadCount ?? "140/2 Ne Compact Spun",
    collar: p?.collar ?? "English Semi-Spread Collar",
    cuff: p?.cuff ?? "2-Button Rounded Barrel Cuff",
    fit: p?.fit ?? "Regular Fit (Chest 40\")",
    selectedChest: 40,
    selectedBodyType: "regular",
    selectedHeight: "regular",
    selectedSleeve: "full",
    image: cleanMediaUrl(p?.image ?? ""),
    gallery: p?.gallery ? p.gallery.map(cleanMediaUrl) : [],
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
  const primaryImage = cleanMediaUrl(f.image.trim());
  const galleryItems = f.gallery.map(cleanMediaUrl).filter(Boolean);
  if (primaryImage && !galleryItems.includes(primaryImage)) {
    galleryItems.unshift(primaryImage);
  }

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
    image: primaryImage,
    gallery: galleryItems,
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
  const router = useRouter();
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const isNew = !product;

  const [form, setForm] = useState<FormState>(() => toForm(product));
  const [baseline, setBaseline] = useState<FormState>(() => toForm(product));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showChestSizes, setShowChestSizes] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty);

  const { data: catData } = useAdminQuery<Paginated<AdminCategory>>("/categories?limit=100");
  const categoryOptions = useMemo(
    () => (catData?.items ?? []).filter((c) => c.active).map((c) => ({ value: c.id, label: c.title })),
    [catData]
  );

  const { data: allProds } = useAdminQuery<Paginated<AdminProduct>>("/products?limit=200");
  const slugOptions = useMemo(
    () => (allProds?.items ?? []).filter((p) => p.slug !== product?.slug).map((p) => ({ value: p.slug, label: `${p.name} (${p.slug})` })),
    [allProds, product]
  );

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      delete next._;
      return next;
    });
  };

  const setColorway = (i: number, patch: Partial<AdminColorway>) =>
    setForm((f) => {
      const c = [...f.colorways];
      c[i] = { ...c[i], ...patch };
      return { ...f, colorways: c };
    });

  const addColorway = () =>
    setForm((f) => ({
      ...f,
      colorways: [...f.colorways, { name: "", hex: "#14110E", productSlug: "" }],
    }));

  const removeColorway = (i: number) =>
    setForm((f) => ({
      ...f,
      colorways: f.colorways.filter((_, idx) => idx !== i),
    }));

  const moveColorway = (i: number, delta: number) =>
    setForm((f) => {
      const j = i + delta;
      if (j < 0 || j >= f.colorways.length) return f;
      const c = [...f.colorways];
      [c[i], c[j]] = [c[j], c[i]];
      return { ...f, colorways: c };
    });

  const moveGallery = (i: number, delta: number) =>
    setForm((f) => {
      const j = i + delta;
      if (j < 0 || j >= f.gallery.length) return f;
      const g = [...f.gallery];
      [g[i], g[j]] = [g[j], g[i]];
      return { ...f, gallery: g };
    });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const local: Record<string, string> = {};
    if (!form.name.trim()) local.name = "Product name is required";
    if (!form.category) local.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0) local.price = "Valid price is required";
    if (!form.image.trim()) local.image = "Product image is required";

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
      setBaseline(toForm(saved));
      toast.success(isNew ? "Product created" : "Product saved");
      if (onSaved) onSaved(saved);
      else if (isNew) router.replace(`/admin/products/${saved.id}`);
    } catch (err) {
      const fe = fieldErrors(err);
      if (fe) {
        setErrors(fe);
        toast.error("Please fix the highlighted fields");
      } else {
        const msg = errorMessage(err);
        setErrors({ _: msg });
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!product) return;
    const ok = await confirm({
      title: `Delete product "${product.name}"?`,
      message: `Slug: ${product.slug}. This cannot be undone. You can also set it inactive instead.`,
      confirmLabel: "Delete product",
      danger: true,
    });
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

  return (
    <form onSubmit={submit} className="pb-28">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Column: Form Sections */}
        <div className="min-w-0 space-y-6">
          {errors._ && <Notice tone="red">{errors._}</Notice>}
          {Object.keys(errors).filter((k) => k !== "_").length > 0 && (
            <ErrorList errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k !== "_"))} />
          )}

          {/* Section 1: Basics */}
          <Card>
            <CardHeader title="Basics" description="Product title, URL and categorisation." />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField label="Product name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} required />
              <TextField label="URL slug" value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} error={errors.slug} hint="Leave empty to generate from name." />
              <SelectField label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} options={categoryOptions} error={errors.category} required />
              <TextField label="Badge / Tag" value={form.tag} onChange={(e) => set("tag", e.target.value)} error={errors.tag} placeholder="e.g. LUXURY TWILL, BESTSELLER" />
              <div className="sm:col-span-2">
                <TextField label="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} error={errors.subtitle} placeholder="Short highlight shown under the title" />
              </div>
              <div className="sm:col-span-2">
                <TextAreaField label="Description" value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} rows={4} placeholder="Full fabric notes, weave details and styling advice." />
              </div>
            </div>
          </Card>

          {/* Section 2: Pricing & Inventory */}
          <Card>
            <CardHeader title="Pricing & inventory" />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <NumberField label="Price (₹)" value={form.price} onValue={(v) => set("price", v)} error={errors.price} min={0} step={1} required />
              <NumberField label="Compare-at price (₹)" value={form.compareAtPrice} onValue={(v) => set("compareAtPrice", v)} error={errors.compareAtPrice} min={0} step={1} hint="Shows struck-through price." />
              <div className="sm:col-span-2 space-y-3">
                <Toggle checked={form.madeToOrder} onChange={(v) => set("madeToOrder", v)} label="Made to order" description="Shirt is tailored on demand; no fixed stock limit is tracked." />
                {!form.madeToOrder && (
                  <NumberField label="Stock count" value={form.stock} onValue={(v) => set("stock", v)} error={errors.stock} min={0} step={1} hint="Units available to purchase." />
                )}
              </div>
            </div>
          </Card>

          {/* ========================================================================= */}
          {/* SECTION 3: UPLOAD YOUR IMAGE (WITH SELECT YOUR CHEST SIZE BUTTON)         */}
          {/* ========================================================================= */}
          <Card>
            <CardHeader
              title="Upload Your Image"
              description="Choose image from media library or paste link, and select chest sizing specifications."
            />
            <div className="space-y-5 p-4 sm:p-5">
              {/* Select Your Chest Size Trigger & Expandable Options */}
              <div className="rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#14110E]">
                      Chest Sizing Fit
                    </p>
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      Current Selection: <span className="font-bold text-[#9E774C]">{form.selectedChest}&quot; Chest</span>
                      {form.fit ? ` · ${form.fit}` : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowChestSizes((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#14110E] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer"
                  >
                    <span>Select Your Chest Size</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", showChestSizes && "rotate-180")} />
                  </button>
                </div>

                {/* When Select Your Chest Size button is clicked -> chest size options open */}
                {showChestSizes && (
                  <div className="mt-4 border-t border-[#EAE3D9] pt-4 animate-in fade-in duration-200">
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#8A5A00]">
                      Choose Chest Size (Inches)
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-8">
                      {CHEST_SIZE_OPTIONS.map((c) => {
                        const isSelected = form.selectedChest === c.size;
                        return (
                          <button
                            key={c.size}
                            type="button"
                            onClick={() => {
                              set("selectedChest", c.size);
                              set("fit", `${form.fit.split(" (")[0] || "Regular Fit"} (Chest ${c.size}")`);
                            }}
                            className={cn(
                              "flex flex-col items-center justify-center rounded-lg border py-2.5 px-2 text-center transition cursor-pointer",
                              isSelected
                                ? "border-[#14110E] bg-[#14110E] text-white shadow-xs scale-102"
                                : "border-[#D6CEBF] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                            )}
                          >
                            <span className="text-base font-extrabold">{c.size}&quot;</span>
                            <span className={cn("text-[10px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                              Collar {c.collar}
                            </span>
                            <span className={cn("text-[10px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                              Shld {c.shoulder}
                            </span>
                            {isSelected && (
                              <span className="mt-1 flex items-center gap-0.5 text-[9px] font-bold text-[#9E774C]">
                                <Check className="h-2.5 w-2.5" /> Selected
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Main Product Image Field */}
              <ImageField
                label="Product Image"
                value={form.image}
                onChange={(v) => set("image", v)}
                error={errors.image}
                previewClassName="h-32 w-28"
                hint="Main image shown on catalog cards, bespoke customizer and product detail page."
              />

              {/* Optional Gallery Images */}
              <div className="pt-2 border-t border-[#F3F4F6]">
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
                {form.gallery.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-[#E5E7EB] px-3 py-4 text-center text-xs text-[#8B93A1]">
                    No extra gallery images added.
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    {form.gallery.map((src, i) => (
                      <li key={`${src}-${i}`} className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                        <MediaPreview src={src} className="aspect-square rounded-none border-0" />
                        <div className="flex items-center justify-between border-t border-[#EEF0F3] p-1">
                          <IconButton label="Move left" onClick={() => moveGallery(i, -1)} disabled={i === 0}>
                            <ArrowUp className="h-3 w-3 -rotate-90" />
                          </IconButton>
                          <IconButton label="Move right" onClick={() => moveGallery(i, 1)} disabled={i === form.gallery.length - 1}>
                            <ArrowDown className="h-3 w-3 -rotate-90" />
                          </IconButton>
                          <IconButton label="Remove" onClick={() => set("gallery", form.gallery.filter((_, idx) => idx !== i))}>
                            <Trash2 className="h-3 w-3 text-[#B4402F]" />
                          </IconButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </Card>

          {/* Section 4: Colorways */}
          <Card>
            <CardHeader
              title="Colorways"
              description="Alternative colour swatches shown on the product card."
              actions={
                <Button size="sm" variant="ghost" onClick={addColorway} icon={<Plus className="h-3.5 w-3.5" />}>
                  Add colorway
                </Button>
              }
            />
            <div className="p-4 sm:p-5">
              {form.colorways.length === 0 ? (
                <p className="text-xs text-[#8B93A1]">No colourways added.</p>
              ) : (
                <div className="space-y-3">
                  {form.colorways.map((c, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E5E7EB] p-3">
                      <div className="flex-1 min-w-[140px]">
                        <TextField
                          label="Color Name"
                          value={c.name}
                          onChange={(e) => setColorway(i, { name: e.target.value })}
                          error={errors[`colorways.${i}.name`]}
                          placeholder="e.g. Navy Blue"
                        />
                      </div>
                      <div className="w-36">
                        <ColorField
                          label="Hex code"
                          value={c.hex}
                          onChange={(hex) => setColorway(i, { hex })}
                          error={errors[`colorways.${i}.hex`]}
                        />
                      </div>
                      <div className="flex-1 min-w-[160px]">
                        <SelectField
                          label="Link to Product"
                          value={c.productSlug || ""}
                          onChange={(e) => setColorway(i, { productSlug: e.target.value })}
                          options={[{ value: "", label: "(This product)" }, ...slugOptions]}
                        />
                      </div>
                      <div className="flex items-center gap-1 pt-6">
                        <IconButton
                          label="Move up"
                          onClick={() => moveColorway(i, -1)}
                          disabled={i === 0}
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                          label="Move down"
                          onClick={() => moveColorway(i, 1)}
                          disabled={i === form.colorways.length - 1}
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                          label="Delete"
                          onClick={() => removeColorway(i)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[#B4402F]" />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Section 6: Ratings & Reviews */}
          <Card>
            <CardHeader title="Ratings & reviews" description="Social proof displayed on the product page and cards." />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <NumberField label="Rating (0–5)" value={form.rating} onValue={(v) => set("rating", v)} error={errors.rating} min={0} max={5} step={0.1} />
              <NumberField label="Reviews count" value={form.reviewsCount} onValue={(v) => set("reviewsCount", v)} error={errors.reviewsCount} min={0} step={1} />
            </div>
          </Card>
        </div>

        {/* Right Column: Sticky Sidebar with Visibility & Live Preview */}
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

      {/* Floating Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur lg:left-64 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B7280]">
            {dirty ? (
              <span className="font-medium text-[#8A5A00]">Unsaved changes</span>
            ) : isNew ? (
              "New product"
            ) : (
              "All changes saved"
            )}
          </p>
          <div className="flex gap-2">
            {!isNew && (
              <Button type="button" variant="ghost" onClick={() => void remove()} icon={<Trash2 className="h-4 w-4" />} className="text-[#B4402F] hover:text-[#B4402F]">
                Delete
              </Button>
            )}
            {dirty && (
              <Button type="button" onClick={() => setForm(baseline)} disabled={saving}>
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
