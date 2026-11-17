import { useMemo, useSyncExternalStore } from "react";
import type { Order } from "@/lib/types";

/** sessionStorage key holding the order just placed, so the confirmation page can show it without a lookup. */
export const LAST_ORDER_KEY = "suitoholic_last_order";

export function saveLastOrder(order: Order) {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    if (order.orderNumber) {
      localStorage.setItem(`suitoholic_order_${order.orderNumber.toUpperCase()}`, JSON.stringify(order));
    }
  } catch {
    /* storage unavailable */
  }
}

const noopSubscribe = () => () => {};
const readRaw = (orderNumber?: string) => {
  try {
    const fromSession = sessionStorage.getItem(LAST_ORDER_KEY);
    if (fromSession) {
      const parsed = JSON.parse(fromSession) as Order;
      if (!orderNumber || parsed?.orderNumber?.toUpperCase() === orderNumber.toUpperCase()) {
        return fromSession;
      }
    }
    if (orderNumber) {
      const fromLocal = localStorage.getItem(`suitoholic_order_${orderNumber.toUpperCase()}`);
      if (fromLocal) return fromLocal;
    }
    return null;
  } catch {
    return null;
  }
};

/** The order placed in this tab or browser, if it matches orderNumber (null during server render). */
export function useLastOrder(orderNumber: string): Order | null {
  const raw = useSyncExternalStore(noopSubscribe, () => readRaw(orderNumber), () => null);
  return useMemo(() => {
    try {
      const order = raw ? (JSON.parse(raw) as Order) : null;
      return order?.orderNumber?.toUpperCase() === orderNumber.toUpperCase() ? order : null;
    } catch {
      return null;
    }
  }, [raw, orderNumber]);
}
