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
        setInView(entry.isIntersecting);
        if (once && entry.isIntersecting) observer.disconnect();
      },
      { rootMargin: margin, threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin, amount]);

  return inView;
}
