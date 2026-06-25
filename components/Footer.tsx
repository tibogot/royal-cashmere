import CartNavLink from "@/components/CartNavLink";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";

const footerLinkClassName =
  "text-sm uppercase leading-snug transition-opacity hover:opacity-60";

const shopLinks = [
  { label: "Meilleures ventes", href: routes.shop },
  { label: "À propos", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "Boutique", href: routes.shop },
] as const;

const accountLinks = [
  { label: "Recherche", href: routes.search },
  { label: "Connexion", href: routes.signIn },
  { label: "Mon compte", href: routes.account },
] as const;

const socialLinks = [
  { label: "Facebook", href: "#", src: "/brand/facebook.svg", width: 20, height: 20 },
  { label: "X", href: "#", src: "/brand/twitter.svg", width: 18, height: 17 },
  { label: "Instagram", href: "#", src: "/brand/instagram.svg", width: 20, height: 20 },
] as const;

export default function Footer() {
  return (
    <footer className="w-full select-none bg-white p-4 text-black md:p-8">
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-8">
        <nav className="flex flex-col gap-1">
          {shopLinks.map(({ label, href }) => (
            <Link key={label} href={href} className={footerLinkClassName}>
              {label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-col gap-1">
          {accountLinks.map(({ label, href }) => (
            <Link key={label} href={href} className={footerLinkClassName}>
              {label}
            </Link>
          ))}
          <CartNavLink className={footerLinkClassName} />
        </nav>

        <div className="flex flex-col gap-1">
          <p className="text-sm uppercase leading-snug">Horaires d&apos;ouverture</p>
          <p className="text-sm uppercase leading-snug">
            Du lundi au vendredi de 10 h à 18 h
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm uppercase leading-snug">
            Chaussée de Waterloo 1251B
          </p>
          <p className="text-sm uppercase leading-snug">Uccle, Belgique</p>
          <a href="tel:+3228505944" className={`${footerLinkClassName} w-fit`}>
            +32 2 850 59 44
          </a>

          <div className="mt-3 flex items-center gap-3">
            {socialLinks.map(({ label, href, src, width, height }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
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
    </footer>
  );
}
