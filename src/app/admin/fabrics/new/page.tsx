"use client";

import FabricForm from "@/components/admin/FabricForm";
import { PageHeader } from "@/components/admin/ui";

export default function NewFabricPage() {
  return (
    <>
      <PageHeader title="New fabric" back={{ href: "/admin/fabrics", label: "Fabrics" }} />
      <FabricForm />
    </>
  );
}
