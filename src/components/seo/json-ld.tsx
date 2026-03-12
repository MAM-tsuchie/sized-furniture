import type { Product } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sized Furniture',
    alternateName: 'サイズで探す家具検索',
    url: BASE_URL,
    description:
      'サイズで家具を検索できるサイト。幅・奥行き・高さを指定して、ぴったりの家具を見つけましょう。',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/search?widthMin={widthMin}&widthMax={widthMax}`,
      },
    },
    inLanguage: 'ja',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductJsonLd({ product }: { product: Product }) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl],
    url: `${BASE_URL}/product/${product.id}`,
    ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
    ...(product.material && { material: product.material }),
    ...(product.colorName && { color: product.colorName }),
    additionalProperty: [
      product.widthCm && {
        '@type': 'PropertyValue',
        name: '幅',
        value: product.widthCm,
        unitCode: 'CMT',
      },
      product.depthCm && {
        '@type': 'PropertyValue',
        name: '奥行き',
        value: product.depthCm,
        unitCode: 'CMT',
      },
      product.heightCm && {
        '@type': 'PropertyValue',
        name: '高さ',
        value: product.heightCm,
        unitCode: 'CMT',
      },
    ].filter(Boolean),
    offers: {
      '@type': 'Offer',
      url: product.affiliateUrl,
      priceCurrency: product.originalCurrency,
      price: product.price,
      availability: product.isAvailable
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
