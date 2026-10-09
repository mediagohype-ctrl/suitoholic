"use client";

import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Loader2, RefreshCw } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ------------------------------------------------------------------ Button

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "bronze";
type ButtonSize = "sm" | "md";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E774C]/50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-[#14110E] text-white hover:bg-[#2b241d]",
  bronze: "bg-[#9E774C] text-white hover:bg-[#8a6640]",
  secondary: "bg-white text-[#14110E] border border-[#E5E7EB] hover:bg-[#F9FAFB]",
  ghost: "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#14110E]",
  danger: "bg-[#B4402F] text-white hover:bg-[#9a3527]",
};
const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
};

export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md", className?: string) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant = "secondary",
  size = "md",
  loading,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize; loading?: boolean; icon?: ReactNode }) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} disabled={disabled || loading} {...props}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}

export function IconButton({ className, label, children, ...props }: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#14110E] disabled:opacity-40 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// -------------------------------------------------------------------- Card

export function Card({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("rounded-xl border border-[#E5E7EB] bg-white", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, description, actions, className }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3 border-b border-[#EEF0F3] px-4 py-3 sm:px-5", className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-[#14110E]">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-[#6B7280]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

// ------------------------------------------------------------------- Badge

export type BadgeTone = "neutral" | "bronze" | "green" | "amber" | "red" | "blue" | "purple" | "ink";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
  bronze: "bg-[#F6EBDD] text-[#7d5b35] border-[#E6CFB2]",
  green: "bg-[#E8F3EA] text-[#2F6B3B] border-[#C6E0CB]",
  amber: "bg-[#FDF3DC] text-[#8A5A00] border-[#F1DBA6]",
  red: "bg-[#FBE9E6] text-[#A3352A] border-[#F0C6BF]",
  blue: "bg-[#E7F0FA] text-[#2D5D8F] border-[#C7DAEF]",
  purple: "bg-[#F1EAF8] text-[#6A4691] border-[#DCCBEE]",
  ink: "bg-[#14110E] text-white border-[#14110E]",
};

export function Badge({ tone = "neutral", className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-4",
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// -------------------------------------------------------------- PageHeader

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 print:hidden">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-[#9E774C] hover:text-[#14110E]">
            <ChevronLeft className="h-3.5 w-3.5" />
            {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-[#14110E]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-[#6B7280]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

// ------------------------------------------------------- Empty / Loading / Error

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F4F6] text-[#9E774C]">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="text-sm font-semibold text-[#14110E]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-[#6B7280]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-[#EEF0F3]", className)} />;
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("h-5 w-5 animate-spin text-[#9E774C]", className)} />;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <AlertTriangle className="h-6 w-6 text-[#B4402F]" />
      <p className="max-w-md text-sm text-[#14110E]">{message}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry} icon={<RefreshCw className="h-3.5 w-3.5" />}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function Notice({ tone = "bronze", children, className }: { tone?: "bronze" | "red" | "neutral"; children: ReactNode; className?: string }) {
  const tones = {
    bronze: "border-[#E6CFB2] bg-[#F9FAFB] text-[#6b4f30]",
    red: "border-[#F0C6BF] bg-[#FBE9E6] text-[#8f2f25]",
    neutral: "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]",
  };
  return <div className={cn("rounded-lg border px-3 py-2 text-xs leading-5", tones[tone], className)}>{children}</div>;
}

// ------------------------------------------------------------------- Table

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("border-b border-[#EEF0F3] bg-[#F9FAFB] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className, ...props }: ComponentProps<"td">) {
  return (
    <td className={cn("border-b border-[#EEF0F3] px-4 py-3 align-middle text-[#14110E]", className)} {...props}>
      {children}
    </td>
  );
}

// -------------------------------------------------------------- Pagination

export function Pagination({ page, limit, total, onPage }: { page: number; limit: number; total: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-[#6B7280]">
      <span>
        {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-1">
        <IconButton label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft className="h-4 w-4" />
        </IconButton>
        <span className="px-2">
          Page {page} of {pages}
        </span>
        <IconButton label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          <ChevronRight className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------- Tabs

export function Tabs<T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            value === t.value ? "border-[#14110E] bg-[#14110E] text-white" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#9E774C] hover:text-[#14110E]",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className={cn("text-[10px]", value === t.value ? "text-white/70" : "text-[#9E774C]")}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ------------------------------------------------------------------- Thumb

/** Image preview for storefront-relative ("/x.jpg") or absolute URLs. */
export function Thumb({ src, alt = "", className }: { src?: string | null; alt?: string; className?: string }) {
  if (!src) return <div className={cn("h-10 w-10 shrink-0 rounded-md border border-[#E5E7EB] bg-[#F3F4F6]", className)} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" className={cn("h-10 w-10 shrink-0 rounded-md border border-[#E5E7EB] bg-[#F3F4F6] object-cover", className)} />
  );
}
