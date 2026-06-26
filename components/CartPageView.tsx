import CartView from "@/components/CartView";
import type { Cart } from "@/lib/shopify/cart";

type CartPageViewProps = {
  cart: Cart | null;
  variant?: "page" | "panel";
  onClose?: () => void;
};

export default function CartPageView({
  cart,
  variant = "page",
  onClose,
}: CartPageViewProps) {
  return (
    <CartView initialCart={cart} variant={variant} onClose={onClose} />
  );
}
