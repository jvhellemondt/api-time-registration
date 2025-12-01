import type { MongoRecord } from '@modules/TimeRegistration/infrastructure/database/mongo/MongoRecord.ts'
import type { TimeEntryModel } from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type {
  ListTimeEntriesDirectivePort,
  ListTimeEntriesItem,
} from '@modules/TimeRegistration/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import type { Db } from 'mongodb'
import { FieldEquals } from '@arts-n-crafts/ts'
import {
  mapTimeEntryModelToListTimeEntriesItemMapper,
} from '@modules/TimeRegistration/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { buildMongoQuery } from '../../utils/buildMongoQuery.ts'
import { mapMongoIdToId } from '../../utils/mapMongoId.ts'

export class ListTimeEntriesDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly stream: string,
    private readonly database: Db,
  ) {
  }

  async execute(userId: string): Promise<ListTimeEntriesItem[]> {
    const collection = this.database.collection<MongoRecord<TimeEntryModel>>(this.stream)
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    const query = buildMongoQuery(specification.toQuery())
    const results = await collection
      .find(query)
      .sort({ startTime: 1 })
      .toArray()
    return results
      .map(mapMongoIdToId)
      .map(mapTimeEntryModelToListTimeEntriesItemMapper)
  }
}
