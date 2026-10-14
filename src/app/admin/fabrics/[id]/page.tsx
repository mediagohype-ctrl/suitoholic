"use client";

import { useParams } from "next/navigation";
import { useAdminQuery } from "@/lib/admin/api";
import type { AdminFabric } from "@/lib/admin/types";
import FabricForm from "@/components/admin/FabricForm";
import { Badge, ButtonLink, Card, EmptyState, ErrorState, PageHeader, SkeletonRows } from "@/components/admin/ui";

export default function EditFabricPage() {
  const { id } = useParams<{ id: string }>();
  const valid = /^\d+$/.test(id ?? "");
  const { data, error, reload, setData } = useAdminQuery<AdminFabric>(valid ? `/fabrics/${id}` : null);
  const back = { href: "/admin/fabrics", label: "Fabrics" };

  if (!valid || error?.status === 404) {
    return (
      <>
        <PageHeader title="Fabric not found" back={back} />
        <Card>
          <EmptyState
            title="This fabric doesn't exist"
            description="It may have been deleted or the link is incorrect."
            action={<ButtonLink href="/admin/fabrics">Back to fabrics</ButtonLink>}
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={data?.name ?? "Edit fabric"}
        description={data ? <>{data.code} {!data.active && <Badge className="ml-1">Hidden</Badge>}</> : undefined}
        back={back}
      />
      {error && !data ? (
        <Card>
          <ErrorState message={error.message} onRetry={reload} />
        </Card>
      ) : !data ? (
        <Card>
          <SkeletonRows rows={10} />
        </Card>
      ) : (
        <FabricForm key={data.id} fabric={data} onSaved={setData} />
      )}
    </>
  );
}
