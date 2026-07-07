"use client";

import HeartIcon from "@/components/HeartIcon";
import {
  isInWishlist,
  subscribeToWishlist,
  toggleWishlist,
} from "@/lib/wishlist";
import { useSyncExternalStore } from "react";

type WishlistHeartButtonProps = {
  handle: string;
  className?: string;
  tone?: "light" | "dark";
};

export default function WishlistHeartButton({
  handle,
  className = "absolute top-2 right-2 z-10",
  tone = "dark",
}: WishlistHeartButtonProps) {
  const active = useSyncExternalStore(
    subscribeToWishlist,
    () => isInWishlist(handle),
    () => false,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // toggleWishlist writes to storage and dispatches the update event, which
    // the store subscription above picks up to re-render `active`.
    toggleWishlist(handle);
  };

  const toneClassName =
    tone === "light"
      ? active
        ? "text-white"
        : "text-white/90"
      : active
        ? "text-black"
        : "text-black/70";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={active}
      className={`flex size-7 items-center justify-center transition-opacity hover:opacity-60 ${toneClassName} ${className}`}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
