import type { CatalogNavSection } from "@/lib/catalog";

const EMPTY_COLLECTIONS: CatalogNavSection[] = [];

let collections: CatalogNavSection[] = EMPTY_COLLECTIONS;
let hasFetched = false;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

async function fetchCollections(): Promise<void> {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const response = await fetch("/api/collections");
      if (!response.ok) return;

      const data = (await response.json()) as {
        sections?: CatalogNavSection[];
      };
      collections = data.sections ?? EMPTY_COLLECTIONS;
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
  if (!hasFetched && !inFlight) {
    void fetchCollections();
  }
}

export function subscribeCollections(callback: () => void): () => void {
  listeners.add(callback);
  ensureFetched();
  return () => listeners.delete(callback);
}

export function getCollectionsSnapshot(): CatalogNavSection[] {
  return collections;
}

export function getCollectionsHasFetched(): boolean {
  return hasFetched;
}

export function getServerCollectionsSnapshot(): CatalogNavSection[] {
  return EMPTY_COLLECTIONS;
}

export function refreshCollections(): Promise<void> {
  return fetchCollections();
}
