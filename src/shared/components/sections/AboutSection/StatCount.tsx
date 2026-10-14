'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

const STAT_COUNT_SECONDS = 1;
/** Row's fade out when scrolled back past, see .stat. Count resets once hidden */
const STAT_HIDE_SECONDS = 0.2;

// Bezier coordinate at s, for control points a and b
const bezier = (s: number, a: number, b: number) =>
  3 * (1 - s) ** 2 * s * a + 3 * (1 - s) * s ** 2 * b + s ** 3;

/** cubic-bezier(0.25, 1, 0.5, 1): quick off the mark, then slows right down
    into the total. Solves x for t by bisection, then reads y */
function easeOut(t: number) {
  let low = 0;
  let high = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    if (bezier(mid, 0.25, 0.5) < t) low = mid;
    else high = mid;
  }
  return bezier((low + high) / 2, 1, 1);
}

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
    let frame = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const t = Math.min(
        1,
        Math.max(0, (now - start) / (STAT_COUNT_SECONDS * 1000)),
      );
      const next = Math.round(target * easeOut(t));
      // Most frames land on the same number, only touch the DOM on a tick.
      // Straight to DOM, no re-render per tick
      if (next !== shown && numberRef.current) {
        shown = next;
        numberRef.current.textContent = next.toString();
      }
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
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
