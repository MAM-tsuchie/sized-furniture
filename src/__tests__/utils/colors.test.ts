import { describe, it, expect } from 'vitest';
import {
  detectColorInfo,
  detectColorInfoFromMultiple,
  getWoodTypeDisplayName,
} from '@/lib/colors/utils';

describe('カラー検出ユーティリティ', () => {
  describe('detectColorInfo', () => {
    describe('木材タイプの検出', () => {
      it('ウォールナットを検出する', () => {
        expect(detectColorInfo('ウォールナット').woodType).toBe('walnut');
        expect(detectColorInfo('Walnut').woodType).toBe('walnut');
        expect(detectColorInfo('WALNUT').woodType).toBe('walnut');
      });

      it('オークを検出する', () => {
        expect(detectColorInfo('オーク材').woodType).toBe('oak');
        expect(detectColorInfo('Oak Wood').woodType).toBe('oak');
      });

      it('レッドオークを優先する', () => {
        expect(detectColorInfo('レッドオーク').woodType).toBe('red-oak');
      });

      it('ホワイトオークを優先する', () => {
        expect(detectColorInfo('ホワイトオーク').woodType).toBe('white-oak');
      });

      it('チェリーを検出する', () => {
        expect(detectColorInfo('チェリー材').woodType).toBe('cherry');
        expect(detectColorInfo('Cherry').woodType).toBe('cherry');
      });

      it('パインを検出する', () => {
        expect(detectColorInfo('パイン材').woodType).toBe('pine');
        expect(detectColorInfo('Pine Wood').woodType).toBe('pine');
      });
    });

    describe('カラーグループの検出', () => {
      it('ホワイトを検出する', () => {
        expect(detectColorInfo('ホワイト').colorGroup).toBe('white');
        expect(detectColorInfo('白').colorGroup).toBe('white');
      });

      it('ブラックを検出する', () => {
        expect(detectColorInfo('ブラック').colorGroup).toBe('black');
        expect(detectColorInfo('黒').colorGroup).toBe('black');
      });
    });

    describe('複合カラー', () => {
      it('ウォールナット/ブラックを検出する', () => {
        const result = detectColorInfo('ウォールナット/ブラック');
        expect(result.woodType).toBe('walnut');
      });

      it('オーク×ホワイトを検出する', () => {
        const result = detectColorInfo('オーク×ホワイト');
        expect(result.woodType).toBe('oak');
      });
    });

    it('不明な色の場合はnullを返す', () => {
      const result = detectColorInfo('unknown color');
      expect(result.woodType).toBeNull();
      expect(result.colorGroup).toBeNull();
    });

    it('空文字の場合はnullを返す', () => {
      const result = detectColorInfo('');
      expect(result.woodType).toBeNull();
      expect(result.colorGroup).toBeNull();
    });
  });

  describe('detectColorInfoFromMultiple', () => {
    it('複数のソースから最初に検出された情報を使用する', () => {
      const result = detectColorInfoFromMultiple(['', 'ウォールナット', 'オーク']);
      expect(result.woodType).toBe('walnut');
    });

    it('すべて空の場合はnullを返す', () => {
      const result = detectColorInfoFromMultiple(['', null, undefined]);
      expect(result.woodType).toBeNull();
    });
  });

  describe('getWoodTypeDisplayName', () => {
    it('日本語名を返す', () => {
      expect(getWoodTypeDisplayName('walnut', 'ja')).toBe('ウォールナット');
      expect(getWoodTypeDisplayName('oak', 'ja')).toBe('オーク');
    });

    it('英語名を返す', () => {
      expect(getWoodTypeDisplayName('walnut', 'en')).toBe('Walnut');
      expect(getWoodTypeDisplayName('oak', 'en')).toBe('Oak');
    });

    it('不明なタイプの場合はタイプ名を返す', () => {
      expect(getWoodTypeDisplayName('unknown', 'ja')).toBe('unknown');
    });
  });
});
