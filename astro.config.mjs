import { defineConfig } from "astro/config";
import autoGenerateImports from "./src/plugins/generate-imports.js";
import viteConfig from "./vite.config.js";

const isProduction = import.meta.env.VITE_MODE == "production";

// https://astro.build/config
export default defineConfig({
  integrations: [autoGenerateImports()],
  output: "static",
  publicDir: "public",
  // compressHTML: !isProduction,
  build: {
    format: isProduction ? "file" : "directory",
    assets: "assets",
  },
  vite: viteConfig,
});
