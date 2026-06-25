import { routes } from "@/lib/routes";
import type { Cart } from "@/lib/shopify/cart";
import Image from "next/image";
import Link from "next/link";

type CartPageViewProps = {
  cart: Cart | null;
};

export default function CartPageView({ cart }: CartPageViewProps) {
  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mt-12 text-center">
        <p className="text-sm text-black/70">Votre panier est vide.</p>
        <Link
          href={routes.shop}
          className="mt-8 inline-block select-none text-sm uppercase tracking-wide underline underline-offset-4 transition-opacity hover:opacity-60"
        >
          Continuer vos achats
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <ul className="divide-y divide-black/10 border-t border-black/10">
        {cart.lines.map((line) => (
          <li
            key={line.id}
            className="grid grid-cols-[96px_1fr_auto] items-center gap-6 py-8 md:grid-cols-[120px_1fr_auto]"
          >
            <Link
              href={routes.product(line.productHandle)}
              className="relative aspect-[4/5] overflow-hidden bg-[#f3efe8]"
            >
              <Image
                src={line.imageUrl}
                alt={line.imageAlt}
                fill
                className="object-cover"
                sizes="120px"
              />
            </Link>

            <div className="min-w-0 text-left">
              <Link
                href={routes.product(line.productHandle)}
                className="font-serif font-medium transition-opacity hover:opacity-60"
              >
                {line.title}
              </Link>
              {line.variantTitle ? (
                <p className="mt-1 text-sm text-black/50">{line.variantTitle}</p>
              ) : null}
              <p className="mt-2 text-sm text-black/70">
                Qté {line.quantity} — {line.price}
              </p>
            </div>

            <p className="text-sm text-black/70">{line.price}</p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-end gap-6 border-t border-black/10 pt-8">
        <p className="text-lg">
          Total{" "}
          <span className="font-medium">{cart.totalPrice}</span>
        </p>

        <a
          href={cart.checkoutUrl}
          className="select-none bg-black px-10 py-4 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80"
        >
          Passer commande
        </a>
      </div>
    </div>
  );
}
