/**
 * Sentry エラー監視設定
 *
 * 使用方法:
 * 1. npm install @sentry/nextjs
 * 2. npx @sentry/wizard@latest -i nextjs
 * 3. 環境変数を設定:
 *    - NEXT_PUBLIC_SENTRY_DSN
 *    - SENTRY_AUTH_TOKEN (ビルド時のソースマップアップロード用)
 *
 * このファイルは Sentry SDKをインストールした後に有効化してください
 */

// Sentry設定のプレースホルダー
// 実際のインストール後は @sentry/nextjs を使用
export const SENTRY_CONFIG = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
};

// エラーレポート関数
export function reportError(error: Error, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Report]', error, context);
    return;
  }

  // Sentryがインストールされている場合
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.captureException(error, { extra: context });

  // フォールバック: コンソールに出力
  console.error('[Production Error]', error.message);
}

// ユーザー情報の設定
export function setUser(user: { id: string; email?: string; region?: string } | null) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry] Set user:', user);
    return;
  }

  // Sentryがインストールされている場合
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.setUser(user);
}

// カスタムタグの設定
export function setTag(key: string, value: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry] Set tag:', key, value);
    return;
  }

  // Sentryがインストールされている場合
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.setTag(key, value);
}

// ブレッドクラムの追加
export function addBreadcrumb(breadcrumb: {
  category: string;
  message: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}) {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Sentry Breadcrumb]', breadcrumb);
    return;
  }

  // Sentryがインストールされている場合
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.addBreadcrumb(breadcrumb);
}
