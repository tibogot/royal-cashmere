"use client";

import { routes } from "@/lib/routes";
import {
  getWishlistCount,
  WISHLIST_UPDATED_EVENT,
} from "@/lib/wishlist";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type WishlistNavLinkProps = {
  className: string;
  onClick?: () => void;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "onClick">;

export default function WishlistNavLink({
  className,
  onClick,
  ...props
}: WishlistNavLinkProps) {
  const [count, setCount] = useState(0);

  const refreshCount = useCallback(() => {
    setCount(getWishlistCount());
  }, []);

  useEffect(() => {
    refreshCount();

    const handleWishlistUpdated = () => {
      refreshCount();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    return () =>
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
  }, [refreshCount]);

  const label = count > 0 ? `WISHLIST (${count})` : "WISHLIST";

  return (
    <Link
      href={routes.wishlist}
      onClick={onClick}
      className={className}
      {...props}
    >
      {label}
    </Link>
  );
}
