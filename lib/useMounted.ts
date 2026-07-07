"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Returns `false` during SSR and the first hydration render, then `true` once
 * mounted on the client — without a `setState`-in-effect. Use it to gate
 * client-only UI such as `createPortal` targets.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
