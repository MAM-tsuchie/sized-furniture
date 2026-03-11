import * as Sentry from '@sentry/nextjs';
import { SENTRY_CONFIG } from '@/lib/monitoring/sentry';

if (SENTRY_CONFIG.dsn) {
  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,

    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,

    replaysSessionSampleRate: SENTRY_CONFIG.replaysSessionSampleRate,
    replaysOnErrorSampleRate: SENTRY_CONFIG.replaysOnErrorSampleRate,

    debug: SENTRY_CONFIG.debug,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    beforeSend(event, hint) {
      if (process.env.NODE_ENV === 'development') {
        return null;
      }

      const error = hint.originalException;
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('ChunkLoadError')) {
          return null;
        }
      }

      return event;
    },
  });
}
