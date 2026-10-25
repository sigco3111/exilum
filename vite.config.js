import { defineConfig } from 'vite';
export default defineConfig({
  server: { host: '127.0.0.1' },
  base: '/exilum/',
  build: { target: 'esnext', sourcemap: false },
});
