"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
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
import { MediaPickerModal, MediaPreview, cleanMediaUrl } from "./media";
import { Badge, Button, Card, CardHeader, Notice, cn } from "./ui";

export const CATEGORY_OPTIONS = [
  { value: "oxford_twill", label: "Oxford & Twill" },
  { value: "stripes", label: "Giza Stripes" },
  { value: "linen", label: "Normandy Linen" },
  { value: "wool", label: "Merino & Cashmere" },
  { value: "velvet_silk", label: "Velvet & Silk" },
];

export interface FabricImageStepDef {
  step: number;
  breadcrumb: string;
  title: string;
  subtitle: string;
  shortLabel: string;
}

export const FABRIC_IMAGE_STEPS: FabricImageStepDef[] = [
  {
    step: 1,
    breadcrumb: "CHEST SIZE",
    title: "SELECT YOUR CHEST SIZE",
    subtitle: "Choose your chest size for the perfect fit.",
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
  stepImages: string[];
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
}

function initStepImages(f?: AdminFabric | null): string[] {
  const steps = ["", "", "", "", "", ""];
  if (!f) return steps;

  if (f.gallery && f.gallery.length >= 6) {
    return f.gallery.slice(0, 6).map(cleanMediaUrl);
  }

  const pool = [cleanMediaUrl(f.image), ...(f.gallery ? f.gallery.map(cleanMediaUrl) : [])].filter(Boolean);
  for (let i = 0; i < pool.length && i < 6; i++) {
    steps[i] = pool[i];
  }
  return steps;
}

function toForm(f?: AdminFabric | null): FormState {
  const stepImages = initStepImages(f);
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
    stepImages,
    image: stepImages[0] || cleanMediaUrl(f?.image ?? ""),
    gallery: f?.gallery ? f.gallery.map(cleanMediaUrl) : stepImages.filter(Boolean),
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
  };
}

function toBody(f: FormState) {
  const int = (v: number | "") => (v === "" ? 0 : Math.round(Number(v)));
  const num = (v: number | "") => (v === "" ? 5.0 : Number(v));
  const cleanedSteps = f.stepImages.map((s) => cleanMediaUrl(s.trim()));
  const primaryImage = cleanedSteps[0] || cleanMediaUrl(f.image.trim());

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
    gallery: cleanedSteps.filter(Boolean),
    description: f.description.trim(),
    shortInfo: f.shortInfo.trim(),
    price: f.price.trim(),
    compareAtPrice: f.compareAtPrice.trim(),
    rating: num(f.rating),
    reviewsCount: int(f.reviewsCount),
    bestFor: f.bestFor.trim(),
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
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty && !saving);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

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

    // Enforce all 6 step images
    const missingSteps: { step: number; name: string }[] = [];
    form.stepImages.forEach((img, idx) => {
      if (!img || !img.trim()) {
        missingSteps.push({
          step: idx + 1,
          name: FABRIC_IMAGE_STEPS[idx].shortLabel,
        });
        local[`stepImage_${idx}`] = `Step ${idx + 1} (${FABRIC_IMAGE_STEPS[idx].shortLabel}) is required`;
      }
    });

    if (missingSteps.length > 0) {
      local.stepImages = `All 6 step images must be uploaded before saving. Missing: ${missingSteps
        .map((m) => `Step ${m.step} (${m.name})`)
        .join(", ")}`;
    }

    if (Object.keys(local).length) {
      setErrors(local);
      if (missingSteps.length > 0) {
        toast.error(`Please upload all 6 step images! (${missingSteps.length} missing)`);
      } else {
        toast.error("Please fill in the required fields highlighted below.");
      }
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
      toast.success(isNew ? "Fabric created successfully with all 6 step images" : "Fabric changes saved successfully");
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
    <form onSubmit={submit} className="pb-24">
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
                label="Fabric Code / SKU"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                error={errors.code}
                placeholder="e.g. OX-140-WH"
                maxLength={60}
                required
                hint="Unique identifier for internal references."
              />
              <TextField
                label="Fabric Name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                error={errors.name}
                placeholder="e.g. Optic White Royal Oxford"
                maxLength={200}
                required
              />
              <SelectField
                label="Category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                options={categoryOptions}
                error={errors.category}
                required
              />
              <TextField
                label="Category Label (Shown on badge)"
                value={form.categoryLabel}
                onChange={(e) => set("categoryLabel", e.target.value)}
                error={errors.categoryLabel}
                placeholder="e.g. 2-PLY ROYAL OXFORD"
                maxLength={120}
                hint="Uppercase subtitle displayed directly above the name."
              />
              <TextField
                label="Price / Label"
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

          {/* Section: Ratings & Reviews */}
          <Card>
            <CardHeader
              title="Ratings & Reviews"
              description="Social proof displayed on the fabric card."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <NumberField
                label="Rating (0.0 to 5.0)"
                value={form.rating}
                onValue={(v) => set("rating", v)}
                error={errors.rating}
                min={0}
                max={5}
                step={0.1}
                hint="Customer rating displayed with stars (e.g. 4.9)."
              />
              <NumberField
                label="Reviews Count"
                value={form.reviewsCount}
                onValue={(v) => set("reviewsCount", v)}
                error={errors.reviewsCount}
                min={0}
                step={1}
                hint="Number of customer reviews."
              />
            </div>
          </Card>

          {/* Section 2: Technical Specifications */}
          <Card>
            <CardHeader
              title="Technical Specifications"
              description="Yarn, weave, weight, and origin details shown in technical badges."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField
                label="Composition"
                value={form.composition}
                onChange={(e) => set("composition", e.target.value)}
                error={errors.composition}
                placeholder="e.g. 100% Egyptian Giza Cotton"
                maxLength={250}
              />
              <TextField
                label="Yarn Count"
                value={form.yarnCount}
                onChange={(e) => set("yarnCount", e.target.value)}
                error={errors.yarnCount}
                placeholder="e.g. 140/2 Ne Compact Double-Twist"
                maxLength={160}
              />
              <TextField
                label="Weave"
                value={form.weave}
                onChange={(e) => set("weave", e.target.value)}
                error={errors.weave}
                placeholder="e.g. 2x2 Royal Micro-Basketweave"
                maxLength={160}
              />
              <TextField
                label="Weight Description"
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                error={errors.weight}
                placeholder="e.g. All-Season Sartorial"
                maxLength={160}
              />
              <TextField
                label="GSM (Grams per Square Meter)"
                value={form.gsm}
                onChange={(e) => set("gsm", e.target.value)}
                error={errors.gsm}
                placeholder="e.g. 130 GSM"
                maxLength={80}
              />
              <TextField
                label="Origin / Mill"
                value={form.origin}
                onChange={(e) => set("origin", e.target.value)}
                error={errors.origin}
                placeholder="e.g. Nile Delta Harvest · Spun in Biella, Italy"
                maxLength={200}
              />
              <TextField
                label="Accent Color (Hex code)"
                value={form.accentColor}
                onChange={(e) => set("accentColor", e.target.value)}
                error={errors.accentColor}
                placeholder="#FAF8F5"
                maxLength={40}
                hint="Light hex color used for subtle background tint on the card."
              />
            </div>
          </Card>

          {/* Section 3: Performance & Care */}
          <Card>
            <CardHeader
              title="Performance & Care"
              description="Fabric qualities like opacity, breathability, and washing instructions."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <TextField
                label="Opacity"
                value={form.opacity}
                onChange={(e) => set("opacity", e.target.value)}
                error={errors.opacity}
                placeholder="e.g. 100% Solid Opaque"
                maxLength={120}
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
                placeholder="e.g. Natural Resilient Basketweave"
                maxLength={160}
              />
              <TextField
                label="Best For (Garment Types)"
                value={form.bestFor}
                onChange={(e) => set("bestFor", e.target.value)}
                error={errors.bestFor}
                placeholder="e.g. Classic White Dress Shirts, Spread Collars"
                maxLength={400}
              />
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

          {/* Section 4: 6-Step Image Upload Studio */}
          <Card>
            <CardHeader
              title="6-Step Fabric Showcase Images (All 6 Required)"
              description="Upload an image for each of the 6 fabric showcase stages below. All 6 steps must have an image before the fabric can be added or updated."
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
                {FABRIC_IMAGE_STEPS.map((stepDef, idx) => {
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
                            Step {stepDef.step} of 6 • {stepDef.breadcrumb}
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

                        {/* Step Title & Subtitle */}
                        <h4 className="text-xs font-bold text-[#14110E] uppercase tracking-wide leading-snug">
                          {stepDef.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-[#6B7280] leading-snug">
                          {stepDef.subtitle}
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

      {/* Media Picker Modal for Step Image Selection */}
      <MediaPickerModal
        open={activeStepIndex !== null}
        onClose={() => setActiveStepIndex(null)}
        title={
          activeStepIndex !== null
            ? `Choose Image for Step ${activeStepIndex + 1} (${FABRIC_IMAGE_STEPS[activeStepIndex].breadcrumb}): ${FABRIC_IMAGE_STEPS[activeStepIndex].title}`
            : "Choose an image"
        }
        onSelect={(url) => {
          if (activeStepIndex !== null) {
            setStepImage(activeStepIndex, url);
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
                variant="ghost"
                onClick={() => void remove()}
                icon={<Trash2 className="h-4 w-4" />}
                className="text-[#B4402F] hover:text-[#B4402F]"
              >
                Delete
              </Button>
            )}
            {dirty && (
              <Button onClick={() => setForm(baseline)} disabled={saving}>
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
  const mainImage = form.stepImages[0] || form.image;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300",
        !form.active && "opacity-60",
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
