'use client';

import React from 'react';
import { hasCapableGpu } from 'src/shared/utils/glSupport';
import { startHeroFx } from './heroFxGl';

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
 * Bundled rather than loaded on demand, so a first visit's riso arrives with
 * the photo's reveal instead of after an extra fetch
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

    return startHeroFx({ canvas, parent, frame, photo });
  }, [frameRef]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
