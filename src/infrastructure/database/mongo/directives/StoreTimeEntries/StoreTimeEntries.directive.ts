import type { Collection } from 'mongodb'
import type { MongoRecord } from '../../MongoRecord'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { mapIdToMongoId } from '../../utils/mapMongoId'

export class StoreTimeEntriesDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly collection: Collection<MongoRecord<TimeEntryModel>>,
  ) {}

  async execute(payload: TimeEntryModel): Promise<void> {
    const document = mapIdToMongoId(payload)
    await this.collection.insertOne(document)
  }
}
