'use client';

import {
  LazyMotion,
  domAnimation,
  m as motion,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import React, { ComponentRef } from 'react';
import { AvailableForHire } from '../../core/AvailableForHire';
import { Brand } from '../../core/Brand';
import { ExternalLink } from '../../core/ExternalLink';
import { LocalTime } from '../../core/LocalTime';
import { Sticker } from '../../core/Sticker';
import { SignatureDraw } from '../../core/SignatureDraw';
import { Row } from '../Row';
import { Section } from '../Section';
import { SOCIAL_LINKS } from 'src/shared/constants';
import styles from './Footer.module.css';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { useSettleAtPageEnd } from '../../../hooks/useSettleAtPageEnd';

const subscribeNever = () => () => {};

type FooterProps = {
  /** Year the static HTML was built, from the server */
  buildYear: number;
};

export function Footer({ buildYear }: FooterProps) {
  const reduceMotion = useReducedMotion();
  // Build year while hydrating so it matches the HTML, then the real one, as
  // a build from last year would otherwise mismatch
  const year = React.useSyncExternalStore(
    subscribeNever,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  const ref = React.useRef<ComponentRef<'div'>>(null);
  const stickerRef = React.useRef<ComponentRef<'div'>>(null);
  // Flamingo only pecks while on screen, restarting each time it comes back
  const stickerInView = useInView(stickerRef, { amount: 0.5 });

  const { scrollYProgress: footerProgress } = useScroll({
    target: ref,
    offset: ['start end', '25vh end'],
  });
  // Short footer on a tall screen can't scroll 25vh in
  const scrollYProgress = useSettleAtPageEnd(footerProgress);

  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '0%']);
  const opacity = useTransform(scrollYProgress, [0.25, 1], [0, 1]);

  return (
    <LazyMotion features={domAnimation}>
      {/* Wrapper so the sticker can straddle the top edge; the footer
          itself clips its scroll reveal */}
      <div className={styles.footerWrap}>
        <div
          ref={stickerRef}
          className={styles.edgeSticker}
          data-in-view={stickerInView}>
          <Sticker name="flamingo" rotate={-10} />
        </div>

        <Section as="footer" className={styles.footer}>
          <motion.div
            ref={ref}
            className={styles.content}
            data-motion-start
            // Resting values, not undefined, which would leave the hydrated
            // start state behind once reduced motion kicks in
            style={
              reduceMotion
                ? { translateY: 0, opacity: 1 }
                : { translateY: y, opacity }
            }>
            <Row className={styles.rowHire}>
              <Brand className={styles.brand} />
              <AvailableForHire />
            </Row>

            <Row className={styles.rowInfo}>
              <address className={styles.location}>
                Sunshine Coast, Australia
                <LocalTime />
              </address>

              <div className={styles.motto}>
                <p>
                  Methodical by nature.
                  <br />
                  Curious by default.
                </p>
                <SignatureDraw className={styles.signature} />
              </div>
            </Row>

            <Row className={styles.rowMeta}>
              <span>© {year} Sam Wyness</span>

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
