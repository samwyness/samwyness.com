'use client';

import { LazyMotion, domAnimation, m as motion } from 'framer-motion';
import styles from './AboutSection.module.css';
import { STAT_HIDE_SECONDS } from './StatCount';
import { InkLayer, STAT_INK } from './statInk';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

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
  const hidden = { opacity: 0, scale: 1.4, rotate: -12 };

  return (
    <LazyMotion features={domAnimation}>
      {/* Keyed so reduced motion remounts shown, see useReducedMotion */}
      <motion.svg
        key={+reduceMotion}
        data-motion-start
        viewBox="0 0 100 100"
        initial={reduceMotion ? false : hidden}
        animate={
          show
            ? {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: {
                  type: 'spring',
                  stiffness: 500,
                  damping: 18,
                  delay,
                },
              }
            : { ...hidden, transition: { duration: STAT_HIDE_SECONDS } }
        }>
        {layers.map(([layer, d], i) => (
          <path key={i} className={LAYER_CLASS[layer]} d={d} />
        ))}
      </motion.svg>
    </LazyMotion>
  );
}
