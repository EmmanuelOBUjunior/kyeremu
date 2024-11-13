import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    cors: true,
  },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["@xenova/transformers"],
  },
  build: {
    commonjsOptions: {
      include: [/@xenova\/transformers/],
    },
  },
});
