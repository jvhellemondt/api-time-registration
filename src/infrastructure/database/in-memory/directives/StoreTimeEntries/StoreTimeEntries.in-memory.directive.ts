import type { CreateStatement } from '@jvhellemondt/arts-and-crafts.ts'
import type { UseCollection } from '../../useCollection'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'

export class StoreTimeEntriesInMemoryDirective implements StoreTimeEntriesDirectivePort {
  constructor(
    private readonly collection: UseCollection<TimeEntryModel>,
  ) {}

  async execute(payload: TimeEntryModel): Promise<void> {
    const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload }
    await this.collection.execute(statement)
  }
}
