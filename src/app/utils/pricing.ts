import { Product } from '../types';

/** Candidate stores for a product, parsed from its `tienda` field ("A / B"). */
export function storesOf(p: Product): string[] {
  return p.tienda
    .split('/')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Price of a product at a given store (falls back to the base price). */
export function priceAt(p: Product, store: string): number {
  return p.precios?.[store] ?? p.precio ?? 0;
}

/** [{store, price}] across all candidate stores (only those with a price > 0). */
export function storePrices(p: Product): { store: string; price: number }[] {
  return storesOf(p)
    .map((store) => ({ store, price: p.precios?.[store] ?? p.precio ?? 0 }))
    .filter((x) => x.price > 0);
}

/** The cheapest {store, price} for a product, or null if no price is set. */
export function bestStore(p: Product): { store: string; price: number } | null {
  const list = storePrices(p);
  if (!list.length) return null;
  return list.reduce((a, b) => (b.price < a.price ? b : a));
}

/** Effective unit price = cheapest available store price (or base price). */
export function effectivePrice(p: Product): number {
  return bestStore(p)?.price ?? p.precio ?? 0;
}

/** Most expensive store price (for savings comparison). */
export function maxPrice(p: Product): number {
  const list = storePrices(p);
  if (!list.length) return p.precio ?? 0;
  return list.reduce((m, x) => Math.max(m, x.price), 0);
}

/** Line total at the best price. */
export function bestLineTotal(p: Product): number {
  return effectivePrice(p) * (p.cantidad ?? 0);
}

/** Potential saving on this line vs buying at its most expensive store. */
export function savingsOf(p: Product): number {
  if (p.cantidad <= 0) return 0;
  return (maxPrice(p) - effectivePrice(p)) * p.cantidad;
}
