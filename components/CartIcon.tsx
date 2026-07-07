type CartIconProps = {
  className?: string;
};

export default function CartIcon({ className = "h-5 w-5" }: CartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 8V6.5C8 4.567 9.567 3 11.5 3C13.433 3 15 4.567 15 6.5V8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M5 8H19L17.5 20H6.5L5 8Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}
