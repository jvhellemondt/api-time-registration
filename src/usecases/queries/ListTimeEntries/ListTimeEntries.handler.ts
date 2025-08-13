import type { QueryHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { ListTimeEntriesByUserIdQuery } from './ListTimeEntries.query'
import type { ListTimeEntriesDirectivePort } from './ports/directive'
import type { TimeEntryEntity } from '@/domain/TimeEntry/TimeEntry.entity'

export class ListTimeEntriesByUserIdHandler implements QueryHandler<ListTimeEntriesByUserIdQuery, object> {
  constructor(
    private readonly directive: ListTimeEntriesDirectivePort,
  ) {}

  async execute(aQuery: ListTimeEntriesByUserIdQuery): Promise<TimeEntryEntity[]> {
    return this.directive.execute(aQuery.payload.userId)
  }
}
