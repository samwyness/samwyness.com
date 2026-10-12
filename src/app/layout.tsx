import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Funnel_Display, Reenie_Beanie } from 'next/font/google';
import './globals.css';
import classNames from 'classnames';
import { SITE_URL } from 'src/shared/constants';

const fontFamilyBase = Funnel_Display({
  variable: '--font-family-base',
  subsets: ['latin'],
  display: 'swap',
});

const fontFamilyHand = Reenie_Beanie({
  variable: '--font-family-hand',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Sam Wyness',
  description: 'Software Engineer & Product Designer',
};

// Without JS, framer's inline start states never animate out. Same reset as
// reduced motion in globals.css
const NO_SCRIPT_REST = `[data-motion-start] {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
  stroke-dasharray: none !important;
}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body
        className={classNames(
          fontFamilyBase.variable,
          fontFamilyHand.variable,
        )}>
        <noscript>
          <style>{NO_SCRIPT_REST}</style>
        </noscript>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
