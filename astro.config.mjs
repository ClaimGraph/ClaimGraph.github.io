// @ts-check
import { defineConfig } from "astro/config";
import { oresWasmLoader } from "./integrations/ores-wasm-loader.mjs";

const site = process.env.PUBLIC_SITE_URL ?? "https://claimgraph.us";

export default defineConfig({
  site,
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    oresWasmLoader({
      appId: "claimgraph",
      triggerSelector:
        'a[href^="https://user.claimgraph."],a[href^="https://org.claimgraph."],a[href^="https://auth.claimgraph."]',
    }),
  ],
});
