'use client';

import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import { HeroFx } from './HeroFx';
import styles from './HeroPhoto.module.css';

const PHOTO = {
  src: '/images/sam-wyness-profile-image.webp',
  sizes:
    '(max-width: 1023px) 100vw, (max-width: 1439px) and (orientation: portrait) 100vw, 40vw',
};

type HeroPhotoProps = {
  className?: string;
};

/**
 * The hero photo under a riso print with a sticker lens, see HeroFx.tsx.
 * Drifts against the cursor and shrinks away on scroll
 */
export function HeroPhoto({ className }: HeroPhotoProps) {
  const frameRef = React.useRef<HTMLDivElement>(null);

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
      ref={frameRef}
      className={classNames(styles.frame, className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}>
      <div className={styles.card}>
        <div className={styles.clip}>
          <div className={styles.drift}>
            <Image
              {...PHOTO}
              alt="Sam Wyness"
              className={styles.photo}
              draggable={false}
              preload
              fetchPriority="high"
              fill
            />
            <HeroFx
              frameRef={frameRef}
              className={classNames(styles.photo, styles.fx)}
            />
          </div>
          {/* Outside the drift, so the reveal holds still */}
          <div className={styles.cover} data-reveal aria-hidden />
        </div>
      </div>
    </div>
  );
}
