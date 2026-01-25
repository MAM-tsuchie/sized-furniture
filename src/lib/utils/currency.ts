import type { Currency } from '@/types';

interface CurrencyConfig {
  symbol: string;
  locale: string;
  decimals: number;
}

const CURRENCY_CONFIG: Record<Currency, CurrencyConfig> = {
  JPY: { symbol: '¥', locale: 'ja-JP', decimals: 0 },
  USD: { symbol: '$', locale: 'en-US', decimals: 2 },
  GBP: { symbol: '£', locale: 'en-GB', decimals: 2 },
  EUR: { symbol: '€', locale: 'de-DE', decimals: 2 },
  AUD: { symbol: 'A$', locale: 'en-AU', decimals: 2 },
  CAD: { symbol: 'C$', locale: 'en-CA', decimals: 2 },
};

/**
 * 価格をフォーマット
 */
export function formatPrice(
  amount: number,
  currency: Currency,
  options?: { showSymbol?: boolean; compact?: boolean }
): string {
  const config = CURRENCY_CONFIG[currency];
  const { showSymbol = true, compact = false } = options || {};

  const formatter = new Intl.NumberFormat(config.locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
    notation: compact ? 'compact' : 'standard',
  });

  return formatter.format(amount);
}

/**
 * 通貨シンボルを取得
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_CONFIG[currency].symbol;
}

/**
 * 為替レート（簡易的な固定レート - 本番では API 使用推奨）
 */
const EXCHANGE_RATES: Record<Currency, number> = {
  JPY: 1,
  USD: 0.0067,
  GBP: 0.0053,
  EUR: 0.0062,
  AUD: 0.0103,
  CAD: 0.0091,
};

/**
 * 通貨を変換（簡易版）
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  
  // まず JPY に変換
  const inJpy = from === 'JPY' ? amount : amount / EXCHANGE_RATES[from];
  
  // 目的の通貨に変換
  const converted = to === 'JPY' ? inJpy : inJpy * EXCHANGE_RATES[to];
  
  return Math.round(converted * 100) / 100;
}
