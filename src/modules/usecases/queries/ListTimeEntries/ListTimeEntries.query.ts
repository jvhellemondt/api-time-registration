import type { QueryMetadata } from '@arts-n-crafts/ts'
import type { ListTimeEntriesByUserIdPayload } from './ListTimeEntries.ports.ts'
import { createQuery } from '@arts-n-crafts/ts'

export function createListTimeEntriesByUserIdQuery(
  payload: ListTimeEntriesByUserIdPayload,
  metadata?: Partial<QueryMetadata>,
) {
  return createQuery('ListTimeEntriesByUserId', payload, metadata)
}

export type ListTimeEntriesByUserIdQuery = ReturnType<typeof createListTimeEntriesByUserIdQuery>
