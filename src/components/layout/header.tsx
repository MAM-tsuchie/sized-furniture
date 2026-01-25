'use client';

import Link from 'next/link';
import { Ruler, Globe } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';
import type { RegionCode } from '@/types';

export function Header() {
  const { t } = useTranslation();
  const { regionCode, setRegionCode, availableRegions } = useRegion();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            <Ruler className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-slate-900">
              {t.common.siteName}
            </span>
          </Link>

          {/* ナビゲーション */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/search"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t.common.search}
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {t.category.title}
            </Link>
          </nav>

          {/* 地域選択 */}
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-slate-400" />
            <Select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value as RegionCode)}
              className="w-32 h-9 text-sm"
            >
              {availableRegions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.nameLocal}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}
