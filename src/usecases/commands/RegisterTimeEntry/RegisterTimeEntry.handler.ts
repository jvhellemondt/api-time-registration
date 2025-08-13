import type { Command, CommandHandler, Repository, WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryEntity } from '@/domain/TimeEntry/TimeEntry.entity'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry.decider.ts'

export class RegisterTimeEntryHandler implements CommandHandler<Command<'RegisterTimeEntry', RegisterTimeEntryCommandPayload>, WithIdentifier> {
  constructor(
    private readonly repository: Repository<TimeEntryEvent, TimeEntryEntity, WithIdentifier>,
  ) {
  }

  async execute(aCommand: Command<'RegisterTimeEntry', RegisterTimeEntryCommandPayload>): Promise<WithIdentifier> {
    const currentState = await this.repository.load(aCommand.aggregateId)
    await this.repository.store(TimeEntry.decide(aCommand, currentState))
    return { id: aCommand.aggregateId }
  }
}
