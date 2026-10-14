import { RefObject, useEffect, useState } from 'react';

type InViewOptions = {
  /** Stays true once seen */
  once?: boolean;
  /** Grows or shrinks the viewport, as IntersectionObserver's rootMargin */
  margin?: string;
  /** Share of the element that must show, 0–1 */
  amount?: number;
};

/** Whether the element is on screen. False on the server and until observed */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, margin, amount }: InViewOptions = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Also fires on the first pixel and when first observed, short of amount
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= (amount ?? 0);
        setInView(visible);
        if (once && visible) observer.disconnect();
      },
      { rootMargin: margin, threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin, amount]);

  return inView;
}
