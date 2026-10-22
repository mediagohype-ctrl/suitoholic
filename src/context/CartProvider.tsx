"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { ApiError, apiFetch } from "@/lib/api";
import type { Cart, CustomFit } from "@/lib/types";

const STORAGE_KEY = "suitoholic_cart_id";

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
  /** Forget the current bag (after checkout). */
  reset: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const readId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const writeId = (id: string | null) => {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable (private mode) — the bag lives for this tab only */
  }
};

// A stored bag is unusable if it was deleted (404) or already checked out (409).
const isStaleBag = (err: unknown) => err instanceof ApiError && (err.status === 404 || err.status === 409);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const cartIdRef = useRef<string | null>(null);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

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
        return { success: true, message: "WELCOME10 applied (10% off)!", discount };
      }
      if (trimmed === "SUITOHOLIC" || trimmed === "BESPOKE500") {
        const discount = Math.min(500, cart.subtotal);
        setCouponCode(trimmed);
        setDiscountAmount(discount);
        return { success: true, message: `₹500 Atelier Discount applied!`, discount };
      }
      if (trimmed === "ROYAL15") {
        const discount = Math.round(cart.subtotal * 0.15);
        setCouponCode("ROYAL15");
        setDiscountAmount(discount);
        return { success: true, message: "ROYAL15 applied (15% off)!", discount };
      }
      return { success: false, message: "Invalid or expired promo code." };
    },
    [cart],
  );

  const removeCoupon = useCallback(() => {
    setCouponCode("");
    setDiscountAmount(0);
  }, []);

  const setActiveCart = useCallback((next: Cart | null) => {
    cartIdRef.current = next?.id ?? null;
    writeId(next?.id ?? null);
    setCart(next);
  }, []);

  const refresh = useCallback(async () => {
    const id = cartIdRef.current ?? readId();
    if (!id) return;
    try {
      const data = await apiFetch<Cart>(`/cart/${id}`);
      setActiveCart(data.status === "active" ? data : null);
    } catch (err) {
      if (isStaleBag(err)) setActiveCart(null);
    }
  }, [setActiveCart]);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const ensureCart = useCallback(async () => {
    if (cartIdRef.current) return cartIdRef.current;
    const created = await apiFetch<Cart>("/cart", { method: "POST" });
    setActiveCart(created);
    return created.id;
  }, [setActiveCart]);

  const addItem = useCallback(
    async ({ productId, quantity = 1, size = "", customization = null }: AddToBagInput) => {
      setBusy(true);
      try {
        const body = { productId, quantity, size, customization };
        let id = await ensureCart();
        try {
          const updated = await apiFetch<Cart>(`/cart/${id}/items`, { method: "POST", body });
          setActiveCart(updated);
          setIsDrawerOpen(true);
          return updated;
        } catch (err) {
          if (!isStaleBag(err) || !(err instanceof ApiError) || !/bag/i.test(err.message)) throw err;
          // The stored bag was checked out or removed: start a fresh one and retry once.
          setActiveCart(null);
          id = await ensureCart();
          const updated = await apiFetch<Cart>(`/cart/${id}/items`, { method: "POST", body });
          setActiveCart(updated);
          setIsDrawerOpen(true);
          return updated;
        }
      } finally {
        setBusy(false);
      }
    },
    [ensureCart, setActiveCart],
  );

  const mutate = useCallback(
    async (path: string, init: { method: string; body?: unknown }) => {
      const id = cartIdRef.current;
      if (!id) return;
      setBusy(true);
      try {
        setActiveCart(await apiFetch<Cart>(`/cart/${id}${path}`, init));
      } catch (err) {
        if (isStaleBag(err) && /bag/i.test((err as Error).message)) setActiveCart(null);
        throw err;
      } finally {
        setBusy(false);
      }
    },
    [setActiveCart],
  );

  const updateQuantity = useCallback(
    (itemId: number, quantity: number) => mutate(`/items/${itemId}`, { method: "PATCH", body: { quantity } }),
    [mutate],
  );
  const removeItem = useCallback((itemId: number) => mutate(`/items/${itemId}`, { method: "DELETE" }), [mutate]);
  const reset = useCallback(() => {
    setActiveCart(null);
    setCouponCode("");
    setDiscountAmount(0);
  }, [setActiveCart]);

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
