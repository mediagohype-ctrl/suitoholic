import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as catalog from "../controllers/catalog.controller.js";
import * as cart from "../controllers/cart.controller.js";
import * as content from "../controllers/content.controller.js";
import * as media from "../controllers/media.controller.js";
import * as inquiries from "../controllers/inquiry.controller.js";
import * as orders from "../controllers/order.controller.js";
import { subscribe } from "../controllers/admin.controller.js";
import { validate } from "../middleware/validate.js";
import * as s from "../validators/schemas.js";

const router = Router();

const writeLimiter = rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false });
const checkoutLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false });

// Site bundle: CMS content + catalog + public settings (used by the storefront layout)
router.get("/site", content.getSiteBundle);
router.get("/settings", content.publicSettings);
router.get("/content", content.getAll);
router.get("/content/:key", validate(s.contentKey, "params"), content.getOne);

// Catalog
router.get("/catalog", catalog.getCatalog);
router.get("/categories", catalog.listCategories);
router.get("/products", validate(s.listQuery, "query"), catalog.listProducts);
router.get("/products/:idOrSlug", catalog.getProduct);

// Bag (cart). The bag id is a random UUID kept in the shopper's browser.
router.post("/cart", writeLimiter, cart.createCart);
router.get("/cart/:cartId", cart.getCart);
router.delete("/cart/:cartId", writeLimiter, cart.clearCart);
router.post("/cart/:cartId/items", writeLimiter, validate(s.addCartItem), cart.addItem);
router.patch("/cart/:cartId/items/:itemId", writeLimiter, validate(s.updateCartItem), cart.updateItem);
router.delete("/cart/:cartId/items/:itemId", writeLimiter, cart.removeItem);

// Orders
router.post("/orders", checkoutLimiter, validate(s.checkoutInput), orders.checkout);
router.get("/orders/:orderNumber", validate(s.trackQuery, "query"), orders.track);

// Newsletter
router.post("/newsletter", writeLimiter, validate(s.subscribeInput), subscribe);

// Swatch requests / contact messages
router.post("/inquiries", checkoutLimiter, validate(s.inquiryInput), inquiries.create);

// Uploaded media (stored in Postgres)
router.get("/media/:id{/:filename}", media.serveFile);

export default router;
