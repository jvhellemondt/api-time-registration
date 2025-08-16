import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type { ListTimeEntriesDirectivePort } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'

export class ListTimeEntriesInMemoryDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly collectionName: string,
    private readonly database: Database<TimeEntryModel>,
  ) {}

  async execute(userId: string): Promise<TimeEntryModel[]> {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    return this.database.query(this.collectionName, specification)
  }
}
