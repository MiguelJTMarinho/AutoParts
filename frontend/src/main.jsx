import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";

import "./i18n";

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  sendDefaultPii: true,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
});

axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
      <App />
    </Sentry.ErrorBoundary>
  </StrictMode>,
);
