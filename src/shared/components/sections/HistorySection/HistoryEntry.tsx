'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ReactNode, useRef } from 'react';
import styles from './HistorySection.module.css';

export type History = {
  role: string;
  company: string;
  period: string;
};

type FocusItemProps = {
  /** li in the list, div outside it */
  as?: 'li' | 'div';
  className?: string;
  animated?: boolean;
  children: ReactNode;
};

/** Grid cell that pulls into focus as it scrolls into view */
export function FocusItem({
  as = 'li',
  className = styles.entry,
  animated = true,
  children,
}: FocusItemProps) {
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
  // Filter dropped once sharp, so settled cards don't keep a filter layer
  const filter = useTransform(blur, value =>
    value > 0 ? `blur(${value}px)` : 'none',
  );

  const Item = as === 'div' ? motion.div : motion.li;

  return (
    <LazyMotion features={domAnimation}>
      <Item
        className={className}
        style={
          animated && !reduceMotion ? { filter, scale, opacity } : undefined
        }>
        {/* Scroll target, offset in CSS to stagger columns */}
        <span ref={ref} className={styles.focusTarget} aria-hidden />
        {children}
      </Item>
    </LazyMotion>
  );
}

type HistoryEntryProps = History & {
  animated?: boolean;
};

export function HistoryEntry({
  role,
  company,
  period,
  animated,
}: HistoryEntryProps) {
  return (
    <FocusItem animated={animated}>
      <p className={styles.period}>{period}</p>
      <h3 className={styles.role}>{role}</h3>
      <p className={styles.company}>{company}</p>
    </FocusItem>
  );
}
