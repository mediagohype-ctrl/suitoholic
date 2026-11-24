export function readBrowserJson<T>(key: string, storage: "localStorage" | "sessionStorage" = "localStorage"): T | null {
  try {
    const raw = window[storage].getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  } catch {
    return null;
  }
}
