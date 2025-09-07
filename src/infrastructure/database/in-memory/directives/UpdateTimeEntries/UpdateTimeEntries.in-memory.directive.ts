import type { PatchStatement, WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'
import type { UseCollection } from '../../useCollection'
import type {
  TimeEntryModel,
  UpdateTimeEntriesDirectivePort,
} from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'

export class UpdateTimeEntriesInMemoryDirective implements UpdateTimeEntriesDirectivePort {
  constructor(
    private readonly collection: UseCollection<TimeEntryModel>,
  ) {}

  async execute(payload: WithIdentifier<Partial<TimeEntryModel>>): Promise<void> {
    const statement: PatchStatement<TimeEntryModel> = { operation: Operation.PATCH, payload }
    await this.collection.execute(statement)
  }
}
