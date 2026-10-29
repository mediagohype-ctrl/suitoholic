/** Base URL of the Express API (server/). */
function getApiUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:4000";
    }
    return "";
  }
  return process.env.NODE_ENV === "development" ? "http://localhost:4000" : "";
}

export const API_URL = getApiUrl();

export class ApiError extends Error {
  status: number;
  details?: { path: string; message: string }[];

  constructor(status: number, message: string, details?: { path: string; message: string }[]) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
};

/** JSON fetch against the API. Throws ApiError with the server's message on non-2xx. */
export async function apiFetch<T>(path: string, { body, token, timeoutMs = 15000, headers, ...init }: FetchOptions = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  let res: Response;
  const url = `${API_URL}/api${path}`;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        ...(body !== undefined && !isForm ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
      signal: init.signal ?? AbortSignal.timeout(timeoutMs),
    });
  } catch {
    throw new ApiError(0, "Could not reach the Suitoholic server. Please check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || `Request failed (${res.status})`, data?.details);
  }
  return data as T;
}

/** Formats an amount as "₹ 2,499". */
export function formatMoney(amount: number, symbol = "₹") {
  const n = Number(amount) || 0;
  return `${symbol} ${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
