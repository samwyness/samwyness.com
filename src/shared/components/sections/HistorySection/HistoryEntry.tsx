'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import styles from './HistorySection.module.css';

export type History = {
  role: string;
  company: string;
  period: string;
};

type HistoryEntryProps = History & {
  animated?: boolean;
};

export function HistoryEntry({
  role,
  company,
  period,
  animated = true,
}: HistoryEntryProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // 0 entering bottom of viewport, 1 (fully sharp) once top reaches 60%
    offset: ['start 0.8', 'start 0.5'],
  });

  // Pulls into focus like a camera, then stays sharp. Holds until 40%,
  // blur lags opacity slightly so it sharpens last
  const opacity = useTransform(scrollYProgress, [0.4, 0.7], [0.25, 1]);
  const scale = useTransform(scrollYProgress, [0.4, 0.7], [0.98, 1]);
  const blur = useTransform(scrollYProgress, [0.6, 1], [10, 0]);
  const filter = useTransform(blur, value => `blur(${value}px)`);

  return (
    <LazyMotion features={domAnimation}>
      <motion.li
        className={styles.entry}
        style={
          animated && !reduceMotion ? { filter, scale, opacity } : undefined
        }>
        {/* Scroll target, offset in CSS to stagger columns */}
        <span ref={ref} className={styles.focusTarget} aria-hidden />
        <p className={styles.period}>{period}</p>
        <h3 className={styles.role}>{role}</h3>
        <p className={styles.company}>{company}</p>
      </motion.li>
    </LazyMotion>
  );
}
