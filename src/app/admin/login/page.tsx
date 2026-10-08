"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { useAdminAuth } from "@/lib/admin/auth";
import { errorMessage } from "@/lib/admin/format";
import { Button, Notice, Spinner } from "@/components/admin/ui";
import { inputClass } from "@/components/admin/fields";

function nextPath() {
  if (typeof window === "undefined") return "/admin";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/admin") && !next.startsWith("/admin/login") && !next.startsWith("//") ? next : "/admin";
}

export default function AdminLoginPage() {
  const { status, login } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") router.replace(nextPath());
  }, [status, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email.trim(), password);
      router.replace(nextPath());
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif-luxury text-4xl font-bold tracking-[0.2em] text-[#14110E]">SUITOHOLIC</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#9E774C]">Atelier Admin</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(20,17,14,0.35)] sm:p-8">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Manage orders, catalog and storefront content.</p>

          {status === "loading" ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              {error && <Notice tone="red">{error}</Notice>}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-[#374151]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputClass} pl-9`}
                    placeholder="you@suitoholic.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[#374151]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full" loading={busy}>
                Sign in
              </Button>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-[#6B7280]">
          <Link href="/" className="hover:text-[#9E774C]">
            ← Back to the store
          </Link>
        </p>
      </div>
    </div>
  );
}
