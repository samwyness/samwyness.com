'use client';

import { animate, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const STAT_COUNT_SECONDS = 1;

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
    if (!play || target === undefined || reduceMotion) return;
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
        <span ref={numberRef}>0</span>
        {parts.suffix}
      </span>
    </>
  );
}
