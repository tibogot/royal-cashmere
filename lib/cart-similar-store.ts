import type { Cart } from "@/lib/shopify/cart";
import type { CartCarouselProduct } from "@/lib/shopify/products";

type CacheEntry = {
  products: CartCarouselProduct[];
  hasFetched: boolean;
};

const EMPTY_PRODUCTS: CartCarouselProduct[] = [];
const EMPTY_ENTRY: CacheEntry = {
  products: EMPTY_PRODUCTS,
  hasFetched: false,
};

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();

function getHandlesKey(productHandles: string[]): string {
  return productHandles.length > 0 ? productHandles.join(",") : "__empty__";
}

function buildSimilarUrl(productHandles: string[]): string {
  const params = new URLSearchParams({ limit: "4" });

  if (productHandles.length > 0) {
    params.set("handle", productHandles[0]);
    params.set("exclude", productHandles.join(","));
  }

  return `/api/products/similar?${params.toString()}`;
}

function emit() {
  for (const listener of listeners) listener();
}

function getEntry(key: string): CacheEntry {
  return cache.get(key) ?? EMPTY_ENTRY;
}

async function fetchSimilarForKey(
  key: string,
  productHandles: string[],
): Promise<void> {
  if (inFlight.has(key)) return inFlight.get(key)!;

  const promise = (async () => {
    try {
      const response = await fetch(buildSimilarUrl(productHandles), {
        cache: "no-store",
      });
      const data = response.ok
        ? ((await response.json()) as { products?: CartCarouselProduct[] })
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

export function prefetchSimilarProducts(productHandles: string[]): void {
  const key = getHandlesKey(productHandles);
  const entry = getEntry(key);

  if (entry.hasFetched || inFlight.has(key)) return;

  void fetchSimilarForKey(key, productHandles);
}

export function prefetchSimilarProductsForCart(cart: Cart | null): void {
  if (!cart || cart.lines.length === 0) {
    prefetchSimilarProducts([]);
    return;
  }

  prefetchSimilarProducts(cart.lines.map((line) => line.productHandle));
}

export function subscribeSimilarProducts(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getSimilarProductsForHandlesKey(
  handlesKey: string,
): CartCarouselProduct[] {
  const key = handlesKey === "__empty__" ? "__empty__" : handlesKey;
  return getEntry(key).products;
}

export function getSimilarProductsHasFetchedForHandlesKey(
  handlesKey: string,
): boolean {
  const key = handlesKey === "__empty__" ? "__empty__" : handlesKey;
  return getEntry(key).hasFetched;
}

export function getServerSimilarProducts(): CartCarouselProduct[] {
  return EMPTY_PRODUCTS;
}

export function getServerSimilarProductsHasFetched(): boolean {
  return false;
}
