"use client";

import ProductForm from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="New product" back={{ href: "/admin/products", label: "Products" }} />
      <ProductForm />
    </>
  );
}
