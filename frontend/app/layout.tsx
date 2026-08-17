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
  title: 'Quiz Builder App',
  description: 'Build and share quizzes with others',

  openGraph: {
    images: '/og.png',
    type: 'website',
    title: 'Quiz Builder App',
    description: 'Build and share quizzes with others',
    siteName: 'Quiz Builder App',
    url: 'https://quiz-builder-app.vercel.app',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Quiz Builder App',
    description: 'Build and share quizzes with others',
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
          {children}
        </TanStackProvider>
      </body>
    </html>
  );
}
