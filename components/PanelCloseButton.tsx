"use client";

import { useDictionary } from "@/components/LocaleProvider";

type PanelCloseButtonProps = {
  onClose: () => void;
  label?: string;
};

export default function PanelCloseButton({
  onClose,
  label,
}: PanelCloseButtonProps) {
  const { common } = useDictionary();

  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label ?? common.close}
      className="flex size-8 cursor-pointer items-center justify-center text-black transition-opacity hover:opacity-60"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M1 1L13 13M13 1L1 13"
          stroke="currentColor"
          strokeWidth="1.25"
        />
      </svg>
    </button>
  );
}
