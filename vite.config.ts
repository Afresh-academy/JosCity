import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 10000, // 10 second timeout
        // Don't rewrite - backend expects /api in the path
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // Suppress proxy errors to prevent console spam
            // The frontend will handle these gracefully
            console.log('[Proxy] Backend connection issue:', err.message);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Log only in development for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log('[Proxy]', req.method, req.url);
            }
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            // Suppress 502/503 errors from being logged repeatedly
            if (proxyRes.statusCode && proxyRes.statusCode >= 500) {
              console.log('[Proxy]', req.method, req.url, '->', proxyRes.statusCode);
            }
          });
        },
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  publicDir: "public",
});
