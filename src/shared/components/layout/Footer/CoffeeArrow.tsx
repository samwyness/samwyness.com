'use client';

import { m as motion, useReducedMotion } from 'framer-motion';

type CoffeeArrowProps = {
  className?: string;
};

// Loops up from below and hooks back left onto the coffee sticker
const SHAFT = 'M74 58 C 78 40, 66 22, 46 18 C 34 15.5, 22 17, 11 21';
const HEAD = 'M21 11.5 C 17 15, 13.5 18, 11 21 C 14.5 23, 18 25.5, 22.5 29';

/** Hand-drawn arrow pointing left; draws itself in once on view */
export function CoffeeArrow({ className }: CoffeeArrowProps) {
  const reduceMotion = useReducedMotion();

  const draw = (delay: number, duration: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true },
          transition: {
            pathLength: { delay, duration, ease: 'easeInOut' as const },
            opacity: { delay, duration: 0.01 },
          },
        };

  return (
    <svg
      className={className}
      viewBox="0 0 84 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden>
      <motion.path d={SHAFT} {...draw(0.4, 0.6)} />
      <motion.path d={HEAD} {...draw(1, 0.25)} />
    </svg>
  );
}
