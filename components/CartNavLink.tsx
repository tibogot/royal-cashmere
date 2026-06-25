"use client";

import { routes } from "@/lib/routes";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type CartNavLinkProps = {
  className: string;
} & React.ComponentPropsWithoutRef<"a">;

export default function CartNavLink({
  className,
  ...props
}: CartNavLinkProps) {
  const [count, setCount] = useState(0);

  const refreshCount = useCallback(async () => {
    try {
      const response = await fetch("/api/cart", { cache: "no-store" });
      if (!response.ok) return;

      const data = (await response.json()) as { totalQuantity: number };
      setCount(data.totalQuantity ?? 0);
    } catch {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCount();

    const handleCartUpdated = () => {
      refreshCount();
    };

    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, [refreshCount]);

  const label = count > 0 ? `Panier (${count})` : "Panier";

  return (
    <Link href={routes.cart} className={className} {...props}>
      {label}
    </Link>
  );
}
