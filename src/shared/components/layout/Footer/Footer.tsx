'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { track } from '@vercel/analytics';
import Link from 'next/link';
import React, { ComponentRef } from 'react';
import { AvailableForHire } from '../../core/AvailableForHire';
import { LocalTime } from '../../core/LocalTime';
import { Sticker } from '../../core/Sticker';
import { SignatureIcon } from '../../icons/SignatureIcon';
import { Row } from '../Row';
import { Section } from '../Section';
import { CoffeeArrow } from './CoffeeArrow';
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
      {/* Wrapper so the mobile sticker can straddle the top edge; the
          footer itself clips its scroll reveal */}
      <div className={styles.footerWrap}>
        <div className={styles.edgeSticker}>
          <Sticker name="flamingo" rotate={-10} />
        </div>

        <Section as="footer" className={styles.footer}>
          <motion.div
            ref={ref}
            className={styles.content}
            style={{ translateY: y, opacity }}>
            <Row className={styles.rowHire}>
              <Link href="/" className={styles.brand}>
                SW.
              </Link>
              <AvailableForHire />
            </Row>

            <Row className={styles.rowInfo}>
              <div className={styles.locationGroup}>
                <p className={styles.location}>
                  Sunshine Coast, Australia
                  <LocalTime />
                </p>
                <a
                  className={styles.coffee}
                  href="https://buymeacoffee.com/samwyness"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  onClick={() => track('Buy me a coffee')}>
                  <Sticker
                    name="coffee"
                    rotate={-8}
                    className={styles.sticker}
                  />
                  <CoffeeArrow className={styles.arrow} />
                  <span className={styles.coffeeLabel}>buy me a coffee?</span>
                </a>
              </div>

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
      </div>
    </LazyMotion>
  );
}
