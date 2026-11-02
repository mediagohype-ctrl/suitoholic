"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
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
import { MediaPickerModal, MediaPreview, cleanMediaUrl } from "./media";
import { Badge, Button, Card, CardHeader, IconButton, Notice, cn } from "./ui";

export interface ImageStepDef {
  step: number;
  breadcrumb: string;
  title: string;
  subtitle: string;
  shortLabel: string;
}

export const PRODUCT_IMAGE_STEPS: ImageStepDef[] = [
  {
    step: 1,
    breadcrumb: "CHEST SIZE",
    title: "SELECT YOUR CHEST SIZE",
    subtitle: "Choose your chest size for the perfect fit. Primary photo shown on catalog cards.",
    shortLabel: "Chest Size",
  },
  {
    step: 2,
    breadcrumb: "BODY TYPE",
    title: "CHOOSE YOUR BODY TYPE",
    subtitle: "Find the fit that matches your body shape and comfort preference.",
    shortLabel: "Body Type",
  },
  {
    step: 3,
    breadcrumb: "HEIGHT",
    title: "SELECT YOUR HEIGHT",
    subtitle: "Choose the height option that fits you.",
    shortLabel: "Height",
  },
  {
    step: 4,
    breadcrumb: "SLEEVES",
    title: "SELECT YOUR SLEEVES",
    subtitle: "Choose the sleeve type that you prefer.",
    shortLabel: "Sleeves",
  },
  {
    step: 5,
    breadcrumb: "COLLAR & DETAILS",
    title: "COLLAR, CUFFS & DETAILS",
    subtitle: "Customize collar style, wrist cuffs, and personalized monogram initials.",
    shortLabel: "Collar & Details",
  },
  {
    step: 6,
    breadcrumb: "REVIEW & ADD TO BAG",
    title: "REVIEW & CONFIRM BESPOKE FIT",
    subtitle: "Verify your bespoke specifications before adding to bag.",
    shortLabel: "Review & Confirm",
  },
];

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
  stepImages: string[];
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

function initStepImages(p?: AdminProduct | null): string[] {
  const steps = ["", "", "", "", "", ""];
  if (!p) return steps;

  if (p.gallery && p.gallery.length >= 6) {
    return p.gallery.slice(0, 6).map(cleanMediaUrl);
  }

  const pool = [cleanMediaUrl(p.image), ...(p.gallery ? p.gallery.map(cleanMediaUrl) : [])].filter(Boolean);
  for (let i = 0; i < pool.length && i < 6; i++) {
    steps[i] = pool[i];
  }
  return steps;
}

function toForm(p?: AdminProduct | null): FormState {
  const stepImages = initStepImages(p);
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
    fit: p?.fit ?? "Regular Fit",
    selectedChest: 40,
    selectedBodyType: "regular",
    selectedHeight: "regular",
    selectedSleeve: "full",
    stepImages,
    image: stepImages[0] || cleanMediaUrl(p?.image ?? ""),
    gallery: p?.gallery ? p.gallery.map(cleanMediaUrl) : stepImages.filter(Boolean),
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
  const cleanedSteps = f.stepImages.map((s) => cleanMediaUrl(s.trim()));
  const primaryImage = cleanedSteps[0] || cleanMediaUrl(f.image.trim());

  const galleryItems = cleanedSteps.filter(Boolean);
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
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

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

  const setStepImage = (idx: number, url: string) => {
    const cleaned = cleanMediaUrl(url);
    setForm((f) => {
      const updated = [...f.stepImages];
      updated[idx] = cleaned;
      return {
        ...f,
        stepImages: updated,
        image: idx === 0 ? cleaned : f.image || cleaned,
      };
    });
    setErrors((e) => {
      const next = { ...e };
      delete next[`stepImage_${idx}`];
      delete next.image;
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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const local: Record<string, string> = {};
    if (!form.name.trim()) local.name = "Product name is required";
    if (!form.category) local.category = "Category is required";
    if (form.price === "" || Number(form.price) < 0) local.price = "Valid price is required";

    // Only Step 1 image is required as the primary card image! Steps 2-6 are optional
    const primaryImg = (form.stepImages[0] || form.image).trim();
    if (!primaryImg) {
      local.stepImage_0 = "Step 1 (Select Your Chest Size) primary image is required";
      local.image = "Please upload at least Step 1 (Chest Size) image.";
    }

    form.colorways.forEach((c, i) => {
      if (!c.name.trim()) local[`colorways.${i}.name`] = "Name is required";
      if (!/^#[0-9a-fA-F]{3,8}$/.test(c.hex.trim())) local[`colorways.${i}.hex`] = "Use a hex colour like #FFFFFF";
    });

    if (Object.keys(local).length) {
      setErrors(local);
      toast.error(local.stepImage_0 ? "Please upload Step 1 (Chest Size) image!" : "Please fix the highlighted fields.");
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

  const completedStepsCount = form.stepImages.filter((s) => !!s.trim()).length;

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

          {/* Section 3: Bespoke Customization Specs */}
          <Card>
            <CardHeader
              title="Bespoke Tailoring Specifications"
              description="Configure collar, cuffs, body type, and chest sizing for bespoke customizer orders."
            />
            <div className="space-y-5 p-4 sm:p-5">
              {/* Chest Sizes */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-[#14110E] uppercase">
                  Primary Chest Fit (Inches)
                </label>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
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
                          "flex flex-col items-center justify-center rounded-lg border py-2 text-center transition cursor-pointer",
                          isSelected
                            ? "border-[#14110E] bg-[#14110E] text-white shadow-xs"
                            : "border-[#E5E7EB] bg-white text-[#14110E] hover:border-[#9E774C]"
                        )}
                      >
                        <span className="text-sm font-bold">{c.size}&quot;</span>
                        <span className={cn("text-[9px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>{c.collar}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="mb-2 block text-xs font-bold tracking-wider text-[#14110E] uppercase">
                  Body Silhouette Fit
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {BODY_TYPE_OPTIONS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        set("selectedBodyType", b.id);
                        set("fit", `${b.title} (Chest ${form.selectedChest}")`);
                      }}
                      className={cn(
                        "rounded-lg border p-3 text-left transition cursor-pointer",
                        form.selectedBodyType === b.id
                          ? "border-[#14110E] bg-[#14110E] text-white"
                          : "border-[#E5E7EB] bg-white text-[#14110E] hover:border-[#9E774C]"
                      )}
                    >
                      <p className="text-xs font-bold">{b.title}</p>
                      <p className={cn("mt-0.5 text-[10px]", form.selectedBodyType === b.id ? "text-neutral-300" : "text-[#6B7280]")}>{b.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collar & Cuff Specs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-[#F3F4F6]">
                <SelectField
                  label="Collar Style"
                  value={form.collar}
                  onChange={(e) => set("collar", e.target.value)}
                  options={COLLAR_OPTIONS.map((c) => ({ value: c, label: c }))}
                />
                <SelectField
                  label="Cuff Style"
                  value={form.cuff}
                  onChange={(e) => set("cuff", e.target.value)}
                  options={CUFF_OPTIONS.map((c) => ({ value: c, label: c }))}
                />
                <TextField label="Fabric Composition" value={form.fabric} onChange={(e) => set("fabric", e.target.value)} error={errors.fabric} />
                <TextField label="Thread Count / Ply" value={form.threadCount} onChange={(e) => set("threadCount", e.target.value)} error={errors.threadCount} />
              </div>
            </div>
          </Card>

          {/* ========================================================================= */}
          {/* SECTION 4: 6-STEP IMAGE UPLOAD (STARTING WITH SELECT YOUR CHEST SIZE)     */}
          {/* ========================================================================= */}
          <Card>
            <CardHeader
              title="Product Images & Customizer Visuals (6-Step Match)"
              description="Upload images corresponding to each customer bespoke fit step. Step 1 (Chest Size) is the primary image shown on catalog cards."
              actions={
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const first = form.stepImages.find((s) => !!s.trim()) || form.image.trim();
                      if (first) {
                        setForm((f) => ({
                          ...f,
                          stepImages: [first, first, first, first, first, first],
                          image: first,
                          gallery: [first],
                        }));
                        toast.success("Applied Step 1 photo across all 6 steps");
                      } else {
                        toast.error("Please upload at least Step 1 (Chest Size) photo first.");
                      }
                    }}
                  >
                    Use Step 1 for all steps
                  </Button>
                  <Badge tone={completedStepsCount > 0 ? "green" : "amber"}>
                    {completedStepsCount === 6 ? "✓ All 6 Steps Complete" : `${completedStepsCount} of 6 Uploaded`}
                  </Badge>
                </div>
              }
            />
            <div className="p-4 sm:p-5">
              {errors.stepImages && <Notice tone="red" className="mb-4">{errors.stepImages}</Notice>}

              {/* 6 Step Upload Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PRODUCT_IMAGE_STEPS.map((stepDef, idx) => {
                  const val = form.stepImages[idx] || "";
                  const isFilled = !!val.trim();
                  const isPrimary = idx === 0;
                  const stepError = errors[`stepImage_${idx}`];

                  return (
                    <div
                      key={stepDef.step}
                      className={cn(
                        "flex flex-col justify-between rounded-xl border p-4 transition-all bg-white shadow-xs",
                        stepError
                          ? "border-[#B4402F] ring-1 ring-[#B4402F] bg-[#FFFBFB]"
                          : isFilled
                          ? "border-[#C6E0CB] hover:border-[#2F6B3B]"
                          : "border-[#E5E7EB] hover:border-[#9E774C]"
                      )}
                    >
                      <div>
                        {/* Step Header Badge */}
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                              isFilled
                                ? "bg-[#EAF5EC] text-[#2F6B3B] border-[#C6E0CB]"
                                : "bg-[#FDF3DC] text-[#8A5A00] border-[#F1DBA6]"
                            )}
                          >
                            Step {stepDef.step} of 6 • {stepDef.breadcrumb}
                          </span>
                          {isPrimary ? (
                            <span className="text-[10px] font-bold text-[#B4402F]">
                              Required *
                            </span>
                          ) : isFilled ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2F6B3B]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#8B93A1]">
                              Optional
                            </span>
                          )}
                        </div>

                        {/* Step Title & Subtitle */}
                        <h4 className="text-xs font-bold text-[#14110E] uppercase tracking-wide leading-snug">
                          {stepDef.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-[#6B7280] leading-snug">
                          {stepDef.subtitle}
                        </p>
                      </div>

                      {/* Image Preview & Picker */}
                      <div className="mt-4 flex items-center gap-3 border-t border-[#F3F4F6] pt-3">
                        <button
                          type="button"
                          onClick={() => setActiveStepIndex(idx)}
                          className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#9E774C] transition"
                          title="Click to choose or upload"
                        >
                          <MediaPreview src={val} className="h-full w-full aspect-square rounded-none border-0" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {isFilled ? "Change" : "Upload"}
                          </div>
                        </button>

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <input
                            className={cn(inputClass, "h-8 text-xs")}
                            value={val}
                            placeholder="Storefront path or /api/r/…"
                            onChange={(e) => setStepImage(idx, e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant={isFilled ? "secondary" : "primary"}
                              className="h-7 text-xs px-2.5"
                              onClick={() => setActiveStepIndex(idx)}
                              icon={<ImagePlus className="h-3 w-3" />}
                            >
                              {isFilled ? "Replace" : "Upload / Choose"}
                            </Button>
                            {isFilled && (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs px-2 text-[#6B7280] hover:text-[#B4402F]"
                                onClick={() => setStepImage(idx, "")}
                                icon={<X className="h-3 w-3" />}
                              >
                                Clear
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {stepError && (
                        <p className="mt-2 text-[11px] font-semibold text-[#B4402F]">
                          {stepError}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Section 5: Colorways */}
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

      {/* Media Picker Modal for Step Image Selection */}
      <MediaPickerModal
        open={activeStepIndex !== null}
        onClose={() => setActiveStepIndex(null)}
        title={
          activeStepIndex !== null
            ? `Choose Image for Step ${activeStepIndex + 1} (${PRODUCT_IMAGE_STEPS[activeStepIndex].breadcrumb}): ${PRODUCT_IMAGE_STEPS[activeStepIndex].title}`
            : "Choose an image"
        }
        onSelect={(url) => {
          if (activeStepIndex !== null) {
            setStepImage(activeStepIndex, url);
          }
        }}
      />

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
  const mainImage = form.stepImages[0] || form.image;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-[#E5E7EB] bg-white", !form.active && "opacity-60")}>
      <div className="relative">
        <MediaPreview src={mainImage} className="aspect-[4/5] rounded-none border-0" />
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
