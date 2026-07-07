"use client";

import {
  getCartCount,
  getServerCartCount,
  subscribeCartCount,
} from "@/lib/cart-count-store";
import { useSyncExternalStore } from "react";

type CartNavLinkProps = {
  className: string;
  onClick?: () => void;
} & Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "type">;

export default function CartNavLink({
  className,
  onClick,
  ...props
}: CartNavLinkProps) {
  const count = useSyncExternalStore(
    subscribeCartCount,
    getCartCount,
    getServerCartCount,
  );

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
