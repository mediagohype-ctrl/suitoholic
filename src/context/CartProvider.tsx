"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch, formatMoney } from "@/lib/api";
import { allProducts } from "@/data/products";
import type { Cart, CartItem, CustomFit } from "@/lib/types";

const STORAGE_KEY = "suitoholic_cart_id";
const CLIENT_STORAGE_KEY = "suitoholic_client_cart_v1";
const COUPON_STORAGE_KEY = "suitoholic_coupon_v1";
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (id: string | null | undefined): id is string => Boolean(id && UUID_RE.test(id));

export interface AddToBagInput {
  productId: number;
  quantity?: number;
  size?: string;
  customization?: Partial<CustomFit> | null;
}

interface CartContextValue {
  cart: Cart | null;
  itemCount: number;
  /** True until the stored bag has been loaded on first render. */
  loading: boolean;
  /** True while an add/update/remove request is in flight. */
  busy: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string; discount?: number };
  removeCoupon: () => void;
  addItem: (input: AddToBagInput) => Promise<Cart>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  refresh: () => Promise<void>;
  /** Ensures server-side cart exists for checkout order placement. */
  ensureServerCart: () => Promise<string | null>;
  /** Forget the current bag (after checkout). */
  reset: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const readId = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return isUuid(val) ? val : null;
  } catch {
    return null;
  }
};

const writeId = (id: string | null) => {
  if (typeof window === "undefined") return;
  try {
    if (id && isUuid(id)) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode) */
  }
};

function readLocalCart(): Cart | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CLIENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.items) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocalCart(cart: Cart | null) {
  if (typeof window === "undefined") return;
  try {
    if (cart && Array.isArray(cart.items) && cart.items.length > 0) {
      localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(cart));
    } else {
      localStorage.removeItem(CLIENT_STORAGE_KEY);
    }
  } catch {
    /* storage unavailable (private mode) */
  }
}

function readStoredCoupon(): { code: string; discount: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStoredCoupon(coupon: { code: string; discount: number } | null) {
  if (typeof window === "undefined") return;
  try {
    if (coupon) localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode) */
  }
}

function calculateCartTotals(items: CartItem[], currencySymbol = "₹", preferredId?: string | null): Cart {
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
  const customizationTotal = items.reduce(
    (sum, item) => sum + ((item.customizationFee || 0) * (item.quantity || 1)),
    0
  );
  const shippingFee = 0;
  const total = subtotal + customizationTotal + shippingFee;

  const id = preferredId && String(preferredId).trim()
    ? preferredId
    : "cart_" + (items.length > 0 ? items[0].id : Date.now());

  return {
    id,
    status: "active",
    items,
    itemCount,
    subtotal,
    customizationTotal,
    shippingFee,
    total,
    totalLabel: formatMoney(total, currencySymbol),
    currencySymbol,
  };
}

// A stored bag is unusable if it was deleted (404) or already checked out (409).
const isStaleBag = (err: unknown) => err instanceof ApiError && (err.status === 404 || err.status === 409);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const cartIdRef = useRef<string | null>(null);

  const router = useRouter();
  const openDrawer = useCallback(() => {
    router.push("/cart");
  }, [router]);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => {
    router.push("/cart");
  }, [router]);

  const applyCoupon = useCallback(
    (code: string) => {
      const trimmed = code.trim().toUpperCase();
      if (!cart || cart.items.length === 0) {
        return { success: false, message: "Add items to your bag first." };
      }
      if (trimmed === "WELCOME10") {
        const discount = Math.round(cart.subtotal * 0.1);
        setCouponCode("WELCOME10");
        setDiscountAmount(discount);
        writeStoredCoupon({ code: "WELCOME10", discount });
        return { success: true, message: "WELCOME10 applied (10% off)!", discount };
      }
      if (trimmed === "SUITOHOLIC" || trimmed === "BESPOKE500") {
        const discount = Math.min(500, cart.subtotal);
        setCouponCode(trimmed);
        setDiscountAmount(discount);
        writeStoredCoupon({ code: trimmed, discount });
        return { success: true, message: `₹500 Atelier Discount applied!`, discount };
      }
      if (trimmed === "ROYAL15") {
        const discount = Math.round(cart.subtotal * 0.15);
        setCouponCode("ROYAL15");
        setDiscountAmount(discount);
        writeStoredCoupon({ code: "ROYAL15", discount });
        return { success: true, message: "ROYAL15 applied (15% off)!", discount };
      }
      return { success: false, message: "Invalid or expired promo code." };
    },
    [cart],
  );

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setDiscountAmount(0);
    writeStoredCoupon(null);
  }, []);

  const setActiveCart = useCallback((next: Cart | null) => {
    if (next && Array.isArray(next.items) && next.items.length > 0) {
      if (isUuid(next.id)) {
        cartIdRef.current = next.id;
        writeId(next.id);
      }
      writeLocalCart(next);
      setCart(next);
    } else {
      cartIdRef.current = null;
      writeId(null);
      writeLocalCart(null);
      setCart(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    const id = cartIdRef.current ?? readId();
    if (!id || !isUuid(id)) return;
    try {
      const data = await apiFetch<Cart>(`/cart/${id}`, { timeoutMs: 2500 });
      if (data && data.status === "active" && Array.isArray(data.items)) {
        const local = readLocalCart();
        // Guard: if server returns 0 items but local storage has items, NEVER wipe out local items!
        if (data.items.length === 0 && local && Array.isArray(local.items) && local.items.length > 0) {
          return;
        }
        setActiveCart(data);
      }
    } catch (err) {
      if (isStaleBag(err)) {
        // Stale bag ID on server: clear only the server ID reference.
        // Under NO circumstance do we delete the user's items from localStorage!
        writeId(null);
        if (cartIdRef.current === id) {
          cartIdRef.current = null;
        }
      }
    }
  }, [setActiveCart]);

  useEffect(() => {
    // 1. Immediately hydrate local cart from localStorage
    const local = readLocalCart();
    if (local && Array.isArray(local.items) && local.items.length > 0) {
      if (isUuid(local.id)) {
        cartIdRef.current = local.id;
      }
      setCart(local);

      // Hydrate saved coupon if exists
      const savedCoupon = readStoredCoupon();
      if (savedCoupon && savedCoupon.code) {
        setCouponCode(savedCoupon.code);
        setDiscountAmount(savedCoupon.discount);
      }
    }
    setLoading(false);

    // 2. Silently attempt server sync only if a valid server UUID was stored
    const existingServerId = readId();
    if (existingServerId) {
      cartIdRef.current = existingServerId;
      void refresh();
    }
  }, [refresh]);

  // Keep tabs synchronized if user opens multiple tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CLIENT_STORAGE_KEY) {
        const local = readLocalCart();
        setCart(local);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const ensureServerCart = useCallback(async (): Promise<string | null> => {
    const currentId = cartIdRef.current ?? readId();
    if (isUuid(currentId)) return currentId;
    try {
      const created = await apiFetch<Cart>("/cart", { method: "POST", timeoutMs: 3000 });
      if (created && isUuid(created.id)) {
        cartIdRef.current = created.id;
        writeId(created.id);

        // Sync local items to server
        const currentItems = cart?.items || readLocalCart()?.items || [];
        for (const item of currentItems) {
          try {
            await apiFetch<Cart>(`/cart/${created.id}/items`, {
              method: "POST",
              body: {
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                customization: item.customization,
              },
              timeoutMs: 2500,
            });
          } catch {
            // Ignore individual item sync failure
          }
        }
        return created.id;
      }
    } catch {
      // Server offline or unreachable
    }
    return null;
  }, [cart]);

  const ensureCart = ensureServerCart;

  const addItem = useCallback(
    async ({ productId, quantity = 1, size = "", customization = null }: AddToBagInput): Promise<Cart> => {
      // 1. Immediately find or synthesize product item
      const product = allProducts.find((p) => p.id === productId) || allProducts[0];
      const unitPrice = product.rawPrice || 2499;
      const lineTotal = unitPrice * quantity;

      const newItem: CartItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        category: product.category,
        quantity,
        size: size || String(customization?.chestSize || 38),
        customization: customization || null,
        unitPrice,
        customizationFee: 0,
        lineTotal,
        lineTotalLabel: formatMoney(lineTotal),
        available: true,
      };

      // 2. Optimistically update local cart INSTANTLY (0ms response)
      const currentItems = cart?.items || readLocalCart()?.items || [];
      const updatedItems = [newItem, ...currentItems];
      const existingId = isUuid(cart?.id) ? cart.id : isUuid(readId()) ? readId() : undefined;
      const updatedCart = calculateCartTotals(updatedItems, "₹", existingId);

      setActiveCart(updatedCart);

      // 3. Silently sync with backend API in background without blocking or failing
      void (async () => {
        try {
          const serverId = await ensureCart();
          if (!serverId) return;
          const body = { productId, quantity, size, customization };
          const serverCart = await apiFetch<Cart>(`/cart/${serverId}/items`, {
            method: "POST",
            body,
            timeoutMs: 2000,
          });
          if (serverCart && Array.isArray(serverCart.items) && serverCart.items.length > 0) {
            setActiveCart({
              ...serverCart,
              items: updatedItems,
            });
          }
        } catch {
          // Backend offline or unreachable — local cart is already active & fully functional!
        }
      })();

      return updatedCart;
    },
    [cart, ensureCart, setActiveCart],
  );

  const mutate = useCallback(
    async (path: string, init: { method: string; body?: unknown }) => {
      const id = cartIdRef.current;
      if (!id || !isUuid(id)) return;
      try {
        const next = await apiFetch<Cart>(`/cart/${id}${path}`, { ...init, timeoutMs: 2500 });
        if (next && Array.isArray(next.items)) {
          setActiveCart(next);
        }
      } catch (err) {
        if (isStaleBag(err) && /bag/i.test((err as Error).message)) {
          writeId(null);
          cartIdRef.current = null;
        }
      }
    },
    [setActiveCart],
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      const currentItems = cart?.items || readLocalCart()?.items || [];
      let updatedItems: CartItem[];
      if (quantity <= 0) {
        updatedItems = currentItems.filter((it) => it.id !== itemId);
      } else {
        updatedItems = currentItems.map((it) => {
          if (it.id === itemId) {
            const lineTotal = it.unitPrice * quantity;
            return {
              ...it,
              quantity,
              lineTotal,
              lineTotalLabel: formatMoney(lineTotal),
            };
          }
          return it;
        });
      }

      if (updatedItems.length === 0) {
        setActiveCart(null);
        removeCoupon();
        return;
      }

      const updatedCart = calculateCartTotals(updatedItems, "₹", cart?.id);
      setActiveCart(updatedCart);

      void mutate(`/items/${itemId}`, { method: "PATCH", body: { quantity } });
    },
    [cart, mutate, removeCoupon, setActiveCart],
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      const currentItems = cart?.items || readLocalCart()?.items || [];
      const updatedItems = currentItems.filter((it) => it.id !== itemId);

      if (updatedItems.length === 0) {
        setActiveCart(null);
        removeCoupon();
        return;
      }

      const updatedCart = calculateCartTotals(updatedItems, "₹", cart?.id);
      setActiveCart(updatedCart);

      void mutate(`/items/${itemId}`, { method: "DELETE" });
    },
    [cart, mutate, removeCoupon, setActiveCart],
  );

  const reset = useCallback(() => {
    setActiveCart(null);
    removeCoupon();
  }, [removeCoupon, setActiveCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart?.itemCount ?? 0,
        loading,
        busy,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        addItem,
        updateQuantity,
        removeItem,
        refresh,
        ensureServerCart,
        reset,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
