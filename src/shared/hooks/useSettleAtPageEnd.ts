import { MotionValue, useScroll, useTransform } from 'framer-motion';

// Last stretch of scroll, in viewport heights, eased up to 1
const RAMP_VH = 0.25;

/** Scroll progress that's sure to reach 1 by the bottom of the page, for
    reveals near the end that tall viewports can't scroll far enough to
    finish on their own */
export function useSettleAtPageEnd(progress: MotionValue<number>) {
  const { scrollY } = useScroll();
  const pageEnd = useTransform(scrollY, y => {
    // Initial value is computed on the server too
    if (typeof window === 'undefined') return 0;
    const remaining =
      document.documentElement.scrollHeight - window.innerHeight - y;
    const ramp = window.innerHeight * RAMP_VH;
    return Math.min(1, Math.max(0, 1 - remaining / ramp));
  });

  return useTransform(() => Math.max(progress.get(), pageEnd.get()));
}
