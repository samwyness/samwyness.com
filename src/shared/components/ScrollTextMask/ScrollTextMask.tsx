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
import styles from './ScrollTextMask.module.css';

const EASE = cubicBezier(0.49, 0, 0.6, 0.99);

type ScrollTextMaskProps = PropsWithChildren & {
  inputRange?: [number, number];
  outputRange?: [string, string];
};

export function ScrollTextMask({
  inputRange = [0, 0.25],
  outputRange = ['0% 100%', '100% 100%'],
  children,
}: ScrollTextMaskProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
  });

  const backgroundSize = useTransform(
    scrollYProgress,
    inputRange,
    outputRange,
    {
      ease: EASE,
    },
  );

  return (
    <LazyMotion features={domAnimation}>
      <motion.span
        ref={ref}
        className={styles.scrollTextMask}
        style={{ backgroundSize }}>
        {children}
      </motion.span>
    </LazyMotion>
  );
}
