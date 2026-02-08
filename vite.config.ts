import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Semua request yang diawali dengan '/api' akan diteruskan ke backend
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // Jika API backend kamu tidak pakai prefix /api, hapus baris di bawah
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
