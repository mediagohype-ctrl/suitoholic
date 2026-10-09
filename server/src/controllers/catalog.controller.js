import * as catalog from "../services/catalog.service.js";
import { paginate } from "../utils/format.js";

// ------------------------------------------------------------- storefront

export async function getCatalog(req, res) {
  res.json(await catalog.getCatalog());
}

export async function listProducts(req, res) {
  const q = req.validQuery;
  const { items, total } = await catalog.listProducts({ category: q.category, search: q.search });
  res.json({ items, total });
}

export async function getProduct(req, res) {
  res.json(await catalog.getProduct(req.params.idOrSlug));
}

export async function listCategories(req, res) {
  res.json(await catalog.listCategories());
}

// ------------------------------------------------------------------ admin

export async function adminListProducts(req, res) {
  const q = req.validQuery;
  const { page, limit, offset } = paginate(q, { defaultLimit: 50, maxLimit: 200 });
  const { items, total } = await catalog.listProducts({
    category: q.category,
    search: q.search,
    includeInactive: true,
    limit,
    offset,
  });
  res.json({ items, total, page, limit });
}

export async function adminGetProduct(req, res) {
  res.json(await catalog.getProduct(req.params.id, { includeInactive: true }));
}

export async function adminCreateProduct(req, res) {
  res.status(201).json(await catalog.createProduct(req.body));
}

export async function adminUpdateProduct(req, res) {
  res.json(await catalog.updateProduct(Number(req.params.id), req.body));
}

export async function adminDeleteProduct(req, res) {
  await catalog.deleteProduct(Number(req.params.id));
  res.status(204).end();
}

export async function adminListCategories(req, res) {
  res.json(await catalog.listCategories({ includeInactive: true }));
}

export async function adminCreateCategory(req, res) {
  res.status(201).json(await catalog.createCategory(req.body));
}

export async function adminUpdateCategory(req, res) {
  res.json(await catalog.updateCategory(req.params.key, req.body));
}

export async function adminDeleteCategory(req, res) {
  await catalog.deleteCategory(req.params.key);
  res.status(204).end();
}
