import type { Database, QueryHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { listTimeEntriesByUserId } from './ListTimeEntries.query'
import type { ListTimeEntriesByUserIdOutput } from './ports/inbound'
import type { ListTimeEntriesByUserIdResult } from './ports/outbound'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'

export class ListTimeEntriesByUserIdHandler implements QueryHandler<ListTimeEntriesByUserIdOutput, ListTimeEntriesByUserIdResult[]> {
  constructor(
    private readonly tableName: string,
    private readonly database: Database,
  ) {}

  async execute(aQuery: ReturnType<typeof listTimeEntriesByUserId>): Promise<ListTimeEntriesByUserIdResult[]> {
    const specification = new FieldEquals('userId', aQuery.payload.userId)
    return this.database.query<ListTimeEntriesByUserIdResult>(this.tableName, specification)
  }
}
