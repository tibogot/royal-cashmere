"use client";

import { useDictionary } from "@/components/LocaleProvider";

type BurgerButtonProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
};

export default function BurgerButton({
  open,
  onClick,
  className = "",
}: BurgerButtonProps) {
  const { nav } = useDictionary();
  const label = open ? nav.closeMenu : nav.openMenu;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={label}
      className={`relative flex h-8 w-8 items-center justify-center ${className}`}
      data-nav-link
    >
      <span className="sr-only">{label}</span>
      <span
        className={`absolute block h-px w-5 bg-current transition-[transform,opacity] duration-300 ease-out ${
          open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
        }`}
      />
      <span
        className={`absolute block h-px w-5 bg-current transition-[transform,opacity] duration-300 ease-out ${
          open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
        }`}
      />
      <span
        className={`absolute block h-px w-5 bg-current transition-[transform,opacity] duration-300 ease-out ${
          open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
        }`}
      />
    </button>
  );
}
