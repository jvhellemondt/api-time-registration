import type { Database, QueryHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { listTimeEntriesByUserId } from './ListTimeEntries.query'
import type { ListTimeEntriesByUserIdOutput } from './ports/inbound'
import type { ListTimeEntriesByUserIdResult } from './ports/outbound'

export class ListTimeEntriesByUserIdHandler implements QueryHandler<ListTimeEntriesByUserIdOutput, ListTimeEntriesByUserIdResult[]> {
  constructor(
    private readonly tableName: string,
    private readonly database: Database,
  ) {}

  async execute(aQuery: ReturnType<typeof listTimeEntriesByUserId>): Promise<ListTimeEntriesByUserIdResult[]> {
    return this.database.query<ListTimeEntriesByUserIdResult>(this.tableName, [{ userId: aQuery.payload.userId }])
  }
}
