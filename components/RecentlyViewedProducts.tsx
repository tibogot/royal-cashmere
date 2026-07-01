"use client";

import ProductCarouselSection from "@/components/ProductCarouselSection";
import {
  addRecentlyViewed,
  getDisplayRecentlyViewedHandles,
} from "@/lib/recently-viewed";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import { useEffect, useState } from "react";

type RecentlyViewedProductsProps = {
  currentHandle: string;
};

export default function RecentlyViewedProducts({
  currentHandle,
}: RecentlyViewedProductsProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  useEffect(() => {
    addRecentlyViewed(currentHandle);

    const handles = getDisplayRecentlyViewedHandles(currentHandle);
    if (handles.length === 0) return;

    let cancelled = false;

    fetch(`/api/products?handles=${encodeURIComponent(handles.join(","))}`)
      .then((response) => response.json())
      .then((data: { products?: ShopifyProduct[] }) => {
        if (!cancelled) {
          setProducts(data.products ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentHandle]);

  return (
    <ProductCarouselSection title="Vu récemment" products={products} />
  );
}
