"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SettingsPage from "@/app/admin/settings/page";

export default function AdminPaymentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/settings");
  }, [router]);

  return <SettingsPage />;
}
