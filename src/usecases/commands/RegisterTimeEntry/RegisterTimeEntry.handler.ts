import type { Command, CommandHandler, CommandHandlerResult, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports'
import type { TimeEntryEvent, TimeEntryState } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry.decider.ts'

export class RegisterTimeEntryHandler implements CommandHandler<'RegisterTimeEntry', RegisterTimeEntryCommandPayload> {
  constructor(
    private readonly repository: Repository<TimeEntryState, TimeEntryEvent>,
  ) {
  }

  async execute(aCommand: Command<'RegisterTimeEntry', RegisterTimeEntryCommandPayload>): Promise<CommandHandlerResult> {
    const currentState = await this.repository.load(aCommand.aggregateId)
    await this.repository.store(TimeEntry.decide(aCommand, currentState))
    return { id: aCommand.aggregateId }
  }
}
