"use client";

import { useParams } from "next/navigation";
import { useAdminQuery } from "@/lib/admin/api";
import type { AdminProduct } from "@/lib/admin/types";
import ProductForm from "@/components/admin/ProductForm";
import { Badge, ButtonLink, Card, EmptyState, ErrorState, PageHeader, SkeletonRows } from "@/components/admin/ui";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const valid = /^\d+$/.test(id ?? "");
  const { data, error, reload, setData } = useAdminQuery<AdminProduct>(valid ? `/products/${id}` : null);
  const back = { href: "/admin/products", label: "Products" };

  if (!valid || error?.status === 404) {
    return (
      <>
        <PageHeader title="Product not found" back={back} />
        <Card>
          <EmptyState title="This product doesn't exist" description="It may have been deleted." action={<ButtonLink href="/admin/products">Back to products</ButtonLink>} />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={data?.name ?? "Edit product"}
        description={data ? <>/{data.slug} {!data.active && <Badge className="ml-1">Hidden</Badge>}</> : undefined}
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
        <ProductForm key={data.id} product={data} onSaved={setData} />
      )}
    </>
  );
}
