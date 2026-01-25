import { describe, it, expect } from 'vitest';
import {
  parseSizeFromText,
  parseSizeFromMultipleSources,
  normalizeSizeToCm,
  parseSizeFromAmazonItem,
} from '@/lib/utils/size-parser';

describe('サイズパースユーティリティ', () => {
  describe('parseSizeFromText (日本語)', () => {
    it('幅・奥行き・高さを個別に抽出する', () => {
      const text = '幅: 120cm 奥行き: 60cm 高さ: 72cm';
      const result = parseSizeFromText(text, 'ja');
      
      expect(result.width).toBe(120);
      expect(result.depth).toBe(60);
      expect(result.height).toBe(72);
      expect(result.unit).toBe('cm');
    });

    it('W×D×H形式をパースする', () => {
      const text = 'サイズ: 120×60×72cm';
      const result = parseSizeFromText(text, 'ja');
      
      expect(result.width).toBe(120);
      expect(result.depth).toBe(60);
      expect(result.height).toBe(72);
    });

    it('約付きの値をパースする', () => {
      const text = '幅:約100cm 奥行:約50cm';
      const result = parseSizeFromText(text, 'ja');
      
      expect(result.width).toBe(100);
      expect(result.depth).toBe(50);
    });

    it('小数点を含む値をパースする', () => {
      const text = '幅: 99.5cm';
      const result = parseSizeFromText(text, 'ja');
      
      expect(result.width).toBe(99.5);
    });
  });

  describe('parseSizeFromText (英語)', () => {
    it('width/depth/heightを抽出する', () => {
      const text = 'Width: 48 inches, Depth: 24 inches, Height: 30 inches';
      const result = parseSizeFromText(text, 'en');
      
      expect(result.width).toBe(48);
      expect(result.depth).toBe(24);
      expect(result.height).toBe(30);
      expect(result.unit).toBe('inch');
    });
  });

  describe('parseSizeFromMultipleSources', () => {
    it('複数のソースから情報を統合する', () => {
      const sources = [
        '幅: 120cm',
        '奥行き: 60cm',
        '高さ: 72cm',
      ];
      const result = parseSizeFromMultipleSources(sources, 'ja');
      
      expect(result.width).toBe(120);
      expect(result.depth).toBe(60);
      expect(result.height).toBe(72);
    });

    it('最初に見つかった値を使用する', () => {
      const sources = [
        '幅: 100cm',
        '幅: 120cm', // 無視される
      ];
      const result = parseSizeFromMultipleSources(sources, 'ja');
      
      expect(result.width).toBe(100);
    });

    it('nullのソースをスキップする', () => {
      const sources = [
        null,
        '幅: 100cm',
        undefined,
      ];
      const result = parseSizeFromMultipleSources(sources, 'ja');
      
      expect(result.width).toBe(100);
    });
  });

  describe('normalizeSizeToCm', () => {
    it('インチをcmに変換する', () => {
      const size = { width: 10, depth: 20, height: 30, unit: 'inch' as const };
      const result = normalizeSizeToCm(size);
      
      expect(result.width).toBeCloseTo(25.4, 0);
      expect(result.depth).toBeCloseTo(50.8, 0);
      expect(result.height).toBeCloseTo(76.2, 0);
      expect(result.unit).toBe('cm');
    });

    it('mmをcmに変換する', () => {
      const size = { width: 1000, depth: null, height: null, unit: 'mm' as const };
      const result = normalizeSizeToCm(size);
      
      expect(result.width).toBeCloseTo(100, 0);
    });

    it('cmはそのまま', () => {
      const size = { width: 100, depth: 50, height: 72, unit: 'cm' as const };
      const result = normalizeSizeToCm(size);
      
      expect(result.width).toBe(100);
      expect(result.depth).toBe(50);
      expect(result.height).toBe(72);
    });
  });

  describe('parseSizeFromAmazonItem', () => {
    it('dimensionsから直接取得する', () => {
      const item = {
        dimensions: {
          width: 120,
          depth: 60,
          height: 72,
          unit: 'cm',
        },
      };
      const result = parseSizeFromAmazonItem(item);
      
      expect(result.width).toBe(120);
      expect(result.depth).toBe(60);
      expect(result.height).toBe(72);
    });

    it('タイトルとfeaturesからパースする', () => {
      const item = {
        title: 'シンプルデスク 幅120cm',
        features: ['奥行き60cm', '高さ72cm'],
      };
      const result = parseSizeFromAmazonItem(item);
      
      expect(result.width).toBe(120);
      expect(result.depth).toBe(60);
      expect(result.height).toBe(72);
    });
  });
});
