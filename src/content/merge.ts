const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Overlays CMS data on top of built-in defaults.
 * - objects merge key by key, so fields added to the defaults later still show up;
 * - arrays from the CMS replace the default array (so admins can add/remove items),
 *   with each object item filled in from the matching default item for any missing fields;
 * - a value whose type doesn't match the default is ignored.
 */
export function mergeContent<T>(defaults: T, override: unknown): T {
  if (override === undefined || override === null) return defaults;

  if (Array.isArray(defaults)) {
    if (!Array.isArray(override)) return defaults;
    const template = defaults[0];
    return override.map((item, i) => {
      const base = defaults[i] ?? template;
      return base === undefined ? item : mergeContent(base, item);
    }) as T;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(override)) return defaults;
    const out: Record<string, unknown> = { ...defaults };
    for (const [k, v] of Object.entries(override)) {
      out[k] = k in defaults ? mergeContent((defaults as Record<string, unknown>)[k], v) : v;
    }
    return out as T;
  }

  if (defaults === undefined) return override as T;
  return typeof override === typeof defaults ? (override as T) : defaults;
}

/**
 * Fills "{chest}", "{chest+2}", "{chest-4}" style tokens in CMS strings.
 * Only simple +/- integer offsets on known variables are supported.
 */
export function fillTemplate(template: string, vars: Record<string, number | string>) {
  return template.replace(/\{(\w+)\s*([+-]\s*\d+(?:\.\d+)?)?\}/g, (match, name: string, offset?: string) => {
    if (!(name in vars)) return match;
    const value = vars[name];
    if (!offset || typeof value !== "number") return String(value);
    return String(value + Number(offset.replace(/\s/g, "")));
  });
}
