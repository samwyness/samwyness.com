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

export type AnimateScrollProgressProps = HTMLMotionProps<'span'> & {
  useTarget?: boolean;
  /** Track another element instead of this span */
  target?: RefObject<HTMLElement | null>;
  inputRange?: number[];
  outputRange?: (string | number)[];
  offset?: NonNullable<Parameters<typeof useScroll>[0]>['offset'];
};

export function AnimateScrollProgress({
  useTarget = true,
  target,
  inputRange = [0, 0.35],
  outputRange = ['0%', '100%'],
  offset,
  children,
  ...props
}: AnimateScrollProgressProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: target ?? (useTarget ? ref : undefined),
    offset:
      offset ??
      (useTarget ? ['end end', 'start start'] : ['start start', 'end end']),
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
