"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { formatMoney } from "@/lib/api";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import type { AdminCategory, AdminColorway, AdminProduct, Paginated } from "@/lib/admin/types";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { useConfirm, useToast } from "./feedback";
import { ColorField, ErrorList, NumberField, SelectField, TextAreaField, TextField, Toggle } from "./fields";
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

export const FORM_STEPS = [
  { step: 1, label: "Chest Size", title: "SELECT YOUR CHEST SIZE" },
  { step: 2, label: "Body Type", title: "CHOOSE YOUR BODY TYPE" },
  { step: 3, label: "Height", title: "SELECT YOUR HEIGHT" },
  { step: 4, label: "Sleeves", title: "SELECT YOUR SLEEVES" },
  { step: 5, label: "Collar & Details", title: "COLLAR, CUFFS & DETAILS" },
  { step: 6, label: "Product & Image", title: "REVIEW & CONFIRM" },
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
    fit: p?.fit ?? "Regular Fit",
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
    image: cleanMediaUrl(f.image.trim()),
    gallery: f.gallery.map((g) => cleanMediaUrl(g.trim())).filter(Boolean),
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

  const [activeStep, setActiveStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>(() => toForm(product));
  const [baseline, setBaseline] = useState<FormState>(() => toForm(product));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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
        // Jump to Step 6 if error is on basic fields, or step 1
        if (fe.name || fe.category || fe.price || fe.image) {
          setActiveStep(6);
        }
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
      {/* 6-Step Stepper Header */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-xs">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
          {FORM_STEPS.map((s) => {
            const isCurrent = activeStep === s.step;
            const isDone = activeStep > s.step;
            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveStep(s.step)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all shrink-0 cursor-pointer",
                  isCurrent
                    ? "bg-[#14110E] text-white shadow-xs"
                    : isDone
                    ? "bg-[#F3F4F6] text-[#14110E] hover:bg-[#E5E7EB]"
                    : "text-[#6B7280] hover:bg-[#F9FAFB]"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                    isCurrent ? "bg-[#9E774C] text-white" : isDone ? "bg-[#14110E] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                  )}
                >
                  {isDone ? "✓" : s.step}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          {errors._ && <Notice tone="red">{errors._}</Notice>}
          {Object.keys(errors).filter((k) => k !== "_").length > 0 && <ErrorList errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k !== "_"))} />}

          {/* ========================================================= */}
          {/* STEP 1: SELECT YOUR CHEST SIZE                            */}
          {/* ========================================================= */}
          {activeStep === 1 && (
            <Card>
              <CardHeader
                title="STEP 1 OF 6 • CHEST SIZE: SELECT YOUR CHEST SIZE"
                description="Select the chest size for this bespoke tailoring specification (38&quot; to 48&quot;)."
              />
              <div className="space-y-6 p-4 sm:p-6">
                <div>
                  <label className="mb-2 block text-xs font-bold tracking-wider text-[#14110E] uppercase">
                    Available Chest Sizes (Inches)
                  </label>
                  <p className="mb-4 text-xs text-[#6B7280]">
                    Click to select the primary fit sizing:
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                            "flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all cursor-pointer",
                            isSelected
                              ? "border-[#14110E] bg-[#14110E] text-white shadow-md scale-102"
                              : "border-[#E5E7EB] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                          )}
                        >
                          <span className="text-xl font-extrabold tracking-tight">
                            {c.size}&quot;
                          </span>
                          <span className={cn("mt-1 text-[11px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            Collar: {c.collar}
                          </span>
                          <span className={cn("text-[11px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            Shoulder: {c.shoulder}
                          </span>
                          {isSelected && (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#9E774C] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                              <Check className="h-2.5 w-2.5" /> Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs text-[#374151]">
                  <p className="font-semibold text-[#14110E]">Current Selection: Chest {form.selectedChest}&quot;</p>
                  <p className="mt-0.5 text-[#6B7280]">
                    This sets the standard proportion ratio for the bespoke shirt silhouette.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="bg-[#14110E] text-white hover:bg-neutral-800"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    Continue to Step 2: Body Type
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================= */}
          {/* STEP 2: CHOOSE YOUR BODY TYPE                             */}
          {/* ========================================================= */}
          {activeStep === 2 && (
            <Card>
              <CardHeader
                title="STEP 2 OF 6 • BODY TYPE: CHOOSE YOUR BODY TYPE"
                description="Select the tailored drape and body cut profile."
              />
              <div className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {BODY_TYPE_OPTIONS.map((b) => {
                    const isSelected = form.selectedBodyType === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          set("selectedBodyType", b.id);
                          set("fit", `${b.title} (Chest ${form.selectedChest}")`);
                        }}
                        className={cn(
                          "flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-[#14110E] bg-[#14110E] text-white shadow-md"
                            : "border-[#E5E7EB] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold tracking-wider">{b.title}</span>
                          {isSelected && <Check className="h-4 w-4 text-[#9E774C]" />}
                        </div>
                        <p className={cn("mt-2 text-xs leading-relaxed", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                          {b.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveStep(1)}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Back to Chest Size
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="bg-[#14110E] text-white hover:bg-neutral-800"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    Continue to Step 3: Height
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================= */}
          {/* STEP 3: SELECT YOUR HEIGHT                                */}
          {/* ========================================================= */}
          {activeStep === 3 && (
            <Card>
              <CardHeader
                title="STEP 3 OF 6 • HEIGHT: SELECT YOUR HEIGHT"
                description="Select torso height and garment length proportion."
              />
              <div className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {HEIGHT_OPTIONS.map((h) => {
                    const isSelected = form.selectedHeight === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => set("selectedHeight", h.id)}
                        className={cn(
                          "flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-[#14110E] bg-[#14110E] text-white shadow-md"
                            : "border-[#E5E7EB] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold tracking-wider">{h.title}</span>
                          {isSelected && <Check className="h-4 w-4 text-[#9E774C]" />}
                        </div>
                        <p className={cn("mt-2 text-xs font-medium", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                          {h.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveStep(2)}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Back to Body Type
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="bg-[#14110E] text-white hover:bg-neutral-800"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    Continue to Step 4: Sleeves
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================= */}
          {/* STEP 4: SELECT YOUR SLEEVES                               */}
          {/* ========================================================= */}
          {activeStep === 4 && (
            <Card>
              <CardHeader
                title="STEP 4 OF 6 • SLEEVES: SELECT YOUR SLEEVES"
                description="Choose full-length or short-sleeve tailoring style."
              />
              <div className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {SLEEVE_OPTIONS.map((s) => {
                    const isSelected = form.selectedSleeve === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => set("selectedSleeve", s.id)}
                        className={cn(
                          "flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer",
                          isSelected
                            ? "border-[#14110E] bg-[#14110E] text-white shadow-md"
                            : "border-[#E5E7EB] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold tracking-wider">{s.title}</span>
                          {isSelected && <Check className="h-4 w-4 text-[#9E774C]" />}
                        </div>
                        <p className={cn("mt-2 text-xs leading-relaxed", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                          {s.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveStep(3)}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Back to Height
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(5)}
                    className="bg-[#14110E] text-white hover:bg-neutral-800"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    Continue to Step 5: Collar & Details
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================= */}
          {/* STEP 5: COLLAR, CUFFS & DETAILS                           */}
          {/* ========================================================= */}
          {activeStep === 5 && (
            <Card>
              <CardHeader
                title="STEP 5 OF 6 • COLLAR & DETAILS: COLLAR, CUFFS & MONOGRAM"
                description="Configure neckband collar spread, wrist cuffs, and tailoring construction."
              />
              <div className="space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-[#14110E] uppercase">
                      Collar Style
                    </label>
                    <div className="space-y-2">
                      {COLLAR_OPTIONS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => set("collar", col)}
                          className={cn(
                            "w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all cursor-pointer",
                            form.collar === col
                              ? "border-[#14110E] bg-[#14110E] text-white font-semibold"
                              : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
                          )}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-[#14110E] uppercase">
                      Wrist Cuff Style
                    </label>
                    <div className="space-y-2">
                      {CUFF_OPTIONS.map((cuf) => (
                        <button
                          key={cuf}
                          type="button"
                          onClick={() => set("cuff", cuf)}
                          className={cn(
                            "w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition-all cursor-pointer",
                            form.cuff === cuf
                              ? "border-[#14110E] bg-[#14110E] text-white font-semibold"
                              : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-[#F9FAFB]"
                          )}
                        >
                          {cuf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E5E7EB] pt-4">
                  <p className="mb-3 text-xs font-bold tracking-wider text-[#14110E] uppercase">Fabric & Weave Info</p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField label="Fabric Composition" value={form.fabric} onChange={(e) => set("fabric", e.target.value)} error={errors.fabric} />
                    <TextField label="Thread Count / Ply" value={form.threadCount} onChange={(e) => set("threadCount", e.target.value)} error={errors.threadCount} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setActiveStep(4)}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  >
                    Back to Sleeves
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveStep(6)}
                    className="bg-[#14110E] text-white hover:bg-neutral-800"
                    icon={<ChevronRight className="h-4 w-4" />}
                  >
                    Continue to Step 6: Product & Image
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ========================================================= */}
          {/* STEP 6: PRODUCT BASICS, PRICING & IMAGE                   */}
          {/* ========================================================= */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <Card>
                <CardHeader
                  title="STEP 6 OF 6 • PRODUCT DETAILS & CONFIRMATION"
                  description="Review customized bespoke fit, enter product title, pricing, and upload product image."
                />
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
                  <TextField label="Name" required value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} className="sm:col-span-2" maxLength={200} placeholder="e.g. Royal Blue Classic Bengal Stripe Twill Shirt" />
                  <TextField
                    label="URL slug"
                    value={form.slug}
                    onChange={(e) => set("slug", e.target.value.toLowerCase())}
                    error={errors.slug}
                    hint={isNew ? "Leave empty to generate from name automatically." : "Product URL identifier."}
                    placeholder="royal-blue-classic-bengal-stripe"
                    aside={
                      !isNew && form.slug ? (
                        <a href={`/product/${form.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] text-[#9E774C] hover:underline">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : undefined
                    }
                  />
                  <SelectField label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} options={categoryOptions} error={errors.category} />
                  <TextField label="Subtitle" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} error={errors.subtitle} className="sm:col-span-2" maxLength={300} placeholder="e.g. Classic Tailored Fit Bengal Stripe Twill Formal Shirt" />
                  <TextAreaField label="Description" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} className="sm:col-span-2" maxLength={5000} />
                  <TextField label="Tag / Ribbon" value={form.tag} onChange={(e) => set("tag", e.target.value)} error={errors.tag} placeholder="e.g. BEST SELLER or BESPOKE" maxLength={80} />
                  <NumberField label="Sort order" value={form.sortOrder} onValue={(v) => set("sortOrder", v)} error={errors.sortOrder} hint="Lower numbers show first." step={1} />
                </div>
              </Card>

              <Card>
                <CardHeader title="Pricing & inventory" />
                <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
                  <NumberField label="Price (₹)" value={form.price} onValue={(v) => set("price", v)} error={errors.price} min={0} step="any" required />
                  <NumberField
                    label="Compare-at price (₹)"
                    value={form.compareAtPrice}
                    onValue={(v) => set("compareAtPrice", v)}
                    error={errors.compareAtPrice}
                    min={0}
                    step="any"
                    hint="Shown struck-through. Leave empty for no discount."
                  />
                  <div className="space-y-3 sm:col-span-2">
                    <Toggle
                      checked={form.madeToOrder}
                      onChange={(v) => set("madeToOrder", v)}
                      label="Made to order"
                      description="No stock tracking — every piece is bespoke cut on demand."
                    />
                    {!form.madeToOrder && (
                      <NumberField label="Units in stock" value={form.stock} onValue={(v) => set("stock", v)} error={errors.stock} min={0} step={1} className="sm:max-w-xs" />
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Product Image" description="Main image shown on catalog cards and product detail page." />
                <div className="space-y-5 p-4 sm:p-5">
                  <ImageField label="Main image" value={form.image} onChange={(v) => set("image", v)} error={errors.image} previewClassName="h-32 w-28" />
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

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveStep(5)}
                  icon={<ChevronLeft className="h-4 w-4" />}
                >
                  Back to Collar & Details
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#14110E] px-6 text-white hover:bg-neutral-800"
                  icon={<Save className="h-4 w-4" />}
                >
                  {saving ? "Saving..." : isNew ? "Create Product" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar: Bespoke Summary & Live Preview */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader title="Bespoke Fit Selection" description="Configured through 6 steps." />
            <div className="space-y-2 p-4 text-xs">
              <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                <span className="text-[#6B7280]">Chest Size:</span>
                <span className="font-bold text-[#14110E]">{form.selectedChest}&quot;</span>
              </div>
              <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                <span className="text-[#6B7280]">Body Type:</span>
                <span className="font-semibold text-[#14110E] capitalize">{form.selectedBodyType} Fit</span>
              </div>
              <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                <span className="text-[#6B7280]">Height:</span>
                <span className="font-semibold text-[#14110E] capitalize">{form.selectedHeight}</span>
              </div>
              <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                <span className="text-[#6B7280]">Sleeves:</span>
                <span className="font-semibold text-[#14110E] capitalize">{form.selectedSleeve} Sleeve</span>
              </div>
              <div className="flex justify-between border-b border-[#F3F4F6] pb-1.5">
                <span className="text-[#6B7280]">Collar:</span>
                <span className="font-semibold text-[#14110E] truncate max-w-[140px]">{form.collar}</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-[#6B7280]">Cuff:</span>
                <span className="font-semibold text-[#14110E] truncate max-w-[140px]">{form.cuff}</span>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Live Preview" description="Card display preview." />
            <div className="p-4">
              <PreviewCard form={form} categoryLabel={categoryOptions.find((o) => o.value === form.category)?.label} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Visibility" />
            <div className="space-y-4 p-4">
              <Toggle checked={form.active} onChange={(v) => set("active", v)} label="Visible on storefront" description="Hidden products cannot be viewed or purchased." />
              <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" description="Highlighted in curated storefront collections." />
              <Toggle checked={form.customizable} onChange={(v) => set("customizable", v)} label="Bespoke customizable" description="Allows customers to configure custom fit." />
            </div>
          </Card>
        </div>
      </div>

      <MediaPickerModal open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => set("gallery", [...form.gallery, url])} />

      {/* Floating Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur lg:left-64 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B7280]">
            <span className="font-semibold text-[#14110E]">Step {activeStep} of 6</span>: {FORM_STEPS[activeStep - 1].label}
            {dirty && <span className="ml-2 font-medium text-[#8A5A00]">• Unsaved changes</span>}
          </p>
          <div className="flex items-center gap-2">
            {!isNew && (
              <Button variant="ghost" onClick={() => void remove()} icon={<Trash2 className="h-4 w-4" />} className="text-[#B4402F] hover:text-[#B4402F]">
                Delete
              </Button>
            )}
            {activeStep > 1 && (
              <Button type="button" variant="secondary" onClick={() => setActiveStep((s) => s - 1)}>
                Previous Step
              </Button>
            )}
            {activeStep < 6 ? (
              <Button type="button" onClick={() => setActiveStep((s) => s + 1)} className="bg-[#14110E] text-white hover:bg-neutral-800">
                Next Step
              </Button>
            ) : (
              <Button type="submit" disabled={saving} icon={<Save className="h-4 w-4" />} className="bg-[#14110E] text-white hover:bg-neutral-800">
                {saving ? "Saving..." : isNew ? "Create product" : "Save changes"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

function PreviewCard({ form, categoryLabel }: { form: FormState; categoryLabel?: string }) {
  const price = form.price === "" ? 0 : Number(form.price);
  const compare = form.compareAtPrice === "" ? 0 : Number(form.compareAtPrice);

  return (
    <div className={cn("overflow-hidden rounded-xl border border-[#E5E7EB] bg-white", !form.active && "opacity-60")}>
      <div className="relative">
        <MediaPreview src={form.image} className="aspect-[4/5] rounded-none border-0" />
        {form.tag && <span className="absolute left-2 top-2 bg-[#14110E] px-2 py-1 text-[9px] font-semibold tracking-[0.15em] text-white">{form.tag}</span>}
      </div>
      <div className="space-y-1 p-3">
        {categoryLabel && <p className="text-[10px] font-bold tracking-[0.15em] text-[#9E774C] uppercase">{categoryLabel}</p>}
        <p className="line-clamp-2 text-xs font-bold text-[#14110E]">{form.name || "Product name"}</p>
        {form.subtitle && <p className="line-clamp-1 text-[11px] text-[#6B7280]">{form.subtitle}</p>}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xs font-extrabold text-[#14110E]">{formatMoney(price)}</span>
          {compare > price && <span className="text-[11px] text-[#8B93A1] line-through">{formatMoney(compare)}</span>}
        </div>
      </div>
    </div>
  );
}
