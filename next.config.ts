import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 画像最適化設定
  images: {
    remotePatterns: [
      // Amazon (各国)
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-eu.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-fe.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '*.media-amazon.com',
      },
      // 楽天
      {
        protocol: 'https',
        hostname: 'thumbnail.image.rakuten.co.jp',
      },
      {
        protocol: 'https',
        hostname: 'shop.r10s.jp',
      },
      {
        protocol: 'https',
        hostname: 'image.rakuten.co.jp',
      },
      // その他ECサイト
      {
        protocol: 'https',
        hostname: '*.ikea.com',
      },
      {
        protocol: 'https',
        hostname: '*.nitori-net.jp',
      },
      // プレースホルダー
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    // 画像フォーマット
    formats: ['image/avif', 'image/webp'],
    // キャッシュ期間（秒）
    minimumCacheTTL: 60 * 60 * 24, // 24時間
    // デバイスサイズ
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // 画像サイズ
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // リダイレクト設定
  async redirects() {
    return [
      {
        source: '/furniture',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/search',
        permanent: true,
      },
    ];
  },

  // 実験的機能
  experimental: {
    // サーバーアクション有効化
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ビルド時の型チェック
  typescript: {
    // 本番環境ではビルド時の型エラーを無視しない
    ignoreBuildErrors: false,
  },

  // 圧縮
  compress: true,

  // パワードバイヘッダーを無効化
  poweredByHeader: false,

  // 本番ビルド時にソースマップを生成
  productionBrowserSourceMaps: false,

  // React Strict Mode
  reactStrictMode: true,

  // 環境変数
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://sized-furniture.com',
  },
};

export default nextConfig;
