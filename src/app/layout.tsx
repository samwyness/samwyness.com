import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Funnel_Display, Reenie_Beanie } from 'next/font/google';
import { Footer } from 'src/shared/components/layout/Footer/Footer';

import { Cursor } from 'src/shared/components/layout/Cursor';
import './globals.css';
import classNames from 'classnames';

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
  metadataBase: new URL('https://samwyness.com'),
  title: 'Sam Wyness',
  description: 'Software Engineer & Product Designer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={classNames(
          fontFamilyBase.variable,
          fontFamilyHand.variable,
        )}>
        {children}
        <Footer />
        {/* <Cursor /> */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
