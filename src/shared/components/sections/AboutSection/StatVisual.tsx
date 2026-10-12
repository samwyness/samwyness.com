'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
} from 'framer-motion';
import styles from './AboutSection.module.css';
import { InkLayer, STAT_INK } from './statInk';

const LAYER_CLASS: Record<InkLayer, string> = {
  ink: styles.ink,
  carve: styles.carve,
  accent: styles.accent,
};

type StatVisualProps = {
  /** Which drawing: heart, orbit, hex */
  visual: string;
  /** Starts the entrance, once true */
  play: boolean;
  /** Seconds to wait after play */
  delay: number;
};

/** Linocut drawing per stat, slaps on like a sticker alongside its count */
export function StatVisual({ visual, play, delay }: StatVisualProps) {
  const reduceMotion = useReducedMotion();
  const layers = STAT_INK[visual];
  if (!layers) return null;

  const show = play || reduceMotion;

  return (
    <LazyMotion features={domAnimation}>
      <motion.svg
        viewBox="0 0 100 100"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.4, rotate: -12 }}
        animate={show ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 18, delay }}>
        {layers.map(([layer, d], i) => (
          <path key={i} className={LAYER_CLASS[layer]} d={d} />
        ))}
      </motion.svg>
    </LazyMotion>
  );
}
