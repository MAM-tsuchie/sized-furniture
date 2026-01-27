'use client';

import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { useRegion } from '@/lib/region/context';
import type { RegionCode } from '@/types';

export function Header() {
  const { regionCode, setRegionCode, availableRegions } = useRegion();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/90 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-[#c9a962] text-2xl font-light tracking-[0.2em] uppercase">
              Sized
            </span>
            <span className="text-neutral-400 text-sm tracking-widest uppercase">
              Furniture
            </span>
          </Link>

          {/* 地域選択 */}
          <div className="flex items-center space-x-3">
            <Globe className="h-4 w-4 text-neutral-500" />
            <Select
              value={regionCode}
              onChange={(e) => setRegionCode(e.target.value as RegionCode)}
              className="w-32 h-9 text-sm bg-transparent border-neutral-700 text-neutral-300 focus:border-[#c9a962]"
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
