import React from "react";

/** Line illustrations for collar and cuff styles, chosen from the option name. */

type CollarKind = "cutaway" | "spread" | "band" | "buttonDown";
type CuffKind = "classic" | "french" | "rounded";

export function collarKind(name: string): CollarKind {
  const n = name.toLowerCase();
  if (n.includes("mandarin") || n.includes("band") || n.includes("grandad")) return "band";
  if (n.includes("button")) return "buttonDown";
  if (n.includes("cutaway") || n.includes("wide")) return "cutaway";
  return "spread";
}

export function cuffKind(name: string): CuffKind {
  const n = name.toLowerCase();
  if (n.includes("french") || n.includes("double")) return "french";
  if (n.includes("round")) return "rounded";
  return "classic";
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function CollarIllustration({ name, className = "" }: { name: string; className?: string }) {
  const kind = collarKind(name);
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" {...stroke}>
      {/* shoulders / yoke */}
      <path d="M8 86 C 14 60, 34 48, 46 44" />
      <path d="M112 86 C 106 60, 86 48, 74 44" />
      {kind === "band" ? (
        <>
          {/* standing band collar */}
          <path d="M38 44 C 38 30, 48 22, 60 22 C 72 22, 82 30, 82 44" />
          <path d="M44 44 C 44 34, 52 28, 60 28 C 68 28, 76 34, 76 44" />
          <path d="M60 28 V 86" />
          <circle cx="60" cy="36" r="1.6" fill="currentColor" />
        </>
      ) : (
        <>
          {/* collar stand */}
          <path d="M40 40 C 42 28, 50 22, 60 22 C 70 22, 78 28, 80 40" />
          {/* collar points: angle differs by style */}
          {kind === "cutaway" && (
            <>
              <path d="M58 34 L 22 58 L 44 40 Z" />
              <path d="M62 34 L 98 58 L 76 40 Z" />
            </>
          )}
          {kind === "spread" && (
            <>
              <path d="M58 34 L 34 66 L 44 40 Z" />
              <path d="M62 34 L 86 66 L 76 40 Z" />
            </>
          )}
          {kind === "buttonDown" && (
            <>
              <path d="M58 34 L 44 70 L 44 40 Z" />
              <path d="M62 34 L 76 70 L 76 40 Z" />
              <circle cx="45" cy="66" r="1.8" fill="currentColor" />
              <circle cx="75" cy="66" r="1.8" fill="currentColor" />
            </>
          )}
          {/* placket */}
          <path d="M60 34 V 86" />
          <circle cx="60" cy="48" r="1.6" fill="currentColor" />
          <circle cx="60" cy="64" r="1.6" fill="currentColor" />
          <circle cx="60" cy="80" r="1.6" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

export function CuffIllustration({ name, className = "" }: { name: string; className?: string }) {
  const kind = cuffKind(name);
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" {...stroke}>
      {/* sleeve */}
      <path d="M22 6 C 26 22, 26 36, 24 50" />
      <path d="M98 6 C 94 22, 94 36, 96 50" />
      {kind === "french" ? (
        <>
          {/* double folded cuff */}
          <rect x="20" y="50" width="80" height="18" rx="2" />
          <rect x="20" y="62" width="80" height="18" rx="2" />
          <path d="M20 62 H 100" strokeDasharray="2 3" />
          {/* cufflink */}
          <rect x="54" y="64" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.15" />
          <path d="M57 70 H 63" />
        </>
      ) : kind === "rounded" ? (
        <>
          <path d="M20 50 H 100 V 70 C 100 78, 94 82, 86 82 H 34 C 26 82, 20 78, 20 70 Z" />
          <circle cx="78" cy="66" r="2.4" fill="currentColor" />
          <path d="M26 56 H 94" strokeDasharray="2 3" />
        </>
      ) : (
        <>
          <rect x="20" y="50" width="80" height="32" rx="2" />
          <circle cx="78" cy="66" r="2.4" fill="currentColor" />
          <path d="M26 56 H 94" strokeDasharray="2 3" />
        </>
      )}
    </svg>
  );
}
