import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // /api দিয়ে শুরু হওয়া রিকোয়েস্টগুলো ব্যাকএন্ডে (port 5000) পাঠানো হবে
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
