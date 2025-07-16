import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '@/infrastructure/models/TimeEntry.model'
import type { ListTimeEntriesByUserIdResult } from '@/usecases/queries/ListTimeEntries/ports/outbound'
import type { ListTimeEntriesQueryPort } from '@/usecases/queries/ListTimeEntries/ports/query'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'

export class ListTimeEntriesQuery implements ListTimeEntriesQueryPort {
  constructor(
    private readonly tableName: string,
    private readonly database: Database,
  ) {}

  static mapFrom(entry: TimeEntryModel): ListTimeEntriesByUserIdResult {
    return {
      id: entry.id,
      userId: entry.user_id,
      startTime: entry.start_time,
      endTime: entry.end_time,
    }
  }

  async execute(userId: string): Promise<ListTimeEntriesByUserIdResult[]> {
    const specification = new FieldEquals<TimeEntryModel>('user_id', userId)
    const data = await this.database.query<TimeEntryModel>(this.tableName, specification)
    return data.map(ListTimeEntriesQuery.mapFrom)
  }
}
