"use client";

import { useEffect, useState } from "react";
import { Copy, ExternalLink, ImagePlus, Search, Trash2 } from "lucide-react";
import { qs, useAdminApi, useAdminQuery } from "@/lib/admin/api";
import { formatBytes, formatDate } from "@/lib/admin/format";
import type { MediaItem, Paginated } from "@/lib/admin/types";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { inputClass } from "@/components/admin/fields";
import { MediaPreview, MediaUploader, isVideoMedia } from "@/components/admin/media";
import { Card, EmptyState, ErrorState, IconButton, PageHeader, Pagination, Skeleton, cn } from "@/components/admin/ui";

const LIMIT = 48;

export default function MediaPage() {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [term, setTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, loading, reload, setData } = useAdminQuery<Paginated<MediaItem>>(`/media${qs({ search: term, page, limit: LIMIT })}`);

  useEffect(() => {
    const t = setTimeout(() => {
      setTerm(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard");
    } catch {
      toast.error("Could not copy — select and copy the URL manually.");
    }
  };

  const remove = async (m: MediaItem) => {
    const ok = await confirm({
      title: `Delete ${m.originalName}?`,
      message: "Pages or products still using this file will show a broken image. This can't be undone.",
      confirmLabel: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await request(`/media/${m.id}`, { method: "DELETE" });
      setData((d) => (d ? { ...d, items: d.items.filter((x) => x.id !== m.id), total: Number(d.total) - 1 } : d!));
      toast.success("File deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  const total = Number(data?.total ?? 0);

  return (
    <>
      <PageHeader title="Media library" description="Images and videos uploaded here can be used for products, categories and page content." />
      <div className="space-y-5">
        <MediaUploader
          onUploaded={() => {
            setPage(1);
            reload();
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a8998a]" />
            <input className={cn(inputClass, "pl-9")} placeholder="Search by file name…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <p className="text-xs text-[#665749]">{total} files</p>
        </div>

        {error && !data ? (
          <Card>
            <ErrorState message={error.message} onRetry={reload} />
          </Card>
        ) : !data ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 12 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
            ))}
          </div>
        ) : data.items.length === 0 ? (
          <Card>
            <EmptyState icon={<ImagePlus className="h-5 w-5" />} title={term ? "No matching files" : "No media yet"} description="Upload images or videos above." />
          </Card>
        ) : (
          <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6", loading && "opacity-60")}>
            {data.items.map((m) => (
              <Card key={m.id} className="group overflow-hidden">
                <a href={m.url} target="_blank" rel="noreferrer" className="block">
                  <MediaPreview src={m.url} kind={isVideoMedia(m) ? "video" : "image"} className="aspect-square rounded-none border-0 border-b border-[#EFE5D8]" />
                </a>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium" title={m.originalName}>
                    {m.originalName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#8a7a6a]">
                    {formatBytes(m.size)} · {m.mimeType.split("/")[1]?.toUpperCase()} · {formatDate(m.createdAt)}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex">
                      <IconButton label="Copy URL" onClick={() => void copy(m.url)}>
                        <Copy className="h-3.5 w-3.5" />
                      </IconButton>
                      <a href={m.url} target="_blank" rel="noreferrer" title="Open" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#665749] hover:bg-[#F5EFE6]">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <IconButton label="Delete" onClick={() => void remove(m)} className="hover:bg-[#FBE9E6] hover:text-[#B4402F]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </IconButton>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {total > LIMIT && (
          <Card>
            <Pagination page={page} limit={LIMIT} total={total} onPage={setPage} />
          </Card>
        )}
      </div>
    </>
  );
}
