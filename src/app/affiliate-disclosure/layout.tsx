import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: 'アフィリエイト開示',
  description:
    'Sized Furnitureのアフィリエイトプログラムに関する開示情報です。Amazon、楽天など参加プログラムと、アフィリエイトリンクについて説明します。',
  alternates: {
    canonical: `${BASE_URL}/affiliate-disclosure`,
  },
  openGraph: {
    title: 'アフィリエイト開示 | Sized Furniture',
    description:
      'Sized Furnitureのアフィリエイトプログラムに関する開示情報です。',
    url: `${BASE_URL}/affiliate-disclosure`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function AffiliateDisclosureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
