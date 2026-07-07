export const COOKIE_CONSENT_STORAGE_KEY = "royal-cashmere-cookie-consent";
export const COOKIE_CONSENT_VERSION = 1;

export type CookieConsent = {
  version: number;
  essential: true;
  acknowledgedAt: string;
};

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CookieConsent;
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function setCookieConsent(): CookieConsent {
  const consent: CookieConsent = {
    version: COOKIE_CONSENT_VERSION,
    essential: true,
    acknowledgedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(
    COOKIE_CONSENT_STORAGE_KEY,
    JSON.stringify(consent),
  );

  return consent;
}

export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null;
}
