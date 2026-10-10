'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
} from 'framer-motion';

type DrawnArrowProps = {
  className?: string;
  /** Stroke colour; defaults to the surrounding text colour */
  color?: string;
  /** Seconds before it starts drawing in */
  delay?: number;
};

// Loops up from below and hooks back left
const SHAFT = 'M74 58 C 78 40, 66 22, 46 18 C 34 15.5, 22 17, 11 21';
const HEAD = 'M21 11.5 C 17 15, 13.5 18, 11 21 C 14.5 23, 18 25.5, 22.5 29';

/** Hand-drawn arrow pointing left; draws itself in once on view. Flip or
    rotate with CSS to point elsewhere */
export function DrawnArrow({
  className,
  color = 'currentColor',
  delay = 0,
}: DrawnArrowProps) {
  const reduceMotion = useReducedMotion();

  const draw = (start: number, duration: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true },
          transition: {
            pathLength: {
              delay: delay + start,
              duration,
              ease: 'easeInOut' as const,
            },
            opacity: { delay: delay + start, duration: 0.01 },
          },
        };

  return (
    <LazyMotion features={domAnimation}>
      <svg
        className={className}
        viewBox="0 0 84 64"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden>
        <motion.path d={SHAFT} {...draw(0.4, 0.6)} />
        <motion.path d={HEAD} {...draw(1, 0.25)} />
      </svg>
    </LazyMotion>
  );
}
