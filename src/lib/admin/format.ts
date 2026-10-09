import { ApiError } from "@/lib/api";

/** "camelCaseKey" / "snake_key" → "Camel Case Key". */
export function humanize(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDate(value?: string | null, withTime = false) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatBytes(bytes: number) {
  if (!bytes && bytes !== 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError(0, err instanceof Error ? err.message : "Something went wrong");
}

/** Maps validation details to { fieldPath: message }. */
export function fieldErrors(err: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (err instanceof ApiError && err.details && Array.isArray(err.details)) {
    for (const d of err.details) if (d && typeof d === "object" && d.path !== undefined) out[d.path || "_"] ??= d.message;
  }
  return out;
}

/** A human-readable error message that includes the validation details, if any. */
export function errorMessage(err: unknown) {
  const e = toApiError(err);
  if (Array.isArray(e.details) && e.details.length) {
    return `${e.message}: ${e.details.map((d) => (d.path ? `${humanize(d.path)} – ${d.message}` : d.message)).join("; ")}`;
  }
  return e.message;
}

export function toNumber(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Reads a query-string value on the client. Admin pages only render after sign-in is
 * confirmed on the client (never during SSR), so this is safe in useState initialisers.
 */
export function initialParam(name: string, fallback = "") {
  if (typeof window === "undefined") return fallback;
  return new URLSearchParams(window.location.search).get(name) ?? fallback;
}
