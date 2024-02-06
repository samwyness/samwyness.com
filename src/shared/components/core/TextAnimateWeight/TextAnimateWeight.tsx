'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { AnimateScrollProgressProps } from '../AnimateScrollProgress/AnimateScrollProgress';

export function TextAnimateWeight({
  inputRange = [0, 0.25],
  outputRange = [`'wght' 600`, `'wght' 300`],
  children,
}: AnimateScrollProgressProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
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
