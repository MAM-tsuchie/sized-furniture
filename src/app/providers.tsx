'use client';

import { type ReactNode, useEffect } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { RegionProvider, useRegion } from '@/lib/region/context';
import { REGION_TO_LANGUAGE } from '@/lib/region/detect';
import type { Language, RegionCode } from '@/types';

interface ProvidersProps {
  children: ReactNode;
  defaultLanguage?: Language;
  defaultRegion?: RegionCode;
}

/**
 * 地域変更時に言語を自動切り替えするコンポーネント
 */
function RegionLanguageSync({ children }: { children: ReactNode }) {
  const { regionCode } = useRegion();
  const { setLanguage } = useI18n();

  useEffect(() => {
    const newLanguage = REGION_TO_LANGUAGE[regionCode];
    setLanguage(newLanguage);
  }, [regionCode, setLanguage]);

  return <>{children}</>;
}

export function Providers({
  children,
  defaultLanguage = 'ja',
  defaultRegion = 'jp',
}: ProvidersProps) {
  return (
    <RegionProvider defaultRegion={defaultRegion}>
      <I18nProvider defaultLanguage={defaultLanguage}>
        <RegionLanguageSync>
          {children}
        </RegionLanguageSync>
      </I18nProvider>
    </RegionProvider>
  );
}
