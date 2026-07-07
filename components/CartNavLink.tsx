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
        className={`relative ${className}`}
        {...props}
      >
        <CartIcon />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-black px-0.5 text-[9px] leading-none text-white">
            {count}
          </span>
        ) : null}
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
