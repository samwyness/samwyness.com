import Image from 'next/image';
import { AnimateScrollProgressProps } from '../../core/AnimateScrollProgress';
import { TextAnimateMask } from '../../core/TextAnimateMask';
import { TextAnimateWeight } from '../../core/TextAnimateWeight';
import { TiltCard } from '../../core/TiltCard';
import { Row } from '../../layout/Row';
import { Section } from '../../layout/Section';
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
    <Section
      className={styles.sectionHero}
      containerClassName={styles.container}>
      <Row className={styles.row}>
        <div className={styles.columnLeft}>
          <h1 className={styles.title}>
            <TextAnimateMask
              {...TITLE_SCROLL}
              inputRange={[0, 0.65]}
              outputRange={['100%', '0%']}>
              <TextAnimateWeight {...TITLE_SCROLL} inputRange={[0, 0.6]}>
                Sam
                <>
                  <span>✳︎</span>
                </>
              </TextAnimateWeight>
            </TextAnimateMask>
            <TextAnimateMask {...TITLE_SCROLL} inputRange={[0, 0.65]}>
              <TextAnimateWeight
                {...TITLE_SCROLL}
                inputRange={[0, 0.6]}
                outputRange={[`'wght' 300`, `'wght' 700`]}>
                Wyness
              </TextAnimateWeight>
            </TextAnimateMask>
          </h1>

          <p className={styles.role}>{role}</p>
        </div>

        <div className={styles.columnRight}>
          <TiltCard className={styles.imageContainer}>
            <Image
              src="/images/sam-wyness-profile-image.webp"
              alt="Sam Wyness profile image"
              sizes="(max-width: 1023px) 100vw, 590px"
              preload
              fill
            />
          </TiltCard>
        </div>
      </Row>
    </Section>
  );
}
