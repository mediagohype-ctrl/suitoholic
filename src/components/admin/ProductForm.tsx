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
import { isLegacyShirtCategory } from "@/data/shopCollections";
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

export const SLEEVE_POCKET_OPTIONS = [
  {
    id: "half_pocket" as const,
    sleeve: "half" as const,
    pocket: "pocket" as const,
    title: "Half Sleeve With Pocket",
    label: "WITH POCKET",
    image: "/customizer/sleeves_half_pocket.png",
  },
  {
    id: "half_nopocket" as const,
    sleeve: "half" as const,
    pocket: "no-pocket" as const,
    title: "Half Sleeve Without Pocket",
    label: "WITHOUT POCKET",
    image: "/customizer/sleeves_half_nopocket.png",
  },
  {
    id: "full_pocket" as const,
    sleeve: "full" as const,
    pocket: "pocket" as const,
    title: "Full Sleeve With Pocket",
    label: "WITH POCKET",
    image: "/customizer/sleeves_full_pocket.png",
  },
  {
    id: "full_nopocket" as const,
    sleeve: "full" as const,
    pocket: "no-pocket" as const,
    title: "Full Sleeve Without Pocket",
    label: "WITHOUT POCKET",
    image: "/customizer/sleeves_full_nopocket.png",
  },
];

export const COLLAR_OPTIONS = [
  {
    id: "cutaway",
    title: "CUTAWAY COLLAR",
    badge: "CUTAWAY COLLAR",
    matchKey: "CUTAWAY",
    desc: "Wide modern points, versatile elegance",
    image: "/customizer/collar_style_cutaway.png?v=12",
  },
  {
    id: "mandarin",
    title: "MANDARIN COLLAR",
    badge: "MANDARIN COLLAR",
    matchKey: "MANDARIN",
    desc: "Minimal stand collar, no points",
    image: "/customizer/collar_style_mandarin.png?v=12",
  },
  {
    id: "buttondown",
    title: "BUTTON-DOWN COLLAR",
    badge: "BUTTON-DOWN COLLAR",
    matchKey: "BUTTON",
    desc: "Points fastened with buttons, smart-casual",
    image: "/customizer/collar_style_buttondown.png?v=12",
  },
];

export const CUFF_OPTIONS = [
  {
    id: "classic",
    title: "CLASSIC CUFF",
    badge: "CLASSIC CUFF",
    matchKeys: ["CLASSIC", "BARREL"],
    desc: "Single-button standard barrel cuff",
    image: "/customizer/cuff_style_classic.png?v=12",
  },
  {
    id: "cufflink",
    title: "CUFFLINK CUFF (DOUBLE FOLD)",
    badge: "CUFFLINK CUFF (DOUBLE FOLD)",
    matchKeys: ["CUFFLINK", "FRENCH", "DOUBLE"],
    desc: "Formal folded French cuff for cufflinks",
    image: "/customizer/cuff_style_cufflink.png?v=12",
  },
];

export interface ThreadColorItem {
  value: string;
  label: string;
  hex: string;
}

export const THREAD_COLOR_OPTIONS: ThreadColorItem[] = [
  { value: "dark_blue", label: "Dark Blue (Navy)", hex: "#1E40AF" },
  { value: "black", label: "Classic Black", hex: "#14110E" },
  { value: "white", label: "Crisp White", hex: "#FFFFFF" },
  { value: "gold", label: "Royal Gold", hex: "#B8860B" },
  { value: "burgundy", label: "Bordeaux Burgundy", hex: "#6B1F2A" },
  { value: "silver", label: "Silver Grey", hex: "#71717A" },
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
  selectedPocket: "pocket" | "no-pocket" | null;
  selectedCollar: string | null;
  selectedCuff: string | null;
  monogram: string;
  selectedThreadColors: string[];
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

  const fitText = (p?.fit ?? "").toLowerCase();
  const initialSleeves: "full" | "half" | null = fitText.includes("half sleeve")
    ? "half"
    : fitText.includes("full sleeve")
    ? "full"
    : null;
  const initialPocket: "pocket" | "no-pocket" | null = fitText.includes("without pocket") || fitText.includes("no-pocket")
    ? "no-pocket"
    : fitText.includes("with pocket")
    ? "pocket"
    : null;

  const collarText = (p?.collar ?? p?.fit ?? "").toLowerCase();
  const initialCollar = collarText.includes("mandarin")
    ? "mandarin"
    : collarText.includes("button")
    ? "buttondown"
    : collarText.includes("cutaway") || collarText.includes("spread") || collarText.includes("classic")
    ? "cutaway"
    : null;

  const cuffText = (p?.cuff ?? p?.fit ?? "").toLowerCase();
  const initialCuff = (cuffText.includes("cufflink") || cuffText.includes("french") || cuffText.includes("double"))
    ? "cufflink"
    : (cuffText.includes("classic") || cuffText.includes("barrel") || cuffText.includes("rounded"))
    ? "classic"
    : null;

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
    selectedSleeves: initialSleeves,
    selectedPocket: initialPocket,
    selectedCollar: initialCollar,
    selectedCuff: initialCuff,
    monogram: "",
    selectedThreadColors: [],
    threadColor: "dark_blue",
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
    : f.collar || "CUTAWAY COLLAR";

  const cuffValue =
    f.selectedSleeves === "half"
      ? "Half Sleeves (No Cuff)"
      : f.selectedCuff
      ? CUFF_OPTIONS.find((c) => c.id === f.selectedCuff)?.title || f.selectedCuff
      : f.cuff || "CLASSIC CUFF";

  const bodyName = f.selectedBodyType === "lean" ? "Lean Fit" : f.selectedBodyType === "tummy" ? "Tummy Fit" : f.selectedBodyType === "regular" ? "Regular Fit" : "";
  const heightName = f.selectedHeight === "tall" ? "Tall Height" : f.selectedHeight === "extra_tall" ? "Extra Tall Height" : f.selectedHeight === "regular" ? "Regular Height" : "";
  const pocketName = f.selectedPocket === "pocket" ? "With Pocket" : f.selectedPocket === "no-pocket" ? "Without Pocket" : "";
  const sleeveBase = f.selectedSleeves === "full" ? "Full Sleeves" : f.selectedSleeves === "half" ? "Half Sleeves" : "";
  const sleeveName = sleeveBase ? (pocketName ? `${sleeveBase} (${pocketName})` : sleeveBase) : "";

  const threadText = f.selectedThreadColors && f.selectedThreadColors.length > 0
    ? `Threads: ${f.selectedThreadColors.join(", ")}`
    : "";

  const fitDetails = [
    f.selectedChest ? `Chest ${f.selectedChest}"` : "",
    heightName,
    sleeveName,
    pocketName ? `Pocket: ${pocketName}` : "",
    collarValue ? `Collar: ${collarValue}` : "",
    f.selectedSleeves === "full" && cuffValue ? `Cuff: ${cuffValue}` : "",
    f.monogram.trim() ? `Monogram: ${f.monogram.trim()}` : "",
    threadText,
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

  const { data: categories, loading: categoriesLoading, error: categoriesError } = useAdminQuery<AdminCategory[]>("/categories");
  const savedCategory = product?.category;
  const categoryOptions = [
    { value: "", label: categoriesLoading ? "Loading categories…" : "Select a category" },
    ...(categories ?? [])
      .filter((c) => c.id === savedCategory || (c.active && c.id !== "blazers" && !isLegacyShirtCategory(c.id)))
      .map((c) => ({ value: c.id, label: c.title })),
  ];

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
  const pocketName = form.selectedPocket === "pocket" ? "With Pocket" : form.selectedPocket === "no-pocket" ? "Without Pocket" : "";
  const sleeveBase = form.selectedSleeves === "full" ? "Full Sleeves" : form.selectedSleeves === "half" ? "Half Sleeves" : "";
  const sleeveName = sleeveBase ? (pocketName ? `${sleeveBase} (${pocketName})` : sleeveBase) : "";
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
              <SelectField
                label="Category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                options={categoryOptions}
                error={errors.category || (categoriesError ? "Could not load categories." : undefined)}
                disabled={categoriesLoading || !!categoriesError}
                required
              />
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
                  ? "Select Your Sleeves & Pockets"
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
                  ? "Apna sleeve style aur pocket option choose karke Continue karein."
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
                    { step: 4, label: sleeveBase ? `4. Sleeves (${sleeveBase.replace(" Sleeves", "")})` : `4. Sleeves & Pockets` },
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
                      Continue to Sleeves & Pockets
                    </Button>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* STEP 4: SELECT YOUR SLEEVES & POCKETS                     */}
              {/* ========================================================= */}
              {wizardStep === 4 && (
                <div className="space-y-5 animate-in fade-in duration-200">
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
                        Select Your Sleeves & Pockets
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Choose your preferred sleeve style and pocket option for your shirt:
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

                  {/* HALF SLEEVE SECTION */}
                  <div className="space-y-3">
                    {/* Section Header Divider */}
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-[1.5px] flex-1 bg-[#8E6F57]/40" />
                      <span className="px-5 py-1 rounded-full bg-[#8A4418] text-white font-serif text-xs font-bold tracking-widest uppercase shadow-xs">
                        HALF SLEEVE
                      </span>
                      <div className="h-[1.5px] flex-1 bg-[#8E6F57]/40" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Half Sleeve WITH Pocket */}
                      {(() => {
                        const isSelected = form.selectedSleeves === "half" && form.selectedPocket === "pocket";
                        return (
                          <div
                            onClick={() => {
                              set("selectedSleeves", "half");
                              set("selectedPocket", "pocket");
                            }}
                            className={cn(
                              "p-3.5 rounded-2xl text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer border",
                              isSelected
                                ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#8A4418] shadow-md scale-[1.01]"
                                : "bg-white hover:bg-[#FFF8F1] border-[#E5E3DD] shadow-2xs hover:shadow-xs"
                            )}
                          >
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                                  isSelected ? "border-[#8A4418] bg-[#FDFBF7]" : "border-[#B8A392] bg-transparent"
                                )}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                              </div>
                            </div>

                            <div className="w-full flex items-center justify-center pt-2 pb-1 h-24 sm:h-28">
                              <img
                                src="/customizer/sleeves_half_pocket.png"
                                alt="Half Sleeve With Pocket"
                                className="h-full w-auto max-w-[155px] object-contain drop-shadow-xs"
                              />
                            </div>

                            <span
                              className={cn(
                                "w-full py-1.5 px-3 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2",
                                isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
                              )}
                            >
                              WITH POCKET
                            </span>
                          </div>
                        );
                      })()}

                      {/* Half Sleeve WITHOUT Pocket */}
                      {(() => {
                        const isSelected = form.selectedSleeves === "half" && form.selectedPocket === "no-pocket";
                        return (
                          <div
                            onClick={() => {
                              set("selectedSleeves", "half");
                              set("selectedPocket", "no-pocket");
                            }}
                            className={cn(
                              "p-3.5 rounded-2xl text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer border",
                              isSelected
                                ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#8A4418] shadow-md scale-[1.01]"
                                : "bg-white hover:bg-[#FFF8F1] border-[#E5E3DD] shadow-2xs hover:shadow-xs"
                            )}
                          >
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                                  isSelected ? "border-[#8A4418] bg-[#FDFBF7]" : "border-[#B8A392] bg-transparent"
                                )}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                              </div>
                            </div>

                            <div className="w-full flex items-center justify-center pt-2 pb-1 h-24 sm:h-28">
                              <img
                                src="/customizer/sleeves_half_nopocket.png"
                                alt="Half Sleeve Without Pocket"
                                className="h-full w-auto max-w-[155px] object-contain drop-shadow-xs"
                              />
                            </div>

                            <span
                              className={cn(
                                "w-full py-1.5 px-3 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2",
                                isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
                              )}
                            >
                              WITHOUT POCKET
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* FULL SLEEVE SECTION */}
                  <div className="space-y-3 pt-2">
                    {/* Section Header Divider */}
                    <div className="flex items-center gap-3 w-full">
                      <div className="h-[1.5px] flex-1 bg-[#8E6F57]/40" />
                      <span className="px-5 py-1 rounded-full bg-[#8A4418] text-white font-serif text-xs font-bold tracking-widest uppercase shadow-xs">
                        FULL SLEEVE
                      </span>
                      <div className="h-[1.5px] flex-1 bg-[#8E6F57]/40" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Full Sleeve WITH Pocket */}
                      {(() => {
                        const isSelected = form.selectedSleeves === "full" && form.selectedPocket === "pocket";
                        return (
                          <div
                            onClick={() => {
                              set("selectedSleeves", "full");
                              set("selectedPocket", "pocket");
                            }}
                            className={cn(
                              "p-3.5 rounded-2xl text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer border",
                              isSelected
                                ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#8A4418] shadow-md scale-[1.01]"
                                : "bg-white hover:bg-[#FFF8F1] border-[#E5E3DD] shadow-2xs hover:shadow-xs"
                            )}
                          >
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                                  isSelected ? "border-[#8A4418] bg-[#FDFBF7]" : "border-[#B8A392] bg-transparent"
                                )}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                              </div>
                            </div>

                            <div className="w-full flex items-center justify-center pt-2 pb-1 h-24 sm:h-28">
                              <img
                                src="/customizer/sleeves_full_pocket.png"
                                alt="Full Sleeve With Pocket"
                                className="h-full w-auto max-w-[155px] object-contain drop-shadow-xs"
                              />
                            </div>

                            <span
                              className={cn(
                                "w-full py-1.5 px-3 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2",
                                isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
                              )}
                            >
                              WITH POCKET
                            </span>
                          </div>
                        );
                      })()}

                      {/* Full Sleeve WITHOUT Pocket */}
                      {(() => {
                        const isSelected = form.selectedSleeves === "full" && form.selectedPocket === "no-pocket";
                        return (
                          <div
                            onClick={() => {
                              set("selectedSleeves", "full");
                              set("selectedPocket", "no-pocket");
                            }}
                            className={cn(
                              "p-3.5 rounded-2xl text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer border",
                              isSelected
                                ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#8A4418] shadow-md scale-[1.01]"
                                : "bg-white hover:bg-[#FFF8F1] border-[#E5E3DD] shadow-2xs hover:shadow-xs"
                            )}
                          >
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                                  isSelected ? "border-[#8A4418] bg-[#FDFBF7]" : "border-[#B8A392] bg-transparent"
                                )}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                              </div>
                            </div>

                            <div className="w-full flex items-center justify-center pt-2 pb-1 h-24 sm:h-28">
                              <img
                                src="/customizer/sleeves_full_nopocket.png"
                                alt="Full Sleeve Without Pocket"
                                className="h-full w-auto max-w-[155px] object-contain drop-shadow-xs"
                              />
                            </div>

                            <span
                              className={cn(
                                "w-full py-1.5 px-3 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2",
                                isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
                              )}
                            >
                              WITHOUT POCKET
                            </span>
                          </div>
                        );
                      })()}
                    </div>
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
                        if (!form.selectedSleeves || !form.selectedPocket) {
                          toast.error("Please select a sleeve style and pocket option to continue.");
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
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                        Step 5 of 6
                      </span>
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
                      Back to Sleeves & Pockets
                    </Button>
                  </div>

                  {/* 1. COLLAR STYLE */}
                  <div className="space-y-3">
                    {/* Divider Badge with Center Pill */}
                    <div className="flex items-center gap-3 w-full mb-3">
                      <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                      <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                        COLLAR STYLE
                      </span>
                      <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {COLLAR_OPTIONS.map((c) => {
                        const isSelected =
                          form.selectedCollar === c.id ||
                          (!!form.selectedCollar && !!c.matchKey && form.selectedCollar.toUpperCase().includes(c.matchKey));
                        return (
                          <div
                            key={c.id}
                            onClick={() => set("selectedCollar", c.id)}
                            className={cn(
                              "p-3 rounded-2xl text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer border",
                              isSelected
                                ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#8A4418] shadow-md scale-[1.01]"
                                : "bg-white hover:bg-[#FFF8F1] border-[#E5E3DD] shadow-2xs hover:shadow-xs"
                            )}
                          >
                            {/* Radio Circle Top-Left */}
                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                                  isSelected ? "border-[#8A4418] bg-[#FDFBF7]" : "border-[#B8A392] bg-transparent"
                                )}
                              >
                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                              </div>
                            </div>

                            {/* Collar Photo */}
                            <div className="w-full flex items-center justify-center pt-2 pb-1 h-20 sm:h-24">
                              <img
                                src={c.image}
                                alt={c.title}
                                className="max-h-full max-w-full object-contain drop-shadow-xs"
                              />
                            </div>

                            {/* Pill Badge */}
                            <span
                              className={cn(
                                "w-full py-1.5 px-3 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2 min-h-[30px] flex items-center justify-center leading-tight whitespace-pre-line",
                                isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
                              )}
                            >
                              {c.badge || c.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* If Full Sleeves: Show Cuff Design + Monogram + Thread Color */}
                  {form.selectedSleeves === "full" && (
                    <>
                      {/* 2. CUFF DESIGN */}
                      <div className="space-y-3 pt-2">
                        {/* Divider Badge with Center Pill */}
                        <div className="flex items-center gap-3 w-full mb-3 mt-2">
                          <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                            CUFF STYLE
                          </span>
                          <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {CUFF_OPTIONS.map((c) => {
                            const isSelected =
                              form.selectedCuff === c.id ||
                              (!!form.selectedCuff && !!c.matchKeys && c.matchKeys.some((k) => form.selectedCuff?.toUpperCase().includes(k)));
                            return (
                              <div
                                key={c.id}
                                onClick={() => set("selectedCuff", c.id)}
                                className={cn(
                                  "p-3 rounded-2xl text-center transition-all duration-200 flex flex-col justify-between items-center relative cursor-pointer border",
                                  isSelected
                                    ? "bg-gradient-to-b from-[#FFF5EC] to-[#F5E2D2] border-2 border-[#8A4418] shadow-md scale-[1.01]"
                                    : "bg-white hover:bg-[#FFF8F1] border-[#E5E3DD] shadow-2xs hover:shadow-xs"
                                )}
                              >
                                {/* Radio Circle Top-Left */}
                                <div className="absolute top-3 left-3 w-5 h-5 rounded-full flex items-center justify-center transition-all">
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full flex items-center justify-center transition-all border-2",
                                      isSelected ? "border-[#8A4418] bg-[#FDFBF7]" : "border-[#B8A392] bg-transparent"
                                    )}
                                  >
                                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#8A4418]" />}
                                  </div>
                                </div>

                                {/* Cuff Photo */}
                                <div className="w-full flex items-center justify-center pt-2 pb-1 h-20 sm:h-24">
                                  <img
                                    src={c.image}
                                    alt={c.title}
                                    className="max-h-full max-w-full object-contain drop-shadow-xs"
                                  />
                                </div>

                                {/* Pill Badge */}
                                <span
                                  className={cn(
                                    "w-full py-1.5 px-3 rounded-full font-serif text-xs font-bold tracking-wider uppercase transition-colors text-center mt-2 min-h-[30px] flex items-center justify-center leading-tight whitespace-pre-line",
                                    isSelected ? "bg-[#8A4418] text-white shadow-2xs" : "bg-[#E6D5C3] text-[#140E0A]"
                                  )}
                                >
                                  {c.badge || c.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. INITIALS */}
                      <div className="space-y-3 pt-2">
                        {/* Divider Badge with Center Pill */}
                        <div className="flex items-center gap-3 w-full mb-3 mt-2">
                          <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                          <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#9A5426] via-[#8C471C] to-[#9A5426] text-white text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase shadow-[0_2px_6px_rgba(146,76,30,0.25)] shrink-0">
                            INITIALS
                          </span>
                          <div className="h-[1.5px] flex-1 bg-[#8E6F57]" />
                        </div>

                        {/* 2-Part Grid: Monogram Input on Left, Thread Color Dropdown on Right */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Left: Do You Need Monogram? */}
                          <div className="bg-[#FFF8F1]/90 border border-[#DFC8B4] rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
                            <div>
                              <label className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#1F1A17] uppercase block mb-1.5">
                                DO YOU NEED MONOGRAM?
                              </label>
                              <div className="relative flex items-center">
                                <input
                                  type="text"
                                  maxLength={3}
                                  value={form.monogram}
                                  onChange={(e) => {
                                    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
                                    set("monogram", val);
                                  }}
                                  placeholder="e.g. YS (Optional)"
                                  className="w-full bg-white border border-[#D5C2AF] rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-widest text-[#1F1A17] placeholder:text-[#9B897D] placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:border-[#9A5426] focus:ring-1 focus:ring-[#9A5426]/30 shadow-2xs transition-all uppercase"
                                />
                                {form.monogram && (
                                  <button
                                    type="button"
                                    onClick={() => set("monogram", "")}
                                    className="absolute right-3 text-[#8A796E] hover:text-[#1F1A17] text-xs font-bold p-1 cursor-pointer"
                                    title="Clear monogram"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="mt-2 text-[10px] text-[#8A796E]">
                              Up to 3 custom embroidered initials on cuff (e.g. YS).
                            </p>
                          </div>

                          {/* Right: Select Thread Color Dropdown */}
                          <div className="bg-[#FFF8F1]/90 border border-[#DFC8B4] rounded-2xl p-3.5 shadow-2xs flex flex-col justify-between">
                            <div>
                              <label className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#1F1A17] uppercase block mb-1.5">
                                SELECT THREAD COLOR
                              </label>
                              <div className="relative flex items-center">
                                {form.threadColor && (
                                  <div
                                    className="w-3.5 h-3.5 rounded-full shrink-0 ml-3 mr-[-26px] z-10 border border-black/20 shadow-2xs pointer-events-none"
                                    style={{
                                      backgroundColor:
                                        THREAD_COLOR_OPTIONS.find((t) => t.value === form.threadColor)?.hex ||
                                        (form.threadColor === "black"
                                          ? "#14110E"
                                          : form.threadColor === "white"
                                          ? "#FFFFFF"
                                          : form.threadColor === "gold"
                                          ? "#B8860B"
                                          : form.threadColor === "burgundy"
                                          ? "#6B1F2A"
                                          : form.threadColor === "silver"
                                          ? "#71717A"
                                          : "#1E40AF"),
                                    }}
                                  />
                                )}
                                <select
                                  value={form.threadColor || ""}
                                  onChange={(e) => set("threadColor", e.target.value)}
                                  className={`w-full bg-white border border-[#D5C2AF] rounded-xl ${
                                    form.threadColor ? "pl-8 text-[#1F1A17] font-semibold" : "pl-3 text-[#8A796E] font-normal"
                                  } pr-8 py-2.5 text-xs focus:outline-none focus:border-[#9A5426] focus:ring-1 focus:ring-[#9A5426]/30 shadow-2xs transition-all cursor-pointer appearance-none`}
                                >
                                  <option value="">Select Thread Color</option>
                                  {THREAD_COLOR_OPTIONS.map((tc) => (
                                    <option key={tc.value} value={tc.value}>
                                      {tc.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute right-3 flex items-center text-[#8A796E]">
                                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <p className="mt-2 text-[10px] text-[#8A796E]">
                              Thread color for bespoke embroidery matching website customizer.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 4. THREAD COLOR OPTIONS (MULTIPLE SELECTION + DISABLE BUTTON ON SIDE) */}
                      <div className="space-y-3 pt-3 border-t border-[#EAE3D9]">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#14110E]">
                                Available Thread Colors for Monogram
                              </h4>
                              <span className="rounded-full bg-white border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#9E774C]">
                                {form.selectedThreadColors.length > 0
                                  ? `${form.selectedThreadColors.length} Colors Selected`
                                  : "All Colors Active"}
                              </span>
                            </div>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              Admin controls: Choose which embroidery thread colors are available for this product:
                            </p>
                          </div>

                          {/* Quick Actions Header Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                set(
                                  "selectedThreadColors",
                                  THREAD_COLOR_OPTIONS.map((c) => c.value)
                                );
                              }}
                              className="rounded-lg border border-[#D6CEBF] bg-white px-3 py-1.5 text-xs font-semibold text-[#14110E] hover:bg-[#FAF8F5] transition cursor-pointer shadow-2xs"
                            >
                              ✓ Select All
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                set("selectedThreadColors", []);
                              }}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] hover:bg-red-100 transition cursor-pointer"
                            >
                              ✕ Reset
                            </button>
                          </div>
                        </div>

                        {/* Color Options Grid with Swatches and Side Disable/Enable Button */}
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {THREAD_COLOR_OPTIONS.map((opt) => {
                            const isEnabled = form.selectedThreadColors.length === 0 || form.selectedThreadColors.includes(opt.value);

                            return (
                              <div
                                key={opt.value}
                                className={cn(
                                  "flex items-center justify-between gap-3 rounded-xl border p-3 transition-all",
                                  isEnabled
                                    ? "border-[#14110E] bg-white shadow-2xs"
                                    : "border-[#E5E7EB] bg-[#FAF8F5] opacity-55"
                                )}
                              >
                                {/* Left side: Swatch + Title */}
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className="h-6 w-6 shrink-0 rounded-full border border-[#D1D5DB] shadow-2xs"
                                    style={{
                                      backgroundColor: opt.hex,
                                      boxShadow: opt.hex === "#FFFFFF" ? "inset 0 0 0 1px #E5E7EB" : undefined,
                                    }}
                                  />
                                  <div className="min-w-0">
                                    <p className={cn("text-xs font-bold uppercase tracking-wider truncate", isEnabled ? "text-[#14110E]" : "text-[#6B7280]")}>
                                      {opt.label}
                                    </p>
                                    <p className="text-[10px] text-[#9CA3AF]">
                                      {isEnabled ? "Active • Available for Monogram" : "Disabled • Not shown to customer"}
                                    </p>
                                  </div>
                                </div>

                                {/* Right side: Button to Disable / Enable */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isEnabled) {
                                      const base = form.selectedThreadColors.length === 0
                                        ? THREAD_COLOR_OPTIONS.map((c) => c.value)
                                        : form.selectedThreadColors;
                                      set(
                                        "selectedThreadColors",
                                        base.filter((c) => c !== opt.value)
                                      );
                                    } else {
                                      set("selectedThreadColors", [...form.selectedThreadColors, opt.value]);
                                    }
                                  }}
                                  className={cn(
                                    "shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer flex items-center gap-1",
                                    isEnabled
                                      ? "border border-red-200 bg-red-50 text-[#B91C1C] hover:bg-red-100 hover:border-red-300"
                                      : "border border-[#14110E] bg-[#14110E] text-white hover:bg-neutral-800"
                                  )}
                                >
                                  {isEnabled ? (
                                    <>
                                      <span>✕</span> Disable
                                    </>
                                  ) : (
                                    <>
                                      <span>+</span> Enable
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
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
                      Back to Sleeves & Pockets
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
                        {form.selectedThreadColors && form.selectedThreadColors.length > 0 && (
                          <span className="rounded-full bg-[#9E774C] px-2.5 py-0.5 text-[10px] font-bold text-white">
                            Threads: {form.selectedThreadColors.length} colors
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
