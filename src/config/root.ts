import type { Aggregator } from '@/shared/domain/Aggregator.ts'
import type { Component } from '@/shared/domain/Component.ts'
import type { Retriever } from '@/shared/domain/Retriever.ts'

export function composeRoot({ env, modules, messageStore, database }: Record<string, unknown>) {
  const aggregators: Aggregator[] = []
  const components: Component[] = []
  const retrievers: Retriever[] = []

  console.log({ modules })

  return {
    env,
    aggregators,
    components,
    retrievers,
    messageStore,
    database,
  }
}
