"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "./ui";

export const inputClass =
  "w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#14110E] placeholder:text-[#9CA3AF] focus:border-[#9E774C] focus:outline-none focus:ring-2 focus:ring-[#9E774C]/20 disabled:bg-[#F9FAFB] disabled:text-[#6B7280]";

export function FieldShell({
  label,
  hint,
  error,
  htmlFor,
  className,
  children,
  aside,
}: {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {(label || aside) && (
        <div className="mb-1.5 flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={htmlFor} className="text-xs font-semibold text-[#374151]">
              {label}
            </label>
          )}
          {aside}
        </div>
      )}
      {children}
      {error ? <p className="mt-1 text-xs text-[#B4402F]">{error}</p> : hint ? <p className="mt-1 text-xs text-[#8B93A1]">{hint}</p> : null}
    </div>
  );
}

type Common = { label?: ReactNode; hint?: ReactNode; error?: string; className?: string; aside?: ReactNode };

export function TextField({ label, hint, error, className, aside, id, ...props }: Common & ComponentProps<"input">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fid} className={className} aside={aside}>
      <input id={fid} className={cn(inputClass, error && "border-[#B4402F]")} {...props} />
    </FieldShell>
  );
}

export function TextAreaField({ label, hint, error, className, aside, id, rows = 4, ...props }: Common & ComponentProps<"textarea">) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fid} className={className} aside={aside}>
      <textarea id={fid} rows={rows} className={cn(inputClass, "resize-y leading-relaxed", error && "border-[#B4402F]")} {...props} />
    </FieldShell>
  );
}

export function SelectField({
  label,
  hint,
  error,
  className,
  aside,
  id,
  options,
  ...props
}: Common & ComponentProps<"select"> & { options: { value: string; label: string }[] }) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <FieldShell label={label} hint={hint} error={error} htmlFor={fid} className={className} aside={aside}>
      <select id={fid} className={cn(inputClass, "pr-8", error && "border-[#B4402F]")} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

/** Number input that keeps an empty string while editing. */
export function NumberField({
  value,
  onValue,
  ...props
}: Common & Omit<ComponentProps<"input">, "value" | "onChange" | "type"> & { value: number | string | null | undefined; onValue: (v: number | "") => void }) {
  return (
    <TextField
      type="number"
      inputMode="decimal"
      value={value === null || value === undefined ? "" : value}
      onChange={(e) => onValue(e.target.value === "" ? "" : Number(e.target.value))}
      {...props}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[#9E774C]" : "bg-[#D1D5DB]",
        )}
      >
        <span className={cn("inline-block h-4 w-4 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium text-[#14110E]">{label}</span>}
          {description && <span className="block text-xs text-[#6B7280]">{description}</span>}
        </span>
      )}
    </label>
  );
}

export function ColorField({ label, value, onChange, error, className }: { label?: ReactNode; value: string; onChange: (v: string) => void; error?: string; className?: string }) {
  const id = useId();
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <FieldShell label={label} error={error} htmlFor={id} className={className}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Pick colour"
          value={valid ? value : "#000000"}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-[#E5E7EB] bg-white p-1"
        />
        <input id={id} className={cn(inputClass, "font-mono", error && "border-[#B4402F]")} value={value} onChange={(e) => onChange(e.target.value)} placeholder="#RRGGBB" />
      </div>
    </FieldShell>
  );
}

/** A list of validation messages from the server. */
export function ErrorList({ errors }: { errors: Record<string, string> }) {
  const entries = Object.entries(errors);
  if (!entries.length) return null;
  return (
    <div className="rounded-lg border border-[#F0C6BF] bg-[#FBE9E6] px-4 py-3 text-xs text-[#8f2f25]">
      <p className="mb-1 font-semibold">Please fix the following:</p>
      <ul className="list-disc space-y-0.5 pl-4">
        {entries.map(([path, msg]) => (
          <li key={path}>
            {path && path !== "_" ? <strong>{path}: </strong> : null}
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}
