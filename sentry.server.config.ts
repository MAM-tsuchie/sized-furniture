import * as Sentry from '@sentry/nextjs';
import { SENTRY_CONFIG } from '@/lib/monitoring/sentry';

if (SENTRY_CONFIG.dsn) {
  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,

    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,

    debug: SENTRY_CONFIG.debug,

    beforeSend(event, hint) {
      if (process.env.NODE_ENV === 'development') {
        return null;
      }

      const error = hint.originalException;
      if (error instanceof Error) {
        if (error.message.includes('NEXT_NOT_FOUND')) {
          return null;
        }
      }

      return event;
    },
  });
}
