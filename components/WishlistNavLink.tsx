"use client";

import HeartIcon from "@/components/HeartIcon";
import { routes } from "@/lib/routes";
import { getWishlistCount, subscribeToWishlist } from "@/lib/wishlist";
import Link from "next/link";
import { useSyncExternalStore } from "react";

type WishlistNavLinkProps = {
  className: string;
  variant?: "text" | "icon";
  onClick?: () => void;
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "onClick">;

export default function WishlistNavLink({
  className,
  variant = "text",
  onClick,
  ...props
}: WishlistNavLinkProps) {
  const count = useSyncExternalStore(
    subscribeToWishlist,
    getWishlistCount,
    () => 0,
  );

  const label = count > 0 ? `WISHLIST (${count})` : "WISHLIST";

  if (variant === "icon") {
    return (
      <Link
        href={routes.wishlist}
        onClick={onClick}
        aria-label={label}
        className={className}
        {...props}
      >
        <span className="relative inline-flex shrink-0">
          <HeartIcon className="h-5 w-5" />
          {count > 0 ? (
            <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 text-[9px] leading-none tabular-nums">
              {count}
            </span>
          ) : null}
        </span>
      </Link>
    );
  }

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
