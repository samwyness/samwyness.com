'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { track } from '@vercel/analytics';
import React, { ComponentRef } from 'react';
import { AvailableForHire } from '../../core/AvailableForHire';
import { Brand } from '../../core/Brand';
import { DrawnArrow } from '../../core/DrawnArrow';
import { ExternalLink } from '../../core/ExternalLink';
import { LocalTime } from '../../core/LocalTime';
import { Sticker } from '../../core/Sticker';
import { SignatureIcon } from '../../icons/SignatureIcon';
import { Row } from '../Row';
import { Section } from '../Section';
import { SOCIAL_LINKS } from 'src/shared/constants';
import styles from './Footer.module.css';

export function Footer() {
  const reduceMotion = useReducedMotion();
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
            style={reduceMotion ? undefined : { translateY: y, opacity }}>
            <Row className={styles.rowHire}>
              <Brand className={styles.brand} />
              <AvailableForHire />
            </Row>

            <Row className={styles.rowInfo}>
              <div className={styles.locationGroup}>
                <address className={styles.location}>
                  Sunshine Coast, Australia
                  <LocalTime />
                </address>
                <ExternalLink
                  className={styles.coffee}
                  href="https://buymeacoffee.com/samwyness"
                  onClick={() => track('Buy me a coffee')}>
                  <Sticker
                    name="coffee"
                    rotate={-8}
                    className={styles.sticker}
                  />
                  <DrawnArrow className={styles.arrow} />
                  <span className={styles.coffeeLabel}>buy me a coffee?</span>
                </ExternalLink>
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

              <nav aria-label="Social">
                <ul className={styles.socialLinks}>
                  <li>
                    <ExternalLink href={SOCIAL_LINKS.linkedin}>
                      LinkedIn
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href={SOCIAL_LINKS.github}>
                      GitHub
                    </ExternalLink>
                  </li>
                </ul>
              </nav>
            </Row>
          </motion.div>
        </Section>
      </div>
    </LazyMotion>
  );
}
