import { ScrollTextMask } from 'src/shared/components/core/ScrollTextMask';
import { Container } from 'src/shared/components/layout/Container';
import { Row } from 'src/shared/components/layout/Row';
import { HeroSection } from 'src/shared/components/sections/HeroSection';
import pageData from './page-data.json';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <HeroSection />

      {/* <section className={classNames(styles.section, styles.showreel)}>
        <Container className={styles.container}>
          <video></video>
        </Container>
      </section> */}

      <section className={styles.section}>
        <Container className={styles.container}>
          <div className={styles.topBorder}>
            <h2 className={styles.title}>
              <strong>Brand collaborations</strong>
            </h2>
            <Row>
              <ul>
                {pageData.brands.map(brand => (
                  <li key={brand}>
                    <ScrollTextMask>{brand}</ScrollTextMask>
                  </li>
                ))}
              </ul>
            </Row>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container className={styles.container}>
          <div className={styles.topBorder}>
            <h2 className={styles.title}>
              <strong>Experience</strong>
            </h2>
            <Row className={styles.experienceRow}>
              {pageData.experience.map((column, index) => (
                <div
                  key={`experience_${index}`}
                  className={styles.experienceColumn}>
                  {column.map((data, index2) => (
                    <p key={`role_${data.role}_${index2}`}>
                      <ScrollTextMask>
                        <strong>{data.role}</strong>
                        <br />
                      </ScrollTextMask>
                      {data.company && (
                        <ScrollTextMask>
                          {data.company}
                          <br />
                        </ScrollTextMask>
                      )}
                      <ScrollTextMask>
                        <span className="text-muted">{data.period}</span>
                      </ScrollTextMask>
                    </p>
                  ))}
                </div>
              ))}
            </Row>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container className={styles.container}>
          <div className={styles.topBorder}>
            <h2 className={styles.title}>
              <strong>Areas of expertise</strong>
            </h2>
            <Row>
              <ul>
                {pageData.expertise.map(expertise => (
                  <li key={expertise}>
                    <ScrollTextMask>{expertise}</ScrollTextMask>
                  </li>
                ))}
              </ul>
            </Row>
          </div>
        </Container>
      </section>

      {/* <StickyCursor /> */}
    </main>
  );
}
