'use client';

import React from 'react';
import { STICKER_NAMES, Sticker } from './Sticker';

type CyclingStickerProps = {
  /** Seconds before the first sticker slaps on; cycling starts after it lands */
  delay?: number;
  /** Seconds each sticker stays before swapping to the next */
  interval?: number;
  rotate?: number;
  className?: string;
};

/** Slaps on the first sticker, then flicks through the rest, looping; hover pauses */
export function CyclingSticker({
  delay = 0,
  interval = 0.5,
  rotate,
  className,
}: CyclingStickerProps) {
  const [tick, setTick] = React.useState(0);
  // Ref so hovering doesn't restart the timers
  const paused = React.useRef(false);

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Warm the cache so each swap doesn't flash empty
    STICKER_NAMES.forEach(name => {
      new window.Image().src = `/images/stickers/${name}.svg`;
    });

    // Wait for the 0.5s slap-on to land before flicking through
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(
      () => {
        timer = setInterval(
          () => !paused.current && setTick(t => t + 1),
          interval * 1000,
        );
      },
      (delay) * 1000,
    );

    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [delay, interval]);

  const name = STICKER_NAMES[tick % STICKER_NAMES.length];

  // Only the first sticker slaps on; swaps are instant
  return (
    <Sticker
      name={name}
      rotate={rotate}
      delay={delay}
      still={tick > 0}
      className={className}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    />
  );
}
