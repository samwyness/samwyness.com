'use client';

import { useRef } from 'react';
import { TextAnimateMask } from '../../core/TextAnimateMask';
import { Section } from '../../layout/Section';
import styles from './AboutSection.module.css';
import { SignatureDraw, TextOffset } from './SignatureDraw';

// 0 as section pins, 1 as it unpins
const PIN_OFFSET: TextOffset = ['start start', 'end end'];
const TEXT_RANGE: [number, number] = [0, 0.6];
// Signature signs once text finishes, short hold before unpinning
const SIG_RANGE: [number, number] = [TEXT_RANGE[1], 0.9];

type AboutSectionProps = {
  paragraphs: string[];
};

export function AboutSection({ paragraphs }: AboutSectionProps) {
  const pinRef = useRef<HTMLDivElement>(null);

  return (
    // Tall wrapper gives scroll distance while section is frozen
    <div ref={pinRef} className={styles.pin}>
      <Section className={styles.section} containerClassName={styles.container}>
        {/* Single mask so reveal flows through whole block */}
        <p className={styles.text}>
          <TextAnimateMask
            target={pinRef}
            offset={PIN_OFFSET}
            inputRange={TEXT_RANGE}>
            {paragraphs.join('\n\n')}
          </TextAnimateMask>
        </p>

        <div className={styles.signatureRow}>
          <SignatureDraw
            target={pinRef}
            offset={PIN_OFFSET}
            range={SIG_RANGE}
          />
        </div>
      </Section>
    </div>
  );
}
