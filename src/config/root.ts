import type { Aggregator } from '@/shared/domain/Aggregator'
import type { Component } from '@/shared/domain/Component'

export function composeRoot({ env }: Record<string, unknown>) {
  const aggregators: Aggregator[] = []
  const components: Component[] = []

  return {
    env,
    aggregators,
    components,
  }
}
