"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useAdminApi } from "@/lib/admin/api";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import type { AdminFabric } from "@/lib/admin/types";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { useConfirm, useToast } from "./feedback";
import { ErrorList, NumberField, SelectField, TextAreaField, TextField, Toggle, inputClass } from "./fields";
import { ImageField, MediaPickerModal, MediaPreview, cleanMediaUrl } from "./media";
import { Button, Card, CardHeader, Notice, cn } from "./ui";

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
    desc: "Tapered drape, form-fitting chest & slim sleeves",
    badge: "Slim Drape",
  },
  {
    id: "regular" as const,
    name: "Regular Fit",
    desc: "Classic British tailoring with comfortable ease",
    badge: "Primary Swatch Photo",
  },
  {
    id: "tummy" as const,
    name: "Tummy Fit",
    desc: "Relaxed midsection with clean shoulder drape",
    badge: "Comfort Drape",
  },
];

export const CATEGORY_OPTIONS = [
  { value: "oxford_twill", label: "Oxford & Twill" },
  { value: "stripes", label: "Giza Stripes" },
  { value: "linen", label: "Normandy Linen" },
  { value: "wool", label: "Merino & Cashmere" },
  { value: "velvet_silk", label: "Velvet & Silk" },
];

interface FormState {
  code: string;
  name: string;
  category: string;
  categoryLabel: string;
  composition: string;
  yarnCount: string;
  weave: string;
  weight: string;
  gsm: string;
  origin: string;
  opacity: string;
  breathability: string;
  wrinkleResistance: string;
  image: string;
  bodyImages: {
    lean: string;
    regular: string;
    tummy: string;
  };
  gallery: string[];
  description: string;
  shortInfo: string;
  price: string;
  compareAtPrice: string;
  rating: number | "";
  reviewsCount: number | "";
  bestFor: string;
  care: string;
  accentColor: string;
  active: boolean;
  sortOrder: number | "";
  selectedChest: number;
  selectedBodyType: "lean" | "regular" | "tummy";
}

function toForm(f?: AdminFabric | null): FormState {
  const mainImg = cleanMediaUrl(f?.image ?? "");
  const gal = f?.gallery ? f.gallery.map(cleanMediaUrl) : [];

  return {
    code: f?.code ?? "",
    name: f?.name ?? "",
    category: f?.category ?? "oxford_twill",
    categoryLabel: f?.categoryLabel ?? "",
    composition: f?.composition ?? "",
    yarnCount: f?.yarnCount ?? "",
    weave: f?.weave ?? "",
    weight: f?.weight ?? "All-Season Sartorial",
    gsm: f?.gsm ?? "",
    origin: f?.origin ?? "",
    opacity: f?.opacity ?? "100% Opaque",
    breathability: f?.breathability ?? "High (4.8 / 5.0)",
    wrinkleResistance: f?.wrinkleResistance ?? "Natural Resilient Drape",
    image: mainImg,
    bodyImages: {
      regular: mainImg || gal[0] || "",
      lean: gal[1] || "",
      tummy: gal[2] || "",
    },
    gallery: gal,
    description: f?.description ?? "",
    shortInfo: f?.shortInfo ?? "",
    price: f?.price ?? "Rs. 3,290 • BESPOKE FIT",
    compareAtPrice: f?.compareAtPrice ?? "",
    rating: f?.rating !== undefined && f?.rating !== null ? f.rating : 5.0,
    reviewsCount: f?.reviewsCount !== undefined && f?.reviewsCount !== null ? f.reviewsCount : 0,
    bestFor: f?.bestFor ?? "",
    care: f?.care ?? "Machine Wash at 30°C • Medium Iron",
    accentColor: f?.accentColor ?? "#9E774C",
    active: f?.active ?? true,
    sortOrder: f?.sortOrder ?? 0,
    selectedChest: 40,
    selectedBodyType: "regular",
  };
}

function toBody(f: FormState) {
  const int = (v: number | "") => (v === "" ? 0 : Math.round(Number(v)));
  const num = (v: number | "") => (v === "" ? 5.0 : Number(v));
  const regImg = cleanMediaUrl(f.bodyImages.regular.trim());
  const leanImg = cleanMediaUrl(f.bodyImages.lean.trim());
  const tumImg = cleanMediaUrl(f.bodyImages.tummy.trim());
  const primaryImage = regImg || leanImg || tumImg || cleanMediaUrl(f.image.trim());

  const gallerySet = new Set<string>();
  if (primaryImage) gallerySet.add(primaryImage);
  if (regImg) gallerySet.add(regImg);
  if (leanImg) gallerySet.add(leanImg);
  if (tumImg) gallerySet.add(tumImg);
  f.gallery.forEach((g) => {
    const c = cleanMediaUrl(g.trim());
    if (c) gallerySet.add(c);
  });
  const galleryItems = Array.from(gallerySet);

  return {
    code: f.code.trim().toUpperCase(),
    name: f.name.trim(),
    category: f.category,
    categoryLabel: f.categoryLabel.trim(),
    composition: f.composition.trim(),
    yarnCount: f.yarnCount.trim(),
    weave: f.weave.trim(),
    weight: f.weight.trim(),
    gsm: f.gsm.trim(),
    origin: f.origin.trim(),
    opacity: f.opacity.trim(),
    breathability: f.breathability.trim(),
    wrinkleResistance: f.wrinkleResistance.trim(),
    image: primaryImage,
    gallery: galleryItems,
    description: f.description.trim(),
    shortInfo: f.shortInfo.trim(),
    price: f.price.trim(),
    compareAtPrice: f.compareAtPrice.trim(),
    rating: num(f.rating),
    reviewsCount: int(f.reviewsCount),
    bestFor: f.bestFor.trim() || `Tailored Fit (Chest ${f.selectedChest}")`,
    care: f.care.trim(),
    accentColor: f.accentColor.trim(),
    active: f.active,
    sortOrder: int(f.sortOrder),
  };
}

export default function FabricForm({
  fabric,
  onSaved,
}: {
  fabric?: AdminFabric | null;
  onSaved?: (f: AdminFabric) => void;
}) {
  const isNew = !fabric;
  const router = useRouter();
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();

  const [baseline, setBaseline] = useState(() => toForm(fabric));
  const [form, setForm] = useState(baseline);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [imageStep, setImageStep] = useState<1 | 2>(1);
  const [activePickerKey, setActivePickerKey] = useState<"lean" | "regular" | "tummy" | "gallery" | null>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty && !saving);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setBodyImage = (type: "lean" | "regular" | "tummy", url: string) => {
    const cleaned = cleanMediaUrl(url);
    setForm((f) => {
      const nextBodyImages = { ...f.bodyImages, [type]: cleaned };
      const primary = nextBodyImages.regular || nextBodyImages.lean || nextBodyImages.tummy || cleaned;
      return {
        ...f,
        bodyImages: nextBodyImages,
        image: primary,
      };
    });
    setErrors((e) => {
      const next = { ...e };
      delete next.image;
      return next;
    });
  };

  const categoryOptions = useMemo(() => {
    const list = [...CATEGORY_OPTIONS];
    if (form.category && !list.some((o) => o.value === form.category)) {
      list.unshift({ value: form.category, label: form.category });
    }
    return list;
  }, [form.category]);

  const submit = async (e?: FormEvent) => {
    e?.preventDefault();
    const local: Record<string, string> = {};
    if (!form.name.trim()) local.name = "Fabric name is required";
    if (!form.code.trim()) local.code = "Fabric code / SKU is required";
    if (!form.category) local.category = "Category is required";
    if (!form.price.trim()) local.price = "Price / Label is required";

    const primaryImg = (form.bodyImages.regular || form.bodyImages.lean || form.bodyImages.tummy || form.image).trim();
    if (!primaryImg) {
      local.image = "Please upload at least one swatch image (Regular Fit, Lean Fit or Tummy Fit).";
      setImageStep(2);
    }

    if (Object.keys(local).length) {
      setErrors(local);
      toast.error(local.image ? local.image : "Please fill in the required fields highlighted below.");
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const body = toBody(form);
      const saved = isNew
        ? await request<AdminFabric>("/fabrics", { method: "POST", body })
        : await request<AdminFabric>(`/fabrics/${fabric!.id}`, { method: "PATCH", body });

      const next = toForm(saved);
      setBaseline(next);
      setForm(next);
      onSaved?.(saved);
      toast.success(isNew ? "Fabric created successfully" : "Fabric changes saved");
      if (isNew) {
        router.replace(`/admin/fabrics/${saved.id}`);
      }
    } catch (err) {
      const fe = fieldErrors(err);
      setErrors(Object.keys(fe).length ? fe : { _: errorMessage(err) });
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!fabric) return;
    const ok = await confirm({
      title: `Delete fabric "${fabric.name}"?`,
      message: `Code: ${fabric.code}. This fabric will be removed from your catalog. You can also hide it instead of deleting.`,
      confirmLabel: "Delete fabric",
      danger: true,
    });
    if (!ok) return;

    try {
      await request(`/fabrics/${fabric.id}`, { method: "DELETE" });
      setBaseline(form);
      toast.success("Fabric deleted");
      router.replace("/admin/fabrics");
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <form onSubmit={submit} className="pb-28">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left Column: Form Fields */}
        <div className="min-w-0 space-y-6">
          {errors._ && <Notice tone="red">{errors._}</Notice>}
          {Object.keys(errors).filter((k) => k !== "_").length > 0 && (
            <ErrorList errors={Object.fromEntries(Object.entries(errors).filter(([k]) => k !== "_"))} />
          )}

          {/* Section 1: Basics */}
          <Card>
            <CardHeader
              title="Basics"
              description="Basic information about the fabric shown on the website."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField
                label="Fabric Name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
                placeholder="e.g. Optic White Royal Oxford"
                maxLength={200}
              />
              <TextField
                label="Fabric Code / SKU"
                required
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                error={errors.code}
                placeholder="e.g. OX-140-WH"
                hint="Unique code shown on swatch cards and search."
                maxLength={60}
              />
              <SelectField
                label="Category"
                required
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                options={categoryOptions}
                error={errors.category}
              />
              <TextField
                label="Category Sub-Title (Badge)"
                value={form.categoryLabel}
                onChange={(e) => set("categoryLabel", e.target.value)}
                error={errors.categoryLabel}
                placeholder="e.g. 2-PLY ROYAL OXFORD"
                hint="Upper badge shown above the fabric name."
                maxLength={120}
              />
              <TextField
                label="Price / Display Label"
                required
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                error={errors.price}
                placeholder="e.g. Rs. 3,290 • BESPOKE FIT"
                maxLength={120}
                hint="Selling price shown to customers."
              />
              <TextField
                label="Compare-at Price (Discount MRP)"
                value={form.compareAtPrice}
                onChange={(e) => set("compareAtPrice", e.target.value)}
                error={errors.compareAtPrice}
                placeholder="e.g. Rs. 4,190"
                maxLength={120}
                hint="Shown struck-through next to price to show a discount."
              />
              <TextField
                label="Tag / Short Info"
                value={form.shortInfo}
                onChange={(e) => set("shortInfo", e.target.value)}
                error={errors.shortInfo}
                placeholder="e.g. 140/2 Ne Egyptian Giza · 135 GSM"
                hint="Small subtitle shown directly under the name."
                maxLength={300}
              />
              <NumberField
                label="Sort Order"
                value={form.sortOrder}
                onValue={(v) => set("sortOrder", v)}
                error={errors.sortOrder}
                hint="Lower numbers appear first on the page."
                step={1}
              />
              <div className="sm:col-span-2">
                <TextAreaField
                  label="Description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  error={errors.description}
                  placeholder="Describe the fabric texture, hand-feel, finish, and sartorial heritage..."
                  maxLength={5000}
                />
              </div>
            </div>
          </Card>

          {/* ========================================================================= */}
          {/* SECTION 2: UPLOAD YOUR IMAGE (2-STEP FLOW)                                */}
          {/* ========================================================================= */}
          <Card>
            <CardHeader
              title="Upload Your Image"
              description="Pehle Chest Size select karke Continue karein, fir Lean Fit, Regular Fit, aur Tummy Fit me images upload karein."
              actions={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setImageStep(1)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer",
                      imageStep === 1 ? "bg-[#14110E] text-white" : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                    )}
                  >
                    1. Chest ({form.selectedChest}&quot;)
                  </button>
                  <span className="text-xs text-[#9CA3AF]">→</span>
                  <button
                    type="button"
                    onClick={() => setImageStep(2)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer",
                      imageStep === 2 ? "bg-[#14110E] text-white" : "bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB]"
                    )}
                  >
                    2. Choose Body Type
                  </button>
                </div>
              }
            />

            <div className="space-y-4 p-4 sm:p-5">
              {/* STEP 1: SELECT YOUR CHEST SIZE */}
              {imageStep === 1 && (
                <div className="rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-5 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="inline-block rounded-md bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                        Step 1 of 2
                      </span>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Select Your Chest Size
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Chest size select karne ke baad Continue button dabayein:
                      </p>
                    </div>
                    <span className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#9E774C] border border-[#E5E7EB] shadow-2xs">
                      Selected: {form.selectedChest}&quot; Chest
                    </span>
                  </div>

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

                  <div className="mt-5 flex items-center justify-between border-t border-[#EAE3D9] pt-4">
                    <p className="text-xs text-[#6B7280]">
                      Selected Chest: <strong className="text-[#14110E]">{form.selectedChest}&quot; Sizing</strong>
                    </p>
                    <Button
                      type="button"
                      onClick={() => setImageStep(2)}
                      className="bg-[#14110E] text-white hover:bg-neutral-800 px-6 font-semibold"
                      icon={<ChevronRight className="h-4 w-4" />}
                    >
                      Continue to Choose Body Type
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: CHOOSE YOUR BODY TYPE & UPLOAD IMAGES */}
              {imageStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E5E7EB] bg-[#FAF8F5] p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md bg-[#2F6B3B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Step 2 of 2
                        </span>
                        <span className="rounded-full bg-[#14110E] px-2.5 py-0.5 text-[10px] font-bold text-white">
                          Chest Size: {form.selectedChest}&quot;
                        </span>
                      </div>
                      <h4 className="mt-1 font-serif text-base font-bold text-[#14110E]">
                        Choose Your Body Type & Upload Images
                      </h4>
                      <p className="text-xs text-[#6B7280]">
                        Lean Fit, Regular Fit, aur Tummy Fit me <strong>Chest {form.selectedChest}&quot;</strong> ke mutabiq photos upload karein:
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setImageStep(1)}
                        icon={<ChevronLeft className="h-3.5 w-3.5" />}
                      >
                        Change Chest Size ({form.selectedChest}&quot;)
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const reg = form.bodyImages.regular.trim() || form.image.trim();
                          if (reg) {
                            setForm((f) => ({
                              ...f,
                              bodyImages: { lean: reg, regular: reg, tummy: reg },
                              image: reg,
                            }));
                            toast.success("Regular Fit swatch applied to Lean and Tummy Fit");
                          } else {
                            toast.error("Please upload Regular Fit swatch first");
                          }
                        }}
                      >
                        Use Regular photo for all 3
                      </Button>
                    </div>
                  </div>

                  {errors.image && <Notice tone="red">{errors.image}</Notice>}

                  {/* 3 Body Type Upload Cards */}
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {BODY_TYPE_DEFS.map((b) => {
                      const imgVal = form.bodyImages[b.id] || "";
                      const isFilled = !!imgVal.trim();
                      const isDefault = form.selectedBodyType === b.id;

                      return (
                        <div
                          key={b.id}
                          className={cn(
                            "flex flex-col justify-between rounded-xl border p-4 bg-white transition-all shadow-xs",
                            isDefault
                              ? "border-[#14110E] ring-1 ring-[#14110E]"
                              : isFilled
                              ? "border-[#C6E0CB]"
                              : "border-[#E5E7EB] hover:border-[#9E774C]"
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="rounded-md bg-[#FAF8F5] border border-[#EAE3D9] px-2 py-0.5 text-[10px] font-bold text-[#8A5A00] uppercase">
                                Chest {form.selectedChest}&quot;
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                  b.id === "regular"
                                    ? "bg-[#14110E] text-white"
                                    : "bg-[#F3F4F6] text-[#4B5563]"
                                )}
                              >
                                {b.badge}
                              </span>
                            </div>

                            <div className="flex items-baseline justify-between">
                              <h4 className="font-serif text-base font-bold text-[#14110E]">
                                {b.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => {
                                  set("selectedBodyType", b.id);
                                }}
                                className={cn(
                                  "text-[10px] font-semibold underline cursor-pointer",
                                  isDefault ? "text-[#14110E] font-bold" : "text-[#9E774C]"
                                )}
                              >
                                {isDefault ? "Active Drape ✓" : "Set Default"}
                              </button>
                            </div>

                            <p className="mt-1 text-xs text-[#6B7280]">
                              {b.desc}
                            </p>
                          </div>

                          {/* Image Upload Box */}
                          <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setActivePickerKey(b.id)}
                              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#9E774C] transition"
                              title={`Click to choose image for ${b.name}`}
                            >
                              <MediaPreview src={imgVal} className="h-full w-full aspect-square rounded-none border-0" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                                {isFilled ? "Change" : "Upload"}
                              </div>
                            </button>

                            <div className="min-w-0 flex-1 space-y-1.5">
                              <input
                                className={cn(inputClass, "h-8 text-xs")}
                                value={imgVal}
                                placeholder={`Swatch for ${b.name} (Chest ${form.selectedChest}")…`}
                                onChange={(e) => setBodyImage(b.id, e.target.value)}
                              />
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={isFilled ? "secondary" : "primary"}
                                  className="h-7 text-xs px-2.5"
                                  onClick={() => setActivePickerKey(b.id)}
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
                                    onClick={() => setBodyImage(b.id, "")}
                                    icon={<X className="h-3 w-3" />}
                                  >
                                    Clear
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Section 3: Material & Specifications */}
          <Card>
            <CardHeader
              title="Material & Specifications"
              description="Technical fabric qualities that sartorial clients look for."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField
                label="Material / Composition"
                value={form.composition}
                onChange={(e) => set("composition", e.target.value)}
                error={errors.composition}
                placeholder="e.g. 100% Egyptian Giza 140s Cotton (2-Ply)"
                maxLength={250}
              />
              <TextField
                label="Yarn Count & Ply"
                value={form.yarnCount}
                onChange={(e) => set("yarnCount", e.target.value)}
                error={errors.yarnCount}
                placeholder="e.g. 140/2 Ne Compact Spun"
                maxLength={160}
              />
              <TextField
                label="Weave Type"
                value={form.weave}
                onChange={(e) => set("weave", e.target.value)}
                error={errors.weave}
                placeholder="e.g. High-Density Fine Twill Weave"
                maxLength={160}
              />
              <TextField
                label="Weight (GSM)"
                value={form.gsm}
                onChange={(e) => set("gsm", e.target.value)}
                error={errors.gsm}
                placeholder="e.g. 135 GSM"
                maxLength={80}
              />
              <TextField
                label="Fabric Weight Classification"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                error={errors.weight}
                placeholder="e.g. All-Season Sartorial"
                maxLength={160}
              />
              <TextField
                label="Origin / Mill"
                value={form.origin}
                onChange={(e) => set("origin", e.target.value)}
                error={errors.origin}
                placeholder="e.g. Nile Delta Harvest · Spun in Italy"
                maxLength={200}
              />
              <TextField
                label="Breathability"
                value={form.breathability}
                onChange={(e) => set("breathability", e.target.value)}
                error={errors.breathability}
                placeholder="e.g. High (4.8 / 5.0)"
                maxLength={120}
              />
              <TextField
                label="Wrinkle Resistance"
                value={form.wrinkleResistance}
                onChange={(e) => set("wrinkleResistance", e.target.value)}
                error={errors.wrinkleResistance}
                placeholder="e.g. Natural Resilient Twill Drape"
                maxLength={160}
              />
              <TextField
                label="Opacity"
                value={form.opacity}
                onChange={(e) => set("opacity", e.target.value)}
                error={errors.opacity}
                placeholder="e.g. 100% Opaque"
                maxLength={120}
              />
              <TextField
                label="Accent Color (Hex)"
                value={form.accentColor}
                onChange={(e) => set("accentColor", e.target.value)}
                error={errors.accentColor}
                placeholder="#9E774C"
                maxLength={30}
              />
              <div className="sm:col-span-2">
                <TextField
                  label="Best For (Garments & Occasions)"
                  value={form.bestFor}
                  onChange={(e) => set("bestFor", e.target.value)}
                  error={errors.bestFor}
                  placeholder="e.g. Executive Boardroom Shirts, French Cuff Formals"
                  maxLength={400}
                />
              </div>
              <div className="sm:col-span-2">
                <TextField
                  label="Care Instructions"
                  value={form.care}
                  onChange={(e) => set("care", e.target.value)}
                  error={errors.care}
                  placeholder="e.g. Dry Clean or Gentle Machine Wash at 30°C · Warm Steam Iron"
                  maxLength={400}
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Ratings & Reviews */}
          <Card>
            <CardHeader
              title="Ratings & Reviews"
              description="Customer rating out of 5 and client review count displayed on the fabric card."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <NumberField
                label="Rating (out of 5)"
                value={form.rating}
                onValue={(v) => set("rating", v)}
                error={errors.rating}
                min={0}
                max={5}
                step={0.1}
                placeholder="5.0"
                hint="Rating score from 0.0 to 5.0 (e.g. 4.9)."
              />
              <NumberField
                label="Client Reviews Count"
                value={form.reviewsCount}
                onValue={(v) => set("reviewsCount", v)}
                error={errors.reviewsCount}
                min={0}
                step={1}
                placeholder="0"
                hint="Total verified customer reviews (e.g. 24)."
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Sticky Sidebar with Visibility & Live Preview */}
        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader title="Visibility" />
            <div className="space-y-4 p-4 sm:p-5">
              <Toggle
                checked={form.active}
                onChange={(v) => set("active", v)}
                label="Visible on website"
                description="Hidden fabrics won't appear to customers on the website."
              />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Live preview"
              description="How this fabric looks on the website."
              actions={
                <a
                  href="/fabrics"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#9E774C] hover:underline"
                >
                  View Storefront <ExternalLink className="h-3 w-3" />
                </a>
              }
            />
            <div className="p-4 sm:p-5">
              <FabricPreviewCard form={form} />
            </div>
          </Card>
        </div>
      </div>

      <MediaPickerModal
        open={activePickerKey !== null}
        onClose={() => setActivePickerKey(null)}
        title={
          activePickerKey === "lean"
            ? `Choose Swatch for Lean Fit (Chest ${form.selectedChest}")`
            : activePickerKey === "regular"
            ? `Choose Swatch for Regular Fit (Chest ${form.selectedChest}")`
            : activePickerKey === "tummy"
            ? `Choose Swatch for Tummy Fit (Chest ${form.selectedChest}")`
            : "Choose an image"
        }
        onSelect={(url) => {
          if (activePickerKey === "lean" || activePickerKey === "regular" || activePickerKey === "tummy") {
            setBodyImage(activePickerKey, url);
          }
        }}
      />

      {/* Sticky Bottom Action Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur lg:left-64 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B7280]">
            {dirty ? (
              <span className="font-medium text-[#8A5A00]">Unsaved changes</span>
            ) : isNew ? (
              "New fabric"
            ) : (
              "All changes saved"
            )}
          </p>
          <div className="flex gap-2">
            {!isNew && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => void remove()}
                icon={<Trash2 className="h-4 w-4" />}
                className="text-[#B4402F] hover:text-[#B4402F]"
              >
                Delete
              </Button>
            )}
            {dirty && (
              <Button type="button" onClick={() => setForm(baseline)} disabled={saving}>
                Discard
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={!dirty && !isNew}
              icon={<Save className="h-4 w-4" />}
            >
              {isNew ? "Create fabric" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function FabricPreviewCard({ form }: { form: FormState }) {
  const mainImage = form.bodyImages.regular || form.bodyImages.lean || form.bodyImages.tummy || form.image;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300",
        !form.active && "opacity-60"
      )}
      style={{ borderColor: form.accentColor ? `${form.accentColor}55` : "#E5E7EB" }}
    >
      {/* Top Swatch Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3F4F6]">
        <MediaPreview src={mainImage} className="h-full w-full rounded-none border-0" />
        <span className="absolute left-2.5 top-2.5 rounded bg-[#14110E]/90 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white backdrop-blur">
          {form.code || "FABRIC-CODE"}
        </span>
        {form.gsm && (
          <span className="absolute right-2.5 top-2.5 rounded bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[#14110E] shadow-sm backdrop-blur">
            {form.gsm}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {form.categoryLabel && (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9E774C]">
            {form.categoryLabel}
          </p>
        )}
        <h3 className="mt-1 font-serif text-base font-bold leading-snug text-[#14110E]">
          {form.name || "Fabric Name"}
        </h3>
        {form.shortInfo && (
          <p className="mt-0.5 text-xs text-[#6B7280]">{form.shortInfo}</p>
        )}

        {/* Rating out of 5 & Reviews */}
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-[#FAF8F5] px-2.5 py-1.5 text-[11px] border border-[#F0EAE1]">
          <div className="flex items-center gap-1 font-semibold text-[#8A5A00]">
            <span className="text-[#9E774C]">★</span>
            <span>{form.rating === "" ? "5.0" : Number(form.rating).toFixed(1)} / 5.0</span>
          </div>
          <span className="text-[#8B93A1]">
            {form.reviewsCount ? `${form.reviewsCount} reviews` : "0 reviews"}
          </span>
        </div>

        {/* Specs Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-[#4B5563]">
          {form.composition && (
            <span className="rounded bg-[#F9FAFB] px-2 py-0.5 border border-[#EEF0F3]">
              {form.composition}
            </span>
          )}
          {form.weave && (
            <span className="rounded bg-[#F9FAFB] px-2 py-0.5 border border-[#EEF0F3]">
              {form.weave}
            </span>
          )}
        </div>

        {/* Price, Discount (Compare-at) & Best For */}
        <div className="mt-4 border-t border-[#F3F4F6] pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-bold text-[#14110E]">
              {form.price || "Price on request"}
            </span>
            {form.compareAtPrice && (
              <span className="text-xs font-medium text-[#9CA3AF] line-through">
                {form.compareAtPrice}
              </span>
            )}
          </div>
          {form.bestFor && (
            <p className="mt-1 line-clamp-2 text-[11px] text-[#8B93A1]">
              <span className="font-medium text-[#4B5563]">Best for:</span> {form.bestFor}
            </p>
          )}
        </div>

        {/* Bottom Accent Line */}
        <div
          className="mt-3 h-1 w-full rounded-full"
          style={{ backgroundColor: form.accentColor || "#9E774C" }}
        />
      </div>
    </div>
  );
}
