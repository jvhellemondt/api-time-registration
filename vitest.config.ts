import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    globals: true,
    reporters: ['verbose'],
    include: ['src/**/*.{test,spec,scenario}.?(c|m)[jt]s?(x)'],
    exclude: [
      'src/infrastructure/database/mongo/**/*',
      '**/node_modules/**',
      '**/tests/property-based/**/*',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
    ],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 100,
        statements: 100,
        functions: 100,
        branches: 100,
      },
      exclude: [
        '*.ts',
        'src/infrastructure/database/mongo/**/*',
        '**/*.module.ts',
        '**/main.ts',
        '**/tests/property-based/**/*',
        '**/node_modules/**',
        '**/dist/**',
        '**/cypress/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
