"use client";

import CartIcon from "@/components/CartIcon";
import {
  getCartCount,
  getServerCartCount,
  subscribeCartCount,
} from "@/lib/cart-count-store";
import { useSyncExternalStore } from "react";

type CartNavLinkProps = {
  className: string;
  variant?: "text" | "icon";
  onClick?: () => void;
} & Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "type">;

export default function CartNavLink({
  className,
  variant = "text",
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

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={className}
        {...props}
      >
        <span className="relative inline-flex shrink-0">
          <CartIcon />
          {count > 0 ? (
            <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 text-[9px] leading-none tabular-nums">
              {count}
            </span>
          ) : null}
        </span>
      </button>
    );
  }

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
