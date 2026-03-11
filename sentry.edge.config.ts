import * as Sentry from '@sentry/nextjs';
import { SENTRY_CONFIG } from '@/lib/monitoring/sentry';

if (SENTRY_CONFIG.dsn) {
  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    environment: SENTRY_CONFIG.environment,
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
    debug: SENTRY_CONFIG.debug,
  });
}
