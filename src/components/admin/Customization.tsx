"use client";

import { Scissors } from "lucide-react";
import { humanize } from "@/lib/admin/format";
import { cn } from "./ui";

type Custom = Record<string, unknown> | null | undefined;

const inches = (v: unknown) => (v === undefined || v === null || v === "" ? undefined : `${v}"`);

function pretty(v: unknown): string | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  if (typeof v === "boolean") return v ? "Yes" : "No";
  const s = String(v);
  // Lowercase ids like "lean" / "full" read better title-cased; keep already-formatted labels.
  return s === s.toLowerCase() ? humanize(s) : s;
}

const FIT_LABELS: Record<string, string> = { lean: "Lean Fit", regular: "Regular Fit", tummy: "Tummy Comfort Fit" };
const SLEEVE_LABELS: Record<string, string> = { full: "Full Sleeve", half: "Half Sleeve" };

function pocketLabel(v: unknown) {
  if (v === undefined || v === null || v === "") return undefined;
  const s = String(v).toLowerCase();
  if (["none", "no", "no-pocket", "no_pocket", "nopocket", "false"].includes(s)) return "No pocket";
  if (["pocket", "yes", "true", "with-pocket", "with_pocket"].includes(s)) return "With chest pocket";
  return pretty(v);
}

interface Row {
  label: string;
  value?: string;
  swatch?: string;
}

const KNOWN = new Set([
  "chestSize",
  "collarSize",
  "shoulderSize",
  "bodyFit",
  "height",
  "sleeveType",
  "collarStyle",
  "cuffStyle",
  "pocket",
  "initials",
  "threadColor",
  "shirtColor",
]);

export function customizationGroups(c: Custom) {
  if (!c) return [];
  const groups: { title: string; rows: Row[] }[] = [
    {
      title: "Measurements",
      rows: [
        { label: "Chest", value: inches(c.chestSize) },
        { label: "Collar", value: inches(c.collarSize) },
        { label: "Shoulder", value: inches(c.shoulderSize) },
      ],
    },
    {
      title: "Fit",
      rows: [
        { label: "Body fit", value: FIT_LABELS[String(c.bodyFit)] ?? pretty(c.bodyFit) },
        { label: "Height", value: pretty(c.height) },
        { label: "Sleeves", value: SLEEVE_LABELS[String(c.sleeveType)] ?? pretty(c.sleeveType) },
      ],
    },
    {
      title: "Style",
      rows: [
        { label: "Collar style", value: pretty(c.collarStyle) },
        { label: "Cuff style", value: pretty(c.cuffStyle) },
        { label: "Pocket", value: pocketLabel(c.pocket) },
        { label: "Shirt colour", value: pretty(c.shirtColor) },
      ],
    },
    {
      title: "Monogram",
      rows: [
        { label: "Initials", value: c.initials ? String(c.initials).toUpperCase() : "None" },
        { label: "Thread", value: c.initials ? pretty(c.threadColor) : undefined, swatch: c.initials ? String(c.threadColor ?? "") : undefined },
      ],
    },
  ];
  const extra = Object.entries(c)
    .filter(([k, v]) => !KNOWN.has(k) && v !== null && v !== undefined && v !== "")
    .map(([k, v]) => ({ label: humanize(k), value: typeof v === "object" ? JSON.stringify(v) : pretty(v) }));
  if (extra.length) groups.push({ title: "Other selections", rows: extra });
  return groups.map((g) => ({ ...g, rows: g.rows.filter((r) => r.value) })).filter((g) => g.rows.length);
}

/** Readable breakdown of a bespoke customizer selection (tailor job-sheet friendly). */
export function CustomizationDetails({ customization, className }: { customization: Custom; className?: string }) {
  const groups = customizationGroups(customization);
  if (!groups.length) return null;
  return (
    <div className={cn("rounded-lg border border-[#E6CFB2] bg-[#FCF7F0] p-3 print:border-black print:bg-white", className)}>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#9E774C] print:text-black">
        <Scissors className="h-3.5 w-3.5" /> Bespoke specification
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 print:grid-cols-4">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#8a7a6a] print:text-black">{g.title}</p>
            <dl className="space-y-0.5">
              {g.rows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-2 text-xs">
                  <dt className="text-[#665749] print:text-black">{r.label}</dt>
                  <dd className="flex items-center gap-1 text-right font-semibold text-[#14110E]">
                    {r.swatch && <span className="inline-block h-2.5 w-2.5 rounded-full border border-black/20" style={{ background: r.swatch }} />}
                    {r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

export function hasCustomization(c: Custom) {
  return !!c && Object.keys(c).length > 0;
}
