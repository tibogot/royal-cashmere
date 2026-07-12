"use client";

import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import {
  addRecentlyViewed,
  getDisplayRecentlyViewedHandles,
} from "@/lib/recently-viewed";
import {
  getProductsForHandlesKey,
  getProductsHasFetchedForHandlesKey,
  getServerProductsByHandles,
  getServerProductsByHandlesHasFetched,
  keyFromHandles,
  prefetchProductsByHandlesKey,
  subscribeProductsByHandles,
} from "@/lib/products-by-handles-store";
import { useEffect, useState, useSyncExternalStore } from "react";

type RecentlyViewedProductsProps = {
  currentHandle: string;
};

function RecentlyViewedSkeleton() {
  return (
    <div className="flex gap-6 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="w-[72vw] shrink-0 animate-pulse md:w-[calc((100vw-4rem)/4-1.125rem)]"
        >
          <div className="aspect-4/5 bg-black/5" />
          <div className="mt-3 h-3 w-3/4 bg-black/5" />
          <div className="mt-1.5 h-3 w-1/3 bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export default function RecentlyViewedProducts({
  currentHandle,
}: RecentlyViewedProductsProps) {
  const [handlesKey, setHandlesKey] = useState("__empty__");

  useEffect(() => {
    addRecentlyViewed(currentHandle);
    const key = keyFromHandles(
      getDisplayRecentlyViewedHandles(currentHandle),
    );
    setHandlesKey(key);
    prefetchProductsByHandlesKey(key);
  }, [currentHandle]);

  const products = useSyncExternalStore(
    subscribeProductsByHandles,
    () => getProductsForHandlesKey(handlesKey),
    getServerProductsByHandles,
  );

  const hasFetched = useSyncExternalStore(
    subscribeProductsByHandles,
    () => getProductsHasFetchedForHandlesKey(handlesKey),
    getServerProductsByHandlesHasFetched,
  );

  if (handlesKey === "__empty__") return null;

  if (hasFetched && products.length === 0) return null;

  return (
    <section className="bg-white px-4 pt-6 pb-20 text-black md:px-8 md:pt-10 md:pb-32">
      <h2 className="mb-10 font-serif text-2xl uppercase md:mb-12 md:text-3xl">
        Vu récemment
      </h2>
      {hasFetched ? (
        <FeaturedProductsCarousel products={products} showViewAll={false} />
      ) : (
        <RecentlyViewedSkeleton />
      )}
    </section>
  );
}
