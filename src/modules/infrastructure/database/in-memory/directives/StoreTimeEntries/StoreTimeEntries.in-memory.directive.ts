import type { CreateStatement, Database } from '@arts-n-crafts/ts'
import type {
  StoreTimeEntriesDirectivePort,
  TimeEntryModel,
} from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { Operation } from '@arts-n-crafts/ts'

export class StoreTimeEntriesInMemoryDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly collectionName: string,
    private readonly database: Database<TimeEntryModel>,
  ) {
  }

  async execute(payload: TimeEntryModel): Promise<void> {
    const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload }
    await this.database.execute(this.collectionName, statement)
  }
}
