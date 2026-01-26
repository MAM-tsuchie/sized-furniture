/**
 * Sentry Client Configuration
 *
 * このファイルは @sentry/nextjs をインストール後に有効化してください
 * npm install @sentry/nextjs
 *
 * 有効化後、以下のコメントを解除してください
 */

// import * as Sentry from '@sentry/nextjs';
// import { SENTRY_CONFIG } from '@/lib/monitoring/sentry';

// Sentry.init({
//   dsn: SENTRY_CONFIG.dsn,
//   environment: SENTRY_CONFIG.environment,
//
//   // パフォーマンス監視
//   tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
//
//   // セッションリプレイ
//   replaysSessionSampleRate: SENTRY_CONFIG.replaysSessionSampleRate,
//   replaysOnErrorSampleRate: SENTRY_CONFIG.replaysOnErrorSampleRate,
//
//   // デバッグモード
//   debug: SENTRY_CONFIG.debug,
//
//   // 統合設定
//   integrations: [
//     Sentry.replayIntegration({
//       maskAllText: true,
//       blockAllMedia: true,
//     }),
//   ],
//
//   // エラーフィルタリング
//   beforeSend(event, hint) {
//     // 開発環境ではエラーを送信しない
//     if (process.env.NODE_ENV === 'development') {
//       return null;
//     }
//
//     // 特定のエラーを除外
//     const error = hint.originalException;
//     if (error instanceof Error) {
//       // ネットワークエラーは除外
//       if (error.message.includes('NetworkError')) {
//         return null;
//       }
//       // チャンクロードエラーは除外
//       if (error.message.includes('ChunkLoadError')) {
//         return null;
//       }
//     }
//
//     return event;
//   },
// });

export {};
