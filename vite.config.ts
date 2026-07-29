import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(process.cwd(), 'src') } },
  build: {
    rollupOptions: {
      output: {
        // El sitio público nunca debe arrastrar el código de consola.
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
          if (id.includes('/src/pages/console/')) return 'console';
        },
      },
    },
  },
});
