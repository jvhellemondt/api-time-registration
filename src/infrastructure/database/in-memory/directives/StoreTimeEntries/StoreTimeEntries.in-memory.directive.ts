import type { CreateStatement, Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'

export class StoreTimeEntriesInMemoryDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly collectionName: string,
    private readonly database: Database<TimeEntryModel>,
  ) {}

  async execute(payload: TimeEntryModel): Promise<void> {
    const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload }
    await this.database.execute(this.collectionName, statement)
  }
}
