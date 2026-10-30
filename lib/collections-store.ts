import type { ShopNav } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { documentLocale } from "@/lib/i18n/document-locale";

const EMPTY_NAV: ShopNav = { sections: [], collections: [] };

let nav: ShopNav = EMPTY_NAV;
let hasFetched = false;
let inFlight: Promise<void> | null = null;
// The language `nav` was fetched in: switching language refetches it.
let navLocale: Locale | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

async function fetchCollections(): Promise<void> {
  if (inFlight) return inFlight;

  const locale = documentLocale();

  inFlight = (async () => {
    try {
      const response = await fetch(`/api/collections?locale=${locale}`);
      if (!response.ok) return;

      const data = (await response.json()) as Partial<ShopNav>;
      nav = {
        sections: data.sections ?? [],
        collections: data.collections ?? [],
      };
      navLocale = locale;
    } catch {
      // Keep the last known collections on network errors.
    } finally {
      hasFetched = true;
      inFlight = null;
      emit();
    }
  })();

  return inFlight;
}

function ensureFetched() {
  if ((!hasFetched || navLocale !== documentLocale()) && !inFlight) {
    void fetchCollections();
  }
}

export function subscribeCollections(callback: () => void): () => void {
  listeners.add(callback);
  ensureFetched();
  return () => listeners.delete(callback);
}

export function getCollectionsSnapshot(): ShopNav {
  return nav;
}

export function getCollectionsHasFetched(): boolean {
  return hasFetched;
}

export function getServerCollectionsSnapshot(): ShopNav {
  return EMPTY_NAV;
}

export function refreshCollections(): Promise<void> {
  return fetchCollections();
}
