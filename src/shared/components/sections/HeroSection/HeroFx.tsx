'use client';

import React from 'react';
import { hasCapableGpu } from 'src/shared/utils/glSupport';

type HeroFxProps = {
  /** Element whose pointer moves steer the lens */
  frameRef: React.RefObject<HTMLElement | null>;
  className?: string;
};

/**
 * WebGL layer over the hero photo: a riso print all over, with a sticker cut
 * out that follows the cursor, or sits on the face when there isn't one.
 * Transparent where it has nothing to add, so the real <Image> shows through.
 * Textured from that same <Image>, so the photo only downloads once.
 * The canvas renders straight away so it shares the photo's reveal, while
 * the GL code (heroFxGl.ts) only loads on devices that can run it
 */
export function HeroFx({ frameRef, className }: HeroFxProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const frame = frameRef.current;
    // The photo underneath, used as the texture
    const photo = parent?.querySelector('img');
    if (!canvas || !parent || !frame || !photo) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Software GL or low memory: plain photo
    if (!hasCapableGpu()) return;

    let stop: (() => void) | undefined;
    let unmounted = false;
    import('./heroFxGl')
      .then(({ startHeroFx }) => {
        if (!unmounted) stop = startHeroFx({ canvas, parent, frame, photo });
      })
      .catch(() => {}); // Failed to load: plain photo

    return () => {
      unmounted = true;
      stop?.();
    };
  }, [frameRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
