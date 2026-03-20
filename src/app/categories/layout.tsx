import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: '家具カテゴリ一覧',
  description:
    'デスク、椅子、収納、ベッド、ソファなど、カテゴリから家具を探せます。サイズで絞り込んで、ぴったりの家具を見つけましょう。',
  alternates: {
    canonical: `${BASE_URL}/categories`,
  },
  openGraph: {
    title: '家具カテゴリ一覧 | Sized Furniture',
    description:
      'デスク、椅子、収納、ベッド、ソファなど、カテゴリから家具を探せます。',
    url: `${BASE_URL}/categories`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
