import CartNavLink from "@/components/CartNavLink";
import FooterSearchLink from "@/components/FooterSearchLink";
import HomeLogoLink from "@/components/HomeLogoLink";
import Image from "next/image";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Link from "@/components/LocaleLink";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

const footerLinkClassName =
  "inline-flex w-fit items-center py-1 text-left text-xs uppercase tracking-wide transition-opacity hover:opacity-60";

const footerTextClassName = "text-xs uppercase tracking-wide";

const footerLegalLinkClassName =
  "inline-flex items-center py-1 text-[10px] text-black transition-opacity hover:opacity-60 md:text-xs";

type FooterCopy = Pick<Dictionary, "nav" | "footer">;

function getPrimaryLinks({ nav }: FooterCopy) {
  return [
    { label: nav.shop, href: routes.shop },
    { label: nav.journal, href: routes.journal },
    { label: nav.about, href: routes.about },
    { label: nav.contact, href: routes.contact },
  ];
}

function getLegalLinks({ footer }: FooterCopy) {
  return [
    { label: footer.legalNotice, href: routes.legal },
    { label: footer.privacyPolicy, href: routes.privacy },
    { label: footer.terms, href: routes.terms },
    { label: footer.cookies, href: routes.cookies },
  ];
}

type SocialLink = {
  label: string;
  href: string;
  src: string;
  width: number;
  height: number;
  external?: boolean;
};

const socialLinks: SocialLink[] = [
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    src: "/brand/facebook.svg",
    width: 20,
    height: 20,
    external: true,
  },
  { label: "X", href: "#", src: "/brand/twitter.svg", width: 18, height: 17 },
  {
    label: "Instagram",
    href: "#",
    src: "/brand/instagram.svg",
    width: 20,
    height: 20,
  },
];

// A Server Component rendered by the layout, which hands it its copy.
export default function Footer({ dictionary }: { dictionary: FooterCopy }) {
  const { nav, footer } = dictionary;

  return (
    <footer className="w-full select-none  p-4 text-black md:p-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="grid grid-cols-2 gap-x-6 md:flex md:gap-x-12">
          <nav className="flex flex-col gap-2">
            {getPrimaryLinks(dictionary).map(({ label, href }) => (
              <Link key={label} href={href} className={footerLinkClassName}>
                {label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-2">
            <Link href={routes.account} className={footerLinkClassName}>
              {nav.account}
            </Link>
            <FooterSearchLink className={footerLinkClassName} />
            <CartNavLink className={footerLinkClassName} />
          </nav>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:gap-x-16 lg:gap-x-24">
          <div className="flex flex-col gap-1">
            <p className={footerTextClassName}>{footer.openingHoursTitle}</p>
            <p className={footerTextClassName}>
              {footer.openingHours}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className={footerTextClassName}>{footer.addressStreet}</p>
            <p className={footerTextClassName}>{footer.addressCity}</p>
            <a
              href="tel:+3228505944"
              className={`${footerLinkClassName} w-fit`}
            >
              +32 2 850 59 44
            </a>

            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map(
                ({ label, href, src, width, height, external }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="transition-opacity hover:opacity-60"
                  >
                    <Image
                      src={src}
                      alt=""
                      width={width}
                      height={height}
                      className="h-4 w-auto"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <HomeLogoLink
        aria-label={nav.homeAriaLabel}
        className="mt-16 block w-full md:mt-24"
      >
        <Image
          src="/brand/logo-nav.svg"
          alt="Royal Cashmere"
          width={224}
          height={18}
          className="h-auto w-full brightness-0"
        />
      </HomeLogoLink>

      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[10px] text-black md:mt-8 md:text-xs">
        <div className="flex items-center gap-4">
          <p>© 2026 Royal Cashmere</p>
          <LanguageSwitcher linkClassName={footerLegalLinkClassName} />
        </div>
        <nav
          aria-label={footer.legalAriaLabel}
          className="flex flex-wrap items-center gap-x-4 gap-y-3"
        >
          {getLegalLinks(dictionary).map(({ label, href }) => (
            <Link key={href} href={href} className={footerLegalLinkClassName}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
