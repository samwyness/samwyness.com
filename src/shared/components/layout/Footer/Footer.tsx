'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import React, { ComponentRef } from 'react';
import { AvailableForHire } from '../../core/AvailableForHire';
import { LocalTime } from '../../core/LocalTime';
import { SignatureIcon } from '../../icons/SignatureIcon';
import { Row } from '../Row';
import { Section } from '../Section';
import styles from './Footer.module.css';

export function Footer() {
  const ref = React.useRef<ComponentRef<'div'>>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', '25vh end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '0%']);
  const opacity = useTransform(scrollYProgress, [0.25, 1], [0, 1]);

  return (
    <LazyMotion features={domAnimation}>
      <Section as="footer" className={styles.footer}>
        <motion.div
          ref={ref}
          className={styles.content}
          style={{ translateY: y, opacity }}>
          <Row className={styles.rowHire}>
            <Link href="/" className={styles.brand}>
              <strong>SW</strong>.STUDIO
            </Link>
            <AvailableForHire />
          </Row>

          <Row className={styles.rowInfo}>
            <p className={styles.location}>
              Sunshine Coast, Australia
              <LocalTime />
            </p>

            <div className={styles.motto}>
              <p>
                Methodical by nature.
                <br />
                Curious by default.
              </p>
              <SignatureIcon className={styles.signature} />
            </div>
          </Row>

          <Row className={styles.rowMeta}>
            <span>© {new Date().getFullYear()} Sam Wyness</span>

            <ul className={styles.socialLinks}>
              <li>
                <a
                  href="https://linkedin.com/in/samwyness22"
                  target="_blank"
                  referrerPolicy="no-referrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/samwyness"
                  target="_blank"
                  referrerPolicy="no-referrer">
                  GitHub
                </a>
              </li>
            </ul>
          </Row>
        </motion.div>
      </Section>
    </LazyMotion>
  );
}
