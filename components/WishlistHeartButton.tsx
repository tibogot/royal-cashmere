"use client";

import HeartIcon from "@/components/HeartIcon";
import {
  isInWishlist,
  toggleWishlist,
  WISHLIST_UPDATED_EVENT,
} from "@/lib/wishlist";
import { useCallback, useEffect, useState } from "react";

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
  const [active, setActive] = useState(false);

  const syncState = useCallback(() => {
    setActive(isInWishlist(handle));
  }, [handle]);

  useEffect(() => {
    syncState();

    const handleWishlistUpdated = () => {
      syncState();
    };

    window.addEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
    return () =>
      window.removeEventListener(WISHLIST_UPDATED_EVENT, handleWishlistUpdated);
  }, [syncState]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActive(toggleWishlist(handle));
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
