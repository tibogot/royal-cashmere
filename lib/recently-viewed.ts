const STORAGE_KEY = "rc-recently-viewed";
const MAX_ITEMS = 4;

export function getRecentlyViewedHandles(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(handle: string) {
  if (typeof window === "undefined" || !handle) return;

  const next = [
    handle,
    ...getRecentlyViewedHandles().filter((item) => item !== handle),
  ].slice(0, MAX_ITEMS);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function getDisplayRecentlyViewedHandles(
  currentHandle: string,
  limit = MAX_ITEMS,
) {
  return getRecentlyViewedHandles()
    .filter((handle) => handle !== currentHandle)
    .slice(0, limit);
}
