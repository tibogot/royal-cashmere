"use client";

import { useCallback, useEffect, useState } from "react";

type CartNavLinkProps = {
  className: string;
  onClick?: () => void;
} & Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "type">;

export default function CartNavLink({
  className,
  onClick,
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

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    window.dispatchEvent(new Event("cart-open"));
  };

  const label = count > 0 ? `Panier (${count})` : "Panier";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {label}
    </button>
  );
}
