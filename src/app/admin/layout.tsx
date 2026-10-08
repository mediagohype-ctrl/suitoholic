import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AdminShell from "@/components/admin/AdminShell";

// The admin uses Inter (a neutral UI font) instead of the storefront's editorial fonts.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Suitoholic Admin",
  robots: { index: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} admin-theme flex min-h-screen w-full flex-1 flex-col`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
