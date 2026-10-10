import { AnimateScrollProgressProps } from '../../core/AnimateScrollProgress';
import { AvailableForHire } from '../../core/AvailableForHire';
import { CyclingSticker } from '../../core/CyclingSticker';
import { TextAnimateMask } from '../../core/TextAnimateMask';
import { TextAnimateWeight } from '../../core/TextAnimateWeight';
import { Header } from '../../layout/Header';
import { Row } from '../../layout/Row';
import { HeroPhoto } from './HeroPhoto';
import styles from './HeroSection.module.css';

// Progress = page scroll / viewport height, so title starts at 0 on load
// regardless of where it sits vertically
const TITLE_SCROLL = {
  useTarget: false,
  offset: ['start start', '75vh start'],
} satisfies AnimateScrollProgressProps;

type HeroSectionProps = {
  role: string;
};

export function HeroSection({ role }: HeroSectionProps) {
  return (
    <section className={styles.sectionHero}>
      <div className={styles.container}>
        <Row className={styles.row}>
          <div className={styles.columnLeft}>
            <Header className={styles.header} />

            <div className={styles.intro}>
              {/* Sticker sits outside h1 so the title's reveal clip can't cut it */}
              <div className={styles.titleWrap}>
                <h1 className={styles.title}>
                  <TextAnimateMask
                    {...TITLE_SCROLL}
                    inputRange={[0, 0.65]}
                    outputRange={['100%', '0%']}>
                    <TextAnimateWeight
                      {...TITLE_SCROLL}
                      inputRange={[0, 0.6]}
                      outputRange={[`'wght' 700`, `'wght' 300`]}>
                      Sam
                    </TextAnimateWeight>
                  </TextAnimateMask>
                  <TextAnimateMask {...TITLE_SCROLL} inputRange={[0, 0.65]}>
                    <TextAnimateWeight
                      {...TITLE_SCROLL}
                      inputRange={[0, 0.6]}
                      outputRange={[`'wght' 400`, `'wght' 700`]}>
                      Wyness
                    </TextAnimateWeight>
                  </TextAnimateMask>
                </h1>
                <CyclingSticker
                  rotate={10}
                  delay={2}
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
    </section>
  );
}
