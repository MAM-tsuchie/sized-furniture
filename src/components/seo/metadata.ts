import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

interface GenerateMetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * ページ用メタデータを生成
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
  noIndex = false,
}: GenerateMetadataOptions): Metadata {
  const url = `${BASE_URL}${path}`;
  const fullTitle = title.includes('Sized Furniture') ? title : `${title} | Sized Furniture`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Sized Furniture',
      type: 'website',
      locale: 'ja_JP',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/**
 * 商品ページ用メタデータを生成
 */
export function generateProductMetadata(product: {
  title: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  id: string;
}): Metadata {
  const description = product.description || 
    `${product.title}の商品情報。サイズで家具を検索できるSized Furnitureで詳細をチェック。`;
  
  return {
    title: `${product.title} | Sized Furniture`,
    description,
    alternates: {
      canonical: `${BASE_URL}/product/${product.id}`,
    },
    openGraph: {
      title: product.title,
      description,
      url: `${BASE_URL}/product/${product.id}`,
      siteName: 'Sized Furniture',
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

/**
 * カテゴリページ用メタデータを生成
 */
export function generateCategoryMetadata(category: {
  name: string;
  slug: string;
  description?: string;
}): Metadata {
  const description = category.description || 
    `${category.name}をサイズで検索。幅・奥行き・高さを指定して、ぴったりの家具を見つけましょう。`;

  return {
    title: `${category.name} | サイズで探す家具 - Sized Furniture`,
    description,
    alternates: {
      canonical: `${BASE_URL}/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Sized Furniture`,
      description,
      url: `${BASE_URL}/category/${category.slug}`,
      siteName: 'Sized Furniture',
      type: 'website',
    },
  };
}
