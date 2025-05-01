import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vercelApi from "vite-plugin-vercel-api";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vercelApi()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
