import Image from 'next/image';
import { AnimateScrollProgress } from '../../core/AnimateScrollProgress';
import { ScrollTextMask } from '../../core/ScrollTextMask';
import { TextAnimateWeight } from '../../core/TextAnimateWeight';
import { Container } from '../../layout/Container';
import { Row } from '../../layout/Row';
import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <section className={styles.sectionHero}>
      {/* <Horizon positionX="30vw" positionY="70vh" /> */}
      {/* <Horizon /> */}

      <Container className={styles.container}>
        <Row className={styles.row}>
          <div className={styles.columnLeft}>
            <h1 className={styles.title}>
              <ScrollTextMask
                inputRange={[0.3, 0.7]}
                outputRange={['100%', '0%']}>
                <TextAnimateWeight inputRange={[0.4, 0.65]}>
                  Sam
                </TextAnimateWeight>
              </ScrollTextMask>

              <br />

              <ScrollTextMask inputRange={[0.1, 0.5]}>
                <TextAnimateWeight
                  inputRange={[0.2, 0.45]}
                  outputRange={[`'wght' 300`, `'wght' 600`]}>
                  Wyness
                </TextAnimateWeight>
              </ScrollTextMask>
            </h1>
          </div>

          <div className={styles.columnRight}>
            <div className={styles.imageContainer}>
              <Image
                className={styles.imageUnderlay}
                src="/images/sam-wyness-profile-image-03.png"
                alt="Sam Wyness profile image"
                sizes="(max-width: 768px) 100vw, 420px"
                priority
                fill
              />
              <AnimateScrollProgress
                inputRange={[1, 0.75]}
                className={styles.imageContainer}>
                <Image
                  src="/images/sam-wyness-profile-image-05.png"
                  alt="Sam Wyness profile image( B+W)"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                  fill
                />
              </AnimateScrollProgress>
            </div>

            <p className={styles.description}>
              I help brands design and build products from idea to final
              execution. Over the years I&apos;ve worn many hats, and worked on
              a wide range of projects across multiple platforms.
            </p>
          </div>
        </Row>
      </Container>
    </section>
  );
}
