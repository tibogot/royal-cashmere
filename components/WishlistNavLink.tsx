"use client";

import { routes } from "@/lib/routes";
import { getWishlistCount, subscribeToWishlist } from "@/lib/wishlist";
import Link from "next/link";
import { useSyncExternalStore } from "react";

type WishlistNavLinkProps = {
  className: string;
  onClick?: () => void;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "onClick">;

export default function WishlistNavLink({
  className,
  onClick,
  ...props
}: WishlistNavLinkProps) {
  const count = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistCount,
    () => 0,
  );

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
