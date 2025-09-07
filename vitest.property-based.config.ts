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
      include: ['src/**/tests/property-based/*.spec.?(c|m)[jt]s?(x)'],
      coverage: {
        ...vitestBaseConfig.test.coverage,
        include: ['src/**/tests/property-based/*.spec.?(c|m)[jt]s?(x)'],
      },
    },
  }
})
