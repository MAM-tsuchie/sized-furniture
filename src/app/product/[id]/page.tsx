'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronRight, ExternalLink, ChevronLeft, ChevronRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RelatedProducts } from '@/components/product/related-products';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import { formatPrice } from '@/lib/utils/currency';
import { formatProductSize } from '@/lib/utils/size';
import type { Product } from '@/types';

// モックデータ（実際はAPIから取得）
const MOCK_PRODUCT: Product = {
  id: '1',
  externalId: 'B08XXXXX1',
  source: 'amazon',
  regionId: 'jp',
  title: 'シンプルデスク オーク材 幅120cm 奥行60cm 高さ72cm 天然木 ワークデスク',
  price: 29800,
  originalCurrency: 'JPY',
  priceLocal: 29800,
  imageUrl: 'https://placehold.co/600x600/DEB887/333333?text=Oak+Desk',
  imageUrls: [
    'https://placehold.co/600x600/DEB887/333333?text=Front',
    'https://placehold.co/600x600/DEB887/333333?text=Side',
    'https://placehold.co/600x600/DEB887/333333?text=Detail',
  ],
  widthCm: 120,
  depthCm: 60,
  heightCm: 72,
  weightKg: 25,
  categoryId: 'desks',
  colorGroupId: 'cg3',
  woodTypeId: 'wt1',
  colorName: 'オーク',
  brand: 'EXAMPLE FURNITURE',
  material: 'オーク無垢材、スチール脚',
  features: [
    '天然オーク材使用',
    '広々とした作業スペース',
    '安定感のあるスチール脚',
    '組み立て簡単',
    '耐荷重：50kg',
  ],
  affiliateUrl: 'https://amazon.co.jp/dp/B08XXXXX1',
  originalUrl: 'https://amazon.co.jp/dp/B08XXXXX1',
  isAvailable: true,
  rawData: {},
  fetchedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useTranslation();
  const { currency, sizeUnit } = useRegion();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          // モックデータを使用（開発用）
          setProduct(MOCK_PRODUCT);
        } else {
          const data = await response.json();
          setProduct(data.product);
        }
      } catch (err) {
        console.error('Fetch product error:', err);
        setError('Failed to load product');
        // モックデータを使用（開発用）
        setProduct(MOCK_PRODUCT);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-slate-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          {language === 'ja' ? '商品が見つかりません' : 'Product not found'}
        </h1>
        <Button onClick={() => router.push('/search')}>
          {language === 'ja' ? '検索に戻る' : 'Back to search'}
        </Button>
      </div>
    );
  }

  const images = product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];
  const displaySize = formatProductSize(product.widthCm, product.depthCm, product.heightCm, sizeUnit);
  const displayPrice = product.price ? formatPrice(product.price, currency) : '-';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* パンくずリスト */}
      <nav className="flex items-center text-sm text-slate-500 mb-6">
        <button onClick={() => router.push('/')} className="hover:text-slate-700">
          {language === 'ja' ? 'ホーム' : 'Home'}
        </button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <button onClick={() => router.push('/search')} className="hover:text-slate-700">
          {t.common.search}
        </button>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-slate-900 truncate max-w-xs">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 画像セクション */}
        <div className="space-y-4">
          {/* メイン画像 */}
          <div className="relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
            {images[selectedImageIndex] && (
              <Image
                src={images[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-contain p-4"
                priority
              />
            )}
            
            {/* 画像ナビゲーション */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow hover:bg-white"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* サムネイル */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                    index === selectedImageIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 商品情報セクション */}
        <div className="space-y-6">
          {/* ブランド */}
          {product.brand && (
            <p className="text-sm text-slate-500">{product.brand}</p>
          )}

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-slate-900">{product.title}</h1>

          {/* 価格 */}
          <p className="text-3xl font-bold text-slate-900">{displayPrice}</p>

          {/* サイズ情報 */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-slate-900 mb-3">{t.product.size}</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-slate-500">{t.search.width}</p>
                  <p className="text-lg font-medium">{product.widthCm ? `${product.widthCm}${sizeUnit}` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t.search.depth}</p>
                  <p className="text-lg font-medium">{product.depthCm ? `${product.depthCm}${sizeUnit}` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{t.search.height}</p>
                  <p className="text-lg font-medium">{product.heightCm ? `${product.heightCm}${sizeUnit}` : '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 詳細情報 */}
          <div className="space-y-3">
            {product.colorName && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{t.product.color}</span>
                <span className="font-medium">{product.colorName}</span>
              </div>
            )}
            {product.material && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{t.product.material}</span>
                <span className="font-medium">{product.material}</span>
              </div>
            )}
            {product.weightKg && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">{language === 'ja' ? '重量' : 'Weight'}</span>
                <span className="font-medium">{product.weightKg}kg</span>
              </div>
            )}
          </div>

          {/* 特徴 */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                {language === 'ja' ? '特徴' : 'Features'}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 購入ボタン */}
          <div className="space-y-3 pt-4">
            {product.isAvailable ? (
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-12 px-6 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {t.product.buyNow}
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            ) : (
              <Button variant="secondary" className="w-full h-12" disabled>
                {t.product.outOfStock}
              </Button>
            )}
            <p className="text-xs text-slate-500 text-center">
              {t.product.affiliateNotice}
            </p>
          </div>
        </div>
      </div>

      {/* 関連商品 */}
      <RelatedProducts
        currentProductId={product.id}
        categoryId={product.categoryId ?? undefined}
        colorGroupId={product.colorGroupId ?? undefined}
        widthCm={product.widthCm ?? undefined}
      />
    </div>
  );
}
