import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/gdpr/cookie-consent';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { WebSiteJsonLd } from '@/components/seo/json-ld';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Sized Furniture - サイズで探す家具検索',
    template: '%s | Sized Furniture',
  },
  description:
    'サイズで家具を検索できるサイト。幅・奥行き・高さを指定して、ぴったりの家具を見つけましょう。Amazon、楽天など複数のECサイトから最適な家具を提案します。',
  keywords: ['家具', 'サイズ', '検索', 'デスク', '椅子', '収納', 'ベッド', 'ソファ', 'インテリア'],
  authors: [{ name: 'Sized Furniture' }],
  creator: 'Sized Furniture',
  openGraph: {
    title: 'Sized Furniture - サイズで探す家具検索',
    description: 'サイズで家具を検索できるサイト。ぴったりの家具を見つけましょう。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'Sized Furniture',
    images: [{ url: `${BASE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'Sized Furniture - サイズで探す家具検索' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sized Furniture - サイズで探す家具検索',
    description: 'サイズで家具を検索できるサイト',
    images: [`${BASE_URL}/opengraph-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION && {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <WebSiteJsonLd />
      </head>
      <body className={inter.className}>
        <GoogleAnalytics />
        <Providers>
          <div className="flex min-h-screen flex-col bg-[#0c0c0c]">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
