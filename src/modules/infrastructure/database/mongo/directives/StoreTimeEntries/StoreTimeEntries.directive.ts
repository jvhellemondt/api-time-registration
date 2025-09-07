import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { Collection } from 'mongodb'
import type { MongoRecord } from '../../MongoRecord.ts'
import { mapIdToMongoId } from '../../utils/mapMongoId.ts'

export class StoreTimeEntriesDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly collection: Collection<MongoRecord<TimeEntryModel>>,
  ) {}

  async execute(payload: TimeEntryModel): Promise<void> {
    const document = mapIdToMongoId(payload)
    await this.collection.insertOne(document)
  }
}
