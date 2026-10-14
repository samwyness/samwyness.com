'use client';

import React from 'react';
import { STICKER_NAMES, Sticker, StickerName } from './Sticker';

// Markup per sticker, fetched once and shared by every instance
const markup = new Map<StickerName, Promise<string>>();
const loadSvg = (name: StickerName) => {
  let svg = markup.get(name);
  if (!svg) {
    svg = fetch(`/images/stickers/${name}.svg`).then(res =>
      res.ok ? res.text() : Promise.reject(),
    );
    // Dropped on failure, so a later swap can try again
    svg.catch(() => markup.delete(name));
    markup.set(name, svg);
  }
  return svg;
};

type CyclingStickerProps = {
  /** Seconds before the first sticker slaps on; cycling starts after it lands */
  delay?: number;
  /** Seconds each sticker stays before swapping to the next */
  interval?: number;
  rotate?: number;
  className?: string;
};

/**
 * Slaps on the first sticker, then flicks through the rest, looping; hover
 * pauses. Drawn as inline SVG: as <img>s, these late arrivals outrank the
 * hero photo (first painted mid-reveal, so measured small) as the LCP
 */
export function CyclingSticker({
  delay = 0,
  interval = 0.5,
  rotate,
  className,
}: CyclingStickerProps) {
  const [tick, setTick] = React.useState(0);
  // Ref so hovering doesn't restart the timers
  const paused = React.useRef(false);
  // Inline ids are page-wide, so namespaced per instance
  const idPrefix = React.useId().replace(/[^\w-]/g, '');
  // Swaps counted, to replay the art's mini slap-on each time
  const [art, setArt] = React.useState({ svg: '', swaps: 0 });

  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Wait for the 0.5s slap-on to land before flicking through
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(
        () => !paused.current && setTick(t => t + 1),
        interval * 1000,
      );
    }, delay * 1000);

    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [delay, interval]);

  const name = STICKER_NAMES[tick % STICKER_NAMES.length];

  // Kept on the last one until the next loads, so a swap never flashes empty
  React.useEffect(() => {
    let current = true;
    loadSvg(name)
      .then(text => {
        if (!current) return;
        const svg = text
          .replaceAll('id="', `id="${idPrefix}`)
          .replaceAll('href="#', `href="#${idPrefix}`);
        setArt(a => ({ svg, swaps: a.svg ? a.swaps + 1 : 0 }));
      })
      .catch(() => {});
    return () => {
      current = false;
    };
  }, [name, idPrefix]);

  // Warm only the next one
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    loadSvg(STICKER_NAMES[(tick + 1) % STICKER_NAMES.length]).catch(() => {});
  }, [tick]);

  // Only the first sticker slaps on fully; swaps get a mini one
  return (
    <Sticker
      name={name}
      rotate={rotate}
      delay={delay}
      still={tick > 0}
      svg={art.svg}
      pop={art.swaps}
      className={className}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    />
  );
}
