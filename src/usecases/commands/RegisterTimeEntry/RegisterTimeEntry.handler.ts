import type { RegisterTimeEntryResult } from './ports/outbound'
import type { RegisterTimeEntryCommand } from './RegisterTimeEntry.command'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry'
import { CommandHandler } from '@jvhellemondt/arts-and-crafts.ts'

export class RegisterTimeEntryHandler extends CommandHandler<RegisterTimeEntryCommand> {
  async execute(command: RegisterTimeEntryCommand): Promise<RegisterTimeEntryResult> {
    const aggregate = TimeEntry.create(command.aggregateId, command.payload)
    await this.repository.store(aggregate)
    return { id: command.aggregateId }
  }
}
