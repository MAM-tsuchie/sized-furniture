import type { AmazonEndpoint, RegionCode } from '@/types';

/**
 * Amazon Product Advertising API エンドポイント
 */
export const AMAZON_ENDPOINTS: Record<RegionCode, AmazonEndpoint> = {
  us: {
    host: 'webservices.amazon.com',
    region: 'us-east-1',
    marketplace: 'www.amazon.com',
  },
  uk: {
    host: 'webservices.amazon.co.uk',
    region: 'eu-west-1',
    marketplace: 'www.amazon.co.uk',
  },
  de: {
    host: 'webservices.amazon.de',
    region: 'eu-west-1',
    marketplace: 'www.amazon.de',
  },
  fr: {
    host: 'webservices.amazon.fr',
    region: 'eu-west-1',
    marketplace: 'www.amazon.fr',
  },
  jp: {
    host: 'webservices.amazon.co.jp',
    region: 'us-west-2',
    marketplace: 'www.amazon.co.jp',
  },
  au: {
    host: 'webservices.amazon.com.au',
    region: 'us-west-2',
    marketplace: 'www.amazon.com.au',
  },
  ca: {
    host: 'webservices.amazon.ca',
    region: 'us-east-1',
    marketplace: 'www.amazon.ca',
  },
};

/**
 * 家具カテゴリの Browse Node ID
 */
export const FURNITURE_BROWSE_NODES: Record<RegionCode, string> = {
  jp: '2045Icons', // 日本のホーム＆キッチン > 家具
  us: '1063306',   // US Furniture
  uk: '3340291',   // UK Furniture
  de: '322525011', // DE Möbel
  fr: '57004031',  // FR Ameublement
  au: '4851626051', // AU Furniture
  ca: '6705177011', // CA Furniture
};

/**
 * 家具カテゴリの SearchIndex
 */
export const FURNITURE_SEARCH_INDEX: Record<RegionCode, string> = {
  jp: 'HomeAndKitchen',
  us: 'Furniture',
  uk: 'Kitchen',
  de: 'Kitchen',
  fr: 'Kitchen',
  au: 'HomeAndKitchen',
  ca: 'Furniture',
};
