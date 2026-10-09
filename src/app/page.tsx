import type { Metadata } from 'next';
import { AboutSection } from 'src/shared/components/sections/AboutSection';
import { BrandExpertiseSection } from 'src/shared/components/sections/BrandExpertiseSection';
import { HeroSection } from 'src/shared/components/sections/HeroSection';
import { HistorySection } from 'src/shared/components/sections/HistorySection';
import { SkillsetSection } from 'src/shared/components/sections/SkillsetSection';
import { WorkSection } from 'src/shared/components/sections/WorkSection';
import pageData from './page-data.json';

export const metadata: Metadata = {
  title: 'Sam Wyness ~ Software Engineer & Product Designer',
  description:
    "I'm Sam Wyness, a Software Engineer & Product Designer from Sunshine Coast, Australia. I build high-quality web and mobile applications with Expo, React Native, TypeScript, Reanimated, and Figma.",
  keywords:
    'Sam Wyness, Software Engineer, Product Designer, Expo, React Native, TypeScript, Figma, Sunshine Coast, Australia',
  openGraph: {
    type: 'website',
    url: 'https://samwyness.com',
    title: 'Sam Wyness ~ Software Engineer & Product Designer',
    description:
      "I'm Sam Wyness, a Software Engineer & Product Designer from Sunshine Coast, Australia. I build high-quality web and mobile applications with Expo, React Native, TypeScript, Reanimated, and Figma.",
    siteName: 'Sam Wyness',
  },
  twitter: {
    card: 'summary_large_image',
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
