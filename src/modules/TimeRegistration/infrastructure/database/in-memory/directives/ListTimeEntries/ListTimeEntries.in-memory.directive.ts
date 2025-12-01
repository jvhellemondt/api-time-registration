import type { Database } from '@arts-n-crafts/ts'
import type { TimeEntryModel } from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type {
  ListTimeEntriesDirectivePort,
} from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import { FieldEquals } from '@arts-n-crafts/ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/TimeRegistration/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'

export class ListTimeEntriesInMemoryDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly collectionName: string,
    private readonly database: Database<TimeEntryModel>,
  ) {
  }

  async execute(userId: string) {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    const result = await this.database.query(this.collectionName, specification)
    return result.map(mapTimeEntryModelToListTimeEntriesItemMapper)
  }
}
