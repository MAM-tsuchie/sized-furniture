import type { RegionCode, Language } from '@/types';

/**
 * 国コード → 地域コードのマッピング
 */
const COUNTRY_TO_REGION: Record<string, RegionCode> = {
  JP: 'jp',
  US: 'us',
  GB: 'uk',
  UK: 'uk',
  DE: 'de',
  FR: 'fr',
  AU: 'au',
  CA: 'ca',
};

/**
 * 言語コード → 地域コードのマッピング
 */
const LANGUAGE_TO_REGION: Record<string, RegionCode> = {
  ja: 'jp',
  'ja-JP': 'jp',
  en: 'us',
  'en-US': 'us',
  'en-GB': 'uk',
  'en-AU': 'au',
  'en-CA': 'ca',
  de: 'de',
  'de-DE': 'de',
  fr: 'fr',
  'fr-FR': 'fr',
};

/**
 * 地域コード → 言語のマッピング
 */
export const REGION_TO_LANGUAGE: Record<RegionCode, Language> = {
  jp: 'ja',
  us: 'en',
  uk: 'en',
  de: 'de',
  fr: 'fr',
  au: 'en',
  ca: 'en',
};

/**
 * 国コードから地域コードに変換
 */
export function mapCountryToRegion(countryCode: string): RegionCode {
  return COUNTRY_TO_REGION[countryCode.toUpperCase()] || 'us';
}

/**
 * 言語コードから地域コードに変換
 */
export function mapLanguageToRegion(languageCode: string): RegionCode {
  // 完全一致を試す
  if (languageCode in LANGUAGE_TO_REGION) {
    return LANGUAGE_TO_REGION[languageCode];
  }
  
  // 言語部分のみで試す (例: "en-US" → "en")
  const lang = languageCode.split('-')[0];
  return LANGUAGE_TO_REGION[lang] || 'us';
}

/**
 * Accept-Language ヘッダーをパース
 */
export function parseAcceptLanguage(header: string): string[] {
  return header
    .split(',')
    .map((lang) => {
      const [code, q] = lang.trim().split(';q=');
      return {
        code: code.trim(),
        quality: q ? parseFloat(q) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality)
    .map((item) => item.code);
}

/**
 * サーバーサイドでユーザーの地域を検出
 */
export async function detectUserRegion(headers: Headers): Promise<RegionCode> {
  // 1. Vercel の地域ヘッダーを確認
  const country = headers.get('x-vercel-ip-country');
  if (country) {
    return mapCountryToRegion(country);
  }

  // 2. Cloudflare の地域ヘッダーを確認
  const cfCountry = headers.get('cf-ipcountry');
  if (cfCountry) {
    return mapCountryToRegion(cfCountry);
  }

  // 3. Accept-Language ヘッダーから推測
  const acceptLang = headers.get('accept-language');
  if (acceptLang) {
    const languages = parseAcceptLanguage(acceptLang);
    if (languages.length > 0) {
      return mapLanguageToRegion(languages[0]);
    }
  }

  // 4. デフォルト
  return 'jp';
}

/**
 * クライアントサイドでブラウザの言語から地域を推測
 */
export function detectBrowserRegion(): RegionCode {
  if (typeof navigator === 'undefined') {
    return 'jp';
  }
  
  const language = navigator.language || 'en';
  return mapLanguageToRegion(language);
}
