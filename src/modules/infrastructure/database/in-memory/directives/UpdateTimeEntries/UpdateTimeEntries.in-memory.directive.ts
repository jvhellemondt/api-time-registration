import type { PatchStatement, WithIdentifier } from '@arts-n-crafts/ts'
import type {
  TimeEntryModel,
  UpdateTimeEntriesDirectivePort,
} from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { UseCollection } from '../../useCollection.ts'
import { Operation } from '@arts-n-crafts/ts'

export class UpdateTimeEntriesInMemoryDirective implements UpdateTimeEntriesDirectivePort {
  constructor(
    private readonly collection: UseCollection<TimeEntryModel>,
  ) {}

  async execute(payload: WithIdentifier<Partial<TimeEntryModel>>): Promise<void> {
    const statement: PatchStatement<TimeEntryModel> = { operation: Operation.PATCH, payload }
    await this.collection.execute(statement)
  }
}
