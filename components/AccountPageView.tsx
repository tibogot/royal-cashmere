import type { CustomerOrder, CustomerProfile } from "@/lib/shopify/customer-account/customer";
import { getCustomerDisplayName } from "@/lib/shopify/customer-account/display-name";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import Link from "next/link";

type AccountPageViewProps = {
  customer: CustomerProfile | null;
  orders: CustomerOrder[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatMoney(amount: string, currencyCode: string) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

function formatStatus(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (char) => char.toUpperCase());
}

export default function AccountPageView({
  customer,
  orders,
}: AccountPageViewProps) {
  const displayName = getCustomerDisplayName(customer);
  const email = customer?.emailAddress?.emailAddress;

  return (
    <div className="space-y-10 text-left">
      <div className="space-y-4">
        <p className="font-serif text-2xl uppercase leading-snug tracking-wide md:text-3xl">
          Mon compte
        </p>
        <p className="max-w-md font-serif text-sm leading-relaxed text-black/70 md:text-base">
          Bienvenue{displayName ? `, ${displayName}` : ""}. Retrouvez ici vos
          informations et l&apos;historique de vos commandes.
        </p>
      </div>

      <div className="border-t border-black/10 pt-8">
        <p className="text-xs uppercase tracking-wide text-black/50">Profil</p>
        <p className="mt-3 font-serif text-lg uppercase md:text-xl">
          {displayName || "Client Royal Cashmere"}
        </p>
        {email ? (
          <p className="mt-2 font-serif text-sm text-black/70 md:text-base">
            {email}
          </p>
        ) : null}
      </div>

      <div className="border-t border-black/10 pt-8">
        <p className="text-xs uppercase tracking-wide text-black/50">
          Mes commandes
        </p>

        {orders.length === 0 ? (
          <div className="mt-6 space-y-4">
            <p className="font-serif text-sm leading-relaxed text-black/70 md:text-base">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Link
              href={routes.shop}
              className={`${ctaLinkClassName} inline-block font-sans`}
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-wide text-black/50">
                    Commande
                  </p>
                  <p className="mt-1 font-serif text-sm uppercase md:text-base">
                    {order.name}
                  </p>
                  <p className="mt-1 font-serif text-sm text-black/60">
                    {formatDate(order.processedAt)}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="font-serif text-sm md:text-base">
                    {formatMoney(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode,
                    )}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-black/50">
                    {formatStatus(order.fulfillmentStatus)} ·{" "}
                    {formatStatus(order.financialStatus)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-black/10 pt-8">
        <Link href={routes.shop} className={`${ctaLinkClassName} font-sans`}>
          Continuer vos achats
        </Link>

        {/* Plain <a>: /api/auth/logout 302-redirects to Shopify's external
            end-session endpoint, which a Next <Link> RSC fetch can't follow. */}
        <a
          href={routes.authLogout}
          className={`${ctaLinkClassName} font-sans text-black/60`}
        >
          Se déconnecter
        </a>
      </div>
    </div>
  );
}
