import type { DetectedColorInfo } from '@/types';

/**
 * 木材キーワード → wood_type slug
 * 具体的なキーワードを先に配置（優先度高）
 */
const woodKeywords: Record<string, string> = {
  // === 具体的なキーワード（優先度高） ===
  
  // ホワイトウッド（具体的）
  'ホワイトオーク': 'white-oak',
  'white oak': 'white-oak',
  'ホワイトアッシュ': 'white-ash',
  'white ash': 'white-ash',
  
  // レッドウッド系
  'レッドオーク': 'red-oak',
  'red oak': 'red-oak',
  
  // ブラックチェリー
  'ブラックチェリー': 'black-cherry',
  'black cherry': 'black-cherry',
  'アメリカンチェリー': 'black-cherry',
  'american cherry': 'black-cherry',
  
  // === 汎用的なキーワード（優先度低） ===
  
  // ホワイトウッド
  '白木': 'whitewood',
  
  // ナチュラルウッド
  'パイン': 'pine',
  'pine': 'pine',
  '松': 'pine',
  'ビーチ': 'beech',
  'beech': 'beech',
  'メープル': 'maple',
  'maple': 'maple',
  '楓': 'maple',
  'バーチ': 'birch',
  'birch': 'birch',
  '樺': 'birch',
  'アッシュ': 'ash',
  'ash': 'ash',
  'タモ': 'ash',
  
  // ミディアムウッド
  'オーク': 'oak',
  'oak': 'oak',
  'ナラ': 'oak',
  '楢': 'oak',
  'チェリー': 'cherry',
  'cherry': 'cherry',
  '桜': 'cherry',
  'アルダー': 'alder',
  'alder': 'alder',
  'チーク': 'teak',
  'teak': 'teak',
  
  // ダークウッド
  'ウォールナット': 'walnut',
  'ウォルナット': 'walnut',
  'walnut': 'walnut',
  '胡桃': 'walnut',
  'クルミ': 'walnut',
  'マホガニー': 'mahogany',
  'mahogany': 'mahogany',
  'ウェンジ': 'wenge',
  'wenge': 'wenge',
  'エボニー': 'ebony',
  'ebony': 'ebony',
  '黒檀': 'ebony',
  
  // ヴィンテージ
  '古材': 'reclaimed',
  'アンティーク': 'antique',
  'ヴィンテージ': 'vintage',
  'ビンテージ': 'vintage',
  'vintage': 'vintage',
};

/**
 * カラーグループキーワード
 */
const colorGroupKeywords: Record<string, string> = {
  // ホワイト系
  'ホワイト': 'white',
  '白': 'white',
  'white': 'white',
  'アイボリー': 'white',
  'ivory': 'white',
  'オフホワイト': 'white',
  
  // ブラック系
  'ブラック': 'black',
  '黒': 'black',
  'black': 'black',
  
  // グレー系
  'グレー': 'gray',
  'グレイ': 'gray',
  'gray': 'gray',
  'grey': 'gray',
  'ライトグレー': 'light-gray',
  'ダークグレー': 'dark-gray',
  'チャコール': 'dark-gray',
  
  // ブラウン系
  'ブラウン': 'brown',
  '茶': 'brown',
  'brown': 'brown',
  'ダークブラウン': 'dark-brown',
  'ライトブラウン': 'light-brown',
  'キャメル': 'brown',
  
  // ナチュラル系
  'ナチュラル': 'natural',
  'natural': 'natural',
  'ベージュ': 'beige',
  'beige': 'beige',
  '無垢': 'natural',
  
  // ブルー系
  'ブルー': 'blue',
  '青': 'blue',
  'blue': 'blue',
  'ネイビー': 'navy',
  'navy': 'navy',
  '紺': 'navy',
  
  // グリーン系
  'グリーン': 'green',
  '緑': 'green',
  'green': 'green',
  'オリーブ': 'olive',
  
  // レッド・ピンク系
  'レッド': 'red',
  '赤': 'red',
  'red': 'red',
  'ピンク': 'pink',
  'pink': 'pink',
  'ワインレッド': 'wine',
  'ボルドー': 'wine',
  
  // イエロー・オレンジ系
  'イエロー': 'yellow',
  '黄': 'yellow',
  'yellow': 'yellow',
  'オレンジ': 'orange',
  'orange': 'orange',
  
  // パープル系
  'パープル': 'purple',
  '紫': 'purple',
  'purple': 'purple',
  
  // メタリック系
  'シルバー': 'silver',
  'silver': 'silver',
  'ゴールド': 'gold',
  'gold': 'gold',
  'スチール': 'black-steel',
  'steel': 'black-steel',
  'ブロンズ': 'bronze',
  'bronze': 'bronze',
  '銅': 'bronze',
};

/**
 * 商品の色情報から color_group と wood_type を検出
 */
export function detectColorInfo(colorName: string): DetectedColorInfo {
  const normalized = colorName.toLowerCase();

  // まず木材をチェック（優先）
  for (const [keyword, woodType] of Object.entries(woodKeywords)) {
    if (normalized.includes(keyword.toLowerCase())) {
      return { colorGroup: null, woodType };
    }
  }

  // 次にカラーグループをチェック
  for (const [keyword, colorGroup] of Object.entries(colorGroupKeywords)) {
    if (normalized.includes(keyword.toLowerCase())) {
      return { colorGroup, woodType: null };
    }
  }

  return { colorGroup: null, woodType: null };
}

/**
 * 複数の色情報を統合して最適なものを返す
 * (タイトル、属性、説明文などから複数の情報がある場合)
 */
export function detectColorInfoFromMultiple(
  sources: (string | null | undefined)[]
): DetectedColorInfo {
  for (const source of sources) {
    if (!source) continue;
    
    const result = detectColorInfo(source);
    if (result.woodType || result.colorGroup) {
      return result;
    }
  }
  
  return { colorGroup: null, woodType: null };
}

/**
 * 木材タイプのスラッグから表示名を取得
 */
export function getWoodTypeDisplayName(slug: string, lang: 'ja' | 'en' = 'ja'): string {
  const names: Record<string, { ja: string; en: string }> = {
    'white-oak': { ja: 'ホワイトオーク', en: 'White Oak' },
    'white-ash': { ja: 'ホワイトアッシュ', en: 'White Ash' },
    'whitewood': { ja: '白木', en: 'Whitewood' },
    'red-oak': { ja: 'レッドオーク', en: 'Red Oak' },
    'black-cherry': { ja: 'ブラックチェリー', en: 'Black Cherry' },
    'pine': { ja: 'パイン', en: 'Pine' },
    'beech': { ja: 'ビーチ', en: 'Beech' },
    'maple': { ja: 'メープル', en: 'Maple' },
    'birch': { ja: 'バーチ', en: 'Birch' },
    'ash': { ja: 'アッシュ/タモ', en: 'Ash' },
    'oak': { ja: 'オーク', en: 'Oak' },
    'cherry': { ja: 'チェリー', en: 'Cherry' },
    'alder': { ja: 'アルダー', en: 'Alder' },
    'teak': { ja: 'チーク', en: 'Teak' },
    'walnut': { ja: 'ウォールナット', en: 'Walnut' },
    'mahogany': { ja: 'マホガニー', en: 'Mahogany' },
    'wenge': { ja: 'ウェンジ', en: 'Wenge' },
    'ebony': { ja: 'エボニー', en: 'Ebony' },
    'reclaimed': { ja: '古材', en: 'Reclaimed' },
    'antique': { ja: 'アンティーク', en: 'Antique' },
    'vintage': { ja: 'ヴィンテージ', en: 'Vintage' },
  };
  
  return names[slug]?.[lang] || slug;
}

/**
 * カラーグループのスラッグから表示名を取得
 */
export function getColorGroupDisplayName(slug: string, lang: 'ja' | 'en' = 'ja'): string {
  const names: Record<string, { ja: string; en: string }> = {
    'white': { ja: 'ホワイト', en: 'White' },
    'black': { ja: 'ブラック', en: 'Black' },
    'gray': { ja: 'グレー', en: 'Gray' },
    'light-gray': { ja: 'ライトグレー', en: 'Light Gray' },
    'dark-gray': { ja: 'ダークグレー', en: 'Dark Gray' },
    'brown': { ja: 'ブラウン', en: 'Brown' },
    'light-brown': { ja: 'ライトブラウン', en: 'Light Brown' },
    'dark-brown': { ja: 'ダークブラウン', en: 'Dark Brown' },
    'natural': { ja: 'ナチュラル', en: 'Natural' },
    'beige': { ja: 'ベージュ', en: 'Beige' },
    'blue': { ja: 'ブルー', en: 'Blue' },
    'navy': { ja: 'ネイビー', en: 'Navy' },
    'green': { ja: 'グリーン', en: 'Green' },
    'olive': { ja: 'オリーブ', en: 'Olive' },
    'red': { ja: 'レッド', en: 'Red' },
    'pink': { ja: 'ピンク', en: 'Pink' },
    'wine': { ja: 'ワインレッド', en: 'Wine Red' },
    'yellow': { ja: 'イエロー', en: 'Yellow' },
    'orange': { ja: 'オレンジ', en: 'Orange' },
    'purple': { ja: 'パープル', en: 'Purple' },
    'silver': { ja: 'シルバー', en: 'Silver' },
    'gold': { ja: 'ゴールド', en: 'Gold' },
    'black-steel': { ja: 'ブラックスチール', en: 'Black Steel' },
    'bronze': { ja: 'ブロンズ', en: 'Bronze' },
  };
  
  return names[slug]?.[lang] || slug;
}
