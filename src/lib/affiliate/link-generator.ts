import type { AspProvider, GeneratedAffiliateLink } from '@/types';

/**
 * アフィリエイトリンク生成設定
 */
interface LinkGeneratorConfig {
  provider: AspProvider;
  affiliateId: string;
  programId?: string;
}

/**
 * もしもアフィリエイト用リンク生成
 */
function generateMoshimoLink(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  const params = new URLSearchParams({
    a_id: config.affiliateId,
    url: productUrl,
  });
  
  // プログラムIDがある場合は追加
  if (config.programId) {
    params.set('p_id', config.programId);
  }

  return `https://af.moshimo.com/af/c/click?${params.toString()}`;
}

/**
 * 楽天アフィリエイト用リンク生成
 */
function generateRakutenLink(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  return `https://hb.afl.rakuten.co.jp/hgc/${config.affiliateId}/?pc=${encodeURIComponent(productUrl)}`;
}

/**
 * Amazon アソシエイト用リンク生成
 */
function generateAmazonLink(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  const url = new URL(productUrl);
  url.searchParams.set('tag', config.affiliateId);
  return url.toString();
}

/**
 * CJ Affiliate 用リンク生成
 */
function generateCjLink(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  return `https://www.anrdoezrs.net/click-${config.affiliateId}?url=${encodeURIComponent(productUrl)}`;
}

/**
 * Awin 用リンク生成
 */
function generateAwinLink(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  return `https://www.awin1.com/cread.php?awinmid=${config.programId}&awinaffid=${config.affiliateId}&ued=${encodeURIComponent(productUrl)}`;
}

/**
 * バリューコマース用リンク生成
 */
function generateValueCommerceLink(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  return `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${config.affiliateId}&pid=${config.programId}&vc_url=${encodeURIComponent(productUrl)}`;
}

/**
 * A8.net 用リンク生成
 */
function generateA8Link(
  productUrl: string,
  config: LinkGeneratorConfig
): string {
  return `https://px.a8.net/svt/ejp?a8mat=${config.affiliateId}&a8ejpredirect=${encodeURIComponent(productUrl)}`;
}

/**
 * アフィリエイトリンクを生成
 */
export function generateAffiliateLink(
  productUrl: string,
  brand: string,
  config: LinkGeneratorConfig
): GeneratedAffiliateLink {
  let url: string;

  switch (config.provider) {
    case 'moshimo':
      url = generateMoshimoLink(productUrl, config);
      break;
    case 'rakuten':
      url = generateRakutenLink(productUrl, config);
      break;
    case 'amazon':
      url = generateAmazonLink(productUrl, config);
      break;
    case 'cj':
      url = generateCjLink(productUrl, config);
      break;
    case 'awin':
      url = generateAwinLink(productUrl, config);
      break;
    case 'valuecommerce':
      url = generateValueCommerceLink(productUrl, config);
      break;
    case 'a8':
      url = generateA8Link(productUrl, config);
      break;
    default:
      url = productUrl;
  }

  return {
    url,
    provider: config.provider,
    brand,
    trackingId: config.affiliateId,
  };
}

/**
 * 商品URLからASINを抽出（Amazon用）
 */
export function extractAsinFromUrl(url: string): string | null {
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/,
    /\/gp\/product\/([A-Z0-9]{10})/,
    /\/ASIN\/([A-Z0-9]{10})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * 楽天商品URLからショップコードと商品IDを抽出
 */
export function extractRakutenProductId(url: string): { shopCode: string; itemCode: string } | null {
  // 例: https://item.rakuten.co.jp/shop-code/item-code/
  const match = url.match(/item\.rakuten\.co\.jp\/([^/]+)\/([^/]+)/);
  if (match) {
    return {
      shopCode: match[1],
      itemCode: match[2],
    };
  }
  return null;
}
