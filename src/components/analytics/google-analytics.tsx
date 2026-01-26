'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// ページビューを送信
export function pageview(url: string) {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

// イベントを送信
export function event({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// カスタムイベント: 商品検索
export function trackSearch(params: {
  category?: string;
  widthMin?: number;
  widthMax?: number;
  depthMin?: number;
  depthMax?: number;
  heightMin?: number;
  heightMax?: number;
  colorGroup?: string;
  woodType?: string;
  resultsCount: number;
}) {
  event({
    action: 'search',
    category: 'engagement',
    label: params.category || 'all',
    value: params.resultsCount,
  });
}

// カスタムイベント: 商品クリック
export function trackProductClick(productId: string, productName: string, source: string) {
  event({
    action: 'product_click',
    category: 'engagement',
    label: `${productId}:${productName}:${source}`,
  });
}

// カスタムイベント: アフィリエイトリンククリック
export function trackAffiliateClick(productId: string, affiliateSource: string) {
  event({
    action: 'affiliate_click',
    category: 'conversion',
    label: `${productId}:${affiliateSource}`,
  });
}

// ページビュートラッカーコンポーネント
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && GA_MEASUREMENT_ID) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

// メインコンポーネント
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

// TypeScript型定義
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set' | 'consent',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
