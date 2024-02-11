import Image from 'next/image';
import { AnimateScrollProgress } from '../../core/AnimateScrollProgress';
import { TextAnimateMask } from '../../core/TextAnimateMask';
import { TextAnimateWeight } from '../../core/TextAnimateWeight';
import { TiltCard } from '../../core/TiltCard';
import { Container } from '../../layout/Container';
import { Row } from '../../layout/Row';
import styles from './HeroSection.module.css';

type HeroSectionProps = {
  intro: string;
};

export function HeroSection({ intro }: HeroSectionProps) {
  return (
    <section className={styles.sectionHero}>
      <Container className={styles.container}>
        <Row className={styles.row}>
          <div className={styles.columnLeft}>
            <h1 className={styles.title}>
              <TextAnimateMask
                inputRange={[0.3, 0.95]}
                outputRange={['100%', '0%']}>
                <TextAnimateWeight inputRange={[0.4, 0.85]}>
                  S<i>a</i>m
                  <>
                    <span>✳︎</span>
                  </>
                </TextAnimateWeight>
              </TextAnimateMask>

              <TextAnimateMask inputRange={[0.1, 0.7]}>
                <TextAnimateWeight
                  inputRange={[0.3, 0.65]}
                  outputRange={[`'wght' 300`, `'wght' 600`]}>
                  Wyness
                </TextAnimateWeight>
              </TextAnimateMask>
            </h1>
          </div>

          <div className={styles.columnRight}>
            <TiltCard className={styles.imageContainer}>
              <AnimateScrollProgress inputRange={[1, 0.6]} outputRange={[0, 1]}>
                <Image
                  src="/images/sam-wyness-profile-image-01.png"
                  alt="Sam Wyness profile image(B+W)"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                  fill
                />
              </AnimateScrollProgress>
            </TiltCard>

            <p className={styles.description}>{intro}</p>
          </div>
        </Row>
      </Container>
    </section>
  );
}
