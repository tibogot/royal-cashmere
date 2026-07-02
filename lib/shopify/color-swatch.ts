const COLOR_VALUES: Record<string, string> = {
  noir: "#1a1a1a",
  black: "#1a1a1a",
  blanc: "#f5f5f0",
  white: "#f5f5f0",
  ivoire: "#f4f0e8",
  ivory: "#f4f0e8",
  ecru: "#e8e4d9",
  écru: "#e8e4d9",
  beige: "#d4c4a8",
  camel: "#c19a6b",
  caramel: "#c68e59",
  gris: "#9ca3af",
  grey: "#9ca3af",
  gray: "#9ca3af",
  "gris clair": "#d1d5db",
  "gris fonce": "#4b5563",
  anthracite: "#3f3f46",
  bleu: "#3b5998",
  blue: "#3b5998",
  marine: "#1e3a5f",
  navy: "#1e3a5f",
  bordeaux: "#6b2737",
  burgundy: "#6b2737",
  rouge: "#b91c1c",
  red: "#b91c1c",
  vert: "#4d7c4a",
  green: "#4d7c4a",
  olive: "#6b705c",
  kaki: "#8a8b5c",
  rose: "#e8b4b8",
  pink: "#e8b4b8",
  mauve: "#9b8b9e",
  purple: "#7c5c8a",
  violet: "#7c5c8a",
  brown: "#8b6914",
  marron: "#8b6914",
  chocolat: "#5d4037",
  chocolate: "#5d4037",
  taupe: "#8b7d6b",
  cream: "#fffdd0",
  crème: "#fffdd0",
  creme: "#fffdd0",
  orange: "#ea580c",
  jaune: "#eab308",
  yellow: "#eab308",
  gold: "#c9a227",
  or: "#c9a227",
  silver: "#c0c0c0",
  argent: "#c0c0c0",
};

function normalizeColorName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function resolveSwatchColor(value: string) {
  const normalized = normalizeColorName(value);
  return COLOR_VALUES[normalized] ?? "#d4d4d4";
}

export function normalizeSwatchColor(color: string, fallbackName?: string) {
  const parsed = parseHexColor(color);
  if (parsed) return parsed;
  if (fallbackName) return resolveSwatchColor(fallbackName);
  return "#d4d4d4";
}

function parseHexColor(color: string) {
  const trimmed = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [r, g, b] = trimmed.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed}`;
  return null;
}

export function isLightSwatchColor(color: string) {
  const hex = parseHexColor(color) ?? resolveSwatchColor(color).replace("#", "");
  const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
  if (normalized.length !== 6) return false;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.72;
}
