import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: 'サイズで家具を検索',
  description:
    '幅・奥行き・高さを指定して、ぴったりの家具を見つけましょう。Amazon、楽天など複数のECサイトから最適な家具を検索できます。',
  alternates: {
    canonical: `${BASE_URL}/search`,
  },
  openGraph: {
    title: 'サイズで家具を検索 | Sized Furniture',
    description:
      '幅・奥行き・高さを指定して、ぴったりの家具を見つけましょう。Amazon、楽天など複数のECサイトから最適な家具を検索できます。',
    url: `${BASE_URL}/search`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
