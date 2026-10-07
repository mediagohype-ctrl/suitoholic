"use client";

import Link from "next/link";
import { ChevronRight, FileText } from "lucide-react";
import { contentSections, type ContentGroup } from "@/content/registry";
import { useAdminQuery } from "@/lib/admin/api";
import { formatDate } from "@/lib/admin/format";
import type { ContentMeta } from "@/lib/admin/types";
import { Badge, Card, ErrorState, PageHeader, Skeleton } from "@/components/admin/ui";

const GROUP_ORDER: ContentGroup[] = ["Global", "Home Page", "Shop & Product", "Bag & Checkout", "Pages"];

export default function ContentListPage() {
  const { data, error, reload } = useAdminQuery<ContentMeta[]>("/content");
  const meta = new Map((data ?? []).map((m) => [m.key, m]));
  const groups = [...GROUP_ORDER, ...Array.from(new Set(contentSections.map((s) => s.group))).filter((g) => !GROUP_ORDER.includes(g))];

  return (
    <>
      <PageHeader title="Page content" description="Edit the copy, images and options shown across the storefront. Changes go live as soon as you save." />
      {error && !data && (
        <Card className="mb-6">
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      )}
      <div className="space-y-8">
        {groups.map((group) => {
          const sections = contentSections.filter((s) => s.group === group);
          if (!sections.length) return null;
          return (
            <section key={group}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#9E774C]">{group}</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {sections.map((s) => {
                  const m = meta.get(s.key);
                  return (
                    <Link key={s.key} href={`/admin/content/${s.key}`} className="group block">
                      <Card className="flex h-full items-start gap-3 p-4 transition-colors group-hover:border-[#9E774C]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F5EFE6] text-[#9E774C]">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold">{s.label}</p>
                            {!data ? <Skeleton className="h-4 w-16 rounded-full" /> : m ? <Badge tone="bronze">Customised</Badge> : <Badge>Default</Badge>}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-[#665749]">{s.description}</p>
                          {m && (
                            <p className="mt-1.5 text-[11px] text-[#8a7a6a]">
                              Updated {formatDate(m.updatedAt, true)}
                              {m.updatedBy ? ` by ${m.updatedBy}` : ""}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-[#c8b8a6] group-hover:text-[#9E774C]" />
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
