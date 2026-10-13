import { AvailableForHire } from '../../core/AvailableForHire';
import { CyclingSticker } from '../../core/CyclingSticker';
import { TextAnimateMask } from '../../core/TextAnimateMask';
import { Header } from '../../layout/Header';
import { Row } from '../../layout/Row';
import { HeroPhoto } from './HeroPhoto';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  role: string;
};

export function HeroSection({ role }: HeroSectionProps) {
  return (
    // Page banner, before <main>
    <header className={styles.sectionHero}>
      <div className={styles.container}>
        <Row className={styles.row}>
          <div className={styles.columnLeft}>
            <Header className={styles.header} />

            <div className={styles.intro}>
              {/* Sticker sits outside h1 so the title's reveal clip can't cut it */}
              <div className={styles.titleWrap}>
                {/* Words reveal on load, then swap weight and fill on scroll */}
                <h1 className={styles.title}>
                  <span>
                    <TextAnimateMask out className={styles.titleMask}>
                      <span className={styles.titleWeight}>Sam</span>
                    </TextAnimateMask>
                  </span>{' '}
                  <span>
                    <TextAnimateMask className={styles.titleMask}>
                      <span className={styles.titleWeight}>Wyness</span>
                    </TextAnimateMask>
                  </span>
                </h1>
                <CyclingSticker
                  rotate={10}
                  delay={1.75}
                  className={styles.sticker}
                />
              </div>
              <p className={styles.role}>{role}</p>
              {/* Header (and its hire status) is hidden on mobile */}
              <div className={styles.hire}>
                <AvailableForHire />
              </div>
            </div>
          </div>

          <div className={styles.columnRight}>
            <HeroPhoto className={styles.imageContainer} />
          </div>
        </Row>
      </div>
    </header>
  );
}
