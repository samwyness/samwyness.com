'use client';

import React from 'react';
import { hasCapableGpu } from 'src/shared/utils/glSupport';
import styles from './WorkSection.module.css';

// Canvas overhangs the list so a bent preview isn't clipped at the edges
export const OVERHANG = 200;

type ProjectPreviewProps = {
  activeIndex: number;
  /** Project images mounted, which the GL textures from */
  mediaShown: boolean;
  /** Hides the CSS media once the GL preview can take over */
  onReady: (ready: boolean) => void;
};

/**
 * WebGL preview for the project list: rests in the open row's media slot,
 * flies to the cursor on enter and follows it, bending with its speed, then
 * flies home on leave. Crossfades between projects. Desktop with a mouse and
 * a capable GPU only, the GL code (projectPreviewGl.ts) loading just for those
 */
export function ProjectPreview({
  activeIndex,
  mediaShown,
  onReady,
}: ProjectPreviewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // Read inside the render loop without restarting it
  const activeRef = React.useRef(activeIndex);
  React.useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    // Wrapper around the project list, sized to it
    const list = canvas?.parentElement;
    if (!canvas || !list || !mediaShown) return;
    if (!window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches)
      return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Software GL or low memory: CSS media stays
    if (!hasCapableGpu()) return;

    let stop: (() => void) | undefined;
    let unmounted = false;
    import('./projectPreviewGl')
      .then(({ startProjectPreview }) => {
        if (!unmounted)
          stop = startProjectPreview({ canvas, list, activeRef, onReady });
      })
      .catch(() => {}); // Failed to load: CSS media stays

    return () => {
      unmounted = true;
      stop?.();
    };
  }, [mediaShown, onReady]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.preview}
      style={{ inset: -OVERHANG }}
      aria-hidden
    />
  );
}
