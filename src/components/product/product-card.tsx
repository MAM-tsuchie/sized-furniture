'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import { formatPrice } from '@/lib/utils/currency';
import { formatProductSize } from '@/lib/utils/size';
import { cn } from '@/lib/utils/cn';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const { t } = useTranslation();
  const { currency, sizeUnit } = useRegion();
  
  const {
    title,
    price,
    imageUrl,
    widthCm,
    depthCm,
    heightCm,
    brand,
    colorName,
    affiliateUrl,
    isAvailable,
  } = product;

  const displayPrice = price ? formatPrice(price, currency) : '-';
  const displaySize = formatProductSize(widthCm, depthCm, heightCm, sizeUnit);

  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-shadow', className)}>
      {/* 商品画像 */}
      <div className="relative aspect-square bg-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            No Image
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-medium">{t.product.outOfStock}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* ブランド */}
        {brand && (
          <p className="text-xs text-slate-500 mb-1">{brand}</p>
        )}

        {/* タイトル */}
        <h3 className="font-medium text-sm line-clamp-2 mb-2" title={title}>
          {title}
        </h3>

        {/* 価格 */}
        <p className="text-lg font-bold text-slate-900 mb-2">
          {displayPrice}
        </p>

        {/* サイズ */}
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
          <span className="font-medium">{t.product.size}:</span>
          <span>{displaySize}</span>
        </div>

        {/* カラー */}
        {colorName && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="font-medium">{t.product.color}:</span>
            <span>{colorName}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {isAvailable ? (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            {t.product.viewDetails}
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        ) : (
          <Button variant="secondary" className="w-full" disabled>
            {t.product.outOfStock}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
