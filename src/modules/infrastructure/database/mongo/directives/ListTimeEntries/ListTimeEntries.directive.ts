import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type {
  ListTimeEntriesDirectivePort,
  ListTimeEntriesItem,
} from '@modules/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import type { Collection } from 'mongodb'
import type { MongoRecord } from '../../MongoRecord.ts'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { buildMongoQuery } from '../../utils/buildMongoQuery.ts'
import { mapMongoIdToId } from '../../utils/mapMongoId.ts'

export class ListTimeEntriesDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly collection: Collection<MongoRecord<TimeEntryModel>>,
  ) {
  }

  async execute(userId: string): Promise<ListTimeEntriesItem[]> {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    const query = buildMongoQuery(specification.toQuery())
    const results = await this.collection
      .find(query)
      .sort({ startTime: 1 })
      .toArray()
    return results
      .map(mapMongoIdToId)
      .map(mapTimeEntryModelToListTimeEntriesItemMapper)
  }
}
