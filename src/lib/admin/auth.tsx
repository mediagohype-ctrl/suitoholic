"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type { AdminUser } from "./types";

export const TOKEN_KEY = "suitoholic_admin_token";
const TOKEN_EVENT = "suitoholic-admin-token";

function readToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(TOKEN_EVENT));
}

function subscribeToken(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(TOKEN_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(TOKEN_EVENT, cb);
  };
}

const noopSubscribe = () => () => {};

/** False during SSR / hydration, true once running on the client. */
export function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export type AuthStatus = "loading" | "authenticated" | "anonymous";

interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: AdminUser | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => void;
  refreshUser: () => void;
  setUser: (user: AdminUser) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();
  const storedToken = useSyncExternalStore(subscribeToken, readToken, () => null);
  const token = hydrated ? storedToken : null;
  const [me, setMe] = useState<{ token: string; user: AdminUser | null; failed?: boolean } | null>(null);
  const [nonce, setNonce] = useState(0);

  const logout = useCallback(() => {
    writeToken(null);
    setMe(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    apiFetch<AdminUser>("/admin/auth/me", { token })
      .then((user) => {
        if (!cancelled) setMe({ token, user });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          writeToken(null);
          setMe(null);
        } else {
          // Server unreachable: keep the session, pages will surface their own errors.
          setMe({ token, user: null, failed: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, nonce]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch<{ token: string; user: AdminUser }>("/admin/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setMe({ token: res.token, user: { ...res.user, active: true } });
    writeToken(res.token);
    return res.user;
  }, []);

  const setUser = useCallback((user: AdminUser) => {
    setMe((m) => (m ? { ...m, user } : m));
  }, []);

  const refreshUser = useCallback(() => setNonce((n) => n + 1), []);

  let status: AuthStatus;
  if (!hydrated) status = "loading";
  else if (!token) status = "anonymous";
  else if (!me || me.token !== token) status = "loading";
  else status = "authenticated";

  const user = status === "authenticated" ? (me?.user ?? null) : null;

  const value = useMemo<AuthContextValue>(
    () => ({ status, token, user, isAdmin: user?.role === "admin", login, logout, refreshUser, setUser }),
    [status, token, user, login, logout, refreshUser, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}
