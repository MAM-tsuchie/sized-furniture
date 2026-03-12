'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import { woodColorGroups, solidColorGroups } from '@/lib/colors/data';

const BG_IMAGES = [2, 3, 4];

const getInitialBgImage = () => BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)];

const CATEGORIES = [
  { slug: 'desks', nameJa: 'デスク', nameEn: 'Desk' },
  { slug: 'dining-tables', nameJa: 'ダイニングテーブル', nameEn: 'Dining Table' },
  { slug: 'side-tables', nameJa: 'サイドテーブル', nameEn: 'Side Table' },
  { slug: 'coffee-tables', nameJa: 'ローテーブル', nameEn: 'Coffee Table' },
  { slug: 'office-chairs', nameJa: 'オフィスチェア', nameEn: 'Office Chair' },
  { slug: 'dining-chairs', nameJa: 'ダイニングチェア', nameEn: 'Dining Chair' },
  { slug: 'lounge-chairs', nameJa: 'ラウンジチェア', nameEn: 'Lounge Chair' },
  { slug: 'bookcases-shelves', nameJa: '本棚・シェルフ', nameEn: 'Bookcase' },
  { slug: 'tv-stands', nameJa: 'テレビ台', nameEn: 'TV Stand' },
  { slug: 'cabinets', nameJa: 'キャビネット', nameEn: 'Cabinet' },
  { slug: 'chests', nameJa: 'チェスト', nameEn: 'Chest' },
  { slug: 'bed-frames', nameJa: 'ベッドフレーム', nameEn: 'Bed Frame' },
  { slug: 'mattresses', nameJa: 'マットレス', nameEn: 'Mattress' },
  { slug: 'sofas', nameJa: 'ソファ', nameEn: 'Sofa' },
  { slug: 'sofa-beds', nameJa: 'ソファベッド', nameEn: 'Sofa Bed' },
];

const COLORS = [
  { slug: '', nameJa: '指定なし', nameEn: 'Any color' },
  ...woodColorGroups.map(c => ({ slug: c.slug, nameJa: c.name, nameEn: c.nameEn })),
  ...solidColorGroups.map(c => ({ slug: c.slug, nameJa: c.name, nameEn: c.nameEn })),
];

export function HeroSearch() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { sizeUnit } = useRegion();

  const [widthMin, setWidthMin] = useState<string>('');
  const [widthMax, setWidthMax] = useState<string>('');
  const [depthMin, setDepthMin] = useState<string>('');
  const [depthMax, setDepthMax] = useState<string>('');
  const [heightMin, setHeightMin] = useState<string>('');
  const [heightMax, setHeightMax] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [category, setCategory] = useState<string>('desks');

  const [bgImage] = useState(getInitialBgImage);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (widthMin) params.set('widthMin', widthMin);
    if (widthMax) params.set('widthMax', widthMax);
    if (depthMin) params.set('depthMin', depthMin);
    if (depthMax) params.set('depthMax', depthMax);
    if (heightMin) params.set('heightMin', heightMin);
    if (heightMax) params.set('heightMax', heightMax);
    if (color) params.set('color', color);
    params.set('category', category);
    
    router.push(`/search?${params.toString()}`);
  };

  const unitLabel = sizeUnit === 'cm' ? 'cm' : 'in';
  const isJa = language === 'ja';

  const headlines: Record<string, { line1: string; line2: string }> = {
    ja: { line1: '置きたい場所にピッタリの', line2: '家具を検索' },
    en: { line1: 'Find furniture that fits', line2: 'your space perfectly' },
    de: { line1: 'Finden Sie Möbel, die perfekt', line2: 'in Ihren Raum passen' },
    fr: { line1: 'Trouvez le meuble parfait', line2: 'pour votre espace' },
  };
  const headline = headlines[language] || headlines.en;

  return (
    <div className="min-h-screen bg-[#0c0c0c] relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(/bg/${bgImage}.png)` }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#0c0c0c]/60 via-[#0c0c0c]/40 to-[#0c0c0c]" />
      
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto">
            
            <div className="text-center mb-12">
              <h1 className="text-2xl md:text-3xl font-light text-white tracking-wide leading-relaxed">
                {headline.line1}
                <br />
                <span className="text-[#c9a962]">{headline.line2}</span>
              </h1>
              <div className="w-12 h-px bg-[#c9a962] mx-auto mt-6" />
            </div>

            <div className="bg-[#141414] border border-neutral-800 p-8 md:p-10 space-y-8">
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400 text-sm tracking-widest uppercase w-20">
                    {t.search.width}
                  </span>
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      type="number"
                      value={widthMin}
                      onChange={(e) => setWidthMin(e.target.value)}
                      placeholder="—"
                      className="w-20 text-center bg-transparent border-neutral-700 text-white placeholder:text-neutral-600 focus:border-[#c9a962]"
                    />
                    <span className="text-neutral-600">–</span>
                    <Input
                      type="number"
                      value={widthMax}
                      onChange={(e) => setWidthMax(e.target.value)}
                      placeholder="—"
                      className="w-20 text-center bg-transparent border-neutral-700 text-white placeholder:text-neutral-600 focus:border-[#c9a962]"
                    />
                    <span className="text-neutral-500 text-sm">{unitLabel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-neutral-400 text-sm tracking-widest uppercase w-20">
                    {t.search.depth}
                  </span>
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      type="number"
                      value={depthMin}
                      onChange={(e) => setDepthMin(e.target.value)}
                      placeholder="—"
                      className="w-20 text-center bg-transparent border-neutral-700 text-white placeholder:text-neutral-600 focus:border-[#c9a962]"
                    />
                    <span className="text-neutral-600">–</span>
                    <Input
                      type="number"
                      value={depthMax}
                      onChange={(e) => setDepthMax(e.target.value)}
                      placeholder="—"
                      className="w-20 text-center bg-transparent border-neutral-700 text-white placeholder:text-neutral-600 focus:border-[#c9a962]"
                    />
                    <span className="text-neutral-500 text-sm">{unitLabel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-neutral-400 text-sm tracking-widest uppercase w-20">
                    {t.search.height}
                  </span>
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      type="number"
                      value={heightMin}
                      onChange={(e) => setHeightMin(e.target.value)}
                      placeholder="—"
                      className="w-20 text-center bg-transparent border-neutral-700 text-white placeholder:text-neutral-600 focus:border-[#c9a962]"
                    />
                    <span className="text-neutral-600">–</span>
                    <Input
                      type="number"
                      value={heightMax}
                      onChange={(e) => setHeightMax(e.target.value)}
                      placeholder="—"
                      className="w-20 text-center bg-transparent border-neutral-700 text-white placeholder:text-neutral-600 focus:border-[#c9a962]"
                    />
                    <span className="text-neutral-500 text-sm">{unitLabel}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-neutral-400 text-sm tracking-widest uppercase w-20">
                  {t.color.title}
                </span>
                <Select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 bg-transparent border-neutral-700 text-white focus:border-[#c9a962]"
                >
                  {COLORS.map((c) => (
                    <option key={c.slug} value={c.slug} className="bg-[#141414]">
                      {isJa ? c.nameJa : c.nameEn}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-neutral-800" />
              </div>

              <div className="flex items-center gap-4">
                <span className="text-neutral-400 text-sm tracking-widest uppercase w-20">
                  {t.category.title}
                </span>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 bg-transparent border-neutral-700 text-white focus:border-[#c9a962]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug} className="bg-[#141414]">
                      {isJa ? cat.nameJa : cat.nameEn}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full py-4 bg-[#c9a962] hover:bg-[#d4b876] text-[#0c0c0c] text-sm tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center gap-3"
                >
                  {t.search.searchButton}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
