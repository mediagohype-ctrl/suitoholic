// Admin-side payload types (mirrors server/src admin endpoints).
import type { Cart, Category, Order, OrderStatus } from "@/lib/types";

export type AdminRole = "admin" | "editor";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  active?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number | string;
  page: number;
  limit: number;
}

export interface AdminColorway {
  name: string;
  hex: string;
  productSlug: string;
}

export interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  rawPrice: number;
  compareAtPrice: number | null;
  subtitle: string;
  description: string;
  fabric: string;
  threadCount: string;
  collar?: string;
  cuff?: string;
  fit?: string;
  image: string;
  gallery: string[];
  colorways: AdminColorway[];
  rating: number;
  reviewsCount: number;
  tag?: string;
  stock: number | null;
  customizable: boolean;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AdminCategory = Category & { dbId?: number; productCount?: number; updatedAt?: string };

export interface DashboardData {
  currencySymbol: string;
  revenue: number;
  revenue30d: number;
  orders: number;
  orders30d: number;
  averageOrderValue: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  bags: { active: number; abandoned: number; activeValue: number; abandonedValue: number };
  catalog: { products: number; activeProducts: number; lowStock: number; categories: number };
  subscribers: number;
  newInquiries: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  topProducts: { name: string; slug: string; units: number; revenue: number }[];
  recentOrders: { id: number; orderNumber: string; customerName: string; total: number; status: OrderStatus; createdAt: string }[];
}

export type AdminOrder = Order;
export type PaymentStatus = Order["paymentStatus"];

export type BagStatus = "active" | "abandoned" | "converted";

export interface AdminBagRow {
  id: string;
  status: BagStatus;
  email: string | null;
  itemCount: number;
  bespokeLines: number;
  value: number;
  orderNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AdminBag = Cart & { email?: string | null; createdAt?: string; updatedAt?: string };

export interface ContentMeta {
  key: string;
  updatedAt: string;
  updatedBy: string | null;
}

export interface MediaItem {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  alt: string;
  url: string;
  createdAt: string;
}

export type InquiryStatus = "new" | "in_progress" | "closed";

export interface Inquiry {
  id: number;
  type: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
  subject: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Subscriber {
  id: number;
  email: string;
  source: string;
  createdAt: string;
}

export interface AdminSettings {
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
  abandonedCartHours: number;
}
