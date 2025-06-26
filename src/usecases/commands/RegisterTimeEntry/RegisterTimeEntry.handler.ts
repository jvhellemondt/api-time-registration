import type { Command, CommandHandler, CommandHandlerResult, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'

export class RegisterTimeEntryHandler implements CommandHandler<'RegisterTimeEntry', RegisterTimeEntryOutput> {
  constructor(
    private readonly repository: Repository<TimeEntryEvent>,
  ) {
  }

  execute(_aCommand: Command<'RegisterTimeEntry', {
    userId: string
    startTime: string
    endTime: string
  }>): Promise<CommandHandlerResult> {
    throw new Error('Not implemented yet')
  }
}
