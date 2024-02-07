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
import { CSSProperties, useRef } from 'react';

const EASE = cubicBezier(0.49, 0, 0.6, 0.99);

export type AnimateScrollProgressProps = HTMLMotionProps<'span'> & {
  useTarget?: boolean;
  inputRange?: [number, number];
  outputRange?: [string, string];
  offset?: [string, string];
};

export function AnimateScrollProgress({
  useTarget = true,
  inputRange = [0.1, 0.45],
  outputRange = ['0%', '100%'],
  offset = ['end end', 'start start'],
  children,
  ...props
}: AnimateScrollProgressProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: useTarget ? ref : undefined,
    offset:
      offset || useTarget
        ? ['end end', 'start start']
        : ['start start', 'end end'],
  });

  const progress = useTransform(scrollYProgress, inputRange, outputRange, {
    ease: EASE,
  });

  // useMotionValueEvent(progress, 'change', last => console.log(last));

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
