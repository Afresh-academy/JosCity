import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from network devices
    proxy: {
      "/api": {
        target: process.env.VITE_API_TARGET || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split node_modules into separate chunks
          if (id.includes("node_modules")) {
            // Split React and React-DOM into separate chunk
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            // Split React Router into separate chunk
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            // Split Lucide icons into separate chunk
            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }
            // All other node_modules go into vendor chunk
            return "vendor";
          }
        },
        chunkSizeWarningLimit: 1000, // Increase limit to 1MB
      },
    },
  },
  publicDir: "public",
});
