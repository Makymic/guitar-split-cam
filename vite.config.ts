import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  optimizeDeps: {
    include: ['@mediapipe/hands', '@mediapipe/camera_utils'],
  },
});