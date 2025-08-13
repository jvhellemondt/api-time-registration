import path from 'node:path'
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    test: {
      env,
      watch: false,
      globals: true,
      reporters: ['verbose'],
      include: ['src/**/*.integration.?(c|m)[jt]s?(x)'],
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
        thresholds: {
          lines: 100,
          statements: 100,
          functions: 100,
          branches: 100,
        },
        include: ['src/**/*.integration.?(c|m)[jt]s?(x)'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
