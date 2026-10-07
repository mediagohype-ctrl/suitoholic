"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL, ApiError, apiFetch } from "@/lib/api";
import { useAdminAuth } from "./auth";
import { toApiError } from "./format";
import type { MediaItem } from "./types";

type RequestOptions = { method?: string; body?: unknown; signal?: AbortSignal; timeoutMs?: number };

export function loginRedirectPath() {
  if (typeof window === "undefined") return "/admin/login";
  const here = window.location.pathname + window.location.search;
  return here.startsWith("/admin/login") ? "/admin/login" : `/admin/login?next=${encodeURIComponent(here)}`;
}

/**
 * Returns a `request(path, options)` function for `/api/admin/*` that sends the bearer token
 * and signs the user out (redirecting to the login page) when the session has expired.
 * `path` is relative to `/api/admin`, e.g. `request("/products")`.
 */
export function useAdminApi() {
  const { token, logout } = useAdminAuth();
  const router = useRouter();

  return useCallback(
    async <T,>(path: string, options: RequestOptions = {}): Promise<T> => {
      try {
        return await apiFetch<T>(`/admin${path}`, { ...options, token });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          const next = loginRedirectPath();
          logout();
          router.replace(next);
        }
        throw err;
      }
    },
    [token, logout, router],
  );
}

export type AdminRequest = ReturnType<typeof useAdminApi>;

/** Small data-loading hook: GET `path` (relative to /api/admin) whenever it changes. Pass null to skip. */
export function useAdminQuery<T>(path: string | null) {
  const request = useAdminApi();
  const { token } = useAdminAuth();
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<{ key: string | null; data: T | undefined; error: ApiError | null }>({
    key: null,
    data: undefined,
    error: null,
  });
  const key = path && token ? `${path}#${nonce}` : null;

  useEffect(() => {
    if (!key || !path) return;
    let cancelled = false;
    request<T>(path).then(
      (data) => {
        if (!cancelled) setState({ key, data, error: null });
      },
      (err: unknown) => {
        if (!cancelled) setState((s) => ({ key, data: s.data, error: toApiError(err) }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [key, path, request]);

  const setData = useCallback((updater: T | ((prev: T | undefined) => T)) => {
    setState((s) => ({ ...s, data: typeof updater === "function" ? (updater as (p: T | undefined) => T)(s.data) : updater }));
  }, []);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return {
    data: state.data,
    error: state.key === key ? state.error : null,
    loading: key !== null && state.key !== key,
    reload,
    setData,
  };
}

/** Builds a query string, skipping empty values. */
export function qs(params: Record<string, string | number | null | undefined | false>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "" || v === false) continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Uploads files to the media library with progress (0..1). */
export function uploadMedia(files: File[], token: string | null, onProgress?: (fraction: number) => void) {
  return new Promise<MediaItem[]>((resolve, reject) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/admin/media`);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => {
      let data: unknown = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        /* not json */
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data as MediaItem[]);
      else {
        const d = data as { error?: string; details?: { path: string; message: string }[] } | null;
        reject(new ApiError(xhr.status, d?.error || `Upload failed (${xhr.status})`, d?.details));
      }
    };
    xhr.onerror = () => reject(new ApiError(0, "Upload failed: could not reach the server."));
    xhr.send(form);
  });
}

/** Downloads an authenticated admin endpoint as a file. */
export async function downloadFile(path: string, token: string | null, filename: string) {
  const res = await fetch(`${API_URL}/api/admin${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data?.error || `Download failed (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
