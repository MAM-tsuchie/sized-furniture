'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ruler, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SizeInput } from '@/components/search/size-input';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';

// カテゴリデータ（仮）
const FEATURED_CATEGORIES = [
  { slug: 'desks', icon: '🖥️', nameJa: 'デスク', nameEn: 'Desks' },
  { slug: 'dining-tables', icon: '🍽️', nameJa: 'ダイニングテーブル', nameEn: 'Dining Tables' },
  { slug: 'office-chairs', icon: '🪑', nameJa: 'オフィスチェア', nameEn: 'Office Chairs' },
  { slug: 'bookcases-shelves', icon: '📚', nameJa: '本棚・シェルフ', nameEn: 'Bookcases' },
  { slug: 'tv-stands', icon: '📺', nameJa: 'テレビ台', nameEn: 'TV Stands' },
  { slug: 'bed-frames', icon: '🛏️', nameJa: 'ベッド', nameEn: 'Beds' },
];

export default function HomePage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { sizeUnit } = useRegion();

  // クイック検索用のサイズ
  const [widthMin, setWidthMin] = useState<number | undefined>();
  const [widthMax, setWidthMax] = useState<number | undefined>();
  const [depthMin, setDepthMin] = useState<number | undefined>();
  const [depthMax, setDepthMax] = useState<number | undefined>();
  const [heightMin, setHeightMin] = useState<number | undefined>();
  const [heightMax, setHeightMax] = useState<number | undefined>();

  const handleQuickSearch = () => {
    const params = new URLSearchParams();
    if (widthMin) params.set('widthMin', String(widthMin));
    if (widthMax) params.set('widthMax', String(widthMax));
    if (depthMin) params.set('depthMin', String(depthMin));
    if (depthMax) params.set('depthMax', String(depthMax));
    if (heightMin) params.set('heightMin', String(heightMin));
    if (heightMax) params.set('heightMax', String(heightMax));
    
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (slug: string) => {
    router.push(`/category/${slug}`);
  };

  return (
    <div className="flex flex-col">
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-2xl">
                <Ruler className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              {t.search.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8">
              {t.search.subtitle}
            </p>

            {/* クイックサイズ検索 */}
            <Card className="max-w-3xl mx-auto">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <SizeInput
                    label={t.search.width}
                    minValue={widthMin}
                    maxValue={widthMax}
                    onMinChange={setWidthMin}
                    onMaxChange={setWidthMax}
                    unit={sizeUnit}
                    minPlaceholder={t.search.min}
                    maxPlaceholder={t.search.max}
                  />
                  <SizeInput
                    label={t.search.depth}
                    minValue={depthMin}
                    maxValue={depthMax}
                    onMinChange={setDepthMin}
                    onMaxChange={setDepthMax}
                    unit={sizeUnit}
                    minPlaceholder={t.search.min}
                    maxPlaceholder={t.search.max}
                  />
                  <SizeInput
                    label={t.search.height}
                    minValue={heightMin}
                    maxValue={heightMax}
                    onMinChange={setHeightMin}
                    onMaxChange={setHeightMax}
                    unit={sizeUnit}
                    minPlaceholder={t.search.min}
                    maxPlaceholder={t.search.max}
                  />
                </div>
                <Button
                  onClick={handleQuickSearch}
                  variant="primary"
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <Search className="w-5 h-5 mr-2" />
                  {t.search.searchButton}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* カテゴリセクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-8">
            {t.category.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_CATEGORIES.map((category) => (
              <button
                key={category.slug}
                onClick={() => handleCategoryClick(category.slug)}
                className="flex flex-col items-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="text-4xl mb-3">{category.icon}</span>
                <span className="text-sm font-medium text-slate-700">
                  {language === 'ja' ? category.nameJa : category.nameEn}
                </span>
              </button>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => router.push('/categories')}
            >
              {t.common.showMore}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Ruler className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {language === 'ja' ? 'サイズで検索' : 'Search by Size'}
              </h3>
              <p className="text-slate-600">
                {language === 'ja'
                  ? '幅・奥行き・高さを指定して、ぴったりの家具を見つけられます'
                  : 'Find furniture that fits perfectly by specifying dimensions'}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-2xl">🌲</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {language === 'ja' ? '木材で絞り込み' : 'Filter by Wood Type'}
              </h3>
              <p className="text-slate-600">
                {language === 'ja'
                  ? 'ウォールナット、オークなど木材の種類で絞り込めます'
                  : 'Filter by walnut, oak, and other wood types'}
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {language === 'ja' ? '複数のショップを比較' : 'Compare Multiple Shops'}
              </h3>
              <p className="text-slate-600">
                {language === 'ja'
                  ? 'Amazon、楽天など複数のECサイトから商品を探せます'
                  : 'Browse products from Amazon, Wayfair and more'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
