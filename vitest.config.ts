import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    // Enable UI mode
    // Port can be configured here or via --api.port flag
    ui: true,
    // API server configuration for UI
    api: {
      // Port will be auto-selected if not specified
      // You can specify a port here if needed: port: 3001
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mock*.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/__mocks__/**',
        '**/types/**',
        '**/constants/**',
      ],
      thresholds: {
        lines: 70,
        functions: 75,
        branches: 65,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

