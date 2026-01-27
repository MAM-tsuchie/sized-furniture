'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RegionCode, Region, SizeUnit, Currency } from '@/types';
import { detectBrowserRegion } from './detect';

// 地域データ（DB から取得するまでの仮データ）
const REGIONS: Record<RegionCode, Region> = {
  jp: {
    id: '',
    code: 'jp',
    name: 'Japan',
    nameLocal: '日本',
    language: 'ja',
    currency: 'JPY',
    currencySymbol: '¥',
    sizeUnit: 'cm',
    isActive: true,
    sortOrder: 1,
  },
  us: {
    id: '',
    code: 'us',
    name: 'United States',
    nameLocal: 'アメリカ',
    language: 'en',
    currency: 'USD',
    currencySymbol: '$',
    sizeUnit: 'inch',
    isActive: true,
    sortOrder: 2,
  },
  uk: {
    id: '',
    code: 'uk',
    name: 'United Kingdom',
    nameLocal: 'イギリス',
    language: 'en',
    currency: 'GBP',
    currencySymbol: '£',
    sizeUnit: 'cm',
    isActive: true,
    sortOrder: 3,
  },
  de: {
    id: '',
    code: 'de',
    name: 'Germany',
    nameLocal: 'ドイツ',
    language: 'de',
    currency: 'EUR',
    currencySymbol: '€',
    sizeUnit: 'cm',
    isActive: true,
    sortOrder: 4,
  },
  fr: {
    id: '',
    code: 'fr',
    name: 'France',
    nameLocal: 'フランス',
    language: 'fr',
    currency: 'EUR',
    currencySymbol: '€',
    sizeUnit: 'cm',
    isActive: true,
    sortOrder: 5,
  },
  au: {
    id: '',
    code: 'au',
    name: 'Australia',
    nameLocal: 'オーストラリア',
    language: 'en',
    currency: 'AUD',
    currencySymbol: 'A$',
    sizeUnit: 'cm',
    isActive: true,
    sortOrder: 6,
  },
  ca: {
    id: '',
    code: 'ca',
    name: 'Canada',
    nameLocal: 'カナダ',
    language: 'en',
    currency: 'CAD',
    currencySymbol: 'C$',
    sizeUnit: 'inch',
    isActive: true,
    sortOrder: 7,
  },
};

interface RegionContextValue {
  region: Region;
  regionCode: RegionCode;
  setRegionCode: (code: RegionCode) => void;
  currency: Currency;
  currencySymbol: string;
  sizeUnit: SizeUnit;
  availableRegions: Region[];
}

const RegionContext = createContext<RegionContextValue | null>(null);

interface RegionProviderProps {
  children: ReactNode;
  defaultRegion?: RegionCode;
}

export function RegionProvider({ children, defaultRegion }: RegionProviderProps) {
  const [regionCode, setRegionCode] = useState<RegionCode>(
    defaultRegion || detectBrowserRegion()
  );

  const region = REGIONS[regionCode];
  const availableRegions = Object.values(REGIONS).filter((r) => r.isActive);

  return (
    <RegionContext.Provider
      value={{
        region,
        regionCode,
        setRegionCode,
        currency: region.currency,
        currencySymbol: region.currencySymbol,
        sizeUnit: region.sizeUnit,
        availableRegions,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}
