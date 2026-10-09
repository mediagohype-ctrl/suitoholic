"use client";

import { useEffect, useRef, useState, type DragEvent, type ReactNode } from "react";
import { ExternalLink, Film, ImageIcon, ImagePlus, Search, Upload, X } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";
import { qs, uploadMedia, useAdminQuery } from "@/lib/admin/api";
import { formatBytes } from "@/lib/admin/format";
import type { MediaItem, Paginated } from "@/lib/admin/types";
import { Modal, useToast } from "./feedback";
import { FieldShell, inputClass } from "./fields";
import { Button, EmptyState, ErrorState, Pagination, Skeleton, cn } from "./ui";

export type MediaKind = "image" | "video" | "any";

export const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?|#|$)/i.test(url);
export const isVideoMedia = (m: MediaItem) => m.mimeType.startsWith("video/");

/** Preview of an image or video URL (storefront-relative paths render as-is). */
export function MediaPreview({ src, kind = "image", className }: { src?: string; kind?: MediaKind; className?: string }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const failed = !!src && failedSrc === src;
  const base = cn("flex items-center justify-center overflow-hidden rounded-lg border border-[#E5E7EB] bg-[#F3F4F6]", className);
  if (!src || failed) {
    return (
      <div className={base}>
        <div className="flex flex-col items-center gap-1 text-[#9CA3AF]">
          {kind === "video" ? <Film className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
          {failed && <span className="px-1 text-center text-[10px]">Preview unavailable</span>}
        </div>
      </div>
    );
  }
  if (kind === "video" || isVideoUrl(src)) {
    return (
      <div className={base}>
        <video src={src} muted playsInline preload="metadata" className="h-full w-full object-cover" onError={() => setFailedSrc(src)} />
      </div>
    );
  }
  return (
    <div className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailedSrc(src)} />
    </div>
  );
}

/** Drag-and-drop + button uploader. Calls onUploaded with the new media. */
export function MediaUploader({
  onUploaded,
  accept = "image/*,video/mp4,video/webm",
  compact,
  children,
}: {
  onUploaded: (items: MediaItem[]) => void;
  accept?: string;
  compact?: boolean;
  children?: ReactNode;
}) {
  const { token } = useAdminAuth();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const upload = async (list: FileList | File[] | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    if (files.length > 10) {
      toast.error("You can upload up to 10 files at a time.");
      return;
    }
    const tooBig = files.find((f) => f.size > 8 * 1024 * 1024);
    if (tooBig) {
      toast.error(`${tooBig.name} is larger than 8 MB.`);
      return;
    }
    setProgress(0);
    try {
      const items = await uploadMedia(files, token, setProgress);
      toast.success(`Uploaded ${items.length} file${items.length === 1 ? "" : "s"}`);
      onUploaded(items);
    } catch (err) {
      toast.error(err);
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    void upload(e.dataTransfer.files);
  };

  const busy = progress !== null;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors",
        compact ? "px-4 py-4" : "px-4 py-8",
        drag ? "border-[#9E774C] bg-[#F9FAFB]" : "border-[#E5E7EB] bg-[#F9FAFB]",
      )}
    >
      <input ref={inputRef} type="file" multiple accept={accept} className="hidden" onChange={(e) => void upload(e.target.files)} />
      {busy ? (
        <div className="w-full max-w-xs">
          <p className="mb-2 text-sm font-medium">Uploading… {Math.round((progress ?? 0) * 100)}%</p>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF0F3]">
            <div className="h-full rounded-full bg-[#9E774C] transition-all" style={{ width: `${Math.round((progress ?? 0) * 100)}%` }} />
          </div>
        </div>
      ) : (
        <>
          {!compact && <Upload className="mb-2 h-6 w-6 text-[#9E774C]" />}
          <p className="text-sm text-[#374151]">
            {children ?? "Drag & drop images or videos here, or"}{" "}
            <button type="button" onClick={() => inputRef.current?.click()} className="font-semibold text-[#9E774C] underline-offset-2 hover:underline">
              browse files
            </button>
          </p>
          <p className="mt-1 text-xs text-[#8B93A1]">JPG, PNG, WEBP, GIF, SVG, AVIF, MP4, WEBM · up to 8 MB each · max 10 at once</p>
        </>
      )}
    </div>
  );
}

const PICKER_LIMIT = 24;

/** Browse / search / upload the media library and pick a file. */
export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  kind = "image",
  title,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, item?: MediaItem) => void;
  kind?: MediaKind;
  title?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title ?? (kind === "video" ? "Choose a video" : "Choose an image")} size="xl" description="Pick from the media library or upload new files.">
      {open && <PickerBody kind={kind} onSelect={onSelect} onClose={onClose} />}
    </Modal>
  );
}

function PickerBody({ kind, onSelect, onClose }: { kind: MediaKind; onSelect: (url: string, item?: MediaItem) => void; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const [manual, setManual] = useState("");
  const { data, error, loading, reload } = useAdminQuery<Paginated<MediaItem>>(`/media${qs({ search: term, page, limit: PICKER_LIMIT })}`);

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const items = (data?.items ?? []).filter((m) => (kind === "image" ? !isVideoMedia(m) : kind === "video" ? isVideoMedia(m) : true));

  const pick = (url: string, item?: MediaItem) => {
    onSelect(url, item);
    onClose();
  };

  return (
    <div className="space-y-4">
      <MediaUploader
        compact
        accept={kind === "video" ? "video/mp4,video/webm" : kind === "image" ? "image/*" : undefined}
        onUploaded={(uploaded) => {
          if (uploaded.length === 1) pick(uploaded[0].url, uploaded[0]);
          else reload();
        }}
      >
        Drop a file to upload and use it, or
      </MediaUploader>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input className={cn(inputClass, "pl-9")} placeholder="Search library…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (manual.trim()) pick(manual.trim());
          }}
        >
          <input className={inputClass} placeholder="…or paste a URL / storefront path (/image.jpg)" value={manual} onChange={(e) => setManual(e.target.value)} />
          <Button type="submit" disabled={!manual.trim()}>
            Use
          </Button>
        </form>
      </div>

      {error && !data ? (
        <ErrorState message={error.message} onRetry={reload} />
      ) : !data ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={<ImagePlus className="h-5 w-5" />} title={term ? "No matching files" : "The media library is empty"} description="Upload a file above to get started." />
      ) : (
        <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6", loading && "opacity-60")}>
          {items.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => pick(m.url, m)}
              className="group overflow-hidden rounded-lg border border-[#E5E7EB] bg-white text-left transition hover:border-[#9E774C] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9E774C]"
            >
              <MediaPreview src={m.url} kind={isVideoMedia(m) ? "video" : "image"} className="aspect-square rounded-none border-0" />
              <div className="px-2 py-1.5">
                <p className="truncate text-[11px] font-medium" title={m.originalName}>
                  {m.originalName}
                </p>
                <p className="text-[10px] text-[#8B93A1]">{formatBytes(m.size)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {data && Number(data.total) > PICKER_LIMIT && <Pagination page={page} limit={PICKER_LIMIT} total={Number(data.total)} onPage={setPage} />}
    </div>
  );
}

/** Image (or video) URL field with preview, media-library picker and free-text input. */
export function ImageField({
  label,
  value,
  onChange,
  kind = "image",
  hint,
  error,
  className,
  previewClassName,
}: {
  label?: ReactNode;
  value: string;
  onChange: (v: string) => void;
  kind?: MediaKind;
  hint?: ReactNode;
  error?: string;
  className?: string;
  previewClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <FieldShell label={label} hint={hint} error={error} className={className}>
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => setOpen(true)} className="shrink-0" title="Choose from media library">
          <MediaPreview src={value} kind={kind} className={cn("h-20 w-20", previewClassName)} />
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <input
            className={cn(inputClass, error && "border-[#B4402F]")}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={kind === "video" ? "/video.mp4 or https://…" : "/image.jpg or https://…"}
          />
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setOpen(true)} icon={kind === "video" ? <Film className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}>
              {value ? "Replace" : "Choose"}
            </Button>
            {value && (
              <>
                <a href={value} target="_blank" rel="noreferrer" className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs text-[#6B7280] hover:bg-[#F3F4F6]">
                  <ExternalLink className="h-3.5 w-3.5" /> Open
                </a>
                <Button size="sm" variant="ghost" onClick={() => onChange("")} icon={<X className="h-3.5 w-3.5" />}>
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <MediaPickerModal open={open} onClose={() => setOpen(false)} onSelect={(url) => onChange(url)} kind={kind} />
    </FieldShell>
  );
}

