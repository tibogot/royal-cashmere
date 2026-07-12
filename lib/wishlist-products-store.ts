import {
  getProductsForHandlesKey,
  getProductsHasFetchedForHandlesKey,
  getServerProductsByHandles,
  getServerProductsByHandlesHasFetched,
  keyFromHandles,
  prefetchProductsByHandles,
  prefetchProductsByHandlesKey,
  subscribeProductsByHandles,
} from "@/lib/products-by-handles-store";
import {
  getWishlistHandles,
  WISHLIST_STORAGE_KEY,
  WISHLIST_UPDATED_EVENT,
} from "@/lib/wishlist";

export {
  getProductsForHandlesKey as getWishlistProductsForHandlesKey,
  getProductsHasFetchedForHandlesKey as getWishlistProductsHasFetchedForHandlesKey,
  getServerProductsByHandles as getServerWishlistProducts,
  getServerProductsByHandlesHasFetched as getServerWishlistProductsHasFetched,
  prefetchProductsByHandlesKey as prefetchWishlistProductsForHandlesKey,
  subscribeProductsByHandles as subscribeWishlistProducts,
};

export function prefetchWishlistProducts(handles: string[]): void {
  prefetchProductsByHandles(handles);
}

if (typeof window !== "undefined") {
  const handleWishlistChanged = () => {
    prefetchProductsByHandles(getWishlistHandles());
  };

  window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistChanged);
  window.addEventListener("storage", (event) => {
    if (event.key === WISHLIST_STORAGE_KEY) {
      handleWishlistChanged();
    }
  });
}

// Re-export for callers that build keys manually.
export { keyFromHandles };
