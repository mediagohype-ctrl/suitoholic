// In-memory cache for the storefront bundle (content + catalog + settings), which every page
// render requests. It is cleared whenever an admin changes anything or an order changes stock,
// so edits still appear immediately; the TTL is only a safety net.
const TTL_MS = 60_000;
let entry = null; // { value, expires, pending }
let generation = 0;

export async function cached(loader) {
  const now = Date.now();
  if (entry?.value && entry.expires > now) return entry.value;
  if (entry?.pending) return entry.pending;

  const gen = generation;
  const pending = loader().then(
    (value) => {
      // Don't store a result that was loaded while an invalidation happened.
      if (gen === generation) entry = { value, expires: Date.now() + TTL_MS };
      else entry = null;
      return value;
    },
    (err) => {
      entry = null;
      throw err;
    },
  );
  entry = { pending };
  return pending;
}

export function invalidateSiteCache() {
  generation++;
  entry = null;
}

/** Express middleware: clears the cache after any successful write it wraps. */
export function invalidateOnWrite(req, res, next) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.on("finish", () => {
      if (res.statusCode < 400) invalidateSiteCache();
    });
  }
  next();
}
