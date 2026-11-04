import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Suitoholic Admin",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme flex min-h-screen w-full flex-1 flex-col">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
