import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      thresholds: {
        statements: 80,
      },
      exclude: [
        'dist/**',
        'docs/**',
        '**/*.config.{ts,mjs}',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
});
