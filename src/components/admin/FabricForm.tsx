"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Eye, Save, Trash2 } from "lucide-react";
import { useAdminApi } from "@/lib/admin/api";
import { errorMessage, fieldErrors } from "@/lib/admin/format";
import type { AdminFabric } from "@/lib/admin/types";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { useConfirm, useToast } from "./feedback";
import { ErrorList, NumberField, SelectField, TextAreaField, TextField, Toggle } from "./fields";
import { ImageField, MediaPreview } from "./media";
import { Button, Card, CardHeader, Notice, cn } from "./ui";

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

function toForm(f?: AdminFabric | null): FormState {
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
    image: f?.image ?? "",
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
    image: f.image.trim(),
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

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty && !saving);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

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

    if (Object.keys(local).length) {
      setErrors(local);
      toast.error("Please fill in the required fields highlighted below.");
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

          {/* Section: Ratings & Reviews */}
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

          {/* Section 2: Material & Specifications */}
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
                className="sm:col-span-2"
              />
            </div>
          </Card>

          {/* Section 3: Tailoring & Care */}
          <Card>
            <CardHeader
              title="Tailoring Advice & Care"
              description="Garment recommendations and washing instructions."
            />
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
              <div className="sm:col-span-2">
                <TextField
                  label="Best For (Garments)"
                  value={form.bestFor}
                  onChange={(e) => set("bestFor", e.target.value)}
                  error={errors.bestFor}
                  placeholder="e.g. Executive Boardroom Shirts, French Cuff Formals, Spread Collars"
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

          {/* Section 4: Image */}
          <Card>
            <CardHeader
              title="Fabric Swatch Image"
              description="Choose an image from your media library or enter an image link."
            />
            <div className="p-4 sm:p-5">
              <ImageField
                label="Swatch image URL"
                value={form.image}
                onChange={(v) => set("image", v)}
                error={errors.image}
                previewClassName="h-32 w-32 rounded-lg"
                hint="Relative path (e.g. /fabric_roll_oxford_white.jpg) or full uploaded image link."
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
        <MediaPreview src={form.image} className="h-full w-full rounded-none border-0" />
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
