"use client";

import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";
import { ButtonLink, Card, EmptyState } from "./ui";

/** Renders children only for users with the admin role. */
export function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdminAuth();
  if (isAdmin) return <>{children}</>;
  return (
    <Card>
      <EmptyState
        icon={<ShieldAlert className="h-5 w-5" />}
        title="Admins only"
        description="Your editor account doesn't have access to this page. Ask an administrator if you need it."
        action={<ButtonLink href="/admin">Back to dashboard</ButtonLink>}
      />
    </Card>
  );
}
