import type { Command, CommandHandler, CommandHandlerResult } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry.decider.ts'

export class RegisterTimeEntryHandler implements CommandHandler<'RegisterTimeEntry', RegisterTimeEntryOutput> {
  constructor(
    private readonly repository: TimeEntryRepository,
  ) {
  }

  async execute(aCommand: Command<'RegisterTimeEntry', {
    userId: string
    startTime: string
    endTime: string
  }>): Promise<CommandHandlerResult> {
    const currentState = [].reduce(TimeEntry.evolve, TimeEntry.initialState(aCommand.aggregateId))
    await this.repository.store(TimeEntry.decide(aCommand, currentState))
    return { id: aCommand.aggregateId }
  }
}
