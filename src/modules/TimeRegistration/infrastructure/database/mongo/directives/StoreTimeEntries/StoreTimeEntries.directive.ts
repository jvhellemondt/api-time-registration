import type {
  StoreTimeEntriesDirectivePort,
  TimeEntryModel,
} from '@modules/TimeRegistration/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { Collection, Db } from 'mongodb'
import type { MongoRecord } from '../../MongoRecord.ts'
import { mapIdToMongoId } from '../../utils/mapMongoId.ts'

export class StoreTimeEntriesDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly stream: string,
    private readonly database: Db,
  ) {
  }

  async execute(payload: TimeEntryModel): Promise<void> {
    const document: MongoRecord<TimeEntryModel> = mapIdToMongoId(payload)
    const collection: Collection<MongoRecord<TimeEntryModel>> = this.database.collection(this.stream)
    await collection.insertOne(document)
  }
}
