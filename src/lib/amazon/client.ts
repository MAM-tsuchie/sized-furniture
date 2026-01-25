import type { RegionCode, AmazonProductItem, AmazonSearchParams } from '@/types';
import { AMAZON_ENDPOINTS, FURNITURE_SEARCH_INDEX } from './endpoints';
import { AwsSignature } from './signature';

/**
 * Amazon Product Advertising API 5.0 クライアント
 * 
 * 注意: このクライアントを使用するには、以下の環境変数が必要です：
 * - AMAZON_ACCESS_KEY: アクセスキー
 * - AMAZON_SECRET_KEY: シークレットキー
 * - AMAZON_PARTNER_TAG_JP: 日本のパートナータグ
 * - AMAZON_PARTNER_TAG_US: 米国のパートナータグ
 * など
 */

interface AmazonClientConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  regionCode: RegionCode;
}

export class AmazonClient {
  private config: AmazonClientConfig;
  private endpoint: typeof AMAZON_ENDPOINTS[RegionCode];
  private signer: AwsSignature;

  constructor(config: AmazonClientConfig) {
    this.config = config;
    this.endpoint = AMAZON_ENDPOINTS[config.regionCode];
    this.signer = new AwsSignature(
      config.accessKey,
      config.secretKey,
      this.endpoint.region,
      'ProductAdvertisingAPI'
    );
  }

  /**
   * AWS Signature Version 4 署名を生成
   */
  private sign(
    method: string,
    path: string,
    headers: Record<string, string>,
    payload: string
  ): Record<string, string> {
    return this.signer.sign(method, this.endpoint.host, path, headers, payload);
  }

  /**
   * API リクエストを送信
   */
  private async request<T>(operation: string, payload: object): Promise<T> {
    const url = `https://${this.endpoint.host}/paapi5/${operation.toLowerCase()}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Encoding': 'amz-1.0',
      'X-Amz-Target': `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${operation}`,
      'Host': this.endpoint.host,
    };

    const body = JSON.stringify({
      ...payload,
      PartnerTag: this.config.partnerTag,
      PartnerType: 'Associates',
      Marketplace: `www.amazon.${this.getMarketplaceSuffix()}`,
    });

    const signedHeaders = await this.sign('POST', `/paapi5/${operation.toLowerCase()}`, headers, body);

    const response = await fetch(url, {
      method: 'POST',
      headers: signedHeaders,
      body,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Amazon API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  private getMarketplaceSuffix(): string {
    const suffixes: Record<RegionCode, string> = {
      jp: 'co.jp',
      us: 'com',
      uk: 'co.uk',
      de: 'de',
      fr: 'fr',
      au: 'com.au',
      ca: 'ca',
    };
    return suffixes[this.config.regionCode];
  }

  /**
   * 商品を検索
   */
  async searchItems(params: AmazonSearchParams): Promise<AmazonProductItem[]> {
    const searchIndex = params.searchIndex || FURNITURE_SEARCH_INDEX[this.config.regionCode];

    const payload = {
      Keywords: params.keywords,
      SearchIndex: searchIndex,
      BrowseNodeId: params.browseNode,
      ItemCount: 10,
      ItemPage: params.itemPage || 1,
      Resources: [
        'Images.Primary.Large',
        'Images.Variants.Large',
        'ItemInfo.Title',
        'ItemInfo.Features',
        'ItemInfo.ProductInfo',
        'ItemInfo.ManufactureInfo',
        'Offers.Listings.Price',
        'Offers.Listings.Availability.Message',
      ],
      ...(params.minPrice && { MinPrice: params.minPrice }),
      ...(params.maxPrice && { MaxPrice: params.maxPrice }),
    };

    try {
      const response = await this.request<AmazonSearchResponse>('SearchItems', payload);
      return this.parseSearchResponse(response);
    } catch (error) {
      console.error('Amazon search error:', error);
      return [];
    }
  }

  /**
   * ASIN で商品を取得
   */
  async getItems(asins: string[]): Promise<AmazonProductItem[]> {
    const payload = {
      ItemIds: asins,
      Resources: [
        'Images.Primary.Large',
        'Images.Variants.Large',
        'ItemInfo.Title',
        'ItemInfo.Features',
        'ItemInfo.ProductInfo',
        'ItemInfo.ManufactureInfo',
        'ItemInfo.TechnicalInfo',
        'Offers.Listings.Price',
        'Offers.Listings.Availability.Message',
      ],
    };

    try {
      const response = await this.request<AmazonGetItemsResponse>('GetItems', payload);
      return this.parseGetItemsResponse(response);
    } catch (error) {
      console.error('Amazon get items error:', error);
      return [];
    }
  }

  /**
   * 検索レスポンスをパース
   */
  private parseSearchResponse(response: AmazonSearchResponse): AmazonProductItem[] {
    if (!response.SearchResult?.Items) {
      return [];
    }

    return response.SearchResult.Items.map((item) => this.parseItem(item));
  }

  /**
   * GetItems レスポンスをパース
   */
  private parseGetItemsResponse(response: AmazonGetItemsResponse): AmazonProductItem[] {
    if (!response.ItemsResult?.Items) {
      return [];
    }

    return response.ItemsResult.Items.map((item) => this.parseItem(item));
  }

  /**
   * 商品データをパース
   */
  private parseItem(item: AmazonItem): AmazonProductItem {
    const dimensions = this.parseDimensions(item.ItemInfo?.ProductInfo?.ItemDimensions);
    
    return {
      asin: item.ASIN,
      title: item.ItemInfo?.Title?.DisplayValue || '',
      detailPageUrl: item.DetailPageURL || '',
      imageUrl: item.Images?.Primary?.Large?.URL || '',
      images: this.parseImages(item.Images),
      price: this.parsePrice(item.Offers?.Listings?.[0]?.Price),
      currency: item.Offers?.Listings?.[0]?.Price?.Currency || 'JPY',
      availability: item.Offers?.Listings?.[0]?.Availability?.Message || '',
      features: item.ItemInfo?.Features?.DisplayValues || [],
      dimensions,
      color: item.ItemInfo?.ProductInfo?.Color?.DisplayValue,
      brand: item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue,
      material: item.ItemInfo?.ProductInfo?.Material?.DisplayValue,
    };
  }

  /**
   * 寸法をパース
   */
  private parseDimensions(dimensions?: AmazonDimensions): AmazonProductItem['dimensions'] {
    if (!dimensions) return undefined;

    return {
      width: dimensions.Width?.DisplayValue,
      depth: dimensions.Length?.DisplayValue,
      height: dimensions.Height?.DisplayValue,
      unit: dimensions.Width?.Unit || 'cm',
    };
  }

  /**
   * 画像をパース
   */
  private parseImages(images?: AmazonImages): string[] {
    const urls: string[] = [];
    
    if (images?.Primary?.Large?.URL) {
      urls.push(images.Primary.Large.URL);
    }
    
    if (images?.Variants) {
      for (const variant of images.Variants) {
        if (variant.Large?.URL) {
          urls.push(variant.Large.URL);
        }
      }
    }

    return urls;
  }

  /**
   * 価格をパース
   */
  private parsePrice(price?: AmazonPrice): number | null {
    if (!price?.Amount) return null;
    return price.Amount;
  }
}

// API レスポンスの型定義
interface AmazonSearchResponse {
  SearchResult?: {
    Items?: AmazonItem[];
    TotalResultCount?: number;
  };
}

interface AmazonGetItemsResponse {
  ItemsResult?: {
    Items?: AmazonItem[];
  };
}

interface AmazonItem {
  ASIN: string;
  DetailPageURL?: string;
  Images?: AmazonImages;
  ItemInfo?: {
    Title?: { DisplayValue?: string };
    Features?: { DisplayValues?: string[] };
    ProductInfo?: {
      ItemDimensions?: AmazonDimensions;
      Color?: { DisplayValue?: string };
      Material?: { DisplayValue?: string };
    };
    ByLineInfo?: {
      Brand?: { DisplayValue?: string };
    };
    ManufactureInfo?: {
      Model?: { DisplayValue?: string };
    };
  };
  Offers?: {
    Listings?: Array<{
      Price?: AmazonPrice;
      Availability?: { Message?: string };
    }>;
  };
}

interface AmazonImages {
  Primary?: {
    Large?: { URL?: string };
  };
  Variants?: Array<{
    Large?: { URL?: string };
  }>;
}

interface AmazonDimensions {
  Width?: { DisplayValue?: number; Unit?: string };
  Length?: { DisplayValue?: number; Unit?: string };
  Height?: { DisplayValue?: number; Unit?: string };
}

interface AmazonPrice {
  Amount?: number;
  Currency?: string;
}

/**
 * 地域ごとのクライアントを作成
 */
export function createAmazonClient(regionCode: RegionCode): AmazonClient | null {
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;
  const partnerTag = process.env[`AMAZON_PARTNER_TAG_${regionCode.toUpperCase()}`];

  if (!accessKey || !secretKey || !partnerTag) {
    console.warn(`Amazon API credentials not configured for region: ${regionCode}`);
    return null;
  }

  return new AmazonClient({
    accessKey,
    secretKey,
    partnerTag,
    regionCode,
  });
}
