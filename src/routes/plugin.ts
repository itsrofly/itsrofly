import { type RequestHandler } from "@builder.io/qwik-city";
import {
  RedirectMessage,
  ServerError,
} from "@builder.io/qwik-city/middleware/request-handler";
import { isDev } from "@builder.io/qwik/build";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://12ce628bf8864d3fa06036e92d0c2801@glitchtip.itsrofly.com/1",
});

export const onRequest: RequestHandler = async ({ next }) => {
  try {
    return await next();
  } catch (err) {
    Sentry.captureException(err);

    // Pass through 3xx redirects
    if (isRedirectMessage(err)) {
      throw err;
    }

    // Pass through ServerErrors
    if (isServerError(err)) {
      Sentry.captureException(err);
      throw err;
    }

    // Log unknown errors
    // console.log("Unknown Error");
    // Sentry.captureException(err);

    if (isDev) {
      throw err;
    } else {
      throw new ServerError(500, "Internal server error");
    }
  }
};

function isServerError(err: unknown): err is ServerError {
  return (
    err instanceof ServerError ||
    // This is required for dev environments due to an issue with vite: https://github.com/vitejs/vite/issues/3910
    (isDev && err instanceof Error && err.constructor.name === "ServerError")
  );
}

function isRedirectMessage(err: unknown): err is RedirectMessage {
  return (
    err instanceof RedirectMessage ||
    // This is required for dev environments due to an issue with vite: https://github.com/vitejs/vite/issues/3910
    (isDev &&
      err instanceof Error &&
      err.constructor.name === "RedirectMessage")
  );
}
