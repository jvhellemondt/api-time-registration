import type { Db } from 'mongodb'
import type { MongoRecord } from '../../Mongodb.client'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type { ListTimeEntriesDirectivePort } from '@/usecases/queries/ListTimeEntries/ports/directive'
import { FieldEquals } from '@jvhellemondt/arts-and-crafts.ts'
import { buildMongoQuery } from '../../buildMongoQuery'
import { mapMongoIdToId } from '../../utils/mapMongoId'

export class ListTimeEntriesDirective implements ListTimeEntriesDirectivePort {
  constructor(
    private readonly collection: string,
    private readonly database: Db,
  ) {}

  async execute(userId: string): Promise<TimeEntryModel[]> {
    const specification = new FieldEquals<TimeEntryModel>('userId', userId)
    const query = buildMongoQuery(specification.toQuery())
    const results = await this.database
      .collection<MongoRecord<Omit<TimeEntryModel, 'id'>>>(this.collection)
      .find(query)
      .toArray()
    return results
      .map(mapMongoIdToId)
  }
}
