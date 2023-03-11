import * as Sentry from "@sentry/node";
import "@sentry/tracing";

Sentry.init({
  // TODO: Change
  dsn: "https://c70446fc3ba249b2a9e6d4e6c202f1aa@o134548.ingest.sentry.io/6242955",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  enabled: process.env.SHOULD_DISABLE_SENTRY !== "true",
});
