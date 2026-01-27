'use client';

import { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { SizeInput } from './size-input';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import { cn } from '@/lib/utils/cn';
import type { ProductSearchParams, Category, ColorGroup, WoodType } from '@/types';

interface SearchFormProps {
  categories: Category[];
  colorGroups: ColorGroup[];
  woodTypes: WoodType[];
  initialParams?: Partial<ProductSearchParams>;
  onSearch: (params: ProductSearchParams) => void;
  className?: string;
}

export function SearchForm({
  categories,
  colorGroups,
  woodTypes,
  initialParams,
  onSearch,
  className,
}: SearchFormProps) {
  const { t, language } = useTranslation();
  const { sizeUnit } = useRegion();
  
  // サイズ
  const [widthMin, setWidthMin] = useState<number | undefined>(initialParams?.widthMin);
  const [widthMax, setWidthMax] = useState<number | undefined>(initialParams?.widthMax);
  const [depthMin, setDepthMin] = useState<number | undefined>(initialParams?.depthMin);
  const [depthMax, setDepthMax] = useState<number | undefined>(initialParams?.depthMax);
  const [heightMin, setHeightMin] = useState<number | undefined>(initialParams?.heightMin);
  const [heightMax, setHeightMax] = useState<number | undefined>(initialParams?.heightMax);
  
  // フィルター
  const [categoryId, setCategoryId] = useState<string | undefined>(initialParams?.categoryId);
  const [colorGroupId, setColorGroupId] = useState<string | undefined>(initialParams?.colorGroupId);
  const [woodTypeId, setWoodTypeId] = useState<string | undefined>(initialParams?.woodTypeId);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch({
        widthMin,
        widthMax,
        depthMin,
        depthMax,
        heightMin,
        heightMax,
        categoryId,
        colorGroupId,
        woodTypeId,
      });
    },
    [widthMin, widthMax, depthMin, depthMax, heightMin, heightMax, categoryId, colorGroupId, woodTypeId, onSearch]
  );

  const handleClear = useCallback(() => {
    setWidthMin(undefined);
    setWidthMax(undefined);
    setDepthMin(undefined);
    setDepthMax(undefined);
    setHeightMin(undefined);
    setHeightMax(undefined);
    setCategoryId(undefined);
    setColorGroupId(undefined);
    setWoodTypeId(undefined);
  }, []);

  // 木目カラーグループをフィルタ
  const woodColorGroups = colorGroups.filter((cg) => 
    cg.slug.includes('wood')
  );

  // 言語に応じた名前を取得
  const getCategoryName = (cat: Category) => language === 'ja' ? cat.name : cat.nameEn;
  const getColorGroupName = (cg: ColorGroup) => language === 'ja' ? cg.name : cg.nameEn;
  const getWoodTypeName = (wt: WoodType) => language === 'ja' ? wt.name : wt.nameEn;

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* メインサイズ入力 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* カテゴリ選択 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {t.category.title}
          </label>
          <Select
            value={categoryId ?? ''}
            onChange={(e) => setCategoryId(e.target.value || undefined)}
          >
            <option value="">{t.category.all}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {'　'.repeat(cat.level)}{getCategoryName(cat)}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {t.color.title}
          </label>
          <Select
            value={colorGroupId ?? ''}
            onChange={(e) => setColorGroupId(e.target.value || undefined)}
          >
            <option value="">{t.color.all}</option>
            <optgroup label={t.color.wood}>
              {woodColorGroups.map((cg) => (
                <option key={cg.id} value={cg.id}>
                  {getColorGroupName(cg)}
                </option>
              ))}
            </optgroup>
            <optgroup label={t.color.solid}>
              {colorGroups
                .filter((cg) => !cg.slug.includes('wood'))
                .map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    {getColorGroupName(cg)}
                  </option>
                ))}
            </optgroup>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            {t.color.woodType}
          </label>
          <Select
            value={woodTypeId ?? ''}
            onChange={(e) => setWoodTypeId(e.target.value || undefined)}
          >
            <option value="">{t.common.all}</option>
            {woodTypes.map((wt) => (
              <option key={wt.id} value={wt.id}>
                {getWoodTypeName(wt)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex items-center justify-between pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={handleClear}
          className="text-slate-500"
        >
          <X className="w-4 h-4 mr-2" />
          {t.common.clear}
        </Button>
        <Button type="submit" variant="primary" size="lg">
          <Search className="w-4 h-4 mr-2" />
          {t.search.searchButton}
        </Button>
      </div>
    </form>
  );
}
