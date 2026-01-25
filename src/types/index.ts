// ============================================
// 地域・言語関連
// ============================================

export type RegionCode = 'jp' | 'us' | 'uk' | 'de' | 'fr' | 'au' | 'ca';
export type Language = 'ja' | 'en' | 'de' | 'fr';
export type Currency = 'JPY' | 'USD' | 'GBP' | 'EUR' | 'AUD' | 'CAD';
export type SizeUnit = 'cm' | 'inch';

export interface Region {
  id: string;
  code: RegionCode;
  name: string;
  nameLocal: string;
  language: Language;
  currency: Currency;
  currencySymbol: string;
  sizeUnit: SizeUnit;
  isActive: boolean;
  sortOrder: number;
}

// ============================================
// カテゴリ関連
// ============================================

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  level: number;
  sortOrder: number;
  icon: string | null;
  isActive: boolean;
  children?: Category[];
}

export interface CategoryPath {
  ancestorId: string;
  descendantId: string;
  depth: number;
}

// ============================================
// カラー関連
// ============================================

export type ColorTypeName = 'wood' | 'solid' | 'metallic' | 'other';

export interface ColorType {
  id: string;
  name: string;
  nameEn: string;
  slug: ColorTypeName;
  sortOrder: number;
}

export interface ColorGroup {
  id: string;
  colorTypeId: string;
  name: string;
  nameEn: string;
  slug: string;
  hexCode: string | null;
  previewImage: string | null;
  sortOrder: number;
}

export interface WoodType {
  id: string;
  name: string;
  nameEn: string;
  colorGroupId: string;
  description: string | null;
  previewImage: string | null;
  sortOrder: number;
}

export interface DetectedColorInfo {
  colorGroup: string | null;
  woodType: string | null;
}

// ============================================
// 商品関連
// ============================================

export type ProductSource = 'amazon' | 'rakuten' | 'wayfair' | 'other';

export interface Product {
  id: string;
  externalId: string;
  source: ProductSource;
  regionId: string;
  title: string;
  price: number;
  originalCurrency: Currency;
  priceLocal: number | null;
  imageUrl: string;
  imageUrls: string[];
  widthCm: number | null;
  depthCm: number | null;
  heightCm: number | null;
  weightKg: number | null;
  categoryId: string | null;
  colorGroupId: string | null;
  woodTypeId: string | null;
  colorName: string | null;
  brand: string | null;
  material: string | null;
  features: string[];
  affiliateUrl: string;
  originalUrl: string;
  isAvailable: boolean;
  rawData: Record<string, unknown>;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSearchParams {
  widthMin?: number;
  widthMax?: number;
  depthMin?: number;
  depthMax?: number;
  heightMin?: number;
  heightMax?: number;
  categoryId?: string;
  colorGroupId?: string;
  woodTypeId?: string;
  regionCode?: RegionCode;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'relevance' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  searchParams: ProductSearchParams;
}

// ============================================
// アフィリエイト関連
// ============================================

export type AspProvider = 
  | 'amazon' 
  | 'rakuten' 
  | 'moshimo' 
  | 'valuecommerce' 
  | 'a8' 
  | 'cj' 
  | 'shareasale' 
  | 'awin' 
  | 'impact';

export interface AffiliateProgram {
  id: string;
  regionId: string;
  name: string;
  provider: AspProvider;
  apiEndpoint: string | null;
  affiliateTag: string | null;
  commissionRate: number | null;
  cookieDays: number | null;
  targetCountries: string[];
  affiliateCountries: string[] | null;
  isActive: boolean;
  config: Record<string, unknown>;
}

export interface AspProviderInfo {
  id: string;
  name: string;
  nameEn: string;
  slug: AspProvider;
  websiteUrl: string;
  apiAvailable: boolean;
  supportedRegions: RegionCode[];
}

export interface BrandAffiliate {
  id: string;
  brandName: string;
  brandSlug: string;
  aspProviderId: string;
  regionId: string;
  commissionRate: number | null;
  cookieDays: number | null;
  affiliateId: string | null;
  linkTemplate: string | null;
  isActive: boolean;
  notes: string | null;
}

export interface GeneratedAffiliateLink {
  url: string;
  provider: AspProvider;
  brand: string;
  trackingId: string;
}

// ============================================
// 検索ログ
// ============================================

export interface SearchLog {
  id: string;
  widthMin: number | null;
  widthMax: number | null;
  depthMin: number | null;
  depthMax: number | null;
  heightMin: number | null;
  heightMax: number | null;
  categoryId: string | null;
  colorGroupId: string | null;
  woodTypeId: string | null;
  regionCode: RegionCode;
  resultsCount: number;
  createdAt: Date;
}

// ============================================
// Amazon API 関連
// ============================================

export interface AmazonEndpoint {
  host: string;
  region: string;
  marketplace: string;
}

export interface AmazonSearchParams {
  keywords: string;
  searchIndex?: string;
  browseNode?: string;
  minPrice?: number;
  maxPrice?: number;
  itemPage?: number;
}

export interface AmazonProductItem {
  asin: string;
  title: string;
  detailPageUrl: string;
  imageUrl: string;
  images: string[];
  price: number | null;
  currency: string;
  availability: string;
  features: string[];
  dimensions?: {
    width?: number;
    depth?: number;
    height?: number;
    unit: string;
  };
  color?: string;
  brand?: string;
  material?: string;
}
