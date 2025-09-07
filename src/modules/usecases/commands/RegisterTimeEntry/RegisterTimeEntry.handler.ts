import type { Command, CommandHandler, Repository, WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryEntity } from '@modules/domain/TimeEntry/TimeEntry.entity.ts'
import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports.ts'
import { TimeEntry } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'

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
