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

// Structured data for name searches
const PERSON = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sam Wyness',
  url: SITE_URL,
  image: `${SITE_URL}/images/sam-wyness-profile-image.webp`,
  jobTitle: ROLE,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Sunshine Coast',
    addressRegion: 'QLD',
    addressCountry: 'AU',
  },
  sameAs: Object.values(SOCIAL_LINKS),
};

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
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
          __html: JSON.stringify(PERSON).replace(/</g, '\\u003c'),
        }}
      />
      <HeroSection role={pageData.role} />
      <main>
        <AboutSection copy={pageData.about} />
        <WorkSection items={pageData.work} />
        <SkillsetSection items={pageData.skills} />
        <HistorySection items={pageData.experience} />
      </main>
      <Footer />
    </>
  );
}
