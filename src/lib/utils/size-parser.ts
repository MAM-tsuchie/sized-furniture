/**
 * 商品情報からサイズを抽出するユーティリティ
 */

export interface ParsedSize {
  width: number | null;
  depth: number | null;
  height: number | null;
  unit: 'cm' | 'inch' | 'mm';
}

/**
 * サイズパースのパターン定義
 */
const SIZE_PATTERNS = {
  // 日本語パターン
  ja: {
    width: [
      /幅[:\s：]*約?(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ|センチ)/,
      /横幅[:\s：]*約?(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)/,
      /W[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM)?/i,
    ],
    depth: [
      /奥行[きい]?[:\s：]*約?(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ|センチ)/,
      /D[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM)?/i,
    ],
    height: [
      /高さ[:\s：]*約?(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ|センチ)/,
      /H[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM)?/i,
    ],
    // W×D×H 形式
    combined: /(\d+(?:\.\d+)?)\s*[×xX✕]\s*(\d+(?:\.\d+)?)\s*[×xX✕]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)?/,
  },
  // 英語パターン
  en: {
    width: [
      /width[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|in|inches?)?/i,
      /W[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|in|")?/i,
    ],
    depth: [
      /depth[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|in|inches?)?/i,
      /D[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|in|")?/i,
    ],
    height: [
      /height[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|in|inches?)?/i,
      /H[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|in|")?/i,
    ],
    combined: /(\d+(?:\.\d+)?)\s*[×xX"]\s*(\d+(?:\.\d+)?)\s*[×xX"]\s*(\d+(?:\.\d+)?)\s*(?:cm|in|inches?|")?/i,
  },
};

/**
 * テキストからサイズをパース
 */
export function parseSizeFromText(
  text: string,
  language: 'ja' | 'en' = 'ja'
): ParsedSize {
  const result: ParsedSize = {
    width: null,
    depth: null,
    height: null,
    unit: 'cm',
  };

  if (!text) return result;

  const patterns = SIZE_PATTERNS[language];

  // 結合パターン (W×D×H) を最初に試す
  const combinedMatch = text.match(patterns.combined);
  if (combinedMatch) {
    result.width = parseFloat(combinedMatch[1]);
    result.depth = parseFloat(combinedMatch[2]);
    result.height = parseFloat(combinedMatch[3]);
    
    // 単位を検出
    if (text.includes('in') || text.includes('"')) {
      result.unit = 'inch';
    } else if (text.includes('mm')) {
      result.unit = 'mm';
    }
    
    return result;
  }

  // 個別パターンを試す
  for (const pattern of patterns.width) {
    const match = text.match(pattern);
    if (match) {
      result.width = parseFloat(match[1]);
      break;
    }
  }

  for (const pattern of patterns.depth) {
    const match = text.match(pattern);
    if (match) {
      result.depth = parseFloat(match[1]);
      break;
    }
  }

  for (const pattern of patterns.height) {
    const match = text.match(pattern);
    if (match) {
      result.height = parseFloat(match[1]);
      break;
    }
  }

  // 単位を検出
  if (text.includes('inch') || text.includes('"') || text.match(/\d+\s*in\b/i)) {
    result.unit = 'inch';
  } else if (text.includes('mm') || text.includes('ミリ')) {
    result.unit = 'mm';
  }

  return result;
}

/**
 * 複数のソースからサイズを抽出
 */
export function parseSizeFromMultipleSources(
  sources: (string | null | undefined)[],
  language: 'ja' | 'en' = 'ja'
): ParsedSize {
  const result: ParsedSize = {
    width: null,
    depth: null,
    height: null,
    unit: 'cm',
  };

  for (const source of sources) {
    if (!source) continue;

    const parsed = parseSizeFromText(source, language);

    if (parsed.width !== null && result.width === null) {
      result.width = parsed.width;
      result.unit = parsed.unit;
    }
    if (parsed.depth !== null && result.depth === null) {
      result.depth = parsed.depth;
    }
    if (parsed.height !== null && result.height === null) {
      result.height = parsed.height;
    }

    // 全て取得できたら終了
    if (result.width !== null && result.depth !== null && result.height !== null) {
      break;
    }
  }

  return result;
}

/**
 * サイズをcmに正規化
 */
export function normalizeSizeToCm(size: ParsedSize): ParsedSize {
  const result = { ...size, unit: 'cm' as const };

  if (size.unit === 'inch') {
    if (result.width !== null) result.width = Math.round(result.width * 2.54 * 10) / 10;
    if (result.depth !== null) result.depth = Math.round(result.depth * 2.54 * 10) / 10;
    if (result.height !== null) result.height = Math.round(result.height * 2.54 * 10) / 10;
  } else if (size.unit === 'mm') {
    if (result.width !== null) result.width = Math.round(result.width / 10 * 10) / 10;
    if (result.depth !== null) result.depth = Math.round(result.depth / 10 * 10) / 10;
    if (result.height !== null) result.height = Math.round(result.height / 10 * 10) / 10;
  }

  return result;
}

/**
 * Amazon商品情報からサイズをパース
 */
export function parseSizeFromAmazonItem(item: {
  title?: string;
  features?: string[];
  dimensions?: {
    width?: number;
    depth?: number;
    height?: number;
    unit?: string;
  };
}): ParsedSize {
  // 構造化されたサイズ情報があればそれを使用
  if (item.dimensions) {
    const unit = item.dimensions.unit?.toLowerCase().includes('inch') ? 'inch' : 'cm';
    return normalizeSizeToCm({
      width: item.dimensions.width ?? null,
      depth: item.dimensions.depth ?? null,
      height: item.dimensions.height ?? null,
      unit,
    });
  }

  // タイトルと特徴からパース
  const sources = [
    item.title,
    ...(item.features || []),
  ];

  const parsed = parseSizeFromMultipleSources(sources, 'ja');
  return normalizeSizeToCm(parsed);
}
