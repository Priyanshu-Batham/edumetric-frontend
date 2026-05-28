import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";

import App from './App';
import './index.css';

Sentry.init({
  dsn: "https://d30c25baa35647e9d83c4b8a1ab1aab7@o4511465929441280.ingest.de.sentry.io/4511465938813008",

  sendDefaultPii: true,

  integrations: [
    Sentry.replayIntegration(),
  ],


  tracePropagationTargets: [
    "localhost",
    /^https:\/\/server\.devsunited\.in/,
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);