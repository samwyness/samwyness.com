import type { Metadata } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import { Footer } from 'src/shared/components/layout/Footer/Footer';
import { Header } from 'src/shared/components/layout/Header/Header';

import './globals.css';

const hkGrotesk = Hanken_Grotesk({
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
      <body className={hkGrotesk.variable}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
