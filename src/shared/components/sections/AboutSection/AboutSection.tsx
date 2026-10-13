'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useInView,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import {
  CSSProperties,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { ScrollOffset } from '../../core/AnimateScrollProgress';
import { Section } from '../../layout/Section';
import styles from './AboutSection.module.css';
import { STAT_HIDE_SECONDS, StatCount } from './StatCount';
import { StatVisual } from './StatVisual';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

// Desktop pins, 0 as section locks, 1 as it unlocks
const PIN_OFFSET: ScrollOffset = ['start start', 'end end'];
// Desktop, short of --screen-h's 1600px cap. Matches .pin in the CSS
const PIN_QUERY = '(min-width: 1024px) and (max-height: 1600px)';
// Scroll in vh per row while locked, last row's slot doubles as hold before unlock
// Rows show and hide with scroll in both directions
const ROW_VH = 50;
// Locked scroll before the first row, time to read the copy
const LEAD_VH = 30;

// Min gap between rows starting, mobile stagger and desktop's floor for quick scrolls
const COUNT_STAGGER_SECONDS = 0.4;
const ROW_FADE_SECONDS = 0.4;
// Count eases out hard so the number reads done about halfway through, land sticker then
const STICKER_AFTER_COUNT_SECONDS = 0.5;

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

function subscribePinned(onChange: () => void) {
  const query = window.matchMedia(PIN_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useIsPinned() {
  return useSyncExternalStore(
    subscribePinned,
    () => window.matchMedia(PIN_QUERY).matches,
    () => false,
  );
}

type AboutSectionProps = {
  copy: AboutCopy;
};

export function AboutSection({ copy }: AboutSectionProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDListElement>(null);
  const titleId = useId();
  const reduceMotion = useReducedMotion();
  const isPinned = useIsPinned();
  const rowCount = copy.stats.length;
  const pinVh = LEAD_VH + rowCount * ROW_VH;

  // Mobile and very tall screens: all rows play once stats top is 60% down the viewport
  const statsInView = useInView(statsRef, {
    once: true,
    margin: '0px 0px -40% 0px',
  });

  // Pinned: each row plays as locked scroll reaches its slot, hides scrolling back
  const { scrollYProgress } = useScroll({ target: pinRef, offset: PIN_OFFSET });
  const [scrolledRows, setScrolledRows] = useState(0);
  // Rows actually shown, catch up to scroll one at a time so a quick scroll still staggers
  const [shownRows, setShownRows] = useState(0);
  const lastShownAt = useRef(0);
  useMotionValueEvent(scrollYProgress, 'change', progress => {
    const scrolledVh = progress * pinVh - LEAD_VH;
    const rows =
      scrolledVh <= 0
        ? 0
        : Math.min(rowCount, Math.floor(scrolledVh / ROW_VH) + 1);
    setScrolledRows(rows);
    // Hiding is immediate
    setShownRows(shown => Math.min(shown, rows));
  });

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

          <LazyMotion features={domAnimation}>
            <dl ref={statsRef} className={styles.stats}>
              {copy.stats.map((stat, i) => {
                // Reduced motion: no lock, so every row shows from the start
                const play = reduceMotion || i < playedRows;
                // Pinned rows are already spaced by scroll
                const countDelay = isPinned ? 0 : i * COUNT_STAGGER_SECONDS;
                return (
                  <motion.div
                    // Reduced motion remounts shown, see useReducedMotion
                    key={`${stat.visual}${+reduceMotion}`}
                    className={styles.stat}
                    data-motion-start
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={
                      play
                        ? {
                            opacity: 1,
                            transition: {
                              duration: ROW_FADE_SECONDS,
                              delay: countDelay,
                            },
                          }
                        : {
                            opacity: 0,
                            transition: { duration: STAT_HIDE_SECONDS },
                          }
                    }>
                    <dt className={styles.statLabel}>{stat.label}</dt>
                    <dd className={styles.statValue}>
                      <StatCount
                        value={stat.value}
                        play={play}
                        delay={countDelay}
                      />
                    </dd>
                    <dd className={styles.statVisual} aria-hidden>
                      <StatVisual
                        visual={stat.visual}
                        play={play}
                        delay={countDelay + STICKER_AFTER_COUNT_SECONDS}
                      />
                    </dd>
                  </motion.div>
                );
              })}
            </dl>
          </LazyMotion>
        </div>
      </Section>
    </div>
  );
}
