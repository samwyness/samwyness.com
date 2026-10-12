'use client';

import classNames from 'classnames';
import Image from 'next/image';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Section } from '../../layout/Section';
import { ProjectCta } from './ProjectCta';
import { ProjectPreview } from './ProjectPreview';
import styles from './WorkSection.module.css';

export type Project = {
  title: string;
  subtitle: string;
  role: string;
  company: string;
  image: string;
  link: string;
  comingSoon?: boolean;
  year?: string;
  summary?: string;
  tags?: string[];
};

type WorkSectionProps = {
  items: Project[];
};

// Ease time constant for rows opening, settles in ~450ms
const OPEN_TAU = 90;

/**
 * Open amount per row, 0 to 1, written to --open on each row without
 * re-rendering. All ease towards their targets at the same rate, so they
 * always sum to one open row: the height never jumps, however fast you
 * move between rows (separate CSS transitions don't add up mid-way)
 */
function useOpenRows(activeIndex: number, count: number) {
  const rowsRef = useRef<(HTMLLIElement | null)[]>([]);
  const openRef = useRef<number[]>([]);

  useEffect(() => {
    const open = openRef.current;
    if (open.length !== count) {
      open.splice(
        0,
        open.length,
        ...Array.from({ length: count }, (_, i) => +(i === activeIndex)),
      );
    }
    const instant = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const k = instant ? 1 : 1 - Math.exp(-(now - last) / OPEN_TAU);
      last = now;
      let settled = true;
      open.forEach((v, i) => {
        const target = +(i === activeIndex);
        const next = v + (target - v) * k;
        open[i] = Math.abs(target - next) < 0.001 ? target : next;
        if (open[i] !== target) settled = false;
      });
      // Guards against drift
      const sum = open.reduce((a, b) => a + b, 0) || 1;
      rowsRef.current.forEach((row, i) =>
        row?.style.setProperty('--open', String(open[i] / sum)),
      );
      if (!settled) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [activeIndex, count]);

  return rowsRef;
}

/** Project image, linking to the project once it's live */
function ProjectMedia({ item }: { item: Project }) {
  const image = (
    <Image
      src={item.image}
      alt={item.title}
      sizes="(max-width: 1023px) 100vw, 50vw"
      fill
    />
  );
  if (item.comingSoon || !item.link) {
    return <div className={styles.media}>{image}</div>;
  }
  return (
    // Out of the tab order, the "View project" button is the same link
    <a
      className={styles.media}
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={-1}>
      {image}
    </a>
  );
}

/**
 * Project index: one line per project, the hovered one opens beneath with
 * its details and image. A WebGL preview follows the cursor, desktop only
 */
export function WorkSection({ items }: WorkSectionProps) {
  // First project open by default; last hovered/focused stays open on leave
  const [activeIndex, setActiveIndex] = useState(0);
  // GL preview loaded, so the CSS media can hide
  const [glReady, setGlReady] = useState(false);
  const rowsRef = useOpenRows(activeIndex, items.length);

  const details = (item: Project) =>
    [
      ['Role', item.role],
      ['Company', item.company],
    ].filter(([, value]) => value);

  return (
    <Section title="Selected Work" count={items.length}>
      {/* Preview canvas sits beside the list, not inside the <ul> */}
      <div className={styles.listWrap} data-gl={glReady || undefined}>
        <ul
          className={styles.list}
          style={{ '--count': items.length } as CSSProperties}>
          {items.map((item, index) => {
            const active = index === activeIndex;
            return (
              <li
                key={item.title}
                ref={el => {
                  rowsRef.current[index] = el;
                }}
                className={classNames(styles.row, active && styles.active)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}>
                <div className={styles.line}>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.subtitle}>{item.subtitle}</p>
                  <span className={styles.year}>
                    {item.comingSoon ? 'Coming soon' : item.year}
                  </span>
                  {/* Where the preview follows the cursor */}
                  <span className={styles.zone} aria-hidden />
                  <ProjectCta
                    className={styles.cta}
                    link={item.link}
                    comingSoon={item.comingSoon}
                  />
                </div>

                <div className={styles.panel}>
                  <div className={styles.body}>
                    <div className={styles.intro}>
                      <p className={styles.summary}>{item.summary}</p>
                      {!!item.tags?.length && (
                        <ul className={styles.tags}>
                          {item.tags.map(tag => (
                            <li key={tag}>{tag}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <dl className={styles.details}>
                      {details(item).map(([label, value]) => (
                        <div key={label}>
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <ProjectMedia item={item} />
                </div>
              </li>
            );
          })}
        </ul>

        <ProjectPreview activeIndex={activeIndex} onReady={setGlReady} />
      </div>
    </Section>
  );
}
