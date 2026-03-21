import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

const identityTarget =
  process.env.VITE_IDENTITY_API_URL ||
  "https://cow-peaceful-filly.ngrok-free.app";

// https://vite.dev/config/
export default defineConfig({
  base: "/shopping-app",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: [
      "680efb8a664d.ngrok-free.app",
      "cow-peaceful-filly.ngrok-free.app",
    ],
    proxy: {
      "/identity": {
        target: identityTarget,
        changeOrigin: true,
        secure: true,
      },
      "/profiles": {
        target: identityTarget,
        changeOrigin: true,
        secure: true,
      },
      "/products": {
        target: identityTarget,
        changeOrigin: true,
        secure: true,
      },
      "/shopping-app/identity": {
        target: identityTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/shopping-app/, ""),
      },
      "/shopping-app/profiles": {
        target: identityTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/shopping-app/, ""),
      },
      "/shopping-app/products": {
        target: identityTarget,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/shopping-app/, ""),
      },
    },
  },
});
