import { createServerSupabaseClient } from '@/lib/supabase/client';
import { createAmazonClient, type AmazonClient } from '@/lib/amazon/client';
import { createRakutenClient, type RakutenClient } from '@/lib/rakuten/client';
import { detectColorInfo } from '@/lib/colors/utils';
import { parseSizeFromAmazonItem } from '@/lib/utils/size-parser';
import type { RegionCode, Product, ProductSource } from '@/types';

interface FetcherConfig {
  regionCode: RegionCode;
  batchSize?: number;
}

interface FetchResult {
  success: number;
  failed: number;
  skipped: number;
  errors: string[];
}

/**
 * 商品データ取得バッチ処理
 */
export class ProductFetcher {
  private supabase = createServerSupabaseClient();
  private amazonClient: AmazonClient | null;
  private rakutenClient: RakutenClient | null;
  private config: FetcherConfig;

  constructor(config: FetcherConfig) {
    this.config = {
      batchSize: 100,
      ...config,
    };

    this.amazonClient = createAmazonClient(config.regionCode);
    this.rakutenClient = config.regionCode === 'jp' ? createRakutenClient() : null;
  }

  /**
   * カテゴリの商品を取得
   */
  async fetchByCategory(
    categorySlug: string,
    keywords: string[]
  ): Promise<FetchResult> {
    const result: FetchResult = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    // カテゴリIDを取得
    const { data: category } = await this.supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (!category) {
      result.errors.push(`Category not found: ${categorySlug}`);
      return result;
    }

    // 地域IDを取得
    const { data: region } = await this.supabase
      .from('regions')
      .select('id')
      .eq('code', this.config.regionCode)
      .single();

    if (!region) {
      result.errors.push(`Region not found: ${this.config.regionCode}`);
      return result;
    }

    for (const keyword of keywords) {
      // Amazonから取得
      if (this.amazonClient) {
        try {
          const amazonItems = await this.amazonClient.searchItems({ keywords: keyword });
          
          for (const item of amazonItems) {
            const saveResult = await this.saveProduct(
              this.convertAmazonItem(item, region.id, category.id),
              'amazon'
            );
            if (saveResult === 'success') result.success++;
            else if (saveResult === 'skipped') result.skipped++;
            else result.failed++;
          }
        } catch (error) {
          result.errors.push(`Amazon fetch error: ${error}`);
        }
      }

      // 楽天から取得（日本のみ）
      if (this.rakutenClient && this.config.regionCode === 'jp') {
        try {
          const rakutenResult = await this.rakutenClient.searchItems({ keyword });
          
          for (const item of rakutenResult.items) {
            const product = this.rakutenClient.convertToProduct(item, region.id);
            product.categoryId = category.id;
            
            const saveResult = await this.saveProduct(product, 'rakuten');
            if (saveResult === 'success') result.success++;
            else if (saveResult === 'skipped') result.skipped++;
            else result.failed++;
          }
        } catch (error) {
          result.errors.push(`Rakuten fetch error: ${error}`);
        }
      }
    }

    return result;
  }

  /**
   * Amazon商品をProduct型に変換
   */
  private convertAmazonItem(
    item: Awaited<ReturnType<AmazonClient['searchItems']>>[number],
    regionId: string,
    categoryId: string
  ): Partial<Product> {
    // サイズをパース
    const sizeInfo = parseSizeFromAmazonItem({
      title: item.title,
      features: item.features,
      dimensions: item.dimensions,
    });

    // カラーを検出（将来の拡張のためにcolorInfoを使用可能）
    detectColorInfo(item.color || item.title);

    return {
      externalId: item.asin,
      source: 'amazon',
      regionId,
      title: item.title,
      price: item.price ?? undefined,
      originalCurrency: item.currency as Product['originalCurrency'],
      priceLocal: item.price ?? undefined,
      imageUrl: item.imageUrl,
      imageUrls: item.images,
      widthCm: sizeInfo.width ?? undefined,
      depthCm: sizeInfo.depth ?? undefined,
      heightCm: sizeInfo.height ?? undefined,
      categoryId,
      colorName: item.color,
      brand: item.brand,
      material: item.material,
      features: item.features,
      affiliateUrl: item.detailPageUrl,
      originalUrl: item.detailPageUrl,
      isAvailable: item.availability !== 'Out of Stock',
      rawData: item as unknown as Record<string, unknown>,
    };
  }

  /**
   * 商品をデータベースに保存
   */
  private async saveProduct(
    product: Partial<Product>,
    source: ProductSource
  ): Promise<'success' | 'skipped' | 'failed'> {
    if (!product.externalId || !product.regionId) {
      return 'failed';
    }

    try {
      // 既存チェック
      const { data: existing } = await this.supabase
        .from('products_cache')
        .select('id, fetched_at')
        .eq('external_id', product.externalId)
        .eq('source', source)
        .eq('region_id', product.regionId)
        .single();

      // 24時間以内に取得済みならスキップ
      if (existing) {
        const fetchedAt = new Date(existing.fetched_at);
        const now = new Date();
        const hoursDiff = (now.getTime() - fetchedAt.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          return 'skipped';
        }

        // 更新
        const { error } = await this.supabase
          .from('products_cache')
          .update({
            ...product,
            fetched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        return error ? 'failed' : 'success';
      }

      // カラーグループ・木材タイプのIDを解決
      if (product.colorName) {
        const colorInfo = detectColorInfo(product.colorName);
        
        if (colorInfo.woodType) {
          const { data: woodType } = await this.supabase
            .from('wood_types')
            .select('id, color_group_id')
            .eq('name_en', colorInfo.woodType)
            .single();
          
          if (woodType) {
            product.woodTypeId = woodType.id;
            product.colorGroupId = woodType.color_group_id;
          }
        } else if (colorInfo.colorGroup) {
          const { data: colorGroup } = await this.supabase
            .from('color_groups')
            .select('id')
            .eq('slug', colorInfo.colorGroup)
            .single();
          
          if (colorGroup) {
            product.colorGroupId = colorGroup.id;
          }
        }
      }

      // 新規挿入
      const { error } = await this.supabase
        .from('products_cache')
        .insert({
          external_id: product.externalId,
          source,
          region_id: product.regionId,
          title: product.title,
          price: product.price,
          original_currency: product.originalCurrency,
          price_local: product.priceLocal,
          image_url: product.imageUrl,
          image_urls: product.imageUrls,
          width_cm: product.widthCm,
          depth_cm: product.depthCm,
          height_cm: product.heightCm,
          category_id: product.categoryId,
          color_group_id: product.colorGroupId,
          wood_type_id: product.woodTypeId,
          color_name: product.colorName,
          brand: product.brand,
          material: product.material,
          features: product.features,
          affiliate_url: product.affiliateUrl,
          original_url: product.originalUrl,
          is_available: product.isAvailable,
          raw_data: product.rawData,
          fetched_at: new Date().toISOString(),
        });

      return error ? 'failed' : 'success';
    } catch (error) {
      console.error('Save product error:', error);
      return 'failed';
    }
  }
}

const CATEGORY_KEYWORDS: Record<string, Record<string, string[]>> = {
  jp: {
    desks: ['デスク', 'パソコンデスク', 'ワークデスク', '学習机'],
    'dining-tables': ['ダイニングテーブル', '食卓'],
    'side-tables': ['サイドテーブル', 'ナイトテーブル'],
    'coffee-tables': ['ローテーブル', 'センターテーブル', 'リビングテーブル'],
    'office-chairs': ['オフィスチェア', 'デスクチェア', 'ワークチェア'],
    'dining-chairs': ['ダイニングチェア', '食卓椅子'],
    'lounge-chairs': ['ラウンジチェア', 'リラックスチェア', 'パーソナルチェア'],
    'bookcases-shelves': ['本棚', 'シェルフ', 'ラック'],
    'tv-stands': ['テレビ台', 'TVボード', 'ローボード'],
    cabinets: ['キャビネット', 'サイドボード', '食器棚'],
    chests: ['チェスト', 'タンス', '引き出し収納'],
    'bed-frames': ['ベッドフレーム', 'シングルベッド', 'ダブルベッド'],
    mattresses: ['マットレス', 'シングルマットレス', 'ダブルマットレス'],
    sofas: ['ソファ', '2人掛けソファ', '3人掛けソファ'],
    'sofa-beds': ['ソファベッド', '折りたたみソファ'],
  },
  en: {
    desks: ['desk', 'computer desk', 'writing desk', 'standing desk'],
    'dining-tables': ['dining table', 'kitchen table'],
    'side-tables': ['side table', 'end table', 'nightstand'],
    'coffee-tables': ['coffee table', 'center table'],
    'office-chairs': ['office chair', 'desk chair', 'ergonomic chair'],
    'dining-chairs': ['dining chair', 'kitchen chair'],
    'lounge-chairs': ['lounge chair', 'accent chair', 'armchair'],
    'bookcases-shelves': ['bookcase', 'bookshelf', 'shelving unit'],
    'tv-stands': ['TV stand', 'TV console', 'media console'],
    cabinets: ['cabinet', 'sideboard', 'buffet cabinet'],
    chests: ['chest of drawers', 'dresser', 'drawer chest'],
    'bed-frames': ['bed frame', 'platform bed', 'bed'],
    mattresses: ['mattress', 'memory foam mattress'],
    sofas: ['sofa', 'couch', 'loveseat', 'sectional sofa'],
    'sofa-beds': ['sofa bed', 'sleeper sofa', 'futon'],
  },
  de: {
    desks: ['Schreibtisch', 'Computertisch', 'Bürotisch'],
    'dining-tables': ['Esstisch', 'Küchentisch'],
    'side-tables': ['Beistelltisch', 'Nachttisch'],
    'coffee-tables': ['Couchtisch', 'Wohnzimmertisch'],
    'office-chairs': ['Bürostuhl', 'Schreibtischstuhl', 'Drehstuhl'],
    'dining-chairs': ['Esszimmerstuhl', 'Küchenstuhl'],
    'lounge-chairs': ['Lounge Sessel', 'Relaxsessel', 'Sessel'],
    'bookcases-shelves': ['Bücherregal', 'Regal', 'Standregal'],
    'tv-stands': ['TV-Schrank', 'Lowboard', 'Fernsehtisch'],
    cabinets: ['Schrank', 'Sideboard', 'Kommode'],
    chests: ['Kommode', 'Schubladenkommode'],
    'bed-frames': ['Bettgestell', 'Bett', 'Bettrahmen'],
    mattresses: ['Matratze', 'Kaltschaummatratze'],
    sofas: ['Sofa', 'Couch', 'Wohnlandschaft'],
    'sofa-beds': ['Schlafsofa', 'Schlafcouch'],
  },
  fr: {
    desks: ['bureau', 'bureau informatique', 'bureau debout'],
    'dining-tables': ['table à manger', 'table de cuisine'],
    'side-tables': ["table d'appoint", 'table de chevet'],
    'coffee-tables': ['table basse', 'table de salon'],
    'office-chairs': ['chaise de bureau', 'fauteuil de bureau'],
    'dining-chairs': ['chaise de salle à manger', 'chaise de cuisine'],
    'lounge-chairs': ['fauteuil', 'chaise longue'],
    'bookcases-shelves': ['bibliothèque', 'étagère'],
    'tv-stands': ['meuble TV', 'meuble télévision'],
    cabinets: ['armoire', 'buffet', 'vaisselier'],
    chests: ['commode', 'chiffonnier'],
    'bed-frames': ['cadre de lit', 'lit', 'sommier'],
    mattresses: ['matelas', 'matelas mousse'],
    sofas: ['canapé', 'sofa', "canapé d'angle"],
    'sofa-beds': ['canapé-lit', 'clic-clac', 'convertible'],
  },
};

function getKeywordsForRegion(regionCode: RegionCode): Record<string, string[]> {
  switch (regionCode) {
    case 'jp':
      return CATEGORY_KEYWORDS.jp;
    case 'de':
      return CATEGORY_KEYWORDS.de;
    case 'fr':
      return CATEGORY_KEYWORDS.fr;
    default:
      return CATEGORY_KEYWORDS.en;
  }
}

/**
 * 全カテゴリの商品を取得
 */
export async function fetchAllProducts(regionCode: RegionCode): Promise<FetchResult> {
  const fetcher = new ProductFetcher({ regionCode });
  const totalResult: FetchResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  const categoryKeywords = getKeywordsForRegion(regionCode);

  for (const [categorySlug, keywords] of Object.entries(categoryKeywords)) {
    const result = await fetcher.fetchByCategory(categorySlug, keywords);
    totalResult.success += result.success;
    totalResult.failed += result.failed;
    totalResult.skipped += result.skipped;
    totalResult.errors.push(...result.errors);
  }

  return totalResult;
}
