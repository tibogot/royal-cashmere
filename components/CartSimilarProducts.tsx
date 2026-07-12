"use client";

import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import {
  getServerSimilarProducts,
  getServerSimilarProductsHasFetched,
  getSimilarProductsForHandlesKey,
  getSimilarProductsHasFetchedForHandlesKey,
  prefetchSimilarProducts,
  subscribeSimilarProducts,
} from "@/lib/cart-similar-store";
import { useEffect, useSyncExternalStore } from "react";

type CartSimilarProductsProps = {
  productHandles: string[];
};

function SimilarProductsSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="w-48 shrink-0 animate-pulse">
          <div className="aspect-4/5 bg-black/5" />
          <div className="mt-2 h-3 w-3/4 bg-black/5" />
          <div className="mt-1.5 h-3 w-1/3 bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export default function CartSimilarProducts({
  productHandles,
}: CartSimilarProductsProps) {
  const handlesKey =
    productHandles.length > 0 ? productHandles.join(",") : "__empty__";

  const products = useSyncExternalStore(
    subscribeSimilarProducts,
    () => getSimilarProductsForHandlesKey(handlesKey),
    getServerSimilarProducts,
  );

  const hasFetched = useSyncExternalStore(
    subscribeSimilarProducts,
    () => getSimilarProductsHasFetchedForHandlesKey(handlesKey),
    getServerSimilarProductsHasFetched,
  );

  useEffect(() => {
    prefetchSimilarProducts(productHandles);
  }, [handlesKey, productHandles]);

  if (hasFetched && products.length === 0) return null;

  return (
    <section className="mt-8 border-t border-black/10 pt-6">
      <h3 className="mb-4 font-serif text-lg uppercase">Articles similaires</h3>
      {hasFetched ? (
        <FeaturedProductsCarousel
          products={products}
          showViewAll={false}
          compact
          quickAdd
        />
      ) : (
        <SimilarProductsSkeleton />
      )}
    </section>
  );
}
