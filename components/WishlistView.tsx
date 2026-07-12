"use client";

import ProductCard from "@/components/ProductCard";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import { getWishlistHandles, subscribeToWishlist } from "@/lib/wishlist";
import {
  getServerWishlistProducts,
  getServerWishlistProductsHasFetched,
  getWishlistProductsForHandlesKey,
  getWishlistProductsHasFetchedForHandlesKey,
  prefetchWishlistProductsForHandlesKey,
  subscribeWishlistProducts,
} from "@/lib/wishlist-products-store";
import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";

function WishlistGridSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-12 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="space-y-3">
          <div className="aspect-4/5 animate-pulse bg-black/5" />
          <div className="h-3 w-3/4 animate-pulse bg-black/5" />
          <div className="h-3 w-1/3 animate-pulse bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export default function WishlistView() {
  const handlesKey = useSyncExternalStore(
    subscribeToWishlist,
    () => getWishlistHandles().join(","),
    () => "",
  );

  const products = useSyncExternalStore(
    subscribeWishlistProducts,
    () => getWishlistProductsForHandlesKey(handlesKey),
    getServerWishlistProducts,
  );

  const hasFetched = useSyncExternalStore(
    subscribeWishlistProducts,
    () => getWishlistProductsHasFetchedForHandlesKey(handlesKey),
    getServerWishlistProductsHasFetched,
  );

  useEffect(() => {
    prefetchWishlistProductsForHandlesKey(handlesKey);
  }, [handlesKey]);

  if (!hasFetched && handlesKey.length > 0) {
    return <WishlistGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-sm text-black/70">Votre wishlist est vide.</p>
        <Link
          href={routes.shop}
          className={`${ctaLinkClassName} mt-8 inline-block`}
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-12 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="grid" />
      ))}
    </div>
  );
}
