import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

export const metadata: Metadata = {
  title: '利用規約',
  description:
    'Sized Furnitureの利用規約です。サービス内容、禁止事項、免責事項、著作権について定めています。',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  openGraph: {
    title: '利用規約 | Sized Furniture',
    description:
      'Sized Furnitureの利用規約です。',
    url: `${BASE_URL}/terms`,
    siteName: 'Sized Furniture',
    type: 'website',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
