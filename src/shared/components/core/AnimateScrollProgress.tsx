'use client';

import {
  HTMLMotionProps,
  LazyMotion,
  cubicBezier,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import React, { CSSProperties, RefObject } from 'react';

const EASE = cubicBezier(0.49, 0, 0.6, 0.99);

export type ScrollOffset = NonNullable<
  Parameters<typeof useScroll>[0]
>['offset'];

export type ScrollProgressOptions = {
  useTarget?: boolean;
  /** Track another element instead of this one */
  target?: RefObject<HTMLElement | null>;
  offset?: ScrollOffset;
};

/** Scroll progress through the returned ref's element, `target`, or the page */
export function useScrollProgress<T extends HTMLElement>({
  useTarget = true,
  target,
  offset,
}: ScrollProgressOptions) {
  const ref = React.useRef<T>(null);
  const { scrollYProgress } = useScroll({
    target: target ?? (useTarget ? ref : undefined),
    offset:
      offset ??
      (useTarget ? ['end end', 'start start'] : ['start start', 'end end']),
  });
  return { ref, scrollYProgress };
}

export type AnimateScrollProgressProps = HTMLMotionProps<'span'> &
  ScrollProgressOptions & {
    inputRange?: number[];
    outputRange?: (string | number)[];
  };

export function AnimateScrollProgress({
  useTarget,
  target,
  inputRange = [0, 0.35],
  outputRange = ['0%', '100%'],
  offset,
  children,
  ...props
}: AnimateScrollProgressProps) {
  const { ref, scrollYProgress } = useScrollProgress<HTMLSpanElement>({
    useTarget,
    target,
    offset,
  });

  const progress = useTransform(scrollYProgress, inputRange, outputRange, {
    ease: EASE,
  });

  return (
    <LazyMotion features={domAnimation}>
      <motion.span
        {...props}
        ref={ref}
        style={{ '--scroll-progress': progress } as CSSProperties}>
        {children}
      </motion.span>
    </LazyMotion>
  );
}
