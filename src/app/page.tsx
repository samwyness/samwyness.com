import type { Metadata } from 'next';
import { Footer } from 'src/shared/components/layout/Footer/Footer';
import { AboutSection } from 'src/shared/components/sections/AboutSection';
import { HeroSection } from 'src/shared/components/sections/HeroSection';
import { HistorySection } from 'src/shared/components/sections/HistorySection';
import { SkillsetSection } from 'src/shared/components/sections/SkillsetSection';
import { WorkSection } from 'src/shared/components/sections/WorkSection';
import { SITE_URL, SOCIAL_LINKS } from 'src/shared/constants';
import pageData from './page-data.json';

const ROLE = 'Software Engineer & Product Designer';
const TITLE = `Sam Wyness ~ ${ROLE}`;
// Under ~155 chars so results don't cut it, and adds to the title rather
// than repeating it
const DESCRIPTION =
  'Designing and building web and mobile apps with Expo, React Native and TypeScript. Based on the Sunshine Coast, Australia. Available for hire.';

const HERO_PHOTO = {
  '@type': 'ImageObject',
  url: `${SITE_URL}/images/sam-wyness-profile-image.webp`,
  width: 1541,
  height: 2048,
};

// Structured data for name searches. primaryImageOfPage hints Google to use
// the hero photo as the result thumbnail
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      primaryImageOfPage: HERO_PHOTO,
      mainEntity: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Sam Wyness',
      url: SITE_URL,
      image: HERO_PHOTO,
      jobTitle: ROLE,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sunshine Coast',
        addressRegion: 'QLD',
        addressCountry: 'AU',
      },
      sameAs: Object.values(SOCIAL_LINKS),
    },
  ],
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  robots: { 'max-image-preview': 'large' },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Sam Wyness',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaped so the JSON can't close the script tag
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(STRUCTURED_DATA).replace(/</g, '\\u003c'),
        }}
      />
      <HeroSection role={pageData.role} />
      <main>
        <AboutSection copy={pageData.about} />
        <WorkSection items={pageData.work} />
        <SkillsetSection items={pageData.skills} />
        <HistorySection items={pageData.experience} />
      </main>
      <Footer buildYear={new Date().getFullYear()} />
    </>
  );
}
