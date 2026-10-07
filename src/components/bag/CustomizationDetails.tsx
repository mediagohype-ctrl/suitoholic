import React from "react";
import type { CustomFit } from "@/lib/types";

const LABELS: [keyof CustomFit, string, (v: unknown) => string][] = [
  ["chestSize", "Chest", (v) => `${v}"`],
  ["collarSize", "Collar", (v) => `${v}"`],
  ["shoulderSize", "Shoulder", (v) => `${v}"`],
  ["bodyFit", "Fit", (v) => `${v} fit`],
  ["height", "Height", (v) => String(v)],
  ["sleeveType", "Sleeve", (v) => `${v} sleeve`],
  ["collarStyle", "Collar Style", (v) => String(v)],
  ["cuffStyle", "Cuff", (v) => String(v)],
  ["initials", "Monogram", (v) => String(v)],
  ["threadColor", "Thread", (v) => String(v)],
];

/** Compact list of bespoke selections for bag, checkout and order views. */
export default function CustomizationDetails({ customization }: { customization: Partial<CustomFit> }) {
  const rows = LABELS.filter(([key]) => {
    const v = customization[key];
    return v !== undefined && v !== null && v !== "";
  });
  // Cuffs only apply to full sleeves
  const visible = rows.filter(([key]) => key !== "cuffStyle" || customization.sleeveType !== "half");

  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[11px]">
      {visible.map(([key, label, fmt]) => (
        <div key={key} className="flex gap-1.5 min-w-0">
          <dt className="text-[#7A6B5D] shrink-0">{label}:</dt>
          <dd className="font-semibold text-[#14110E] uppercase truncate">{fmt(customization[key])}</dd>
        </div>
      ))}
    </dl>
  );
}
