'use client';

import { CSSProperties, useEffect, useId, useRef, useState } from 'react';
import { Section } from '../../layout/Section';
import styles from './AboutSection.module.css';
import { StatCount } from './StatCount';
import { StatVisual } from './StatVisual';
import { useInView } from '../../../hooks/useInView';
import { useMediaQuery } from '../../../hooks/useMediaQuery';

// Desktop, short of --screen-h's 1600px cap. Matches .pin in the CSS
const PIN_QUERY = '(min-width: 1024px) and (max-height: 1600px)';
// Scroll in vh per row while locked, last row's slot doubles as hold before unlock
// Rows show and hide with scroll in both directions
const ROW_VH = 50;
// Locked scroll before the first row, time to read the copy
const LEAD_VH = 30;

// Min gap between rows starting, mobile stagger and desktop's floor for quick scrolls
const COUNT_STAGGER_SECONDS = 0.4;

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
  /** How you think */
  closing: string;
  /** Product/client numbers */
  stats: AboutStat[];
};

type AboutSectionProps = {
  copy: AboutCopy;
};

export function AboutSection({ copy }: AboutSectionProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const titleId = useId();
  const isPinned = useMediaQuery(PIN_QUERY);
  const rowCount = copy.stats.length;
  const pinVh = LEAD_VH + rowCount * ROW_VH;

  // Mobile and very tall screens: all rows play once stats top is 60% down the viewport
  const statsInView = useInView(statsRef, {
    once: true,
    margin: '0px 0px -40% 0px',
  });

  // Pinned: each row plays as locked scroll reaches its slot, hides scrolling back
  const [scrolledRows, setScrolledRows] = useState(0);
  // Rows actually shown, catch up to scroll one at a time so a quick scroll still staggers
  const [shownRows, setShownRows] = useState(0);
  const lastShownAt = useRef(0);
  useEffect(() => {
    const pin = pinRef.current;
    if (!isPinned || !pin) return;
    const onScroll = () => {
      // 0 as section locks, 1 as it unlocks
      const rect = pin.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / (rect.height - window.innerHeight)),
      );
      const scrolledVh = progress * pinVh - LEAD_VH;
      const rows =
        scrolledVh <= 0
          ? 0
          : Math.min(rowCount, Math.floor(scrolledVh / ROW_VH) + 1);
      setScrolledRows(rows);
      // Hiding is immediate
      setShownRows(shown => Math.min(shown, rows));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isPinned, pinVh, rowCount]);

  useEffect(() => {
    if (shownRows >= scrolledRows) return;
    const wait = Math.max(
      0,
      lastShownAt.current + COUNT_STAGGER_SECONDS * 1000 - performance.now(),
    );
    const next = setTimeout(() => {
      lastShownAt.current = performance.now();
      setShownRows(shown => shown + 1);
    }, wait);
    return () => clearTimeout(next);
  }, [shownRows, scrolledRows]);

  const playedRows = isPinned ? shownRows : statsInView ? rowCount : 0;

  return (
    // Tall wrapper gives scroll distance while section is locked on desktop
    <div
      ref={pinRef}
      className={styles.pin}
      style={{ '--pin-scroll': `${pinVh}vh` } as CSSProperties}>
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

          <dl ref={statsRef} className={styles.stats}>
            {copy.stats.map((stat, i) => {
              const play = i < playedRows;
              // Pinned rows are already spaced by scroll
              const countDelay = isPinned ? 0 : i * COUNT_STAGGER_SECONDS;
              return (
                // Fades in on play, drawing slapping on after the count, see
                // .stat. Reduced motion shows them all from the start
                <div
                  key={stat.visual}
                  className={styles.stat}
                  data-motion-start
                  data-play={play}
                  style={{ '--row-delay': `${countDelay}s` } as CSSProperties}>
                  <dt className={styles.statLabel}>{stat.label}</dt>
                  <dd className={styles.statValue}>
                    <StatCount
                      value={stat.value}
                      play={play}
                      delay={countDelay}
                    />
                  </dd>
                  <dd className={styles.statVisual} aria-hidden>
                    <StatVisual visual={stat.visual} />
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </Section>
    </div>
  );
}
