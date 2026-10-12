'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useTransform,
} from 'framer-motion';
import React from 'react';
import {
  ScrollProgressOptions,
  useScrollProgress,
} from './AnimateScrollProgress';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type TextAnimateWeightProps = ScrollProgressOptions & {
  inputRange?: number[];
  /** font-variation-settings values */
  outputRange?: string[];
  children: React.ReactNode;
};

export function TextAnimateWeight({
  inputRange = [0, 0.25],
  outputRange = [`'wght' 600`, `'wght' 300`],
  children,
  ...scroll
}: TextAnimateWeightProps) {
  const reduceMotion = useReducedMotion();
  const { ref, scrollYProgress } = useScrollProgress<HTMLSpanElement>(scroll);

  const fontVariationSettings = useTransform(
    scrollYProgress,
    inputRange,
    outputRange,
  );

  return (
    <LazyMotion features={domAnimation}>
      {/* Reduced motion keeps the CSS weight. Inherit rather than undefined,
          which would leave the hydrated start weight behind */}
      <motion.span
        ref={ref}
        data-motion-start="weight"
        style={{
          fontVariationSettings: reduceMotion
            ? 'inherit'
            : fontVariationSettings,
        }}>
        {children}
      </motion.span>
    </LazyMotion>
  );
}
