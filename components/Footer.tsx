import CartNavLink from "@/components/CartNavLink";
import FooterSearchLink from "@/components/FooterSearchLink";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/lib/site";

const footerLinkClassName =
  "w-fit text-left text-xs uppercase tracking-wide transition-opacity hover:opacity-60";

const footerTextClassName = "text-xs uppercase tracking-wide";

const footerLegalLinkClassName =
  "text-[10px] text-black transition-opacity hover:opacity-60 md:text-xs";

const primaryLinks = [
  { label: "Boutique", href: routes.shop },
  { label: "Collection", href: routes.collection },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
] as const;

const legalLinks = [
  { label: "Mentions légales", href: routes.legal },
  { label: "Politique de confidentialité", href: routes.privacy },
  { label: "CGV", href: routes.terms },
  { label: "Cookies", href: routes.cookies },
] as const;

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
  { label: "Instagram", href: "#", src: "/brand/instagram.svg", width: 20, height: 20 },
];

export default function Footer() {
  return (
    <footer className="w-full select-none bg-primary p-4 text-black md:p-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
        <div className="grid grid-cols-2 gap-x-6 md:flex md:gap-x-12">
          <nav className="flex flex-col gap-1">
            {primaryLinks.map(({ label, href }) => (
              <Link key={label} href={href} className={footerLinkClassName}>
                {label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-1">
            <Link href={routes.account} className={footerLinkClassName}>
              Mon compte
            </Link>
            <FooterSearchLink className={footerLinkClassName} />
            <CartNavLink className={footerLinkClassName} />
          </nav>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:flex md:gap-x-16 lg:gap-x-24">
          <div className="flex flex-col gap-1">
            <p className={footerTextClassName}>Horaires d&apos;ouverture</p>
            <p className={footerTextClassName}>
              Du lundi au vendredi de 10 h à 18 h
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className={footerTextClassName}>
              Chaussée de Waterloo 1251B
            </p>
            <p className={footerTextClassName}>Uccle, Belgique</p>
            <a href="tel:+3228505944" className={`${footerLinkClassName} w-fit`}>
              +32 2 850 59 44
            </a>

            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map(({ label, href, src, width, height, external }) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link
        href={routes.home}
        aria-label="Royal Cashmere home"
        className="mt-16 block w-full md:mt-24"
      >
        <Image
          src="/brand/logo-nav.svg"
          alt="Royal Cashmere"
          width={224}
          height={18}
          className="h-auto w-full brightness-0"
        />
      </Link>

      <div className="mt-6 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[10px] text-black md:mt-8 md:text-xs">
        <p>© 2026 Royal Cashmere</p>
        <nav
          aria-label="Informations légales"
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          {legalLinks.map(({ label, href }) => (
            <Link key={href} href={href} className={footerLegalLinkClassName}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
