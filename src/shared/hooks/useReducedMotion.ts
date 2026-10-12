import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

/** Hydration-safe stand-in for framer's useReducedMotion, which reads the
    media query on first client render and so mismatches the server HTML.
    False on the server and while hydrating, then the real preference, so
    motion elements that only branch `initial` should key on it to remount
    straight into their end state */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
