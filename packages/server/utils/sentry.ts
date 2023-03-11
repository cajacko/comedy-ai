import * as Sentry from "@sentry/node";
import "@sentry/tracing";

Sentry.init({
  dsn: "https://df07c80ff7014c3083526410600a240b@o134548.ingest.sentry.io/4504820038565888",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  enabled: process.env.SHOULD_DISABLE_SENTRY !== "true",
});
