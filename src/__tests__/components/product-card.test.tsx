import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/product/product-card';
import type { Product } from '@/types';

// I18nとRegionのモック
vi.mock('@/lib/i18n/context', () => ({
  useTranslation: () => ({
    t: {
      product: {
        viewDetails: '詳細を見る',
        outOfStock: '在庫なし',
        size: 'サイズ',
        color: 'カラー',
      },
    },
    language: 'ja',
  }),
}));

vi.mock('@/lib/region/context', () => ({
  useRegion: () => ({
    regionCode: 'jp',
    currency: 'JPY' as const,
    sizeUnit: 'cm' as const,
  }),
}));

const mockProduct: Product = {
  id: '1',
  externalId: 'B08XXXXX1',
  source: 'amazon',
  regionId: 'jp',
  title: 'テストデスク オーク材 幅120cm',
  price: 29800,
  originalCurrency: 'JPY',
  priceLocal: 29800,
  imageUrl: 'https://placehold.co/400x400',
  imageUrls: [],
  widthCm: 120,
  depthCm: 60,
  heightCm: 72,
  weightKg: 25,
  categoryId: '1',
  colorGroupId: 'cg1',
  woodTypeId: 'wt1',
  colorName: 'オーク',
  brand: 'TEST',
  material: 'オーク材',
  features: [],
  affiliateUrl: 'https://amazon.co.jp/dp/B08XXXXX1',
  originalUrl: 'https://amazon.co.jp/dp/B08XXXXX1',
  isAvailable: true,
  rawData: {},
  fetchedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ProductCard コンポーネント', () => {
  it('商品タイトルを表示する', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it('価格を表示する', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/29,800/)).toBeInTheDocument();
  });

  it('サイズ情報を表示する', () => {
    render(<ProductCard product={mockProduct} />);
    // W×D×H形式でサイズが表示される
    expect(screen.getByText(/W120/)).toBeInTheDocument();
  });

  it('在庫あり商品の場合、詳細リンクを表示する', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('詳細を見る')).toBeInTheDocument();
  });

  it('在庫なし商品の場合、在庫なしを表示する', () => {
    const outOfStockProduct = { ...mockProduct, isAvailable: false };
    render(<ProductCard product={outOfStockProduct} />);
    // 複数の「在庫なし」テキストがある場合は getAllByText を使用
    const elements = screen.getAllByText('在庫なし');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('画像を表示する', () => {
    render(<ProductCard product={mockProduct} />);
    const img = screen.getByAltText(mockProduct.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('placehold.co'));
  });
});
