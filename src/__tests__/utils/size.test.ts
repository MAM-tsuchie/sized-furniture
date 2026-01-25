import { describe, it, expect } from 'vitest';
import {
  cmToInch,
  inchToCm,
  formatSizeRange,
  formatProductSize,
  isSizeInRange,
} from '@/lib/utils/size';

describe('サイズユーティリティ', () => {
  describe('cmToInch', () => {
    it('センチメートルをインチに正しく変換する', () => {
      expect(cmToInch(2.54)).toBeCloseTo(1, 1);
      expect(cmToInch(25.4)).toBeCloseTo(10, 1);
      expect(cmToInch(100)).toBeCloseTo(39.37, 1);
    });

    it('0を0に変換する', () => {
      expect(cmToInch(0)).toBe(0);
    });
  });

  describe('inchToCm', () => {
    it('インチをセンチメートルに正しく変換する', () => {
      expect(inchToCm(1)).toBeCloseTo(2.54, 1);
      expect(inchToCm(10)).toBeCloseTo(25.4, 1);
      expect(inchToCm(39.37)).toBeCloseTo(100, 0);
    });

    it('0を0に変換する', () => {
      expect(inchToCm(0)).toBe(0);
    });
  });

  describe('formatSizeRange', () => {
    it('最小値と最大値の両方がある場合', () => {
      const result = formatSizeRange(50, 100, 'cm');
      expect(result).toContain('50');
      expect(result).toContain('100');
    });

    it('最小値のみの場合', () => {
      const result = formatSizeRange(50, null, 'cm');
      expect(result).toContain('50');
      expect(result).toContain('以上');
    });

    it('最大値のみの場合', () => {
      const result = formatSizeRange(null, 100, 'cm');
      expect(result).toContain('100');
      expect(result).toContain('以下');
    });

    it('両方ともnullの場合は空文字を返す', () => {
      expect(formatSizeRange(null, null, 'cm')).toBe('');
    });
  });

  describe('formatProductSize', () => {
    it('幅・奥行き・高さをフォーマットする', () => {
      const result = formatProductSize(120, 60, 72, 'cm');
      expect(result).toContain('W120');
      expect(result).toContain('D60');
      expect(result).toContain('H72');
    });

    it('一部がnullの場合', () => {
      const result1 = formatProductSize(120, null, 72, 'cm');
      expect(result1).toContain('W120');
      expect(result1).toContain('H72');
      expect(result1).not.toContain('D');

      const result2 = formatProductSize(null, 60, null, 'cm');
      expect(result2).toContain('D60');
    });

    it('すべてnullの場合は不明を示す文字列を返す', () => {
      const result = formatProductSize(null, null, null, 'cm');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('isSizeInRange', () => {
    it('範囲内の場合trueを返す', () => {
      expect(isSizeInRange(100, 50, 150)).toBe(true);
      expect(isSizeInRange(50, 50, 150)).toBe(true);
      expect(isSizeInRange(150, 50, 150)).toBe(true);
    });

    it('範囲外の場合falseを返す', () => {
      expect(isSizeInRange(49, 50, 150)).toBe(false);
      expect(isSizeInRange(151, 50, 150)).toBe(false);
    });

    it('最小値のみの場合', () => {
      expect(isSizeInRange(100, 50, null)).toBe(true);
      expect(isSizeInRange(49, 50, null)).toBe(false);
    });

    it('最大値のみの場合', () => {
      expect(isSizeInRange(100, null, 150)).toBe(true);
      expect(isSizeInRange(151, null, 150)).toBe(false);
    });

    it('サイズがnullの場合falseを返す', () => {
      expect(isSizeInRange(null, 50, 150)).toBe(false);
    });
  });
});
