import type { Command } from '@jvhellemondt/arts-and-crafts.ts'
import type { UUID } from 'node:crypto'
import type { RegisterTimeEntryPayload } from './ports/inbound'
import type { RegisterTimeEntryResult } from './ports/outbound'
import { CommandHandler } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeEntry } from '@/TimeEntries/domain/TimeEntry/TimeEntry'

type CommandType = Command<RegisterTimeEntryPayload, UUID>

export class RegisterTimeEntryHandler extends CommandHandler<CommandType> {
  async execute(command: CommandType): Promise<RegisterTimeEntryResult> {
    const aggregate = TimeEntry.create(command.aggregateId, command.payload)
    await this.repository.store(aggregate)
    return { id: command.aggregateId }
  }
}
