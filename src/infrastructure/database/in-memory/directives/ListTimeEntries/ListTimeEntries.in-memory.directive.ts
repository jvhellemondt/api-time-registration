import type { UseCollection } from '../../useCollection'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type { ListTimeEntriesDirectivePort } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'

export class ListTimeEntriesInMemoryDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly collection: UseCollection<TimeEntryModel>,
  ) {}

  async execute(userId: string): Promise<TimeEntryModel[]> {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    return this.collection.query(specification)
  }
}
