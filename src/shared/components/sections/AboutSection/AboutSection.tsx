'use client';

import { useInView } from 'framer-motion';
import { useId, useRef } from 'react';
import { Section } from '../../layout/Section';
import styles from './AboutSection.module.css';
import { SignatureDraw } from './SignatureDraw';
import { StatCount } from './StatCount';
import { StatVisual } from './StatVisual';

// Signs off first, stickers slap on mid-signature, then counts run together, all done ~1.8s
const SIGN_START_SECONDS = 0;
const STICKER_START_SECONDS = 0.5;
const STICKER_STAGGER_SECONDS = 0.1;
const COUNT_START_SECONDS = 0.8;

type AboutStat = {
  /** Drawing beside the number: heart, hands, orbit, hex */
  visual: string;
  value: string;
  label: string;
};

type AboutCopy = {
  /** Large, what you do */
  statement: string;
  /** The proof */
  experience: string;
  /** How you think, signed off */
  closing: string;
  /** Product/client numbers */
  stats: AboutStat[];
};

type AboutSectionProps = {
  copy: AboutCopy;
};

export function AboutSection({ copy }: AboutSectionProps) {
  const statsRef = useRef<HTMLDListElement>(null);
  const titleId = useId();
  // Plays once stats top is 60% down the viewport, not tied to scroll after
  const statsPlay = useInView(statsRef, {
    once: true,
    margin: '0px 0px -40% 0px',
  });

  return (
    <Section
      aria-labelledby={titleId}
      className={styles.section}
      containerClassName={styles.container}>
      <h2 id={titleId} className="sr-only">
        About
      </h2>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.statement}>{copy.statement}</p>
          <p className={styles.body}>{copy.experience}</p>
          <p className={styles.body}>{copy.closing}</p>
        </div>

        {/* Signs off the copy, under text on all sizes */}
        <SignatureDraw play={statsPlay} delay={SIGN_START_SECONDS} />

        <dl ref={statsRef} className={styles.stats}>
          {/* Always visible, stickers land then counts run together */}
          {copy.stats.map((stat, i) => {
            return (
              <div key={stat.visual} className={styles.stat}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>
                  <StatCount
                    value={stat.value}
                    play={statsPlay}
                    delay={COUNT_START_SECONDS}
                  />
                </dd>
                <dd className={styles.statVisual} aria-hidden>
                  <StatVisual
                    visual={stat.visual}
                    play={statsPlay}
                    delay={STICKER_START_SECONDS + i * STICKER_STAGGER_SECONDS}
                  />
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
