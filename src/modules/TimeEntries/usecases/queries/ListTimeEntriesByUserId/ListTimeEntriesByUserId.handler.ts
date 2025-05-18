import type { Query } from '@jvhellemondt/arts-and-crafts.ts'
import type { ListTimeEntriesByUserIdPayload } from './ports/inbound'
import type { ListTimeEntriesByUserIdResult } from './ports/outbound'
import { QueryHandler } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeEntriesByUserId } from '@/TimeEntries/specifications/TimeEntriesByUserId'

type QueryType = Query<ListTimeEntriesByUserIdPayload>
interface ResultType { items: ListTimeEntriesByUserIdResult[] }

export class ListTimeEntriesByUserIdHandler extends QueryHandler<QueryType, ResultType> {
  async execute(query: QueryType): Promise<ResultType> {
    const specification = new TimeEntriesByUserId(query.payload.userId)
    const items = await this.database.query<ListTimeEntriesByUserIdResult>('time-entries', specification)
    return { items }
  }
}
