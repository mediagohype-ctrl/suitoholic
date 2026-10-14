import * as fabrics from "../services/fabric.service.js";
import { paginate } from "../utils/format.js";

// ------------------------------------------------------------- public

export async function publicListFabrics(req, res) {
  const result = await fabrics.listFabrics({
    category: req.query.category,
    activeOnly: true,
    limit: 200,
    offset: 0,
  });
  res.json(result.items);
}

// -------------------------------------------------------------- admin

export async function adminListFabrics(req, res) {
  const q = req.validQuery || req.query;
  const { page, limit, offset } = paginate(q, { defaultLimit: 50, maxLimit: 200 });
  const { items, total } = await fabrics.listFabrics({
    category: q.category,
    search: q.search,
    limit,
    offset,
  });
  res.json({ items, total, page, limit });
}

export async function adminGetFabric(req, res) {
  res.json(await fabrics.getFabric(req.params.id));
}

export async function adminCreateFabric(req, res) {
  const item = await fabrics.createFabric(req.body);
  res.status(201).json(item);
}

export async function adminUpdateFabric(req, res) {
  const item = await fabrics.updateFabric(Number(req.params.id), req.body);
  res.json(item);
}

export async function adminDeleteFabric(req, res) {
  await fabrics.deleteFabric(Number(req.params.id));
  res.status(204).end();
}
