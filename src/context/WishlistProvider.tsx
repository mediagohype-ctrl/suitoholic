"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

import { readBrowserJson } from "@/lib/browser-storage";
import { useIsClient } from "@/lib/useIsClient";

const STORAGE_KEY = "suitoholic_wishlist_ids";

interface WishlistContextValue {
  wishlistIds: (number | string)[];
  wishlistCount: number;
  isInWishlist: (productId: number | string) => boolean;
  toggleWishlist: (productId: number | string) => void;
  removeFromWishlist: (productId: number | string) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();
  const storedIds = useMemo(() => {
    const stored = isClient ? readBrowserJson<unknown>(STORAGE_KEY) : null;
    return Array.isArray(stored) ? stored.map(String) : [];
  }, [isClient]);
  const [updatedIds, setWishlistIds] = useState<string[]>();
  const wishlistIds = updatedIds ?? storedIds;
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    if (!updatedIds) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
    } catch {
      // Storage unavailable.
    }
  }, [updatedIds]);

  const isInWishlist = useCallback(
    (productId: number | string) => {
      const sId = String(productId);
      return wishlistIds.some((id) => String(id) === sId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback((productId: number | string) => {
    const sId = String(productId);
    setWishlistIds((prev) => {
      const ids = prev ?? storedIds;
      return ids.includes(sId) ? ids.filter((id) => id !== sId) : [...ids, sId];
    });
  }, [storedIds]);

  const removeFromWishlist = useCallback((productId: number | string) => {
    const sId = String(productId);
    setWishlistIds((prev) => (prev ?? storedIds).filter((id) => id !== sId));
  }, [storedIds]);

  const clearWishlist = useCallback(() => {
    setWishlistIds([]);
  }, []);

  const openWishlist = useCallback(() => setIsWishlistOpen(true), []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    return {
      wishlistIds: [] as (number | string)[],
      wishlistCount: 0,
      isInWishlist: () => false,
      toggleWishlist: () => {},
      removeFromWishlist: () => {},
      clearWishlist: () => {},
      isWishlistOpen: false,
      openWishlist: () => {},
      closeWishlist: () => {},
    };
  }
  return ctx;
}
