import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: format => `format-quantity.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
      name: 'formatQuantity',
    },
    sourcemap: true,
  },
  server: {
    open: '/main.html',
  },
});