import Image from "next/image";
import Link from "next/link";
import { routes } from "@/lib/routes";

type HeroBottomLogoProps = {
  priority?: boolean;
  raised?: boolean;
};

export default function HeroBottomLogo({
  priority = false,
  raised = false,
}: HeroBottomLogoProps) {
  return (
    <Link
      href={routes.home}
      aria-label="Royal Cashmere"
      className={`absolute inset-x-0 z-10 px-4 md:px-8 ${
        raised
          ? "bottom-[6%] translate-y-0 md:bottom-[8%]"
          : "bottom-0 translate-y-[6%]"
      }`}
    >
      <Image
        src="/brand/logo-nav.svg"
        alt=""
        width={224}
        height={18}
        loading={priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className="block h-auto w-full brightness-0 invert"
      />
    </Link>
  );
}
