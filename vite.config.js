import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        entryFileNames: "assets/js/app.[hash].js",
        assetFileNames: ({ name }) => {
          const { ext, dir } = path.parse(name);
          if (ext == ".css") {
            return path.join(dir, "assets/css", "app.[hash].css");
          } else if (
            ext == ".ttf" ||
            ext == ".otf" ||
            ext == ".woff" ||
            ext == ".woff2"
          ) {
            return "assets/fonts/[name].[ext]";
          } else if (ext == ".mp4" || ext == ".ogv" || ext == ".webm") {
            return "assets/videos/[name].[ext]";
          } else if (ext == ".js") {
            return "assets/js/[name].[hash].[ext]";
          } else {
            return "assets/img/[name].[ext]";
          }
        },
      },
    },
  },
});
