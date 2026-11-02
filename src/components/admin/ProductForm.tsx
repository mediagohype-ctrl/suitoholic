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
  Star,
  Trash2,
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

export const BODY_TYPE_DEFS = [
  {
    id: "lean" as const,
    name: "Lean Fit",
    desc: "Tapered waist, form-fitting chest & slim sleeves",
  },
  {
    id: "regular" as const,
    name: "Regular Fit",
    desc: "Classic British tailoring with comfortable ease",
  },
  {
    id: "tummy" as const,
    name: "Tummy Fit",
    desc: "Relaxed midsection with clean shoulder drape",
  },
];

export const HEIGHT_OPTIONS = [
  {
    id: "regular" as const,
    title: "Regular Height",
    desc: "5.5 – 5.7\" (Shirt Length: 27.5\" · Sleeve: 23.75\")",
  },
  {
    id: "tall" as const,
    title: "Tall Height",
    desc: "5.8 – 5.10\" (Shirt Length: 29.0\" · Sleeve: 24.5\")",
  },
  {
    id: "extra_tall" as const,
    title: "Extra Tall Height",
    desc: "5.11 – 6.2\" (Shirt Length: 30.5\" · Sleeve: 25.25\")",
  },
];

export const SLEEVE_OPTIONS = [
  {
    id: "full" as const,
    title: "Full Sleeves",
    desc: "Classic tailored full-length sleeves with double-button barrel cuffs",
  },
  {
    id: "half" as const,
    title: "Half Sleeves",
    desc: "Summer tailored short sleeves resting crisply mid-bicep",
  },
];

export const COLLAR_OPTIONS = [
  {
    id: "cutaway",
    title: "CUTAWAY COLLAR",
    desc: "Wide, modern points for larger tie knots",
  },
  {
    id: "classic_spread",
    title: "CLASSIC SPREAD",
    desc: "The versatile boardroom standard",
  },
  {
    id: "mandarin",
    title: "MANDARIN / BAND",
    desc: "Minimal stand collar, no points",
  },
  {
    id: "button_down",
    title: "BUTTON DOWN",
    desc: "Points fastened with buttons, smart-casual",
  },
];

export const CUFF_OPTIONS = [
  {
    id: "classic_cuff",
    title: "CLASSIC CUFF",
    desc: "Single-button standard barrel cuff",
  },
  {
    id: "french_double",
    title: "FRENCH DOUBLE",
    desc: "Formal folded French cuff for cufflinks",
  },
  {
    id: "rounded_cuff",
    title: "ROUNDED CUFF",
    desc: "Curved 2-button elegant corner cuff",
  },
];

export const THREAD_COLOR_OPTIONS = [
  { value: "MATCHING THREAD", label: "MATCHING / TONAL THREAD" },
  { value: "BLACK THREAD", label: "BLACK THREAD" },
  { value: "WHITE THREAD", label: "WHITE THREAD" },
  { value: "NAVY BLUE THREAD", label: "NAVY BLUE THREAD" },
  { value: "GOLD THREAD", label: "GOLD THREAD" },
  { value: "BURGUNDY THREAD", label: "BURGUNDY THREAD" },
  { value: "SILVER GREY THREAD", label: "SILVER GREY THREAD" },
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
  selectedChest: number | null;
  selectedBodyType: "lean" | "regular" | "tummy" | null;
  selectedHeight: "regular" | "tall" | "extra_tall" | null;
  selectedSleeves: "full" | "half" | null;
  selectedCollar: string | null;
  selectedCuff: string | null;
  monogram: string;
  threadColor: string;
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
  const mainImg = cleanMediaUrl(p?.image ?? "");
  const gal = p?.gallery ? p.gallery.map(cleanMediaUrl) : [];

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
    fit: p?.fit ?? "",
    selectedChest: null,
    selectedBodyType: null,
    selectedHeight: null,
    selectedSleeves: null,
    selectedCollar: null,
    selectedCuff: null,
    monogram: "",
    threadColor: "MATCHING THREAD",
    image: mainImg,
    gallery: gal,
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

  const collarValue = f.selectedCollar
    ? COLLAR_OPTIONS.find((c) => c.id === f.selectedCollar)?.title || f.selectedCollar
    : f.collar || "English Semi-Spread Collar";

  const cuffValue =
    f.selectedSleeves === "half"
      ? "Half Sleeves (No Cuff)"
      : f.selectedCuff
      ? CUFF_OPTIONS.find((c) => c.id === f.selectedCuff)?.title || f.selectedCuff
      : f.cuff || "2-Button Rounded Barrel Cuff";

  const bodyName = f.selectedBodyType === "lean" ? "Lean Fit" : f.selectedBodyType === "tummy" ? "Tummy Fit" : f.selectedBodyType === "regular" ? "Regular Fit" : "";
  const heightName = f.selectedHeight === "tall" ? "Tall Height" : f.selectedHeight === "extra_tall" ? "Extra Tall Height" : f.selectedHeight === "regular" ? "Regular Height" : "";
  const sleeveName = f.selectedSleeves === "full" ? "Full Sleeves" : f.selectedSleeves === "half" ? "Half Sleeves" : "";

  const fitDetails = [
    f.selectedChest ? `Chest ${f.selectedChest}"` : "",
    heightName,
    sleeveName,
    collarValue ? `Collar: ${collarValue}` : "",
    f.selectedSleeves === "full" && cuffValue ? `Cuff: ${cuffValue}` : "",
    f.monogram.trim() ? `Monogram: ${f.monogram.trim()}` : "",
  ].filter(Boolean).join(", ");

  const synthesizedFit = bodyName ? (fitDetails ? `${bodyName} (${fitDetails})` : bodyName) : "";

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
    collar: collarValue,
    cuff: cuffValue,
    fit: f.fit.trim() || synthesizedFit || "Bespoke Tailored Fit",
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


function CollarIcon({ type, className }: { type: string; className?: string }) {
  if (type === "cutaway") {
    return (
      <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 6 C 20 14, 28 14, 34 6" />
        <path d="M14 6 L 6 18 L 18 16 L 24 10" />
        <path d="M34 6 L 42 18 L 30 16 L 24 10" />
        <path d="M24 10 L 24 26" strokeDasharray="2 2" opacity="0.6" />
      </svg>
    );
  }
  if (type === "classic_spread") {
    return (
      <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 6 C 21 12, 27 12, 32 6" />
        <path d="M16 6 L 10 20 L 20 15 L 24 10" />
        <path d="M32 6 L 38 20 L 28 15 L 24 10" />
        <path d="M24 10 L 24 26" strokeDasharray="2 2" opacity="0.6" />
      </svg>
    );
  }
  if (type === "mandarin") {
    return (
      <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 14 C 20 9, 28 9, 33 14" />
        <path d="M15 14 L 14 20 C 20 16, 28 16, 34 20 L 33 14" />
        <path d="M24 18 L 24 28" strokeDasharray="2 2" opacity="0.6" />
      </svg>
    );
  }
  if (type === "button_down") {
    return (
      <svg viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 6 C 21 12, 27 12, 32 6" />
        <path d="M16 6 L 12 21 L 21 16 L 24 10" />
        <path d="M32 6 L 36 21 L 27 16 L 24 10" />
        <circle cx="14" cy="18" r="1" fill="currentColor" />
        <circle cx="34" cy="18" r="1" fill="currentColor" />
        <path d="M24 10 L 24 26" strokeDasharray="2 2" opacity="0.6" />
      </svg>
    );
  }
  return null;
}

function CuffIcon({ type, className }: { type: string; className?: string }) {
  if (type === "classic_cuff") {
    return (
      <svg viewBox="0 0 60 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 L 16 16 L 44 16 L 42 6" opacity="0.5" />
        <rect x="14" y="16" width="32" height="15" rx="1" />
        <line x1="14" y1="20" x2="46" y2="20" strokeDasharray="1.5 1.5" opacity="0.7" />
        <circle cx="30" cy="25" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (type === "french_double") {
    return (
      <svg viewBox="0 0 60 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 L 16 14 L 44 14 L 42 6" opacity="0.5" />
        <rect x="13" y="14" width="34" height="17" rx="1.5" />
        <line x1="13" y1="22" x2="47" y2="22" />
        <circle cx="25" cy="26" r="1.2" fill="currentColor" />
        <circle cx="35" cy="26" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (type === "rounded_cuff") {
    return (
      <svg viewBox="0 0 60 36" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 L 16 16 L 44 16 L 42 6" opacity="0.5" />
        <path d="M14 16 H 46 V 25 C 46 28.5, 43 31, 39.5 31 H 20.5 C 17 31, 14 28.5, 14 25 Z" />
        <line x1="16" y1="20" x2="44" y2="20" strokeDasharray="1.5 1.5" opacity="0.7" />
        <circle cx="30" cy="25" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  return null;
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
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
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

    if (!form.image.trim()) {
      local.image = "Please upload product image in the last step.";
      setWizardStep(6);
    }

    form.colorways.forEach((c, i) => {
      if (!c.name.trim()) local[`colorways.${i}.name`] = "Name is required";
      if (!/^#[0-9a-fA-F]{3,8}$/.test(c.hex.trim())) local[`colorways.${i}.hex`] = "Use a hex colour like #FFFFFF";
    });

    if (Object.keys(local).length) {
      setErrors(local);
      toast.error(local.image ? local.image : "Please fix the highlighted fields.");
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

  const bodyName = form.selectedBodyType === "lean" ? "Lean Fit" : form.selectedBodyType === "tummy" ? "Tummy Fit" : form.selectedBodyType === "regular" ? "Regular Fit" : "";
  const heightName = form.selectedHeight === "tall" ? "Tall Height" : form.selectedHeight === "extra_tall" ? "Extra Tall Height" : form.selectedHeight === "regular" ? "Regular Height" : "";
  const sleeveName = form.selectedSleeves === "full" ? "Full Sleeves" : form.selectedSleeves === "half" ? "Half Sleeves" : "";
  const collarTitle = form.selectedCollar ? COLLAR_OPTIONS.find((c) => c.id === form.selectedCollar)?.title || form.selectedCollar : "";
  const cuffTitle = form.selectedCuff ? CUFF_OPTIONS.find((c) => c.id === form.selectedCuff)?.title || form.selectedCuff : "";

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
          {/* SECTION 3: 6-STEP BESPOKE CUSTOMIZATION & IMAGE UPLOAD                     */}
          {/* Step 1: Chest Size -> Continue                                            */}
          {/* Step 2: Choose Your Body Type (Lean, Regular, Tummy) -> Continue          */}
          {/* Step 3: Select Your Height (Regular, Tall, Extra Tall) -> Continue        */}
          {/* Step 4: Select Your Sleeves (Full Sleeves, Half Sleeves) -> Continue       */}
          {/* Step 5: Collar, Cuffs & Details (Full = Collar/Cuff/Monogram; Half = Collar)*/}
          {/* Step 6: Upload Your Image (Last Step)                                     */}
          {/* ========================================================================= */}
          <Card>
            <CardHeader
              title={
                wizardStep === 1
                  ? "Select Your Chest Size"
                  : wizardStep === 2
                  ? "Choose Your Body Type"
                  : wizardStep === 3
                  ? "Select Your Height"
                  : wizardStep === 4
                  ? "Select Your Sleeves"
                  : wizardStep === 5
                  ? (form.selectedSleeves === "half" ? "Collar Style & Details" : "Collar, Cuffs & Details")
                  : "Upload Your Image"
              }
              description={
                wizardStep === 1
                  ? "Pehle apna chest size select karke Continue karein."
                  : wizardStep === 2
                  ? "Apna body type (Lean, Regular, ya Tummy) choose karke Continue karein."
                  : wizardStep === 3
                  ? "Apna height proportion choose karke Continue karein."
                  : wizardStep === 4
                  ? "Apna sleeve option (Full Sleeves ya Half Sleeves) choose karke Continue karein."
                  : wizardStep === 5
                  ? (form.selectedSleeves === "half" ? "Collar style select karein." : "Collar style, cuff design aur monogram details customize karein.")
                  : "Aakhri step me product ki main photo upload karein."
              }
              actions={
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                  {[
                    { step: 1, label: form.selectedChest ? `1. Chest (${form.selectedChest}")` : `1. Chest` },
                    { step: 2, label: bodyName ? `2. Body (${bodyName.replace(" Fit", "")})` : `2. Body` },
                    { step: 3, label: heightName ? `3. Height (${heightName.replace(" Height", "")})` : `3. Height` },
                    { step: 4, label: sleeveName ? `4. Sleeves (${sleeveName.replace(" Sleeves", "")})` : `4. Sleeves` },
                    { step: 5, label: collarTitle ? `5. Details (${collarTitle.split(" ")[0]})` : `5. Details` },
                    { step: 6, label: `6. Image` },
                  ].map((s) => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setWizardStep(s.step as 1 | 2 | 3 | 4 | 5 | 6)}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 cursor-pointer",
                        wizardStep === s.step
                          ? "bg-[#14110E] text-white shadow-xs"
                          : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              }
            />

            <div className="space-y-5 p-4 sm:p-5">
              {/* ========================================================= */}
              {/* STEP 1: SELECT YOUR CHEST SIZE                            */}
              {/* ========================================================= */}
              {wizardStep === 1 && (
                <div className="rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-5 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="inline-block rounded-md bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Step 1 of 6
                      </span>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Select Your Chest Size
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Chest size select karne ke baad Continue button dabayein:
                      </p>
                    </div>
                    <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#9E774C] border border-[#E5E7EB] shadow-2xs">
                      {form.selectedChest ? `Selected: ${form.selectedChest}" Chest` : "None Selected"}
                    </span>
                  </div>

                  {/* Chest Size Chips */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
                    {CHEST_SIZE_OPTIONS.map((c) => {
                      const isSelected = form.selectedChest === c.size;
                      return (
                        <button
                          key={c.size}
                          type="button"
                          onClick={() => {
                            set("selectedChest", c.size);
                          }}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all cursor-pointer",
                            isSelected
                              ? "border-[#14110E] bg-[#14110E] text-white shadow-md scale-102"
                              : "border-[#D6CEBF] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                          )}
                        >
                          <span className="text-lg font-extrabold">{c.size}&quot;</span>
                          <span className={cn("text-[10px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            Collar {c.collar}
                          </span>
                          <span className={cn("text-[10px]", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            Shld {c.shoulder}
                          </span>
                          {isSelected && (
                            <span className="mt-1.5 inline-flex items-center gap-0.5 rounded-full bg-[#9E774C] px-1.5 py-0.2 text-[8px] font-bold text-white uppercase">
                              <Check className="h-2 w-2" /> Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#EAE3D9] pt-4">
                    <p className="text-xs text-[#6B7280]">
                      Selected Chest: <strong className="text-[#14110E]">{form.selectedChest ? `${form.selectedChest}" Sizing` : "None Selected"}</strong>
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.selectedChest) {
                          toast.error("Please select your chest size first.");
                          return;
                        }
                        setWizardStep(2);
                      }}
                      className="bg-[#14110E] text-white hover:bg-neutral-800 px-6 font-semibold"
                      icon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continue to Choose Body Type
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 2: CHOOSE YOUR BODY TYPE (NO IMAGES HERE!)           */}
              {/* ========================================================= */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md bg-[#14110E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Step 2 of 6
                        </span>
                        <span className="rounded-full bg-white border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#9E774C]">
                          Chest Size: {form.selectedChest ? `${form.selectedChest}"` : "Not selected"}
                        </span>
                      </div>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Choose Your Body Type
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Koi sa bhi ek body type select karein, fir Continue button dabayein:
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setWizardStep(1)}
                      icon={<ChevronLeft className="h-3.5 w-3.5" />}
                    >
                      Back to Chest Size
                    </Button>
                  </div>

                  {/* 3 Body Type Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {BODY_TYPE_DEFS.map((b) => {
                      const isSelected = form.selectedBodyType === b.id;

                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            set("selectedBodyType", b.id);
                          }}
                          className={cn(
                            "flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#14110E] bg-[#14110E] text-white shadow-md scale-102"
                              : "border-[#D6CEBF] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                              isSelected ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#8A5A00] border border-[#EAE3D9]"
                            )}>
                              {form.selectedChest ? `Chest ${form.selectedChest}"` : "Fit Drape"}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-[#9E774C]">
                                <Check className="h-3.5 w-3.5" /> Selected
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-lg font-bold">
                            {b.name}
                          </h4>
                          <p className={cn("mt-1.5 text-xs leading-relaxed", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            {b.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue Button to Step 3 */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#EAE3D9] pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setWizardStep(1)}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Back to Chest Size
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.selectedBodyType) {
                          toast.error("Please choose your body type first.");
                          return;
                        }
                        setWizardStep(3);
                      }}
                      className="bg-[#14110E] text-white hover:bg-neutral-800 px-6 font-semibold"
                      icon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 3: SELECT YOUR HEIGHT (REGULAR, TALL, EXTRA TALL)    */}
              {/* ========================================================= */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md bg-[#14110E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Step 3 of 6
                        </span>
                        <span className="rounded-full bg-white border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#9E774C]">
                          Chest: {form.selectedChest ? `${form.selectedChest}"` : "—"} · {bodyName || "—"}
                        </span>
                      </div>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Select Your Height
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Apna height option choose karein (Regular, Tall, ya Extra Tall):
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setWizardStep(2)}
                      icon={<ChevronLeft className="h-3.5 w-3.5" />}
                    >
                      Back to Body Type
                    </Button>
                  </div>

                  {/* 3 Height Options */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {HEIGHT_OPTIONS.map((h) => {
                      const isSelected = form.selectedHeight === h.id;

                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => {
                            set("selectedHeight", h.id);
                          }}
                          className={cn(
                            "flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#14110E] bg-[#14110E] text-white shadow-md scale-102"
                              : "border-[#D6CEBF] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                              isSelected ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#8A5A00] border border-[#EAE3D9]"
                            )}>
                              Height
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-[#9E774C]">
                                <Check className="h-3.5 w-3.5" /> Selected
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-lg font-bold">
                            {h.title}
                          </h4>
                          <p className={cn("mt-1.5 text-xs leading-relaxed font-medium", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            {h.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue Button to Step 4 (Sleeves) */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#EAE3D9] pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setWizardStep(2)}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Back to Body Type
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.selectedHeight) {
                          toast.error("Please select your height first.");
                          return;
                        }
                        setWizardStep(4);
                      }}
                      className="bg-[#14110E] text-white hover:bg-neutral-800 px-6 font-semibold"
                      icon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continue to Select Sleeves
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 4: SELECT YOUR SLEEVES (FULL SLEEVES, HALF SLEEVES)   */}
              {/* ========================================================= */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md bg-[#14110E] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Step 4 of 6
                        </span>
                        <span className="rounded-full bg-white border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#9E774C]">
                          Chest: {form.selectedChest ? `${form.selectedChest}"` : "—"} · {bodyName || "—"} · {heightName || "—"}
                        </span>
                      </div>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Select Your Sleeves
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Apna sleeve option choose karein (Full Sleeves ya Half Sleeves):
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setWizardStep(3)}
                      icon={<ChevronLeft className="h-3.5 w-3.5" />}
                    >
                      Back to Height
                    </Button>
                  </div>

                  {/* 2 Sleeve Options */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {SLEEVE_OPTIONS.map((s) => {
                      const isSelected = form.selectedSleeves === s.id;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            set("selectedSleeves", s.id);
                          }}
                          className={cn(
                            "flex flex-col rounded-xl border p-5 text-left transition-all cursor-pointer",
                            isSelected
                              ? "border-[#14110E] bg-[#14110E] text-white shadow-md scale-102"
                              : "border-[#D6CEBF] bg-white text-[#14110E] hover:border-[#9E774C] hover:bg-[#FDFBF7]"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
                              isSelected ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#8A5A00] border border-[#EAE3D9]"
                            )}>
                              Sleeve Style
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-[#9E774C]">
                                <Check className="h-3.5 w-3.5" /> Selected
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif text-lg font-bold">
                            {s.title}
                          </h4>
                          <p className={cn("mt-1.5 text-xs leading-relaxed font-medium", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                            {s.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Continue Button to Step 5 (Collar, Cuffs & Details) */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#EAE3D9] pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setWizardStep(3)}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Back to Height
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.selectedSleeves) {
                          toast.error("Please select a sleeve option to continue.");
                          return;
                        }
                        setWizardStep(5);
                      }}
                      className="bg-[#14110E] text-white hover:bg-neutral-800 px-6 font-semibold"
                      icon={<ChevronRight className="h-4 w-4" />}
                    >
                      {form.selectedSleeves === "half" ? "Continue to Collar Style" : "Continue to Collar, Cuffs & Details"}
                    </Button>
                  </div>
                </div>
              )}

                            {/* ========================================================= */}
              {/* STEP 5: COLLAR, CUFFS & DETAILS (HALF = COLLAR ONLY)      */}
              {/* ========================================================= */}
              {wizardStep === 5 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Top info header matching screenshot */}
                  <div className="text-center py-2">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <div className="h-px w-16 bg-[#D6CEBF]" />
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                        Step 5 of 6
                      </span>
                      <div className="h-px w-16 bg-[#D6CEBF]" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold uppercase tracking-wider text-[#14110E]">
                      {form.selectedSleeves === "half" ? "Collar Style & Details" : "Collar, Cuffs & Details"}
                    </h3>
                    <p className="mt-1 text-xs text-[#6B7280]">
                      {form.selectedSleeves === "half"
                        ? "Customize collar style for your tailored half-sleeve shirt."
                        : "Customize collar style, wrist cuffs, and personalized monogram initials."}
                    </p>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        Chest: {form.selectedChest ? `${form.selectedChest}"` : "—"}
                      </span>
                      <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        {bodyName || "—"}
                      </span>
                      <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        {heightName || "—"}
                      </span>
                      <span className="rounded-full bg-[#9E774C] px-2.5 py-0.5 text-[10px] font-bold text-white">
                        {sleeveName || "—"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setWizardStep(4)}
                      icon={<ChevronLeft className="h-3.5 w-3.5" />}
                    >
                      Back to Sleeves
                    </Button>
                  </div>

                  {/* 1. COLLAR STYLE */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#14110E]">
                      Collar Style
                    </h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {COLLAR_OPTIONS.map((c) => {
                        const isSelected = form.selectedCollar === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => set("selectedCollar", c.id)}
                            className={cn(
                              "flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all cursor-pointer relative",
                              isSelected
                                ? "border-[#14110E] bg-[#14110E] text-white shadow-md"
                                : "border-[#E5E7EB] bg-[#FAF8F5] text-[#14110E] hover:border-[#9E774C] hover:bg-white"
                            )}
                          >
                            <div className={cn(
                              "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border",
                              isSelected ? "border-white/20 bg-white/10 text-white" : "border-[#EAE3D9] bg-white text-[#14110E]"
                            )}>
                              <CollarIcon type={c.id} className="h-8 w-8" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-serif text-sm font-bold uppercase tracking-wider">
                                {c.title}
                              </h5>
                              <p className={cn("text-xs leading-snug mt-0.5", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                                {c.desc}
                              </p>
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 shrink-0 text-white" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* If Full Sleeves: Show Cuff Design + Monogram + Thread Color */}
                  {form.selectedSleeves === "full" && (
                    <>
                      {/* 2. CUFF DESIGN */}
                      <div className="space-y-3 pt-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#14110E]">
                          Cuff Design
                        </h4>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          {CUFF_OPTIONS.map((c) => {
                            const isSelected = form.selectedCuff === c.id;
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => set("selectedCuff", c.id)}
                                className={cn(
                                  "flex flex-col items-center justify-center rounded-xl border p-4 text-center transition-all cursor-pointer relative",
                                  isSelected
                                    ? "border-[#14110E] bg-[#14110E] text-white shadow-md"
                                    : "border-[#E5E7EB] bg-[#FAF8F5] text-[#14110E] hover:border-[#9E774C] hover:bg-white"
                                )}
                              >
                                {isSelected && (
                                  <span className="absolute top-2 right-2 flex items-center justify-center h-4 w-4 rounded-full bg-[#9E774C] text-white">
                                    <Check className="h-2.5 w-2.5" />
                                  </span>
                                )}
                                <div className={cn(
                                  "flex h-12 w-16 items-center justify-center mb-2",
                                  isSelected ? "text-white" : "text-[#14110E]"
                                )}>
                                  <CuffIcon type={c.id} className="h-9 w-14" />
                                </div>
                                <h5 className="font-serif text-xs font-bold uppercase tracking-wider">
                                  {c.title}
                                </h5>
                                <p className={cn("text-[10px] mt-0.5", isSelected ? "text-neutral-300" : "text-[#6B7280]")}>
                                  {c.desc}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. MONOGRAM & THREAD COLOR */}
                      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#14110E] mb-1.5">
                            Monogram Initials
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            value={form.monogram}
                            onChange={(e) => set("monogram", e.target.value.toUpperCase())}
                            placeholder="e.g. A K"
                            className="w-full rounded-xl border border-[#D6CEBF] bg-[#FAF8F5] px-3.5 py-2.5 font-serif text-base font-bold tracking-widest uppercase text-[#14110E] placeholder:text-[#9CA3AF] focus:border-[#14110E] focus:bg-white focus:outline-none"
                          />
                          <p className="mt-1 text-[10px] text-[#6B7280]">
                            Optional custom embroidery initials (e.g. cuff or chest pocket).
                          </p>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#14110E] mb-1.5">
                            Thread Color
                          </label>
                          <select
                            value={form.threadColor}
                            onChange={(e) => set("threadColor", e.target.value)}
                            className="w-full rounded-xl border border-[#D6CEBF] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#14110E] focus:border-[#14110E] focus:bg-white focus:outline-none cursor-pointer"
                          >
                            {THREAD_COLOR_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 text-[10px] text-[#6B7280]">
                            Contrast or matching thread for buttons & monogram.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Navigation footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-[#EAE3D9] pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setWizardStep(4)}
                      icon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Back to Sleeves
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (!form.selectedCollar) {
                          toast.error("Please select a collar style first.");
                          return;
                        }
                        if (form.selectedSleeves === "full" && !form.selectedCuff) {
                          toast.error("Please select a cuff design first.");
                          return;
                        }
                        setWizardStep(6);
                      }}
                      className="bg-[#14110E] text-white hover:bg-neutral-800 px-6 font-semibold"
                      icon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continue to Upload Image
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 6: UPLOAD YOUR IMAGE (LAST STEP)                     */}
              {/* ========================================================= */}
              {wizardStep === 6 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block rounded-md bg-[#2F6B3B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Last Step • Step 6 of 6
                        </span>
                        {form.selectedChest && (
                          <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            Chest: {form.selectedChest}&quot;
                          </span>
                        )}
                        {bodyName && (
                          <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            {bodyName}
                          </span>
                        )}
                        {heightName && (
                          <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            {heightName}
                          </span>
                        )}
                        {sleeveName && (
                          <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            {sleeveName}
                          </span>
                        )}
                        {collarTitle && (
                          <span className="rounded-full bg-[#9E774C] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            Collar: {collarTitle}
                          </span>
                        )}
                        {form.selectedSleeves === "full" && cuffTitle && (
                          <span className="rounded-full bg-[#9E774C] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            Cuff: {cuffTitle}
                          </span>
                        )}
                        {form.monogram && (
                          <span className="rounded-full bg-[#9E774C] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            Monogram: {form.monogram}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Upload Product Image
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Main product image upload karein jo catalog cards aur customizer par display hogi:
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setWizardStep(5)}
                      icon={<ChevronLeft className="h-3.5 w-3.5" />}
                    >
                      Back to Details
                    </Button>
                  </div>

                  {errors.image && <Notice tone="red">{errors.image}</Notice>}

                  {/* Main Product Image Field */}
                  <ImageField
                    label="Product Image (Main Front View)"
                    value={form.image}
                    onChange={(v) => set("image", v)}
                    error={errors.image}
                    previewClassName="h-32 w-28"
                    hint="Main photo shown on catalog cards, bespoke customizer and product detail page."
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
              )}
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

          {/* Section 5: Ratings & Reviews */}
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
