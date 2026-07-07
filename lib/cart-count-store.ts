// A tiny external store for the cart's total quantity, shared by any component
// that shows the cart badge. It fetches once on first subscription and
// refreshes whenever the cart changes, so components can read it with
// `useSyncExternalStore` instead of a setState-in-effect fetch.

let count = 0;
let hasFetched = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

async function fetchCount() {
  try {
    const response = await fetch("/api/cart", { cache: "no-store" });
    if (!response.ok) return;

    const data = (await response.json()) as { totalQuantity?: number };
    const next = data.totalQuantity ?? 0;
    if (next !== count) {
      count = next;
      emit();
    }
  } catch {
    // Keep the last known count on network errors.
  }
}

export function subscribeCartCount(callback: () => void): () => void {
  listeners.add(callback);

  if (!hasFetched) {
    hasFetched = true;
    fetchCount();
  }

  const handleCartChanged = () => fetchCount();
  window.addEventListener("cart-updated", handleCartChanged);
  window.addEventListener("cart-item-added", handleCartChanged);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("cart-updated", handleCartChanged);
    window.removeEventListener("cart-item-added", handleCartChanged);
  };
}

export function getCartCount(): number {
  return count;
}

export function getServerCartCount(): number {
  return 0;
}
