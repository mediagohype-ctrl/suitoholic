"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Eye, RotateCcw, Save } from "lucide-react";
import { contentDefaults, contentSections, type ContentKey } from "@/content/registry";
import { mergeContent } from "@/content/merge";
import { ApiError, apiFetch } from "@/lib/api";
import { useAdminApi } from "@/lib/admin/api";
import { formatDate, toApiError } from "@/lib/admin/format";
import { useUnsavedChanges } from "@/lib/admin/useUnsavedChanges";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { useConfirm, useToast } from "@/components/admin/feedback";
import { Badge, Button, ButtonLink, Card, EmptyState, ErrorState, PageHeader, SkeletonRows } from "@/components/admin/ui";

interface Stored {
  data: Record<string, unknown> | null;
  updatedAt: string | null;
}

export default function ContentEditPage() {
  const { key } = useParams<{ key: string }>();
  const valid = !!key && Object.prototype.hasOwnProperty.call(contentDefaults, key);
  const meta = contentSections.find((s) => s.key === key);
  const back = { href: "/admin/content", label: "Page content" };

  if (!valid) {
    return (
      <>
        <PageHeader title="Section not found" back={back} />
        <Card>
          <EmptyState title={`There is no content section “${key}”`} action={<ButtonLink href="/admin/content">All sections</ButtonLink>} />
        </Card>
      </>
    );
  }

  return <Editor key={key} sectionKey={key as ContentKey} label={meta?.label ?? key} description={meta?.description} previewPath={meta?.previewPath ?? "/"} />;
}

function Editor({ sectionKey, label, description, previewPath }: { sectionKey: ContentKey; label: string; description?: string; previewPath: string }) {
  const request = useAdminApi();
  const toast = useToast();
  const confirm = useConfirm();
  const defaults = contentDefaults[sectionKey] as unknown;
  const [nonce, setNonce] = useState(0);
  const [loaded, setLoaded] = useState<{ nonce: number; stored: Stored | null; error: ApiError | null } | null>(null);
  const [draft, setDraft] = useState<unknown>(undefined);
  const [busy, setBusy] = useState<"save" | "reset" | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ data: Record<string, unknown>; updatedAt: string }>(`/content/${sectionKey}`)
      .then(
        (res) => ({ nonce, stored: { data: res.data, updatedAt: res.updatedAt }, error: null }),
        (err: unknown) => {
          const e = toApiError(err);
          // 404 = the section has never been customised: it uses the built-in defaults.
          return e.status === 404 ? { nonce, stored: { data: null, updatedAt: null }, error: null } : { nonce, stored: null, error: e };
        },
      )
      .then((result) => {
        if (cancelled) return;
        setLoaded(result);
        setDraft(undefined);
      });
    return () => {
      cancelled = true;
    };
  }, [sectionKey, nonce]);

  const stored = loaded?.stored ?? null;
  const original = useMemo(() => (stored ? mergeContent(defaults, stored.data) : undefined), [defaults, stored]);
  const value = draft === undefined ? original : draft;
  const dirty = draft !== undefined && JSON.stringify(draft) !== JSON.stringify(original);
  useUnsavedChanges(dirty);

  const save = async () => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return;
    setBusy("save");
    try {
      const res = await request<{ data: Record<string, unknown>; updatedAt: string }>(`/content/${sectionKey}`, { method: "PUT", body: { data: value } });
      setLoaded({ nonce, stored: { data: res.data, updatedAt: res.updatedAt }, error: null });
      setDraft(undefined);
      toast.success(`${label} saved — live on the storefront`);
    } catch (err) {
      toast.error(err);
    } finally {
      setBusy(null);
    }
  };

  const reset = async () => {
    const ok = await confirm({
      title: `Reset ${label} to default?`,
      message: "All customisations to this section are removed and the built-in site copy is restored. This can't be undone.",
      confirmLabel: "Reset to default",
      danger: true,
    });
    if (!ok) return;
    setBusy("reset");
    try {
      await request(`/content/${sectionKey}`, { method: "DELETE" });
      setLoaded({ nonce, stored: { data: null, updatedAt: null }, error: null });
      setDraft(undefined);
      toast.success(`${label} reset to default`);
    } catch (err) {
      toast.error(err);
    } finally {
      setBusy(null);
    }
  };

  const customised = !!stored?.data;

  return (
    <div className="pb-24">
      <PageHeader
        title={label}
        description={
          <>
            {description}
            <span className="mt-2 flex flex-wrap items-center gap-2">
              {stored ? customised ? <Badge tone="bronze">Customised</Badge> : <Badge>Using defaults</Badge> : null}
              {stored?.updatedAt && <span className="text-xs text-[#8B93A1]">Last saved {formatDate(stored.updatedAt, true)}</span>}
            </span>
          </>
        }
        back={{ href: "/admin/content", label: "Page content" }}
      />

      {loaded?.error && !stored ? (
        <Card>
          <ErrorState message={loaded.error.message} onRetry={() => setNonce((n) => n + 1)} />
        </Card>
      ) : value === undefined ? (
        <Card>
          <SkeletonRows rows={8} />
        </Card>
      ) : (
        <Card className="p-4 sm:p-6">
          <ContentEditor value={value} defaults={defaults} onChange={setDraft} />
        </Card>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#E5E7EB] bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-xs text-[#6B7280]">{dirty ? <span className="font-medium text-[#8A5A00]">Unsaved changes</span> : "No unsaved changes"}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={previewPath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#14110E]"
            >
              <Eye className="h-4 w-4" /> <span className="hidden sm:inline">Preview on site</span>
            </a>
            {customised && (
              <Button variant="ghost" onClick={() => void reset()} loading={busy === "reset"} disabled={!!busy} icon={<RotateCcw className="h-4 w-4" />}>
                <span className="hidden sm:inline">Reset to default</span>
                <span className="sm:hidden">Reset</span>
              </Button>
            )}
            {dirty && (
              <Button onClick={() => setDraft(undefined)} disabled={!!busy}>
                Discard
              </Button>
            )}
            <Button variant="primary" onClick={() => void save()} loading={busy === "save"} disabled={!dirty || !!busy} icon={<Save className="h-4 w-4" />}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
