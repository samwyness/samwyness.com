import type { Metadata } from 'next';
import { AboutSection } from 'src/shared/components/sections/AboutSection';
import { BrandExpertiseSection } from 'src/shared/components/sections/BrandExpertiseSection';
import { HeroSection } from 'src/shared/components/sections/HeroSection';
import { HistorySection } from 'src/shared/components/sections/HistorySection';
import { SkillsetSection } from 'src/shared/components/sections/SkillsetSection';
import { WorkSection } from 'src/shared/components/sections/WorkSection';
import pageData from './page-data.json';

export const metadata: Metadata = {
  metadataBase: new URL('https://samwyness.com'),
  title: 'Sam Wyness ~ Software Engineer & Creative Developer',
  description:
    "I'm Sam Wyness, a Software Engineer & Creative Developer from Sunshine Coast, Australia. I design and build high-quality applications with Expo, React Native, TypeScript, Reanimated, and Figma, help brands take their digital ideas from concept to final execution.",
  keywords:
    'Sam Wyness, Software Engineer, Creative Developer, Expo, React Native, TypeScript, Figma, Sunshine Coast, Australia',
  openGraph: {
    type: 'website',
    url: 'https://samwyness.com',
    title: 'Sam Wyness ~ Software Engineer & Creative Developer',
    description:
      "I'm Sam Wyness, a Software Engineer & Creative Developer from Sunshine Coast, Australia. I design and build high-quality applications with Expo, React Native, TypeScript, Reanimated, and Figma, help brands take their digital ideas from concept to final execution.",
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
    <main>
      <HeroSection role={pageData.role} />
      <AboutSection paragraphs={pageData.about} />
      <WorkSection items={pageData.work} />
      <SkillsetSection items={pageData.skills} />
      {/* <BrandExpertiseSection
        brands={pageData.brands}
        expertise={pageData.expertise}
      /> */}
      <HistorySection items={pageData.experience} />
    </main>
  );
}
