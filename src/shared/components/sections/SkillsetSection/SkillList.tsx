'use client';

import {
  LazyMotion,
  cubicBezier,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import classNames from 'classnames';
import { useRef } from 'react';
import { ScrollOffset } from '../../core/AnimateScrollProgress';
import styles from './SkillsetSection.module.css';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export type Skill = {
  title: string;
  description: string;
  tools: string[];
};

const EASE = cubicBezier(0.33, 1, 0.68, 1);

// 0 as element enters bottom of viewport, 1 once it reaches 55%
const OFFSET: ScrollOffset = ['start end', 'start 0.55'];

type DividerProps = {
  className?: string;
};

// Tracks its own position so bottom divider sweeps in when it's reached
function Divider({ className }: DividerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: OFFSET });
  const scaleX = useTransform(scrollYProgress, [0, 0.7], [0, 1], {
    ease: EASE,
  });

  return (
    <motion.span
      ref={ref}
      className={classNames(styles.line, className)}
      data-motion-start
      // Resting value, not undefined, which would leave the hydrated start
      // state behind once reduced motion kicks in
      style={{ scaleX: reduceMotion ? 1 : scaleX }}
    />
  );
}

type SkillRowProps = Skill & {
  number: number;
  isLast: boolean;
};

function SkillRow({
  title,
  description,
  tools,
  number,
  isLast,
}: SkillRowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: OFFSET });

  // Content hinges down off its divider like a split-flap board
  const rotateX = useTransform(scrollYProgress, [0, 1], [-90, 0], {
    ease: EASE,
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <li ref={ref} className={styles.skill}>
      <Divider />
      {isLast && <Divider className={styles.lineBottom} />}

      <motion.div
        className={styles.flap}
        data-motion-start
        // Resting values, as above
        style={
          reduceMotion ? { rotateX: 0, opacity: 1 } : { rotateX, opacity }
        }>
        <span className={styles.number} aria-hidden>
          {String(number).padStart(2, '0')}
        </span>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.body}>
          <p className={styles.description}>{description}</p>
          <ul className={styles.tools}>
            {tools.map(tool => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </li>
  );
}

type SkillListProps = {
  items: Skill[];
};

export function SkillList({ items }: SkillListProps) {
  return (
    <LazyMotion features={domAnimation}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <SkillRow
            key={item.title}
            {...item}
            number={index + 1}
            isLast={index === items.length - 1}
          />
        ))}
      </ol>
    </LazyMotion>
  );
}
