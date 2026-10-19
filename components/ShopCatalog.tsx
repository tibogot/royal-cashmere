"use client";

import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/lib/boutique-filters";
import type { ShopifyProduct } from "@/lib/shopify/queries";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type CategoryLink = {
  label: string;
  href: string;
  active: boolean;
};

type ShopCatalogProps = {
  products: ShopifyProduct[];
  // Links to the sibling category collections, shown above the grid.
  categoryLinks?: CategoryLink[];
};

export default function ShopCatalog({
  products,
  categoryLinks = [],
}: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const filteredProducts = useMemo(
    () => searchProducts(products, query),
    [products, query],
  );

  return (
    <>
      {query ? (
        <p className="mt-10 text-center text-sm text-black/60 md:mt-12">
          Résultats pour &ldquo;{query}&rdquo;
        </p>
      ) : null}

      <div className="mt-10 flex flex-col gap-6 border-b border-black/10 pb-6 md:mt-12 md:flex-row md:items-end md:justify-between">
        {categoryLinks.length > 0 ? (
          <nav aria-label="Catégories" className="flex flex-wrap gap-x-6 gap-y-3">
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.active ? "page" : undefined}
                className={`select-none text-xs uppercase tracking-wide transition-opacity ${
                  link.active
                    ? "text-black"
                    : "text-black/50 hover:text-black/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <div aria-hidden="true" />
        )}

        <p className="text-sm text-black/50">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "produit" : "produits"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-12 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout="grid"
            />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-sm text-black/60">
          Aucun produit ne correspond à votre recherche pour le moment.
        </p>
      )}
    </>
  );
}
