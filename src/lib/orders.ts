import { useMemo, useSyncExternalStore } from "react";
import type { Order } from "@/lib/types";

/** sessionStorage key holding the order just placed, so the confirmation page can show it without a lookup. */
export const LAST_ORDER_KEY = "suitoholic_last_order";

export function saveLastOrder(order: Order) {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable */
  }
}

const noopSubscribe = () => () => {};
const readRaw = () => {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
};

/** The order placed in this tab, if it matches orderNumber (null during server render). */
export function useLastOrder(orderNumber: string): Order | null {
  const raw = useSyncExternalStore(noopSubscribe, readRaw, () => null);
  return useMemo(() => {
    try {
      const order = raw ? (JSON.parse(raw) as Order) : null;
      return order?.orderNumber === orderNumber ? order : null;
    } catch {
      return null;
    }
  }, [raw, orderNumber]);
}
