import type { CreateStatement } from '@arts-n-crafts/ts'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { UseCollection } from '../../useCollection.ts'
import { Operation } from '@arts-n-crafts/ts'

export class StoreTimeEntriesInMemoryDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly collection: UseCollection<TimeEntryModel>,
  ) {}

  async execute(payload: TimeEntryModel): Promise<void> {
    const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload }
    await this.collection.execute(statement)
  }
}
