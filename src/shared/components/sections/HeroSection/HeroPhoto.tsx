'use client';

import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React from 'react';
import { HeroFx } from './HeroFx';
import styles from './HeroPhoto.module.css';

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
  sizes:
    '(max-width: 1023px) 100vw, (max-width: 1439px) and (orientation: portrait) 100vw, 40vw',
};

// Effect lab, with every variant and a picker: on in dev, or with
// NEXT_PUBLIC_HERO_FX_LAB=true. Otherwise it's left out of the build, and
// only the riso reveal ships
const HeroFxLab =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_HERO_FX_LAB === 'true'
    ? dynamic(() => import('./HeroFxLab').then(m => m.HeroFxLab), {
        ssr: false,
      })
    : null;

type HeroPhotoProps = {
  className?: string;
};

/**
 * A glossy print: drifts against the cursor under a glare and falling snow,
 * and shrinks away on scroll
 */
export function HeroPhoto({ className }: HeroPhotoProps) {
  // Effect shown, set by the lab; data-fx hides the CSS glare and snow
  const [fx, setFx] = React.useState('riso-reveal');

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

  return (
    <div
      className={classNames(styles.frame, className)}
      data-fx={fx}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}>
      <div className={styles.card}>
        <div className={styles.clip}>
          <div className={styles.drift}>
            <Image
              {...PHOTO}
              alt="Sam Wyness"
              className={styles.photo}
              preload
              fill
            />
            {HeroFxLab ? (
              <HeroFxLab
                className={classNames(styles.photo, styles.fx)}
                onFx={setFx}
              />
            ) : (
              <HeroFx className={classNames(styles.photo, styles.fx)} />
            )}
          </div>
          <span className={styles.glare} />
          <div className={styles.snow} aria-hidden>
            {FLAKES.map((style, i) => (
              <span key={i} className={styles.flake} style={style} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
