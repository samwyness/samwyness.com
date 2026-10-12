'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
} from 'framer-motion';
import { SIGNATURE_PATH } from '../../icons/SignatureIcon';
import styles from './AboutSection.module.css';

const SIGN_SECONDS = 0.9;

type SignatureDrawProps = {
  /** Starts signing, once true */
  play: boolean;
  /** Seconds to wait after play */
  delay?: number;
};

export function SignatureDraw({ play, delay = 0 }: SignatureDrawProps) {
  const reduceMotion = useReducedMotion();

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
          // Hidden at zero length so round cap doesn't show before signing
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={play ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{
            pathLength: { duration: SIGN_SECONDS, delay, ease: 'easeInOut' },
            opacity: { duration: 0, delay },
          }}
        />
      </svg>
    </LazyMotion>
  );
}
