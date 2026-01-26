/**
 * Sentry Server Configuration
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
//   // デバッグモード
//   debug: SENTRY_CONFIG.debug,
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
//       // 404エラーは除外
//       if (error.message.includes('NEXT_NOT_FOUND')) {
//         return null;
//       }
//     }
//
//     return event;
//   },
// });

export {};
