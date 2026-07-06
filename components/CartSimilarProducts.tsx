"use client";

import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import type { CartCarouselProduct } from "@/lib/shopify/products";
import { useEffect, useState } from "react";

type CartSimilarProductsProps = {
  productHandles: string[];
};

export default function CartSimilarProducts({
  productHandles,
}: CartSimilarProductsProps) {
  const [products, setProducts] = useState<CartCarouselProduct[]>([]);
  const handlesKey = productHandles.join(",");
  const isEmptyCart = productHandles.length === 0;

  useEffect(() => {
    const params = new URLSearchParams({ limit: "4" });

    if (!isEmptyCart) {
      params.set("handle", productHandles[0]);
      params.set("exclude", productHandles.join(","));
    }

    fetch(`/api/products/similar?${params.toString()}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : { products: [] }))
      .then((data: { products?: CartCarouselProduct[] }) => {
        setProducts(data.products ?? []);
      })
      .catch(() => {
        setProducts([]);
      });
  }, [handlesKey, isEmptyCart, productHandles]);

  if (products.length === 0) return null;

  return (
    <section className="mt-8 border-t border-black/10 pt-6">
      <h3 className="mb-4 font-serif text-lg uppercase">Articles similaires</h3>
      <FeaturedProductsCarousel
        products={products}
        showViewAll={false}
        compact
        quickAdd
      />
    </section>
  );
}
