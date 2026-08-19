import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import TanStackProvider from '@/providers/TanStackProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Підготовка до НМТ, тестування та тренування',
  description:
    'Тренуйтеся в підготовці до НМТ. Підготуємо вас до екзамену. Підготовка до НМТ, тестування та тренування.',

  openGraph: {
    images: '/og.png',
    type: 'website',
    title: 'Підготовка до НМТ, тестування та тренування',
    description:
      'Тренуйтеся в підготовці до НМТ. Підготуємо вас до екзамену. Підготовка до НМТ, тестування та тренування.',
    siteName: 'Підготовка до НМТ',
    url: 'https://quiz-builder-app.vercel.app',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Підготовка до НМТ, тестування та тренування',
    description:
      'Тренуйтеся в підготовці до НМТ. Підготуємо вас до екзамену. Підготовка до НМТ, тестування та тренування.',
    images: '/og.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <TanStackProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </TanStackProvider>
      </body>
    </html>
  );
}
