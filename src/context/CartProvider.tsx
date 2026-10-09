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
  const cartIdRef = useRef<string | null>(null);

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
          return updated;
        } catch (err) {
          if (!isStaleBag(err) || !(err instanceof ApiError) || !/bag/i.test(err.message)) throw err;
          // The stored bag was checked out or removed: start a fresh one and retry once.
          setActiveCart(null);
          id = await ensureCart();
          const updated = await apiFetch<Cart>(`/cart/${id}/items`, { method: "POST", body });
          setActiveCart(updated);
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
  const reset = useCallback(() => setActiveCart(null), [setActiveCart]);

  return (
    <CartContext.Provider
      value={{ cart, itemCount: cart?.itemCount ?? 0, loading, busy, addItem, updateQuantity, removeItem, refresh, reset }}
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
