import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { vitestBaseConfig } from './vitest.base.config.ts'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    ...vitestBaseConfig,
    test: {
      ...vitestBaseConfig.test,
      env,
      include: ['src/**/*.integration.spec.?(c|m)[jt]s?(x)'],
      exclude: [
        ...vitestBaseConfig.test.exclude,
        'src/infrastructure/database/mongo/**/*',
        '**/tests/property-based/**/*',
      ],
      coverage: {
        ...vitestBaseConfig.test.coverage,
        include: ['src/**/*.integration.?(c|m)[jt]s?(x)'],
      },
    },
  }
})
