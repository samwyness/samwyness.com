'use client';

import { animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const STAT_COUNT_SECONDS = 1;
/** Fade out when scrolled back past a row, count resets once hidden */
export const STAT_HIDE_SECONDS = 0.2;

type StatCountProps = {
  /** e.g. "$25M+", only the number counts */
  value: string;
  /** Starts the count, once true */
  play: boolean;
  /** Seconds to wait after play */
  delay?: number;
};

/** Splits "$25M+" into ["$", 25, "M+"] */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d.]+)(.*)$/);
  if (!match) return null;
  return { prefix: match[1], number: Number(match[2]), suffix: match[3] };
}

export function StatCount({ value, play, delay = 0 }: StatCountProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const parts = parse(value);
  const target = parts?.number;

  useEffect(() => {
    if (target === undefined || reduceMotion) return;
    if (!play) {
      // Back to 0 once faded out, ready to count again
      const reset = setTimeout(() => {
        if (numberRef.current) numberRef.current.textContent = '0';
      }, STAT_HIDE_SECONDS * 1000);
      return () => clearTimeout(reset);
    }
    // Server HTML has the total, so reduced motion never flashes 0 pre-hydration
    if (numberRef.current) numberRef.current.textContent = '0';
    let shown = 0;
    const controls = animate(0, target, {
      duration: STAT_COUNT_SECONDS,
      delay,
      // Quick off the mark, then slows right down into the total
      ease: [0.25, 1, 0.5, 1],
      // Write straight to DOM, no re-render per tick
      onUpdate: latest => {
        const next = Math.round(latest);
        // Most frames land on the same number, only touch the DOM on a tick
        if (next === shown || !numberRef.current) return;
        shown = next;
        numberRef.current.textContent = next.toString();
      },
    });
    return () => controls.stop();
  }, [play, target, delay, reduceMotion]);

  if (!parts || reduceMotion) return value;

  return (
    <>
      {/* Screen readers get final value, not every tick */}
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {parts.prefix}
        {/* Total until play starts the count, hidden by the row fade */}
        <span ref={numberRef}>{target}</span>
        {parts.suffix}
      </span>
    </>
  );
}
