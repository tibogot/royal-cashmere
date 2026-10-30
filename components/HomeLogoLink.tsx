"use client";

import Link from "@/components/LocaleLink";
import { useBarePathname } from "@/components/LocaleProvider";
import { useLenis } from "@/components/SmoothScroll";
import { routes } from "@/lib/routes";
import type { ComponentProps } from "react";

type HomeLogoLinkProps = Omit<ComponentProps<typeof Link>, "href">;

/**
 * Link to the home page that scrolls back to the top when already there —
 * the pathname doesn't change, so ScrollToTopOnNavigate never fires.
 */
export default function HomeLogoLink({ onClick, ...props }: HomeLogoLinkProps) {
  const barePathname = useBarePathname();
  const lenis = useLenis();
  // ISR renders the home page as "/index"; see Navbar.
  const isHome = barePathname === routes.home || barePathname === "/index";

  return (
    <Link
      href={routes.home}
      onClick={(event) => {
        onClick?.(event);
        if (!isHome) return;
        event.preventDefault();
        if (lenis) {
          lenis.scrollTo(0);
        } else {
          window.scrollTo({ top: 0 });
        }
      }}
      {...props}
    />
  );
}
