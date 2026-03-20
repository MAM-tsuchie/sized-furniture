import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description:
    'Sized Furnitureのプライバシーポリシーです。収集する情報、利用目的、Cookie、第三者への情報提供について説明します。',
  alternates: {
    canonical: `${BASE_URL}/privacy`,
  },
  openGraph: {
    title: 'プライバシーポリシー | Sized Furniture',
    description:
      'Sized Furnitureのプライバシーポリシーです。',
    url: `${BASE_URL}/privacy`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
