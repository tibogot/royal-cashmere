import type { ReactNode } from "react";
import WishlistHeartButton from "@/components/WishlistHeartButton";
import type { ShopifyProduct } from "@/lib/shopify/queries";

type ProductImageWishlistProps = {
  product: Pick<ShopifyProduct, "handle">;
  children: ReactNode;
  className?: string;
  heartClassName?: string;
  tone?: "light" | "dark";
};

export default function ProductImageWishlist({
  product,
  children,
  className = "relative",
  heartClassName = "absolute top-2 right-2 z-10",
  tone = "dark",
}: ProductImageWishlistProps) {
  return (
    <div className={className}>
      {children}
      <WishlistHeartButton
        handle={product.handle}
        className={heartClassName}
        tone={tone}
      />
    </div>
  );
}
