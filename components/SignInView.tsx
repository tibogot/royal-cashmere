import type { Dictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";
import { ctaLinkClassName } from "@/lib/ui";
import Link from "@/components/LocaleLink";

type SignInViewProps = {
  configured: boolean;
  hasError?: boolean;
  copy: Dictionary["signIn"];
};

const primaryCtaClassName =
  "inline-flex w-full max-w-sm select-none items-center justify-center bg-black px-8 py-4 text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80";

export default function SignInView({
  configured,
  hasError,
  copy,
}: SignInViewProps) {
  if (!configured) {
    return (
      <div className="space-y-8 text-left">
        <p className="font-serif text-2xl uppercase leading-snug tracking-wide md:text-3xl">
          {copy.title}
        </p>
        <p className="max-w-md font-sans text-sm leading-relaxed text-black/70 md:text-base">
          {copy.notConfiguredBefore}{" "}
          <code className="text-black">.env</code> {copy.notConfiguredAfter}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 text-left">
      <div className="space-y-4">
        <p className="font-serif text-2xl uppercase leading-snug tracking-wide md:text-3xl">
          {copy.title}
        </p>
        <p className="max-w-md font-serif text-sm leading-relaxed text-black/70 md:text-base">
          {copy.intro}
        </p>
      </div>

      <div className="border-t border-black/10 pt-8">
        <p className="text-xs uppercase tracking-wide text-black/50">
          {copy.spaceTitle}
        </p>
        <ul className="mt-4 space-y-3 font-serif text-sm text-black/80 md:text-base">
          <li>{copy.benefitOrders}</li>
          <li>{copy.benefitHistory}</li>
          <li>{copy.benefitDetails}</li>
        </ul>
      </div>

      {hasError ? (
        <p className="font-sans text-sm text-red-700" role="alert">
          {copy.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {/* Plain <a>: hits an API route that 302-redirects to Shopify's
            external OAuth endpoint. A Next <Link> would fetch it as an RSC
            request and try to follow the cross-origin redirect → CORS error. */}
        <a
          href={`${routes.authLogin}?return_to=${encodeURIComponent(routes.account)}`}
          className={primaryCtaClassName}
        >
          {copy.submit}
        </a>

        <p className="max-w-sm text-xs leading-relaxed text-black/50">
          {copy.redirectNote}
        </p>

        <Link href={routes.shop} className={`${ctaLinkClassName} font-sans`}>
          {copy.continueShopping}
        </Link>
      </div>
    </div>
  );
}
