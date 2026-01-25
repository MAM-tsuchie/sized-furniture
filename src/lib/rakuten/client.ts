import type { Product } from '@/types';

/**
 * 楽天商品検索API クライアント
 * 
 * 必要な環境変数:
 * - RAKUTEN_APPLICATION_ID: アプリケーションID
 * - RAKUTEN_AFFILIATE_ID: アフィリエイトID
 */

interface RakutenClientConfig {
  applicationId: string;
  affiliateId: string;
}

interface RakutenSearchParams {
  keyword?: string;
  genreId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  hits?: number;
  sort?: string;
}

interface RakutenItem {
  itemCode: string;
  itemName: string;
  itemPrice: number;
  itemCaption: string;
  itemUrl: string;
  affiliateUrl: string;
  shopCode: string;
  shopName: string;
  shopUrl: string;
  mediumImageUrls: Array<{ imageUrl: string }>;
  smallImageUrls: Array<{ imageUrl: string }>;
  availability: number;
  reviewCount: number;
  reviewAverage: number;
}

interface RakutenSearchResponse {
  Items: Array<{ Item: RakutenItem }>;
  pageCount: number;
  count: number;
  page: number;
  first: number;
  last: number;
  hits: number;
}

export class RakutenClient {
  private config: RakutenClientConfig;
  private baseUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601';

  constructor(config: RakutenClientConfig) {
    this.config = config;
  }

  /**
   * 商品を検索
   */
  async searchItems(params: RakutenSearchParams): Promise<{
    items: RakutenItem[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const searchParams = new URLSearchParams({
      applicationId: this.config.applicationId,
      affiliateId: this.config.affiliateId,
      format: 'json',
      hits: String(params.hits || 30),
      page: String(params.page || 1),
    });

    if (params.keyword) {
      searchParams.set('keyword', params.keyword);
    }
    if (params.genreId) {
      searchParams.set('genreId', params.genreId);
    }
    if (params.minPrice) {
      searchParams.set('minPrice', String(params.minPrice));
    }
    if (params.maxPrice) {
      searchParams.set('maxPrice', String(params.maxPrice));
    }
    if (params.sort) {
      searchParams.set('sort', params.sort);
    }

    try {
      const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Rakuten API error: ${response.status}`);
      }

      const data: RakutenSearchResponse = await response.json();

      return {
        items: data.Items.map(i => i.Item),
        total: data.count,
        page: data.page,
        totalPages: data.pageCount,
      };
    } catch (error) {
      console.error('Rakuten search error:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };
    }
  }

  /**
   * 楽天商品をProduct型に変換
   */
  convertToProduct(item: RakutenItem, regionId: string): Partial<Product> {
    // サイズ情報をパース
    const sizeInfo = this.parseSizeFromCaption(item.itemCaption);

    return {
      externalId: item.itemCode,
      source: 'rakuten',
      regionId,
      title: item.itemName,
      price: item.itemPrice,
      originalCurrency: 'JPY',
      priceLocal: item.itemPrice,
      imageUrl: item.mediumImageUrls[0]?.imageUrl || '',
      imageUrls: item.mediumImageUrls.map(i => i.imageUrl),
      widthCm: sizeInfo.width,
      depthCm: sizeInfo.depth,
      heightCm: sizeInfo.height,
      brand: item.shopName,
      affiliateUrl: item.affiliateUrl,
      originalUrl: item.itemUrl,
      isAvailable: item.availability === 1,
      rawData: item as unknown as Record<string, unknown>,
    };
  }

  /**
   * 商品説明からサイズ情報をパース
   */
  private parseSizeFromCaption(caption: string): {
    width: number | null;
    depth: number | null;
    height: number | null;
  } {
    const result = { width: null as number | null, depth: null as number | null, height: null as number | null };

    // 幅のパターン
    const widthPatterns = [
      /幅[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)/,
      /W[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)?/i,
      /横[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)/,
      /(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)\s*[×xX]\s*\d+/,
    ];

    // 奥行きのパターン
    const depthPatterns = [
      /奥行[き]?[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)/,
      /D[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)?/i,
      /\d+\s*(?:cm|CM|ｃｍ)?\s*[×xX]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)?\s*[×xX]\s*\d+/,
    ];

    // 高さのパターン
    const heightPatterns = [
      /高さ[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)/,
      /H[:\s]*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)?/i,
      /\d+\s*(?:cm|CM|ｃｍ)?\s*[×xX]\s*\d+\s*(?:cm|CM|ｃｍ)?\s*[×xX]\s*(\d+(?:\.\d+)?)\s*(?:cm|CM|ｃｍ)?/,
    ];

    for (const pattern of widthPatterns) {
      const match = caption.match(pattern);
      if (match) {
        result.width = parseFloat(match[1]);
        break;
      }
    }

    for (const pattern of depthPatterns) {
      const match = caption.match(pattern);
      if (match) {
        result.depth = parseFloat(match[1]);
        break;
      }
    }

    for (const pattern of heightPatterns) {
      const match = caption.match(pattern);
      if (match) {
        result.height = parseFloat(match[1]);
        break;
      }
    }

    return result;
  }
}

/**
 * 楽天クライアントを作成
 */
export function createRakutenClient(): RakutenClient | null {
  const applicationId = process.env.RAKUTEN_APPLICATION_ID;
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID;

  if (!applicationId || !affiliateId) {
    console.warn('Rakuten API credentials not configured');
    return null;
  }

  return new RakutenClient({ applicationId, affiliateId });
}

/**
 * 楽天の家具ジャンルID
 */
export const RAKUTEN_FURNITURE_GENRES = {
  furniture: '100804', // インテリア・寝具・収納
  desk: '566382',      // デスク
  chair: '215122',     // イス・チェア
  storage: '215134',   // 収納家具
  bed: '100806',       // 寝具
  sofa: '559102',      // ソファ・ソファベッド
  table: '566376',     // テーブル
};
