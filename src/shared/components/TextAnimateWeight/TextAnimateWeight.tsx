'use client';

import {
  LazyMotion,
  cubicBezier,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { PropsWithChildren, useRef } from 'react';
import styles from './TextAnimateWeight.module.css';

const EASE = cubicBezier(0.32, 0, 0.67, 0);

type TextAnimateWeightProps = PropsWithChildren & {
  inputRange?: [number, number];
  outputRange?: [string, string];
};

export function TextAnimateWeight({
  inputRange = [0, 0.25],
  outputRange = [`'wght' 600`, `'wght' 300`],
  children,
}: TextAnimateWeightProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
  });

  const fontVariationSettings = useTransform(
    scrollYProgress,
    inputRange,
    outputRange,
    // {
    //   ease: EASE,
    // },
  );

  return (
    <LazyMotion features={domAnimation}>
      <motion.span
        ref={ref}
        className={styles.TextAnimateWeight}
        style={{ fontVariationSettings }}>
        {children}
      </motion.span>
    </LazyMotion>
  );
}
