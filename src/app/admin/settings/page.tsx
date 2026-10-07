"use client";

import { useMemo, useState } from "react";
import { Lock, Save } from "lucide-react";
import { useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { useAdminAuth } from "@/lib/admin/auth";
import { fieldErrors } from "@/lib/admin/format";
import type { AdminSettings } from "@/lib/admin/types";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { useToast } from "@/components/admin/feedback";
import { NumberField, TextAreaField, TextField, Toggle } from "@/components/admin/fields";
import { Button, Card, CardHeader, ErrorState, Notice, PageHeader, SkeletonRows } from "@/components/admin/ui";

export default function SettingsPage() {
  const { data, error, reload, setData } = useAdminQuery<AdminSettings>("/settings");
  return (
    <>
      <PageHeader title="Store settings" description="Currency, shipping, bespoke fees, payment methods and support contacts." />
      {error && !data ? (
        <Card>
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      ) : !data ? (
        <Card>
          <SkeletonRows rows={8} />
        </Card>
      ) : (
        <SettingsForm initial={data} onSaved={setData} />
      )}
    </>
  );
}

type Form = Omit<AdminSettings, "shippingFee" | "freeShippingThreshold" | "customizationFee" | "abandonedCartHours"> & {
  shippingFee: number | "";
  freeShippingThreshold: number | "";
  customizationFee: number | "";
  abandonedCartHours: number | "";
};

function SettingsForm({ initial, onSaved }: { initial: AdminSettings; onSaved: (s: AdminSettings) => void }) {
  const request = useAdminApi();
  const toast = useToast();
  const { isAdmin } = useAdminAuth();
  const [baseline, setBaseline] = useState<Form>(initial);
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const readOnly = !isAdmin;
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(baseline), [form, baseline]);
  useUnsavedChanges(dirty && !readOnly);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const num = (v: number | "") => (v === "" ? 0 : Number(v));

  const save = async () => {
    setSaving(true);
    setErrors({});
    try {
      const body: AdminSettings = {
        ...form,
        shippingFee: num(form.shippingFee),
        freeShippingThreshold: num(form.freeShippingThreshold),
        customizationFee: num(form.customizationFee),
        abandonedCartHours: Math.round(num(form.abandonedCartHours)) || 24,
      };
      const saved = await request<AdminSettings>("/settings", { method: "PUT", body });
      setBaseline(saved);
      setForm(saved);
      onSaved(saved);
      toast.success("Settings saved");
    } catch (err) {
      setErrors(fieldErrors(err));
      toast.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {readOnly && (
        <Notice className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5" /> Settings are read-only for editors. Ask an admin to make changes.
        </Notice>
      )}
      <fieldset disabled={readOnly} className="min-w-0 space-y-6">
        <Card>
          <CardHeader title="Store" />
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-5">
            <TextField label="Store name" value={form.storeName} onChange={(e) => set("storeName", e.target.value)} error={errors.storeName} />
            <TextField label="Currency symbol" value={form.currencySymbol} onChange={(e) => set("currencySymbol", e.target.value)} error={errors.currencySymbol} maxLength={5} />
            <TextField label="Currency code" value={form.currencyCode} onChange={(e) => set("currencyCode", e.target.value.toUpperCase())} error={errors.currencyCode} maxLength={5} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Shipping & bespoke pricing" />
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3 sm:p-5">
            <NumberField label="Shipping fee" value={form.shippingFee} onValue={(v) => set("shippingFee", v)} error={errors.shippingFee} min={0} step="any" disabled={readOnly} />
            <NumberField
              label="Free shipping over"
              value={form.freeShippingThreshold}
              onValue={(v) => set("freeShippingThreshold", v)}
              error={errors.freeShippingThreshold}
              min={0}
              step="any"
              hint="0 = no free-shipping threshold."
              disabled={readOnly}
            />
            <NumberField
              label="Bespoke fee (per unit)"
              value={form.customizationFee}
              onValue={(v) => set("customizationFee", v)}
              error={errors.customizationFee}
              min={0}
              step="any"
              hint="Added for each customised piece."
              disabled={readOnly}
            />
            <NumberField
              label="Abandoned bag after (hours)"
              value={form.abandonedCartHours}
              onValue={(v) => set("abandonedCartHours", v)}
              error={errors.abandonedCartHours}
              min={1}
              max={720}
              step={1}
              hint="Bags idle this long show as abandoned (1–720)."
              disabled={readOnly}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Payments" />
          <div className="space-y-4 p-4 sm:p-5">
            <Toggle checked={form.codEnabled} onChange={(v) => set("codEnabled", v)} disabled={readOnly} label="Cash on delivery" description="Let customers pay when the order arrives." />
            <Toggle checked={form.upiEnabled} onChange={(v) => set("upiEnabled", v)} disabled={readOnly} label="UPI" description="Show UPI payment details at checkout." />
            {form.upiEnabled && (
              <TextField label="UPI ID" value={form.upiId} onChange={(e) => set("upiId", e.target.value)} error={errors.upiId} placeholder="suitoholic@bank" className="sm:max-w-sm" />
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Customer support" />
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5">
            <TextField label="Support email" type="email" value={form.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} error={errors.supportEmail} />
            <TextField label="Support phone" value={form.supportPhone} onChange={(e) => set("supportPhone", e.target.value)} error={errors.supportPhone} />
            <TextAreaField
              label="Order notice"
              value={form.orderNotice}
              onChange={(e) => set("orderNotice", e.target.value)}
              error={errors.orderNotice}
              rows={3}
              className="sm:col-span-2"
              hint="Shown to customers at checkout and on order confirmation."
              maxLength={1000}
            />
          </div>
        </Card>
      </fieldset>

      {!readOnly && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E2D4C3] bg-white/95 backdrop-blur lg:left-64">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-xs text-[#665749]">{dirty ? <span className="font-medium text-[#8A5A00]">Unsaved changes</span> : "All changes saved"}</p>
            <div className="flex gap-2">
              {dirty && (
                <Button onClick={() => setForm(baseline)} disabled={saving}>
                  Discard
                </Button>
              )}
              <Button variant="primary" onClick={() => void save()} loading={saving} disabled={!dirty} icon={<Save className="h-4 w-4" />}>
                Save settings
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
