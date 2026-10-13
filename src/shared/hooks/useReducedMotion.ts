import { useMediaQuery } from './useMediaQuery';

/** Reduced motion preference, for motion CSS can't gate. False on the server
    and while hydrating, see useMediaQuery */
export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
