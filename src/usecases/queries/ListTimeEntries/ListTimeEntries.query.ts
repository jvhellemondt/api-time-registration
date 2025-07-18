import type { Query, QueryMetadata } from '@jvhellemondt/arts-and-crafts.ts'
import type { ListTimeEntriesByUserIdOutput } from './ports/inbound'
import { createQuery } from '@jvhellemondt/arts-and-crafts.ts'

export function createListTimeEntriesByUserIdQuery(payload: ListTimeEntriesByUserIdOutput, metadata?: Partial<QueryMetadata>): Query<ListTimeEntriesByUserIdOutput> {
  return createQuery('ListTimeEntriesByUserId', payload, metadata)
}

export type ListTimeEntriesByUserIdQuery = ReturnType<typeof createListTimeEntriesByUserIdQuery>
