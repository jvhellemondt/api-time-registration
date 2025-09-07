import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { ListTimeEntriesDirectivePort } from '@modules/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import type { UseCollection } from '../../useCollection.ts'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'

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
