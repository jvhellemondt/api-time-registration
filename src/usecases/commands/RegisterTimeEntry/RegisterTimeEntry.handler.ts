import type { RegisterTimeEntryCommand } from './RegisterTimeEntry.command'
import { randomUUID } from 'node:crypto'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry'
import { CommandHandler } from '@jvhellemondt/crafts-and-arts.ts'

export class RegisterTimeEntryHandler extends CommandHandler<RegisterTimeEntryCommand> {
  async execute(command: RegisterTimeEntryCommand): Promise<{ id: string }> {
    const aggregateId = randomUUID()
    const aggregate = TimeEntry.create(command.payload, aggregateId)
    await this.repository.store(aggregate)
    return { id: aggregateId }
  }
}
