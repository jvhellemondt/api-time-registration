import { defineConfig } from 'vitest/config'
import { vitestBaseConfig } from './vitest.base.config.ts'

export default defineConfig({
  ...vitestBaseConfig,
  test: {
    ...vitestBaseConfig.test,
    include: ['src/**/*.{test,spec,scenario}.?(c|m)[jt]s?(x)'],
    exclude: [
      ...vitestBaseConfig.test.exclude,
      '**/modules/infrastructure/database/mongo/**/*',
      '**/modules/infrastructure/eventBus/pulsar/**/*',
      '**/tests/property-based/**/*',
      '**/*.integration.*',

    ],
    coverage: {
      ...vitestBaseConfig.test.coverage,
      exclude: [
        ...vitestBaseConfig.test.coverage.exclude,
        '*.ts',
        '**/infrastructure/database/mongo/**/*',
        '**/infrastructure/eventBus/pulsar/**/*',
        '**/*.module.ts',
        '**/main.ts',
        '**/tests/property-based/**/*',
        '**/*.integration.*',
      ],
    },
  },
})
