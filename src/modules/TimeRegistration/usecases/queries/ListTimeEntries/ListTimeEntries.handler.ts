import type { QueryHandler } from '@arts-n-crafts/ts'
import type { ListTimeEntriesDirectivePort, ListTimeEntriesItem } from './ListTimeEntries.ports.ts'
import type { ListTimeEntriesByUserIdQuery } from './ListTimeEntries.query.ts'

export class ListTimeEntriesByUserIdHandler implements QueryHandler<ListTimeEntriesByUserIdQuery, Promise<ListTimeEntriesItem[]>> {
  constructor(
    private readonly directive: ListTimeEntriesDirectivePort,
  ) {}

  async execute(aQuery: ListTimeEntriesByUserIdQuery) {
    return this.directive.execute(aQuery.payload.userId)
  }
}
