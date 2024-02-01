import { ScrollTextMask } from 'src/shared/components/ScrollTextMask/ScrollTextMask';
import { TextAnimateWeight } from 'src/shared/components/TextAnimateWeight';
import styles from './page.module.css';

function calculateAge(birthday: number) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday;
  var ageDate = new Date(ageDifMs); // milliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.sectionHero}>
        <div className={styles.horizon}>
          <div className={styles.aurora} />
          <div className={styles.sun} />
        </div>

        <div className="container">
          <div className="row">
            <h1 className={styles.heroTitle}>
              <ScrollTextMask
                inputRange={[0.3, 0.55]}
                outputRange={['100% 100%', '0% 100%']}>
                <TextAnimateWeight inputRange={[0.3, 0.7]}>
                  S<i>a</i>m
                </TextAnimateWeight>
              </ScrollTextMask>

              <br />

              <ScrollTextMask inputRange={[0.15, 0.4]}>
                <TextAnimateWeight
                  inputRange={[0.15, 0.475]}
                  outputRange={[`'wght' 300`, `'wght' 600`]}>
                  Wyness
                </TextAnimateWeight>
              </ScrollTextMask>
            </h1>
            <p className={styles.heroDescription}>
              I help brands design and build products from idea to final
              execution. Over the years I&apos;ve worn many hats, and worked on
              a wide range of projects across multiple platforms.
              <br />
              <br />
              Currently working at{' '}
              <i>
                <a href="https://www.district-technologies.com/">
                  District Technologies.
                </a>
              </i>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
