'use client';

import { ProductCard } from './product-card';
import { useTranslation } from '@/lib/i18n/context';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-slate-500 text-lg">{t.search.noResultsMessage}</p>
        <p className="text-slate-400 text-sm mt-2">
          {t.search.tryDifferent}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
