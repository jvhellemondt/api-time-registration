import type { QueryMetadata } from '@jvhellemondt/arts-and-crafts.ts'
import type { ListTimeEntriesByUserIdPayload } from './ListTimeEntries.ports'
import { createQuery } from '@jvhellemondt/arts-and-crafts.ts'

export function createListTimeEntriesByUserIdQuery(
  payload: ListTimeEntriesByUserIdPayload,
  metadata?: Partial<QueryMetadata>,
) {
  return createQuery('ListTimeEntriesByUserId', payload, metadata)
}

export type ListTimeEntriesByUserIdQuery = ReturnType<typeof createListTimeEntriesByUserIdQuery>
