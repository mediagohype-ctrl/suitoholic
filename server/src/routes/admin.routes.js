import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as admin from "../controllers/admin.controller.js";
import * as cart from "../controllers/cart.controller.js";
import * as catalog from "../controllers/catalog.controller.js";
import * as content from "../controllers/content.controller.js";
import * as inquiries from "../controllers/inquiry.controller.js";
import * as media from "../controllers/media.controller.js";
import * as orders from "../controllers/order.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import * as s from "../validators/schemas.js";

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many sign-in attempts. Please try again in 15 minutes." },
});

// ------------------------------------------------------------------ auth
router.post("/auth/login", loginLimiter, validate(s.loginInput), admin.login);

// Everything below requires a signed-in admin or editor.
router.use(requireAuth);
const adminOnly = requireRole("admin");

router.get("/auth/me", admin.me);
router.post("/auth/password", validate(s.changePasswordInput), admin.changePassword);

router.get("/dashboard", admin.dashboard);

// --------------------------------------------------------------- catalog
router.get("/products", validate(s.listQuery, "query"), catalog.adminListProducts);
router.post("/products", validate(s.productInput), catalog.adminCreateProduct);
router.get("/products/:id", validate(s.idParam, "params"), catalog.adminGetProduct);
router.patch("/products/:id", validate(s.idParam, "params"), validate(s.productUpdate), catalog.adminUpdateProduct);
router.delete("/products/:id", validate(s.idParam, "params"), catalog.adminDeleteProduct);

router.get("/categories", catalog.adminListCategories);
router.post("/categories", validate(s.categoryInput), catalog.adminCreateCategory);
router.patch("/categories/:key", validate(s.categoryUpdate), catalog.adminUpdateCategory);
router.delete("/categories/:key", catalog.adminDeleteCategory);

// ------------------------------------------------------------- bags/orders
router.get("/carts", validate(s.listQuery, "query"), cart.adminListCarts);
router.get("/carts/:cartId", cart.adminGetCart);
router.delete("/carts/:cartId", cart.adminDeleteCart);

router.get("/orders", validate(s.listQuery, "query"), orders.adminList);
router.get("/orders/:id", validate(s.idParam, "params"), orders.adminGet);
router.patch("/orders/:id", validate(s.idParam, "params"), validate(s.orderUpdate), orders.adminUpdate);

// --------------------------------------------------------------- content
router.get("/content", content.adminList);
router.put("/content/:key", validate(s.contentKey, "params"), validate(s.contentBody), content.adminSave);
router.delete("/content/:key", validate(s.contentKey, "params"), content.adminReset);

// ----------------------------------------------------------------- media
router.get("/media", validate(s.listQuery, "query"), media.adminList);
router.post("/media", upload.array("files", 10), media.adminUpload);
router.delete("/media/:id", validate(s.idParam, "params"), media.adminDelete);

// ------------------------------------------------------------- inquiries
router.get("/inquiries", validate(s.listQuery, "query"), inquiries.adminList);
router.patch("/inquiries/:id", validate(s.idParam, "params"), validate(s.inquiryUpdate), inquiries.adminUpdate);
router.delete("/inquiries/:id", validate(s.idParam, "params"), inquiries.adminDelete);

// ------------------------------------------------------------ newsletter
router.get("/subscribers", validate(s.listQuery, "query"), admin.listSubscribers);
router.get("/subscribers/export", admin.exportSubscribers);
router.delete("/subscribers/:id", validate(s.idParam, "params"), adminOnly, admin.deleteSubscriber);

// ----------------------------------------------- settings & users (admin only)
router.get("/settings", content.adminGetSettings);
router.put("/settings", adminOnly, validate(s.settingsInput), content.adminUpdateSettings);

router.get("/users", adminOnly, admin.listUsers);
router.post("/users", adminOnly, validate(s.userInput), admin.createUser);
router.patch("/users/:id", adminOnly, validate(s.idParam, "params"), validate(s.userUpdate), admin.updateUser);
router.delete("/users/:id", adminOnly, validate(s.idParam, "params"), admin.deleteUser);

export default router;
