import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 3001,
    open: false,
  },
  resolve: {
    alias: {
      '@flowstate/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
  build: {
    outDir: 'dist-web',
    sourcemap: true,
  },
});
