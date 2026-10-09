import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Funnel_Display } from 'next/font/google';
import { Footer } from 'src/shared/components/layout/Footer/Footer';
import { Header } from 'src/shared/components/layout/Header/Header';

import { Cursor } from 'src/shared/components/layout/Cursor';
import './globals.css';

const funnelDisplay = Funnel_Display({
  variable: '--font-family-base',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sam Wyness',
  description: 'Software Engineer & Creative Developer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={funnelDisplay.variable}>
        <Header />
        {children}
        <Footer />
        {/* <Cursor /> */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
