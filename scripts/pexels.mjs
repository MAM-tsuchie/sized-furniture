/**
 * Pexels API ヘルパーモジュール
 *
 * 商用利用可能な家具・インテリア写真を取得する。
 * PEXELS_API_KEY が未設定の場合は空配列を返し、記事生成を妨げない。
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const FURNITURE_SEARCH_TERMS = {
  '本棚': 'bookshelf interior room',
  'ダイニングテーブル': 'dining table interior',
  'ソファ': 'sofa living room interior',
  'ベッド': 'bedroom bed interior design',
  '椅子': 'office chair desk workspace',
  'オフィスチェア': 'office chair workspace',
  'シューズラック': 'shoe rack entryway storage',
  'ワードローブ': 'wardrobe closet bedroom',
  'キッチン収納': 'kitchen cabinet storage',
  '食器棚': 'kitchen cabinet dishes',
  'デスク': 'desk workspace interior',
  'テレビ台': 'tv stand living room',
  '学習机': 'study desk room',
  'スタンディングデスク': 'standing desk workspace',
  'L字デスク': 'L shaped desk workspace',
  'コンパクト家具': 'compact furniture small room',
  'オープンラック': 'open shelf storage room',
  '収納': 'storage furniture interior',
  'ペット': 'pet friendly living room furniture',
  '間取り': 'room layout furniture design',
  '8畳': 'japanese room interior furniture',
  '10畳': 'living room interior furniture',
  '1LDK': 'apartment living room modern',
  'ワンルーム': 'studio apartment furniture',
  '新生活': 'modern apartment interior furniture',
  '在宅ワーク': 'home office workspace desk',
  '引越し': 'moving new apartment furniture',
  '二人暮らし': 'couple apartment interior furniture',
  '赤ちゃん': 'nursery baby room furniture',
  'シニア': 'senior living room furniture',
  '地震対策': 'furniture safety anchored home',
  'カラー': 'furniture color interior design',
  '採寸': 'measuring room interior furniture',
  '配置': 'furniture placement interior room',
  '組み立て家具': 'furniture assembly modern room',
};

/**
 * トピックのタグ・タイトルから英語の検索クエリを決定
 */
export function getSearchQuery(tags, title) {
  for (const tag of tags) {
    if (FURNITURE_SEARCH_TERMS[tag]) return FURNITURE_SEARCH_TERMS[tag];
  }
  for (const [key, value] of Object.entries(FURNITURE_SEARCH_TERMS)) {
    if (title.includes(key)) return value;
  }
  return 'furniture interior design';
}

/**
 * Pexels API から画像を取得
 * @param {string} query - 検索クエリ（英語推奨）
 * @param {number} count - 取得枚数
 * @returns {Promise<Array<{id: number, large: string, large2x: string, medium: string, alt: string, photographer: string}>>}
 */
export async function fetchPexelsImages(query, count = 3) {
  if (!PEXELS_API_KEY) {
    console.warn('  ⚠ PEXELS_API_KEY が未設定のため画像取得をスキップします');
    return [];
  }

  const url = new URL('https://api.pexels.com/v1/search');
  url.searchParams.set('query', query);
  url.searchParams.set('per_page', String(count));
  url.searchParams.set('orientation', 'landscape');
  url.searchParams.set('size', 'large');

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: PEXELS_API_KEY },
    });

    if (!res.ok) {
      console.warn(`  ⚠ Pexels API エラー (${res.status}): ${await res.text()}`);
      return [];
    }

    const data = await res.json();
    return data.photos.map((p) => ({
      id: p.id,
      large: p.src.large,
      large2x: p.src.large2x,
      medium: p.src.medium,
      alt: p.alt || query,
      photographer: p.photographer,
    }));
  } catch (err) {
    console.warn(`  ⚠ Pexels API 接続エラー: ${err.message}`);
    return [];
  }
}

/**
 * Markdown 本文の見出しセクション間に画像を挿入
 * H2 を優先的に使い、H2 が少ない場合は H3 も挿入位置として利用する。
 * @param {string} content - Markdown本文
 * @param {Array} images - fetchPexelsImages の戻り値（coverImage用の1枚目は除く）
 * @param {string} altPrefix - alt テキストの接頭辞（例: "ダイニングテーブル"）
 * @returns {string}
 */
export function insertInlineImages(content, images, altPrefix) {
  if (!images || images.length === 0) return content;

  const lines = content.split('\n');

  // H2 の位置を収集し、足りなければ H3 も含める
  let headingIndices = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) headingIndices.push(i);
  }
  if (headingIndices.length < 2) {
    headingIndices = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('## ') || lines[i].startsWith('### ')) {
        headingIndices.push(i);
      }
    }
  }

  if (headingIndices.length < 2) return content;

  const positions = [];
  // 2番目の見出しの直前に1枚目
  positions.push({ lineIdx: headingIndices[1], imgIdx: 0 });

  // 見出しが4つ以上あれば中間あたりに2枚目
  if (headingIndices.length >= 4 && images.length >= 2) {
    const mid = Math.floor(headingIndices.length / 2) + 1;
    if (mid < headingIndices.length) {
      positions.push({ lineIdx: headingIndices[mid], imgIdx: 1 });
    }
  }

  for (let i = positions.length - 1; i >= 0; i--) {
    const { lineIdx, imgIdx } = positions[i];
    const img = images[imgIdx];
    const alt = `${altPrefix}のイメージ`;
    const imgLine = `![${alt}](${img.large})`;
    lines.splice(lineIdx, 0, imgLine, '');
  }

  return lines.join('\n');
}
