import { useSyncExternalStore } from "react";
import {
  FREE_SHIPPING_THRESHOLD,
  PRINT_PRICE,
  SHIPPING_FEE,
  getProduct,
  type KitColors,
  type Size,
} from "./products";

export type CartItem = {
  id: string;
  slug: string;
  size: Size;
  name?: string;
  number?: string;
  /** Only set for kits built in the customizer */
  custom?: KitColors;
  /** Team name shown for customizer kits, e.g. "Brazil" */
  team?: string;
  qty: number;
};

export type NewCartItem = Omit<CartItem, "id" | "qty">;

const STORAGE_KEY = "blaze-pro-cart-v1";
const EMPTY: CartItem[] = [];
const MAX_QTY = 20;

// Small external store backed by localStorage, read through useSyncExternalStore
// so every page (and the hero's cart pill) shares one cart without a provider.
let items: CartItem[] | null = null;
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (items) return items;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    items = Array.isArray(parsed) ? parsed.filter((i) => getProduct(i.slug)) : EMPTY;
  } catch {
    items = EMPTY;
  }
  return items!;
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode etc.) — cart still works for this tab
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      items = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function lineId(item: NewCartItem) {
  return [
    item.slug,
    item.size,
    item.name ?? "",
    item.number ?? "",
    item.team ?? "",
    item.custom ? Object.values(item.custom).join(",") : "",
  ].join("|");
}

export const cart = {
  add(item: NewCartItem, qty = 1) {
    const id = lineId(item);
    const current = read();
    const existing = current.find((i) => i.id === id);
    commit(
      existing
        ? current.map((i) =>
            i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i
          )
        : [...current, { ...item, id, qty: Math.min(MAX_QTY, qty) }]
    );
  },
  setQty(id: string, qty: number) {
    if (qty <= 0) return cart.remove(id);
    commit(read().map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)));
  },
  remove(id: string) {
    commit(read().filter((i) => i.id !== id));
  },
  clear() {
    commit(EMPTY);
  },
};

export function useCartItems() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const noopSubscribe = () => () => {};

/** False during SSR/hydration, true once the browser cart can be read — avoids an "empty cart" flash */
export function useCartReady() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function unitPrice(item: Pick<CartItem, "slug" | "name" | "number">) {
  const product = getProduct(item.slug);
  if (!product) return 0;
  // Player kits include their print; other shirts pay for name & number
  if (product.print) return product.price;
  return product.price + (item.name || item.number ? PRINT_PRICE : 0);
}

export function cartTotals(list: CartItem[]) {
  const count = list.reduce((n, i) => n + i.qty, 0);
  const subtotal = list.reduce((sum, i) => sum + unitPrice(i) * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  return { count, subtotal, shipping, total: subtotal + shipping };
}
