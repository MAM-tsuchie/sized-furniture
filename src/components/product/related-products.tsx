'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import { formatPrice } from '@/lib/utils/currency';
import { formatProductSize } from '@/lib/utils/size';
import type { Product } from '@/types';

interface RelatedProductsProps {
  currentProductId: string;
  categoryId?: string;
  colorGroupId?: string;
  widthCm?: number;
  limit?: number;
}

export function RelatedProducts({
  currentProductId,
  categoryId,
  colorGroupId,
  widthCm,
  limit = 4,
}: RelatedProductsProps) {
  const { t, language } = useTranslation();
  const { regionCode, currency, sizeUnit } = useRegion();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);

      const urlParams = new URLSearchParams();
      urlParams.set('region', regionCode);
      urlParams.set('limit', String(limit + 1)); // 自分自身を除外するため+1

      // カテゴリで絞り込み
      if (categoryId) {
        urlParams.set('categoryId', categoryId);
      }

      // カラーで絞り込み（同系色）
      if (colorGroupId) {
        urlParams.set('colorGroupId', colorGroupId);
      }

      // サイズが近いものを優先（±20%の範囲）
      if (widthCm) {
        urlParams.set('widthMin', String(Math.floor(widthCm * 0.8)));
        urlParams.set('widthMax', String(Math.ceil(widthCm * 1.2)));
      }

      try {
        const response = await fetch(`/api/search?${urlParams.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          // 自分自身を除外
          const filtered = (data.products || [])
            .filter((p: Product) => p.id !== currentProductId)
            .slice(0, limit);
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, categoryId, colorGroupId, widthCm, regionCode, limit]);

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">
          {language === 'ja' ? '関連商品' : 'Related Products'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-slate-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6">
        {language === 'ja' ? '関連商品' : 'Related Products'}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            
            <h3 className="text-sm text-slate-700 line-clamp-2 group-hover:text-blue-600 mb-1">
              {product.title}
            </h3>
            
            <p className="text-sm font-semibold text-slate-900">
              {product.price ? formatPrice(product.price, currency) : '-'}
            </p>
            
            {(product.widthCm || product.depthCm || product.heightCm) && (
              <p className="text-xs text-slate-500 mt-1">
                {formatProductSize(product.widthCm, product.depthCm, product.heightCm, sizeUnit)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
