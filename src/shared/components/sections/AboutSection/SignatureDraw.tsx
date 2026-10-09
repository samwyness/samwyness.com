'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { RefObject } from 'react';
import { SIGNATURE_DOT, SIGNATURE_PATH } from '../../icons/SignatureIcon';
import styles from './AboutSection.module.css';

export type TextOffset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

type SignatureDrawProps = {
  target: RefObject<HTMLElement | null>;
  offset: TextOffset;
  /** Scroll progress range to sign over */
  range: [number, number];
};

export function SignatureDraw({ target, offset, range }: SignatureDrawProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target, offset });

  // Name takes most of the range, full stop dabbed at the end
  const [start, end] = range;
  const dotStart = start + (end - start) * 0.9;
  const pathLength = useTransform(scrollYProgress, [start, dotStart], [0, 1]);
  // Hide round cap that shows at zero length
  const strokeOpacity = useTransform(pathLength, value => (value > 0 ? 1 : 0));
  const dotScale = useTransform(scrollYProgress, [dotStart, end], [0, 1]);

  return (
    <LazyMotion features={domAnimation}>
      <svg
        role="img"
        aria-label="Sam"
        className={styles.signatureDraw}
        viewBox="0 0 600 300">
        <motion.path
          className={styles.signatureStroke}
          d={SIGNATURE_PATH}
          style={
            reduceMotion ? undefined : { pathLength, opacity: strokeOpacity }
          }
        />
        <motion.circle
          className={styles.signatureDot}
          {...SIGNATURE_DOT}
          style={reduceMotion ? undefined : { scale: dotScale }}
        />
      </svg>
    </LazyMotion>
  );
}
