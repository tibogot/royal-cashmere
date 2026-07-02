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
    <div className="mx-auto max-w-3xl">
      <div className="border-b border-black/10 pb-8">
        <p className="text-sm uppercase tracking-wide text-black/60">
          Mon compte
        </p>
        <h2 className="mt-3 font-serif text-3xl uppercase md:text-4xl">
          {displayName || "Bienvenue"}
        </h2>
        {email ? (
          <p className="mt-3 text-sm text-black/70 md:text-base">{email}</p>
        ) : null}

        <Link
          href={routes.authLogout}
          className="mt-8 inline-flex items-center justify-center border border-black px-6 py-2.5 text-sm uppercase tracking-wide transition-opacity hover:opacity-60"
        >
          Se déconnecter
        </Link>
      </div>

      <div className="pt-10">
        <h3 className="font-serif text-2xl uppercase md:text-3xl">
          Mes commandes
        </h3>

        {orders.length === 0 ? (
          <div className="mt-8 text-sm leading-relaxed text-black/70 md:text-base">
            <p>Vous n&apos;avez pas encore passé de commande.</p>
            <Link
              href={routes.shop}
              className={`${ctaLinkClassName} mt-4 inline-block`}
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-black/10 border-y border-black/10">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm uppercase tracking-wide">
                    {order.name}
                  </p>
                  <p className="mt-1 text-sm text-black/60">
                    {formatDate(order.processedAt)}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm">
                    {formatMoney(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode,
                    )}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-black/60">
                    {formatStatus(order.fulfillmentStatus)} ·{" "}
                    {formatStatus(order.financialStatus)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
