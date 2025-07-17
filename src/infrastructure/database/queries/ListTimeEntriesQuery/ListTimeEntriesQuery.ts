import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type { ListTimeEntriesQueryPort } from '@/usecases/queries/ListTimeEntries/ports/query'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'

export class ListTimeEntriesQuery implements ListTimeEntriesQueryPort {
  constructor(
    private readonly tableName: string,
    private readonly database: Database,
  ) {}

  async execute(userId: string): Promise<TimeEntryModel[]> {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    return this.database.query(this.tableName, specification)
  }
}
