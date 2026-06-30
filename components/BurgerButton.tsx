"use client";

type BurgerButtonProps = {
  open: boolean;
  onClick: () => void;
  className?: string;
  lineClassName?: string;
};

export default function BurgerButton({
  open,
  onClick,
  className = "",
  lineClassName = "",
}: BurgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      className={`relative flex h-8 w-8 items-center justify-center ${className}`}
      data-nav-link
    >
      <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
      <span
        className={`absolute block h-px w-5 transition-[transform,opacity,background-color] duration-300 ease-out ${
          open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
        } ${lineClassName}`}
      />
      <span
        className={`absolute block h-px w-5 transition-[transform,opacity,background-color] duration-300 ease-out ${
          open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
        } ${lineClassName}`}
      />
      <span
        className={`absolute block h-px w-5 transition-[transform,opacity,background-color] duration-300 ease-out ${
          open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
        } ${lineClassName}`}
      />
    </button>
  );
}
