"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useHydrated } from "@/lib/admin/auth";
import { errorMessage } from "@/lib/admin/format";
import { Button, cn } from "./ui";

// -------------------------------------------------------------------- Modal

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  variant = "center",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "center" | "drawer";
}) {
  const hydrated = useHydrated();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !hydrated) return null;
  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

  return createPortal(
    <div className={cn("fixed inset-0 z-[200] flex print:hidden", variant === "drawer" ? "justify-end" : "items-end justify-center sm:items-center sm:p-4")}>
      <div className="absolute inset-0 bg-[#14110E]/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex w-full flex-col bg-white shadow-2xl",
          variant === "drawer" ? "h-full max-w-2xl" : cn("max-h-[92vh] rounded-t-2xl sm:rounded-2xl", widths[size]),
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-3 border-b border-[#EEF0F3] px-5 py-4">
            <div className="min-w-0">
              {title && <h2 className="text-lg font-semibold text-[#14110E]">{title}</h2>}
              {description && <p className="mt-0.5 text-xs text-[#6B7280]">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-[#6B7280] hover:bg-[#F3F4F6]">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#EEF0F3] px-5 py-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

// -------------------------------------------------------------------- Toasts

type ToastTone = "success" | "error" | "info";
interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ConfirmOptions {
  title: string;
  message?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}

interface FeedbackContextValue {
  toast: {
    success: (message: string) => void;
    error: (messageOrError: unknown) => void;
    info: (message: string) => void;
  };
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [pending, setPending] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (tone: ToastTone, message: string) => {
      const id = nextId.current++;
      setToasts((t) => [...t.slice(-4), { id, tone, message }]);
      setTimeout(() => dismiss(id), tone === "error" ? 7000 : 3500);
    },
    [dismiss],
  );

  const toast = useMemo(
    () => ({
      success: (m: string) => push("success", m),
      info: (m: string) => push("info", m),
      error: (e: unknown) => push("error", typeof e === "string" ? e : errorMessage(e)),
    }),
    [push],
  );

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setPending({ ...options, resolve });
      }),
    [],
  );

  const close = (result: boolean) => {
    pending?.resolve(result);
    setPending(null);
  };

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-[#4C9A5B]" />,
    error: <XCircle className="h-4 w-4 shrink-0 text-[#E07A6A]" />,
    info: <Info className="h-4 w-4 shrink-0 text-[#D1A876]" />,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[300] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end print:hidden" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-lg bg-[#14110E] px-4 py-3 text-sm text-white shadow-xl">
            {icons[t.tone]}
            <p className="min-w-0 flex-1 break-words leading-5">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <Modal
        open={!!pending}
        onClose={() => close(false)}
        size="sm"
        footer={
          <>
            <Button onClick={() => close(false)}>{pending?.cancelLabel ?? "Cancel"}</Button>
            <Button variant={pending?.danger ? "danger" : "primary"} onClick={() => close(true)} autoFocus>
              {pending?.confirmLabel ?? "Confirm"}
            </Button>
          </>
        }
      >
        <div className="flex gap-3 pt-1">
          {pending?.danger && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FBE9E6]">
              <AlertTriangle className="h-4 w-4 text-[#B4402F]" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-[#14110E]">{pending?.title}</h3>
            {pending?.message && <div className="mt-1 text-sm text-[#6B7280]">{pending.message}</div>}
          </div>
        </div>
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used inside <FeedbackProvider>");
  return ctx;
}

export const useToast = () => useFeedback().toast;
export const useConfirm = () => useFeedback().confirm;
