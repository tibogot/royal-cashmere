export const WISHLIST_STORAGE_KEY = "royal-cashmere-wishlist";
export const WISHLIST_UPDATED_EVENT = "wishlist-updated";

export function getWishlistHandles(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((handle): handle is string => typeof handle === "string");
  } catch {
    return [];
  }
}

export function isInWishlist(handle: string): boolean {
  return getWishlistHandles().includes(handle);
}

function saveWishlistHandles(handles: string[]) {
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(handles));
  window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));
}

export function addToWishlist(handle: string) {
  const handles = getWishlistHandles();
  if (handles.includes(handle)) return;

  saveWishlistHandles([handle, ...handles]);
}

export function removeFromWishlist(handle: string) {
  saveWishlistHandles(getWishlistHandles().filter((item) => item !== handle));
}

export function toggleWishlist(handle: string): boolean {
  if (isInWishlist(handle)) {
    removeFromWishlist(handle);
    return false;
  }

  addToWishlist(handle);
  return true;
}

export function getWishlistCount(): number {
  return getWishlistHandles().length;
}
