import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  getCurrencySymbol,
  convertCurrency,
} from '@/lib/utils/currency';

describe('通貨ユーティリティ', () => {
  describe('formatPrice', () => {
    it('日本円をフォーマットする', () => {
      const result = formatPrice(29800, 'JPY');
      expect(result).toContain('29,800');
    });

    it('米ドルをフォーマットする', () => {
      expect(formatPrice(199.99, 'USD')).toBe('$199.99');
      expect(formatPrice(1000, 'USD')).toBe('$1,000.00');
    });

    it('ユーロをフォーマットする', () => {
      const result = formatPrice(199.99, 'EUR');
      expect(result).toContain('199');
      expect(result).toContain('€');
    });
  });

  describe('getCurrencySymbol', () => {
    it('各通貨のシンボルを返す', () => {
      expect(getCurrencySymbol('JPY')).toBe('¥');
      expect(getCurrencySymbol('USD')).toBe('$');
      expect(getCurrencySymbol('EUR')).toBe('€');
      expect(getCurrencySymbol('GBP')).toBe('£');
    });
  });

  describe('convertCurrency', () => {
    it('同じ通貨の場合は変換しない', () => {
      expect(convertCurrency(100, 'JPY', 'JPY')).toBe(100);
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100);
    });

    it('異なる通貨間で変換する', () => {
      // JPY -> USD (大体の変換レート)
      const result = convertCurrency(15000, 'JPY', 'USD');
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(15000); // JPY > USD
    });
  });
});
