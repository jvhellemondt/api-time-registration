import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'process.env.HOST': JSON.stringify(process.env.HOST),
    'process.env.PORT': JSON.stringify(process.env.PORT),
  },
  test: {
    watch: false,
    globals: true,
    reporters: ['verbose'],
    include: ['src/**/*.{test,spec,scenario}.?(c|m)[jt]s?(x)'],
    exclude: [
      './src/config/bootstrap.ts',
      './src/shared/infrastructure/server.ts',
      '**/main.ts',
      '**/node_modules/**',
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
        './src/config/bootstrap.ts',
        './src/shared/infrastructure/server/server.ts',
        'src/infrastructure/eventStore/mongodb.ts',
        '**/*.seed.ts',
        '**/main.ts',
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
