import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/client';
import { transformKeys } from '@/lib/utils/transform';
import type { Product } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products_cache')
      .select('id, title, image_url, image_urls, price, original_currency, brand, width_cm, depth_cm, height_cm, is_available')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return transformKeys<Product>(data);
  } catch {
    return null;
  }
}

function buildSizeText(product: Product): string {
  const parts = [];
  if (product.widthCm) parts.push(`幅${product.widthCm}cm`);
  if (product.depthCm) parts.push(`奥行き${product.depthCm}cm`);
  if (product.heightCm) parts.push(`高さ${product.heightCm}cm`);
  return parts.join(' × ');
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: '商品が見つかりません',
      description: 'お探しの商品は見つかりませんでした。',
    };
  }

  const sizeText = buildSizeText(product);
  const description = [
    product.title,
    sizeText && `サイズ: ${sizeText}`,
    product.brand && `ブランド: ${product.brand}`,
    'サイズで家具を検索できるSized Furnitureで詳細をチェック。',
  ]
    .filter(Boolean)
    .join('。');

  const ogImageUrl = `${BASE_URL}/product/${id}/opengraph-image`;

  return {
    title: product.title,
    description,
    alternates: {
      canonical: `${BASE_URL}/product/${id}`,
    },
    openGraph: {
      title: product.title,
      description,
      url: `${BASE_URL}/product/${id}`,
      siteName: 'Sized Furniture',
      type: 'website',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
