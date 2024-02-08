import classNames from 'classnames';
import type { Metadata } from 'next';
import { HoverImageLink } from 'src/shared/components/core/HoverImageLink';
import { TextAnimateMask } from 'src/shared/components/core/TextAnimateMask';
import { Container } from 'src/shared/components/layout/Container';
import { Row } from 'src/shared/components/layout/Row';
import { HeroSection } from 'src/shared/components/sections/HeroSection';
import pageData from './page-data.json';
import styles from './page.module.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://samwyness.com'),
  title: 'Sam Wyness ~ Software Engineer & Creative Developer',
  description:
    'Software Engineer from Australia based on the Sunshine Coast. I help brands take their digital ideas from concept to final execution.',
  keywords: 'Sam Wyness, Software Engineer, Creative Developer, Sunshine Coast',
  openGraph: {
    type: 'website',
    url: 'https://samwyness.com',
    title: 'Sam Wyness ~ Software Engineer & Creative Developer',
    description:
      'Software Engineer from Australia based on the Sunshine Coast. I help brands take their digital ideas from concept to final execution.',
    siteName: 'Sam Wyness',
    images: [
      {
        url: 'https://samwyness.com/images/og_image.png',
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <HeroSection intro={pageData.intro} />

        <section className={classNames(styles.section, styles.work)}>
          <Container className={styles.container}>
            <h2 className={styles.title}>
              <strong>Featured ({pageData.work.length})</strong>
            </h2>

            {pageData.work.map(item => (
              <HoverImageLink
                key={item.title}
                link={item.link}
                title={item.title}
                completed={item.completed}
                tags={item.tags}
                image={item.image}
              />
            ))}
          </Container>
        </section>

        <section className={styles.section}>
          <Container className={styles.container}>
            <div className={styles.borderSection}>
              <Row className={styles.row}>
                <div className={styles.column}>
                  <h2 className={styles.title}>
                    <strong>Brand collaborations</strong>
                  </h2>
                  <Row>
                    <ul>
                      {pageData.brands.map(brand => (
                        <li key={brand}>
                          <TextAnimateMask>{brand}</TextAnimateMask>
                        </li>
                      ))}
                    </ul>
                  </Row>
                </div>

                <div className={styles.column}>
                  <h2 className={styles.title}>
                    <strong>Areas of expertise</strong>
                  </h2>
                  <Row>
                    <ul>
                      {pageData.expertise.map(expertise => (
                        <li key={expertise}>
                          <TextAnimateMask>{expertise}</TextAnimateMask>
                        </li>
                      ))}
                    </ul>
                  </Row>
                </div>
              </Row>
            </div>
          </Container>
        </section>

        <section className={styles.section}>
          <Container className={styles.container}>
            <h2 className={styles.title}>
              <strong>History</strong>
            </h2>
            <Row className={styles.row}>
              {pageData.experience.map((column, index) => (
                <div key={`experience_${index}`} className={styles.column}>
                  {column.map((data, index2) => (
                    <p key={`role_${data.role}_${index2}`}>
                      <TextAnimateMask>
                        <strong>{data.role}</strong>
                        <br />
                      </TextAnimateMask>
                      {data.company && (
                        <TextAnimateMask>
                          {data.company}
                          <br />
                        </TextAnimateMask>
                      )}
                      <TextAnimateMask>
                        <span className="text-muted">{data.period}</span>
                      </TextAnimateMask>
                    </p>
                  ))}
                </div>
              ))}
            </Row>
          </Container>
        </section>
      </main>
    </>
  );
}
