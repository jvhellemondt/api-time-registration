import type { Collection } from 'mongodb'
import type { MongoRecord } from '../../MongoRecord'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type {
  ListTimeEntriesDirectivePort,
  ListTimeEntriesItem,
} from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { buildMongoQuery } from '../../utils/buildMongoQuery'
import { mapMongoIdToId } from '../../utils/mapMongoId'

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
