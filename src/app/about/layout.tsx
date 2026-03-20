import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: 'このサイトについて',
  description:
    'Sized Furnitureは、サイズで家具を検索できるサービスです。幅・奥行き・高さを指定して、ぴったりの家具を見つけられます。',
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
  openGraph: {
    title: 'このサイトについて | Sized Furniture',
    description:
      'Sized Furnitureは、サイズで家具を検索できるサービスです。',
    url: `${BASE_URL}/about`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
