import * as orders from "../services/order.service.js";
import { paginate } from "../utils/format.js";

// ------------------------------------------------------------- storefront

export async function checkout(req, res) {
  res.status(201).json(await orders.checkout(req.body));
}

export async function track(req, res) {
  res.json(await orders.trackOrder(req.params.orderNumber, req.validQuery.email));
}

// ------------------------------------------------------------------ admin

export async function adminList(req, res) {
  const q = req.validQuery;
  const { page, limit, offset } = paginate(q);
  const { items, total } = await orders.listOrders({ status: q.status, search: q.search, limit, offset });
  res.json({ items, total, page, limit });
}

export async function adminGet(req, res) {
  res.json(await orders.getOrder(Number(req.params.id)));
}

export async function adminUpdate(req, res) {
  res.json(await orders.updateOrder(Number(req.params.id), req.body, req.admin.name));
}
