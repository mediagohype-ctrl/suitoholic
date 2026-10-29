"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
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
  title: string;
  easyName: string;
  hint: string;
  shortLabel: string;
}

export const PRODUCT_IMAGE_STEPS: ImageStepDef[] = [
  {
    step: 1,
    title: "Step 1: Front Fabric & Main Look",
    easyName: "Front View (Main Card Photo)",
    hint: "Close-up front view of collar & shirt fabric. This is the main photo shown on catalog cards and product listings.",
    shortLabel: "Front View",
  },
  {
    step: 2,
    title: "Step 2: Full Body & Fit (Mannequin)",
    easyName: "Full Shirt Fit (Silhouette View)",
    hint: "Full-length mannequin or model view showing garment drape, body cut, and overall fit silhouette.",
    shortLabel: "Full Body Fit",
  },
  {
    step: 3,
    title: "Step 3: Collar Style Detail",
    easyName: "Collar Close-Up (Cut & Stitching)",
    hint: "Detailed close-up showing collar spread, band height, and neckline craftsmanship.",
    shortLabel: "Collar Detail",
  },
  {
    step: 4,
    title: "Step 4: Sleeves & Cuffs Detail",
    easyName: "Sleeve & Wrist Cuffs (Buttons)",
    hint: "Close-up view of sleeve fall, cuff barrel/french double style, and button craftsmanship.",
    shortLabel: "Sleeves & Cuffs",
  },
  {
    step: 5,
    title: "Step 5: Back & Tailoring Construction",
    easyName: "Back Tailoring (Yoke & Pleats)",
    hint: "Back view showing shoulder yoke, tailoring pleats, and precise seam finishes.",
    shortLabel: "Back Tailoring",
  },
  {
    step: 6,
    title: "Step 6: Complete Final Look (Review)",
    easyName: "Final Styled Look (Confirmation View)",
    hint: "Complete styled shirt on model or hanger for customer review and bespoke confirmation.",
    shortLabel: "Final Look",
  },
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
    fabric: p?.fabric ?? "",
    threadCount: p?.threadCount ?? "",
    collar: p?.collar ?? "",
    cuff: p?.cuff ?? "",
    fit: p?.fit ?? "",
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
    gallery: cleanedSteps.filter(Boolean),
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
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const categories = useAdminQuery<AdminCategory[]>("/categories");
  const products = useAdminQuery<Paginated<AdminProduct>>("/products?limit=200");

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty && !saving);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const setStepImage = (stepIndex: number, url: string) => {
    setForm((prev) => {
      const nextSteps = [...prev.stepImages];
      nextSteps[stepIndex] = cleanMediaUrl(url);
      return {
        ...prev,
        stepImages: nextSteps,
        image: nextSteps[0] || "",
        gallery: nextSteps.filter(Boolean),
      };
    });
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`stepImage_${stepIndex}`];
      delete copy.stepImages;
      return copy;
    });
  };

  const completedStepsCount = useMemo(() => {
    return form.stepImages.filter((s) => s && s.trim().length > 0).length;
  }, [form.stepImages]);

  const categoryOptions = useMemo(() => {
    const opts = (categories.data ?? []).map((c) => ({
      value: c.id,
      label: `${c.shortTitle || c.title}${c.active ? "" : " (hidden)"}`,
    }));
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

    // Enforce 6 step images requirement
    const missingSteps: { step: number; name: string }[] = [];
    form.stepImages.forEach((img, idx) => {
      if (!img || !img.trim()) {
        missingSteps.push({
          step: idx + 1,
          name: PRODUCT_IMAGE_STEPS[idx].shortLabel,
        });
        local[`stepImage_${idx}`] = `Step ${idx + 1} (${PRODUCT_IMAGE_STEPS[idx].shortLabel}) is required`;
      }
    });

    if (missingSteps.length > 0) {
      local.stepImages = `All 6 step images must be uploaded before saving. Missing: ${missingSteps
        .map((m) => `Step ${m.step} (${m.name})`)
        .join(", ")}`;
    }

    form.colorways.forEach((c, i) => {
      if (!c.name.trim()) local[`colorways.${i}.name`] = "Name is required";
      if (!/^#[0-9a-fA-F]{3,8}$/.test(c.hex.trim())) local[`colorways.${i}.hex`] = "Use a hex colour like #FFFFFF";
    });

    if (Object.keys(local).length) {
      setErrors(local);
      if (missingSteps.length > 0) {
        toast.error(`Please upload all 6 step images! (${missingSteps.length} missing)`);
      } else {
        toast.error("Please fix the highlighted fields.");
      }
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
      toast.success(isNew ? "Product created successfully with all 6 step images" : "Product saved successfully");
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
    const ok = await confirm({
      title: `Delete “${product.name}”?`,
      message: "This can't be undone. Consider hiding the product instead.",
      confirmLabel: "Delete",
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
          {Object.keys(errors).filter((k) => k !== "_").length > 0 && (
            <ErrorList errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k !== "_"))} />
          )}

          <Card>
            <CardHeader title="Basics" description="Product title, URL and categorisation." />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField label="Product name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} required />
              <TextField label="URL slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} error={errors.slug} hint="Leave empty to generate from name." />
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

          {/* 6-Step Image Upload Section */}
          <Card>
            <CardHeader
              title="6-Step Customization Images (All 6 Required)"
              description="Upload an image for each of the 6 bespoke stages below. Just like the 6-step bespoke customizer, all 6 steps must be uploaded before adding this product."
              actions={
                <Badge tone={completedStepsCount === 6 ? "green" : "amber"}>
                  {completedStepsCount === 6 ? "✓ All 6 Steps Complete" : `${completedStepsCount} of 6 Uploaded`}
                </Badge>
              }
            />
            <div className="space-y-5 p-4 sm:p-5">
              {/* Progress Bar & Status */}
              <div className="rounded-xl border border-[#EEF0F3] bg-[#F9FAFB] p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#374151]">
                    Required Images Progress:{" "}
                    <strong className={completedStepsCount === 6 ? "text-[#2F6B3B]" : "text-[#9E774C]"}>
                      {completedStepsCount} of 6 Completed
                    </strong>
                  </span>
                  <span className="font-semibold text-[#8B93A1]">
                    {Math.round((completedStepsCount / 6) * 100)}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      completedStepsCount === 6 ? "bg-[#2F6B3B]" : "bg-[#9E774C]"
                    )}
                    style={{ width: `${(completedStepsCount / 6) * 100}%` }}
                  />
                </div>
                {errors.stepImages && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#FBE9E6] p-2.5 text-xs font-medium text-[#A3352A]">
                    <AlertCircle className="h-4 w-4 shrink-0 text-[#A3352A] mt-0.5" />
                    <span>{errors.stepImages}</span>
                  </div>
                )}
              </div>

              {/* 6 Step Upload Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PRODUCT_IMAGE_STEPS.map((stepDef, idx) => {
                  const val = form.stepImages[idx] || "";
                  const isFilled = !!val.trim();
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
                              "rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase",
                              isFilled
                                ? "bg-[#E8F3EA] text-[#2F6B3B] border-[#C6E0CB]"
                                : "bg-[#FDF3DC] text-[#8A5A00] border-[#F1DBA6]"
                            )}
                          >
                            Step {stepDef.step} of 6
                          </span>
                          {isFilled ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2F6B3B]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-[#B4402F]">
                              Required *
                            </span>
                          )}
                        </div>

                        {/* Step Title & Hint */}
                        <h4 className="text-xs font-bold text-[#14110E] leading-snug">
                          {stepDef.easyName}
                        </h4>
                        <p className="mt-1 text-[11px] text-[#6B7280] leading-snug">
                          {stepDef.hint}
                        </p>
                      </div>

                      {/* Image Preview & Controls */}
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveStepIndex(idx)}
                          className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] hover:border-[#9E774C] transition"
                          title="Click to choose or upload"
                        >
                          <MediaPreview src={val} className="h-full w-full aspect-square rounded-none border-0" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {isFilled ? "Change" : "Upload"}
                          </div>
                        </button>

                        <div className="min-w-0 flex-1 space-y-1.5">
                          <input
                            type="text"
                            className={cn(
                              inputClass,
                              "text-xs py-1.5 px-2.5",
                              stepError && "border-[#B4402F]"
                            )}
                            placeholder="Storefront path or /api/media/..."
                            value={val}
                            onChange={(e) => setStepImage(idx, e.target.value)}
                          />

                          <div className="flex flex-wrap items-center gap-1.5">
                            <Button
                              type="button"
                              size="sm"
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
            <CardHeader title="Ratings & reviews" description="Social proof displayed on the product page and cards." />
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

      {/* Media Picker Modal for Step Image Selection */}
      <MediaPickerModal
        open={activeStepIndex !== null}
        onClose={() => setActiveStepIndex(null)}
        title={
          activeStepIndex !== null
            ? `Choose Image for Step ${activeStepIndex + 1}: ${PRODUCT_IMAGE_STEPS[activeStepIndex].easyName}`
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
