'use client';

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
import { useInView } from '../../../hooks/useInView';
import styles from './Footer.module.css';

const subscribeNever = () => () => {};

type FooterProps = {
  /** Year the static HTML was built, from the server */
  buildYear: number;
};

export function Footer({ buildYear }: FooterProps) {
  // Build year while hydrating so it matches the HTML, then the real one, as
  // a build from last year would otherwise mismatch
  const year = React.useSyncExternalStore(
    subscribeNever,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  const stickerRef = React.useRef<ComponentRef<'div'>>(null);
  // Flamingo only pecks while on screen, restarting each time it comes back
  const stickerInView = useInView(stickerRef, { amount: 0.5 });

  // Wrapper so the sticker can straddle the top edge; the footer itself
  // clips its scroll reveal
  return (
    <div className={styles.footerWrap}>
      <div
        ref={stickerRef}
        className={styles.edgeSticker}
        data-in-view={stickerInView}>
        <Sticker name="flamingo" rotate={-10} />
      </div>

      <Section as="footer" className={styles.footer}>
        {/* Scroll reveal in the CSS */}
        <div className={styles.content}>
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
                  <ExternalLink href={SOCIAL_LINKS.github}>GitHub</ExternalLink>
                </li>
              </ul>
            </nav>
          </Row>
        </div>
      </Section>
    </div>
  );
}
