import { component$, useOn, $, useStyles$ } from "@builder.io/qwik";
import {
  QwikCityProvider,
  RouterOutlet,
  ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { isDev } from "@builder.io/qwik";

import bootstrapStyles from "../node_modules/bootstrap/dist/css/bootstrap.min.css?inline";
import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */
  useOn(
    "qvisible",
    $(() => import("bootstrap")),
  );
  useStyles$(bootstrapStyles);

  return (
    <QwikCityProvider>
      <head>
        <meta charset="utf-8" />
        {!isDev && (
          <link
            rel="manifest"
            href={`${import.meta.env.BASE_URL}manifest.json`}
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nova+Round&display=swap"
          rel="stylesheet"
        ></link>
        <script
          defer
          data-domain="itsrofly.com"
          src="https://plausible.itsrofly.com/js/script.file-downloads.hash.outbound-links.pageview-props.revenue.tagged-events.js"
        ></script>
        <meta
          name="google-site-verification"
          content="F2IA7D_CvFpIsgeXtYm3DrktGwVNn8jDkUiWuNfLOBY"
        />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        {!isDev && <ServiceWorkerRegister />}
      </body>
    </QwikCityProvider>
  );
});
