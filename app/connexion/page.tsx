import SignInView from "@/components/SignInView";
import FadeInImage from "@/components/FadeInImage";
import { getValidCustomerSession } from "@/lib/shopify/customer-account/auth";
import { isCustomerAccountConfigured } from "@/lib/shopify/customer-account/config";
import { createPageMetadata } from "@/lib/seo";
import { routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export const metadata = createPageMetadata({
  title: "Connexion",
  description:
    "Connectez-vous à votre compte Royal Cashmere pour suivre vos commandes.",
  path: "/connexion",
});

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  if (isCustomerAccountConfigured() && (await getValidCustomerSession())) {
    redirect(routes.account);
  }

  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-24 pb-20 text-black md:px-8 md:pt-28 md:pb-32">
        <h1 className="sr-only">Se connecter — Royal Cashmere</h1>

        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <SignInView
            configured={isCustomerAccountConfigured()}
            hasError={params.error === "auth_failed"}
          />

          <div className="relative min-h-80 w-full md:min-h-[calc(100svh-7rem)]">
            <FadeInImage
              src="/images/chu-william-DQkDC6-3vnQ-unsplash.jpg"
              alt="Cachemire Royal Cashmere"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
