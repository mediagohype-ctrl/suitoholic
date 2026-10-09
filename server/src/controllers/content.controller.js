import { getCatalog } from "../services/catalog.service.js";
import * as content from "../services/content.service.js";
import { getPublicSettings, getSettings, updateSettings } from "../services/settings.service.js";
import { cached } from "../services/siteCache.js";

// ------------------------------------------------------------- storefront

export async function getAll(req, res) {
  res.json(await content.getAllContent());
}

export async function getOne(req, res) {
  res.json(await content.getContent(req.params.key));
}

/** One round trip for everything the storefront layout needs. */
export async function getSiteBundle(req, res) {
  const bundle = await cached(async () => {
    const [sections, catalog, settings] = await Promise.all([content.getAllContent(), getCatalog(), getPublicSettings()]);
    return { content: sections, ...catalog, settings };
  });
  res.json(bundle);
}

export async function publicSettings(req, res) {
  res.json(await getPublicSettings());
}

// ------------------------------------------------------------------ admin

export async function adminList(req, res) {
  res.json(await content.listContentMeta());
}

export async function adminSave(req, res) {
  res.json(await content.saveContent(req.params.key, req.body.data, req.admin.id));
}

export async function adminReset(req, res) {
  await content.resetContent(req.params.key);
  res.status(204).end();
}

export async function adminGetSettings(req, res) {
  res.json(await getSettings());
}

export async function adminUpdateSettings(req, res) {
  res.json(await updateSettings(req.body));
}
