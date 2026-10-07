import * as carts from "../services/cart.service.js";
import { paginate } from "../utils/format.js";

// ------------------------------------------------------------- storefront

export async function createCart(req, res) {
  res.status(201).json(await carts.createCart());
}

export async function getCart(req, res) {
  res.json(await carts.getCart(req.params.cartId));
}

export async function addItem(req, res) {
  res.status(201).json(await carts.addItem(req.params.cartId, req.body));
}

export async function updateItem(req, res) {
  res.json(await carts.updateItem(req.params.cartId, Number(req.params.itemId), req.body));
}

export async function removeItem(req, res) {
  res.json(await carts.removeItem(req.params.cartId, Number(req.params.itemId)));
}

export async function clearCart(req, res) {
  res.json(await carts.clearCart(req.params.cartId));
}

// ------------------------------------------------------------------ admin

export async function adminListCarts(req, res) {
  const q = req.validQuery;
  const { page, limit, offset } = paginate(q);
  const { items, total } = await carts.listCartsAdmin({ status: q.status, limit, offset });
  res.json({ items, total, page, limit });
}

export async function adminGetCart(req, res) {
  res.json(await carts.getCart(req.params.cartId));
}

export async function adminDeleteCart(req, res) {
  await carts.deleteCart(req.params.cartId);
  res.status(204).end();
}
