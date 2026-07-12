import type { ShopifyProduct } from "@/lib/shopify/queries";

type CacheEntry = {
  products: ShopifyProduct[];
  hasFetched: boolean;
};

const EMPTY_PRODUCTS: ShopifyProduct[] = [];
const EMPTY_ENTRY: CacheEntry = {
  products: EMPTY_PRODUCTS,
  hasFetched: false,
};

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

export function keyFromHandles(handles: string[]): string {
  return handles.length > 0 ? handles.join(",") : "__empty__";
}

export function keyFromHandlesKey(handlesKey: string): string {
  return handlesKey.length > 0 ? handlesKey : "__empty__";
}

function getEntry(key: string): CacheEntry {
  return cache.get(key) ?? EMPTY_ENTRY;
}

function emit() {
  for (const listener of listeners) listener();
}

async function fetchProductsForKey(
  key: string,
  handles: string[],
): Promise<void> {
  if (inFlight.has(key)) return inFlight.get(key)!;

  const promise = (async () => {
    try {
      if (handles.length === 0) {
        cache.set(key, { products: EMPTY_PRODUCTS, hasFetched: true });
        return;
      }

      const params = new URLSearchParams({ handles: handles.join(",") });
      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });

      const data = response.ok
        ? ((await response.json()) as { products?: ShopifyProduct[] })
        : { products: [] };

      cache.set(key, {
        products: data.products ?? EMPTY_PRODUCTS,
        hasFetched: true,
      });
    } catch {
      cache.set(key, { products: EMPTY_PRODUCTS, hasFetched: true });
    } finally {
      inFlight.delete(key);
      emit();
    }
  })();

  inFlight.set(key, promise);
  return promise;
}

export function prefetchProductsByHandles(handles: string[]): void {
  const key = keyFromHandles(handles);
  const entry = getEntry(key);

  if (entry.hasFetched || inFlight.has(key)) return;

  void fetchProductsForKey(key, handles);
}

export function prefetchProductsByHandlesKey(handlesKey: string): void {
  const handles = handlesKey ? handlesKey.split(",") : [];
  prefetchProductsByHandles(handles);
}

function ensureFetched() {
  // No default prefetch — callers pass explicit handles.
}

export function subscribeProductsByHandles(callback: () => void): () => void {
  listeners.add(callback);
  ensureFetched();
  return () => listeners.delete(callback);
}

export function getProductsForHandlesKey(handlesKey: string): ShopifyProduct[] {
  return getEntry(keyFromHandlesKey(handlesKey)).products;
}

export function getProductsHasFetchedForHandlesKey(handlesKey: string): boolean {
  return getEntry(keyFromHandlesKey(handlesKey)).hasFetched;
}

export function getServerProductsByHandles(): ShopifyProduct[] {
  return EMPTY_PRODUCTS;
}

export function getServerProductsByHandlesHasFetched(): boolean {
  return false;
}

export function refreshProductsByHandles(handles: string[]): Promise<void> {
  const key = keyFromHandles(handles);
  cache.delete(key);
  return fetchProductsForKey(key, handles);
}
