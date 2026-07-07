"use client";

import ProductCard from "@/components/ProductCard";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import { getWishlistHandles, subscribeToWishlist } from "@/lib/wishlist";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";

export default function WishlistView() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // A stable, primitive snapshot of the wishlist that changes whenever handles
  // are added/removed (same-tab or cross-tab). The product fetch keys off it.
  const handlesKey = useSyncExternalStore(
    subscribeToWishlist,
    () => getWishlistHandles().join(","),
    () => "",
  );

  useEffect(() => {
    const handles = handlesKey ? handlesKey.split(",") : [];
    let cancelled = false;

    async function loadProducts() {
      if (handles.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setIsLoading(false);
        }
        return;
      }

      if (!cancelled) setIsLoading(true);

      try {
        const params = new URLSearchParams({ handles: handles.join(",") });
        const response = await fetch(`/api/products?${params.toString()}`, {
          cache: "no-store",
        });

        if (cancelled) return;

        if (!response.ok) {
          setProducts([]);
          return;
        }

        const data = (await response.json()) as {
          products?: ShopifyProduct[];
        };
        if (!cancelled) setProducts(data.products ?? []);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [handlesKey]);

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
