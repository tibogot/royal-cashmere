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
  if (variant === "panel") {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <CartView initialCart={cart} variant={variant} onClose={onClose} />
      </div>
    );
  }

  return <CartView initialCart={cart} variant={variant} onClose={onClose} />;
}
