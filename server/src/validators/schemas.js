import { z } from "zod";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../services/order.service.js";

const text = (max = 500) => z.string().trim().max(max);
const optionalText = (max = 500) => text(max).optional();
// Image fields accept site-relative paths ("/shirt.jpg") or absolute URLs.
const imageRef = z.string().trim().max(1000);
const key = z
  .string()
  .trim()
  .regex(/^[a-z0-9][a-z0-9_-]{0,63}$/, "Use lowercase letters, numbers, - and _ only");
const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens")
  .max(120);

export const idParam = z.object({ id: z.coerce.number().int().positive() });

export const listQuery = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  search: z.string().trim().max(100).optional(),
  status: z.string().trim().max(30).optional(),
  category: z.string().trim().max(64).optional(),
});

// --------------------------------------------------------------- catalog

export const categoryInput = z.object({
  key: key.optional(),
  title: text(160).min(1),
  shortTitle: optionalText(80),
  mobileTitle: z.array(text(60)).max(3).optional(),
  subtitle: optionalText(300),
  homeTitle: optionalText(160),
  description: optionalText(1000),
  tag: optionalText(160),
  image: imageRef.optional(),
  bgImage: imageRef.optional(),
  showOnHome: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});
export const categoryUpdate = categoryInput.partial();

const colorway = z.object({
  name: text(80).min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{3,8}$/, "Use a hex colour like #FFFFFF"),
  productSlug: z.string().trim().max(120),
});

export const productInput = z.object({
  slug: slug.optional(),
  name: text(200).min(1),
  category: key,
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  subtitle: optionalText(300),
  description: optionalText(5000),
  fabric: optionalText(200),
  threadCount: optionalText(200),
  collar: optionalText(200),
  cuff: optionalText(200),
  fit: optionalText(200),
  image: imageRef.optional(),
  gallery: z.array(imageRef).max(20).optional(),
  colorways: z.array(colorway).max(20).optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewsCount: z.number().int().min(0).optional(),
  tag: optionalText(80),
  stock: z.number().int().min(0).nullable().optional(),
  customizable: z.boolean().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});
export const productUpdate = productInput.partial();

// ------------------------------------------------------------------ bag

// The bespoke configurator payload. Known fields are typed; extra option keys added
// later from the admin customizer are accepted as short strings/numbers.
export const customization = z
  .object({
    chestSize: z.number().min(20).max(80).optional(),
    collarSize: z.number().min(10).max(30).optional(),
    shoulderSize: z.number().min(10).max(30).optional(),
    bodyFit: text(40).optional(),
    height: text(80).optional(),
    sleeveType: text(40).optional(),
    collarStyle: text(80).optional(),
    cuffStyle: text(80).optional(),
    pocket: text(40).optional(),
    initials: text(5).optional(),
    threadColor: text(40).optional(),
    shirtColor: text(40).optional(),
  })
  .catchall(z.union([text(120), z.number(), z.boolean()]))
  .refine((o) => Object.keys(o).length <= 30, "Too many customization fields");

export const addCartItem = z
  .object({
    productId: z.number().int().positive().optional(),
    slug: z.string().trim().max(120).optional(),
    quantity: z.number().int().min(1).max(20).default(1),
    size: text(40).default(""),
    customization: customization.nullable().optional(),
  })
  .refine((v) => v.productId || v.slug, "productId or slug is required");

export const updateCartItem = z.object({ quantity: z.number().int().min(1).max(20) });

// ---------------------------------------------------------------- orders

export const checkoutInput = z.object({
  cartId: z.string().uuid(),
  customer: z.object({
    name: text(120).min(2, "Please enter your full name"),
    email: z.string().trim().email("Please enter a valid email").max(200),
    phone: text(30).min(7, "Please enter a valid phone number"),
  }),
  shippingAddress: z.object({
    line1: text(200).min(3, "Address is required"),
    line2: optionalText(200),
    city: text(100).min(2, "City is required"),
    state: text(100).min(2, "State is required"),
    postalCode: text(20).min(3, "PIN code is required"),
    country: text(80).default("India"),
  }),
  paymentMethod: z.enum(["cod", "upi"]).default("cod"),
  notes: text(1000).default(""),
});

export const trackQuery = z.object({ email: z.string().trim().email().max(200) });

export const orderUpdate = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  adminNotes: text(5000).optional(),
  note: optionalText(1000),
});

// --------------------------------------------------------------- content

export const contentKey = z.object({ key: z.string().regex(/^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/, "Invalid section key") });
export const contentBody = z.object({ data: z.record(z.string(), z.unknown()) });

// -------------------------------------------------------------- settings

export const settingsInput = z
  .object({
    storeName: text(120),
    currencySymbol: text(5),
    currencyCode: text(5),
    shippingFee: z.number().min(0),
    freeShippingThreshold: z.number().min(0),
    customizationFee: z.number().min(0),
    codEnabled: z.boolean(),
    upiEnabled: z.boolean(),
    upiId: text(120),
    supportEmail: z.string().trim().email().or(z.literal("")),
    supportPhone: text(40),
    orderNotice: text(1000),
    abandonedCartHours: z.number().int().min(1).max(720),
  })
  .partial();

// ----------------------------------------------------------------- users

export const loginInput = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

const password = z.string().min(8, "Password must be at least 8 characters").max(200);

export const changePasswordInput = z.object({ currentPassword: z.string().min(1), newPassword: password });

export const userInput = z.object({
  name: text(120).min(1),
  email: z.string().trim().email().max(200),
  password,
  role: z.enum(["admin", "editor"]).default("editor"),
});
export const userUpdate = z.object({
  name: text(120).min(1).optional(),
  email: z.string().trim().email().max(200).optional(),
  password: password.optional(),
  role: z.enum(["admin", "editor"]).optional(),
  active: z.boolean().optional(),
});

export const subscribeInput = z.object({
  email: z.string().trim().email("Please enter a valid email").max(200),
  source: text(60).default("website"),
});

export const inquiryInput = z.object({
  type: z.string().trim().regex(/^[a-z_]{1,40}$/).default("contact"),
  name: text(120).default(""),
  email: z.string().trim().email("Please enter a valid email").max(200).or(z.literal("")).default(""),
  phone: text(30).default(""),
  address: text(500).default(""),
  message: text(3000).default(""),
  subject: text(200).default(""),
});

export const inquiryUpdate = z.object({ status: z.enum(["new", "in_progress", "closed"]) });
