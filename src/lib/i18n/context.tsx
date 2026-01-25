'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language } from '@/types';
import { translations, getTranslations, interpolate, type TranslationData } from './translations';

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationData;
  formatMessage: (key: string, values?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = 'ja' }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const t = getTranslations(language);

  const formatMessage = useCallback(
    (key: string, values?: Record<string, string | number>) => {
      // key を "search.title" のような形式でパース
      const keys = key.split('.');
      let value: unknown = t;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key; // キーが見つからない場合はキーをそのまま返す
        }
      }

      if (typeof value !== 'string') {
        return key;
      }

      return values ? interpolate(value, values) : value;
    },
    [t]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, formatMessage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, formatMessage, language } = useI18n();
  return { t, formatMessage, language };
}
