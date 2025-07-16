import type { QueryHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { listTimeEntriesByUserId } from './ListTimeEntries.query'
import type { ListTimeEntriesByUserIdOutput } from './ports/inbound'
import type { ListTimeEntriesByUserIdResult } from './ports/outbound'
import type { ListTimeEntriesQueryPort } from './ports/query'

export class ListTimeEntriesByUserIdHandler implements QueryHandler<ListTimeEntriesByUserIdOutput, ListTimeEntriesByUserIdResult[]> {
  constructor(
    private readonly listTimeEntriesQuery: ListTimeEntriesQueryPort,
  ) {}

  async execute(aQuery: ReturnType<typeof listTimeEntriesByUserId>): Promise<ListTimeEntriesByUserIdResult[]> {
    return this.listTimeEntriesQuery.execute(aQuery.payload.userId)
  }
}
