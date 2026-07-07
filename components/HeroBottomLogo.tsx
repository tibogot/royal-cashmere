import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function HeroBottomLogo() {
  return (
    <Link
      href={routes.home}
      aria-label="Royal Cashmere"
      className="absolute inset-x-0 bottom-0 z-10 translate-y-[6%] px-4 md:px-8"
    >
      <Image
        src="/brand/logo-nav.svg"
        alt=""
        width={224}
        height={18}
        className="block h-auto w-full brightness-0 invert"
      />
    </Link>
  );
}
