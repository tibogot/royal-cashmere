"use client";

import ProductCard from "@/components/ProductCard";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import {
  getWishlistHandles,
  WISHLIST_UPDATED_EVENT,
} from "@/lib/wishlist";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function WishlistView() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshWishlist = useCallback(async () => {
    const handles = getWishlistHandles();

    if (handles.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({ handles: handles.join(",") });
      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        setProducts([]);
        return;
      }

      const data = (await response.json()) as { products?: ShopifyProduct[] };
      setProducts(data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWishlist();

    const handleWishlistUpdated = () => {
      refreshWishlist();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    return () =>
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
  }, [refreshWishlist]);

  if (isLoading) {
    return <p className="mt-12 text-center text-sm text-black/50">Chargement…</p>;
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
