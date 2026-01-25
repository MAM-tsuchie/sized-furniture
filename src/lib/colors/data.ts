/**
 * 木目カラーグループのデータ定義
 */
export const woodColorGroups = [
  {
    slug: 'white-wood',
    name: 'ホワイトウッド',
    nameEn: 'White Wood',
    description: '明るく白っぽい木目',
    hexCode: '#F5E6D3',
    woodTypes: [
      { slug: 'white-oak', name: 'ホワイトオーク', nameEn: 'White Oak' },
      { slug: 'white-ash', name: 'ホワイトアッシュ', nameEn: 'White Ash' },
      { slug: 'whitewood', name: '白木', nameEn: 'Whitewood' },
    ],
  },
  {
    slug: 'natural-wood',
    name: 'ナチュラルウッド',
    nameEn: 'Natural Wood',
    description: '自然な明るい木目',
    hexCode: '#DEB887',
    woodTypes: [
      { slug: 'pine', name: 'パイン', nameEn: 'Pine' },
      { slug: 'beech', name: 'ビーチ', nameEn: 'Beech' },
      { slug: 'maple', name: 'メープル', nameEn: 'Maple' },
      { slug: 'birch', name: 'バーチ', nameEn: 'Birch' },
      { slug: 'ash', name: 'アッシュ/タモ', nameEn: 'Ash' },
    ],
  },
  {
    slug: 'medium-wood',
    name: 'ミディアムウッド',
    nameEn: 'Medium Wood',
    description: '中間的な茶色の木目',
    hexCode: '#A0522D',
    woodTypes: [
      { slug: 'oak', name: 'オーク', nameEn: 'Oak' },
      { slug: 'red-oak', name: 'レッドオーク', nameEn: 'Red Oak' },
      { slug: 'cherry', name: 'チェリー', nameEn: 'Cherry' },
      { slug: 'black-cherry', name: 'ブラックチェリー', nameEn: 'Black Cherry' },
      { slug: 'alder', name: 'アルダー', nameEn: 'Alder' },
      { slug: 'teak', name: 'チーク', nameEn: 'Teak' },
    ],
  },
  {
    slug: 'dark-wood',
    name: 'ダークウッド',
    nameEn: 'Dark Wood',
    description: '深い茶〜黒の木目',
    hexCode: '#4A3728',
    woodTypes: [
      { slug: 'walnut', name: 'ウォールナット', nameEn: 'Walnut' },
      { slug: 'mahogany', name: 'マホガニー', nameEn: 'Mahogany' },
      { slug: 'wenge', name: 'ウェンジ', nameEn: 'Wenge' },
      { slug: 'ebony', name: 'エボニー', nameEn: 'Ebony' },
    ],
  },
  {
    slug: 'vintage-wood',
    name: 'ヴィンテージウッド',
    nameEn: 'Vintage Wood',
    description: '古材・アンティーク調',
    hexCode: '#8B7355',
    woodTypes: [
      { slug: 'reclaimed', name: '古材', nameEn: 'Reclaimed' },
      { slug: 'antique', name: 'アンティーク', nameEn: 'Antique' },
      { slug: 'vintage', name: 'ヴィンテージ', nameEn: 'Vintage' },
    ],
  },
] as const;

/**
 * ソリッドカラーグループのデータ定義
 */
export const solidColorGroups = [
  { slug: 'white', name: 'ホワイト', nameEn: 'White', hexCode: '#FFFFFF' },
  { slug: 'black', name: 'ブラック', nameEn: 'Black', hexCode: '#1A1A1A' },
  { slug: 'gray', name: 'グレー', nameEn: 'Gray', hexCode: '#808080' },
  { slug: 'light-gray', name: 'ライトグレー', nameEn: 'Light Gray', hexCode: '#C0C0C0' },
  { slug: 'dark-gray', name: 'ダークグレー', nameEn: 'Dark Gray', hexCode: '#404040' },
  { slug: 'brown', name: 'ブラウン', nameEn: 'Brown', hexCode: '#8B4513' },
  { slug: 'light-brown', name: 'ライトブラウン', nameEn: 'Light Brown', hexCode: '#CD853F' },
  { slug: 'dark-brown', name: 'ダークブラウン', nameEn: 'Dark Brown', hexCode: '#5D4037' },
  { slug: 'natural', name: 'ナチュラル', nameEn: 'Natural', hexCode: '#F5DEB3' },
  { slug: 'beige', name: 'ベージュ', nameEn: 'Beige', hexCode: '#F5F5DC' },
  { slug: 'blue', name: 'ブルー', nameEn: 'Blue', hexCode: '#4169E1' },
  { slug: 'navy', name: 'ネイビー', nameEn: 'Navy', hexCode: '#000080' },
  { slug: 'green', name: 'グリーン', nameEn: 'Green', hexCode: '#228B22' },
  { slug: 'olive', name: 'オリーブ', nameEn: 'Olive', hexCode: '#808000' },
  { slug: 'red', name: 'レッド', nameEn: 'Red', hexCode: '#DC143C' },
  { slug: 'pink', name: 'ピンク', nameEn: 'Pink', hexCode: '#FFB6C1' },
  { slug: 'wine', name: 'ワインレッド', nameEn: 'Wine Red', hexCode: '#722F37' },
  { slug: 'yellow', name: 'イエロー', nameEn: 'Yellow', hexCode: '#FFD700' },
  { slug: 'orange', name: 'オレンジ', nameEn: 'Orange', hexCode: '#FF8C00' },
  { slug: 'purple', name: 'パープル', nameEn: 'Purple', hexCode: '#800080' },
] as const;

/**
 * メタリックカラーグループのデータ定義
 */
export const metallicColorGroups = [
  { slug: 'silver', name: 'シルバー', nameEn: 'Silver', hexCode: '#C0C0C0' },
  { slug: 'gold', name: 'ゴールド', nameEn: 'Gold', hexCode: '#FFD700' },
  { slug: 'black-steel', name: 'ブラックスチール', nameEn: 'Black Steel', hexCode: '#2F2F2F' },
  { slug: 'bronze', name: 'ブロンズ', nameEn: 'Bronze', hexCode: '#CD7F32' },
] as const;

/**
 * すべてのカラータイプ
 */
export const colorTypes = [
  { slug: 'wood', name: '木目', nameEn: 'Wood', sortOrder: 1 },
  { slug: 'solid', name: 'ソリッドカラー', nameEn: 'Solid Color', sortOrder: 2 },
  { slug: 'metallic', name: 'メタリック', nameEn: 'Metallic', sortOrder: 3 },
  { slug: 'other', name: 'その他', nameEn: 'Other', sortOrder: 4 },
] as const;
