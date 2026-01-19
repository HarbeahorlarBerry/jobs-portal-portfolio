// server/config/instrument.js
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://b4bd736a87e0fc91b24e2abe5109ab14@o4510681287950336.ingest.us.sentry.io/4510681305776128",

  integrations: [
    Sentry.mongooseIntegration(),
  ],

  tracesSampleRate: 1.0,
  sendDefaultPii: true,
})
