import type { ProductItem } from "@/data/products";

export type { ProductItem, Colorway, CollectionCategory } from "@/data/products";

export interface Category {
  /** Category key, e.g. "formal_shirts" (used in /shop?category=). */
  id: string;
  title: string;
  shortTitle: string;
  mobileTitle: string[];
  subtitle: string;
  homeTitle: string;
  description: string;
  tag: string;
  image: string;
  bgImage: string;
  showOnHome: boolean;
  sortOrder: number;
  active: boolean;
  productCount?: number;
}

export interface StoreSettings {
  storeName: string;
  currencySymbol: string;
  currencyCode: string;
  shippingFee: number;
  freeShippingThreshold: number;
  customizationFee: number;
  codEnabled: boolean;
  upiEnabled: boolean;
  upiId: string;
  supportEmail: string;
  supportPhone: string;
  orderNotice: string;
}

/** Raw CMS overrides keyed by section; merged over the built-in defaults on the client. */
export type ContentMap = Record<string, unknown>;

export interface SiteBundle {
  content: ContentMap;
  categories: Category[];
  products: ProductItem[];
  settings: StoreSettings;
  /** False when the API could not be reached and built-in fallback data is shown. */
  apiAvailable: boolean;
}

/** Selections made in the 6-step bespoke customizer. */
export interface CustomFit {
  chestSize: number;
  collarSize: number;
  shoulderSize: number;
  bodyFit: string;
  height: string;
  sleeveType: string;
  collarStyle: string;
  cuffStyle: string;
  pocket: string;
  initials: string;
  threadColor: string;
  shirtColor: string;
}

export interface CartItem {
  id: number;
  productId: number;
  slug: string;
  name: string;
  image: string;
  category: string;
  quantity: number;
  size: string;
  customization: Partial<CustomFit> | null;
  unitPrice: number;
  customizationFee: number;
  lineTotal: number;
  lineTotalLabel: string;
  available: boolean;
}

export interface Cart {
  id: string;
  status: "active" | "converted" | "abandoned";
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  customizationTotal: number;
  shippingFee: number;
  total: number;
  totalLabel: string;
  currencySymbol: string;
}

export type OrderStatus = "pending" | "confirmed" | "in_tailoring" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: number;
  productId: number | null;
  slug: string;
  name: string;
  image: string;
  quantity: number;
  size: string;
  customization: Partial<CustomFit> | null;
  unitPrice: number;
  customizationFee: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  customizationTotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  totalLabel: string;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "refunded" | "failed";
  status: OrderStatus;
  notes: string;
  adminNotes?: string;
  cartId?: string;
  itemCount?: number;
  items?: OrderItem[];
  history?: { status: string; note: string; changedBy?: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  in_tailoring: "In Tailoring",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
