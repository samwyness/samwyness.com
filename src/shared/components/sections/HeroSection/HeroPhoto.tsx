'use client';

import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import styles from './HeroPhoto.module.css';
import { NotebookPage } from './NotebookPage';
import { StampBookPage } from './StampBookPage';

// Deterministic "random" so server and client render the same flakes;
// rounded as Math.sin's last digits differ between Node and browsers
const FLAKES = Array.from({ length: 28 }, (_, i) => {
  const rand = (seed: number) => {
    const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return Math.round((x - Math.floor(x)) * 1000) / 1000;
  };
  // 0 = far, 1 = near the lens: nearer flakes are bigger, blurrier, faster
  const depth = rand(2);
  return {
    '--left': `${(rand(1) * 100).toFixed(1)}%`,
    '--size': `${(3 + depth * 11).toFixed(1)}px`,
    '--blur': `${(0.5 + depth * 3.5).toFixed(1)}px`,
    '--opacity': (0.95 - depth * 0.35).toFixed(2),
    '--sway': `${((rand(3) - 0.5) * 60).toFixed(1)}px`,
    '--duration': `${(9 - depth * 4 + rand(4) * 2).toFixed(2)}s`,
    // Negative so flakes are already mid-fall when hover starts
    '--delay': `${(-rand(5) * 10).toFixed(2)}s`,
  } as React.CSSProperties;
});

const PHOTO = {
  src: '/images/sam-wyness-profile-image.webp',
  sizes: '(max-width: 1023px) 100vw, 40vw',
};

type HeroPhotoProps = {
  /** Which page is on the reverse of the print */
  back?: 'notebook' | 'stampBook';
  className?: string;
};

/**
 * A glossy print: drifts against the cursor under a glare with a chromatic
 * fringe and falling snow, flips over on click, and rounds off on scroll
 */
export function HeroPhoto({ back = 'notebook', className }: HeroPhotoProps) {
  const [flipped, setFlipped] = React.useState(false);

  // Cursor position as 0–1 CSS vars, so moves don't re-render
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { style } = e.currentTarget;
    style.setProperty('--x', String((e.clientX - rect.left) / rect.width));
    style.setProperty('--y', String((e.clientY - rect.top) / rect.height));
  };

  // Back to centre (the CSS default) so the photo eases home
  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty('--x');
    e.currentTarget.style.removeProperty('--y');
  };

  const toggleFlip = () => setFlipped(f => !f);

  return (
    <div
      className={classNames(styles.frame, flipped && styles.flipped, className)}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Flip photo"
      onClick={toggleFlip}
      onKeyDown={e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        toggleFlip();
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}>
      <div className={styles.card}>
        <div className={styles.clip}>
          <div className={styles.drift}>
            <Image
              {...PHOTO}
              alt="Sam Wyness profile image"
              className={styles.photo}
              preload
              fill
            />
            <Image
              {...PHOTO}
              alt=""
              aria-hidden
              className={classNames(styles.photo, styles.chromaLayer)}
              fill
            />
          </div>
          <span className={styles.glare} />
          <div className={styles.snow} aria-hidden>
            {FLAKES.map((style, i) => (
              <span key={i} className={styles.flake} style={style} />
            ))}
          </div>
        </div>

        {/* Back of the print */}
        <div className={styles.back}>
          {back === 'notebook' ? <NotebookPage /> : <StampBookPage />}
        </div>
      </div>

      {/* Scrawled beside the print, pointing at it */}
      <span className={styles.aside} aria-hidden>
        psst, turn me over
        <svg
          viewBox="0 0 40 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M 2 18 C 12 6, 26 4, 37 11 M 30 5.5 L 37 11 L 29.5 14.5" />
        </svg>
      </span>

      <svg className={styles.filterDefs} aria-hidden>
        {/* Red shifted left, cyan right, screened back together */}
        <filter id="hero-chroma">
          <feColorMatrix
            in="SourceGraphic"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feOffset in="red" dx="-6" result="redShift" />
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="cyan"
          />
          <feOffset in="cyan" dx="6" result="cyanShift" />
          <feBlend in="redShift" in2="cyanShift" mode="screen" />
        </filter>
      </svg>
    </div>
  );
}
