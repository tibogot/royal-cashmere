import type { Metadata } from "next";
import { toLocale, withLocale } from "@/lib/i18n/config";
import AccountPageView from "@/components/AccountPageView";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/auth";
import { getCustomerAccountSummary } from "@/lib/shopify/customer-account/customer";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import Image from "next/image";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/account">): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { shopMeta } = await getDictionary(locale);
  return createPageMetadata({
    locale,
    title: shopMeta.accountTitle,
    description: shopMeta.accountDescription,
    path: "/account",
  });
}

export default async function AccountPage({ params }: PageProps<"/[lang]/account">) {
  const locale = toLocale((await params).lang);
  const signIn = withLocale(routes.signIn, locale);

  if (!isCustomerAccountConfigured()) {
    redirect(signIn);
  }

  const session = await getValidCustomerSession();
  if (!session) {
    redirect(signIn);
  }

  const [account, dict] = await Promise.all([
    getCustomerAccountSummary(),
    getDictionary(locale),
  ]);

  if (!account.ok) {
    redirect(signIn);
  }

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="sr-only">{dict.shopHeadings.account}</h1>

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <AccountPageView
            customer={account.customer}
            orders={account.orders}
            locale={locale}
            copy={dict.account}
          />

          <div className="relative min-h-80 w-full md:min-h-[calc(100svh-7rem)]">
            <Image
              src="/images/shared/paysage-mongolie.jpg"
              alt={dict.account.imageAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
