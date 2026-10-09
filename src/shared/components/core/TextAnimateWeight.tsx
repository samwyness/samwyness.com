'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import React from 'react';
import { AnimateScrollProgressProps } from './AnimateScrollProgress';

export function TextAnimateWeight({
  useTarget = true,
  offset,
  inputRange = [0, 0.25],
  outputRange = [`'wght' 600`, `'wght' 300`],
  children,
}: AnimateScrollProgressProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: useTarget ? ref : undefined,
    offset:
      offset ??
      (useTarget ? ['end end', 'start start'] : ['start start', 'end end']),
  });

  const fontVariationSettings = useTransform(
    scrollYProgress,
    inputRange,
    outputRange,
  );

  return (
    <LazyMotion features={domAnimation}>
      <motion.span ref={ref} style={{ fontVariationSettings }}>
        {children}
      </motion.span>
    </LazyMotion>
  );
}
