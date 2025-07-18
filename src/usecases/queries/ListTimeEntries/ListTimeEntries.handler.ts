import type { QueryHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { createListTimeEntriesByUserIdQuery } from './ListTimeEntries.query'
import type { ListTimeEntriesByUserIdOutput } from './ports/inbound'
import type { ListTimeEntriesByUserIdResult } from './ports/outbound'
import type { ListTimeEntriesQueryPort } from './ports/query'

export class ListTimeEntriesByUserIdHandler implements QueryHandler<ListTimeEntriesByUserIdOutput, ListTimeEntriesByUserIdResult[]> {
  constructor(
    private readonly listTimeEntriesQuery: ListTimeEntriesQueryPort,
  ) {}

  async execute(aQuery: ReturnType<typeof createListTimeEntriesByUserIdQuery>): Promise<ListTimeEntriesByUserIdResult[]> {
    return this.listTimeEntriesQuery.execute(aQuery.payload.userId) satisfies Promise<ListTimeEntriesByUserIdResult[]>
  }
}
