import type { UseCollection } from '../../useCollection'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type { ListTimeEntriesDirectivePort } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'

export class ListTimeEntriesInMemoryDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly collection: UseCollection<TimeEntryModel>,
  ) {
  }

  async execute(userId: string) {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    const result = await this.collection.query(specification)
    return result.map(mapTimeEntryModelToListTimeEntriesItemMapper)
  }
}
