type HeartIconProps = {
  filled?: boolean;
  className?: string;
};

export default function HeartIcon({
  filled = false,
  className = "size-3.5",
}: HeartIconProps) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className={className}
      >
        <path d="M8 13.5S1.5 9.25 1.5 5.5C1.5 3.57 3.07 2 5 2c1.11 0 2.08.55 2.67 1.39C8.26 2.55 9.23 2 10.34 2 12.27 2 13.84 3.57 13.84 5.5c0 3.75-5.84 8-5.84 8Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 13.5S1.5 9.25 1.5 5.5C1.5 3.57 3.07 2 5 2c1.11 0 2.08.55 2.67 1.39C8.26 2.55 9.23 2 10.34 2 12.27 2 13.84 3.57 13.84 5.5c0 3.75-5.84 8-5.84 8Z"
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}
