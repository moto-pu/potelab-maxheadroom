import { defineConfig } from 'vite';
import path from 'path';

// GitHub Pagesにデモをデプロイするため、ビルド先を標準のdistディレクトリから変更
const dist = path.join(__dirname, 'docs');

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: dist,
    rollupOptions: {
      input: {
        index: 'index.html',
        index2: 'index2.html',
      },
    },
  },
});
