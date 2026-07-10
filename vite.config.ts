import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@features": path.resolve(__dirname, "./src/features"),
      "@shared": path.resolve(__dirname, "./src/shared"),
    },
  },
  server: {
    port: 5200,
    host: '0.0.0.0',
    proxy: {
      // Semua request yang diawali dengan '/api' akan diteruskan ke backend
      "/api": {
        target: "http://localhost:3020",
        changeOrigin: true,
        // Jika API backend kamu tidak pakai prefix /api, hapus baris di bawah
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
