import type { CommandBus, EventStore, Module, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntry } from './domain/TimeEntry/TimeEntry'
import type { TimeEntryRepository } from './repositories/TimeEntryRepository/TimeEntryRepository'
import { RegisterTimeEntryHandler } from './usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler'

export class TimeRegistrationModule implements Module {
  private readonly repository: TimeEntryRepository
  private readonly eventStore: EventStore
  private readonly commandBus: CommandBus

  constructor(
    eventStore: EventStore,
    commandBus: CommandBus,
    repository: Repository<TimeEntry>,
  ) {
    this.eventStore = eventStore
    this.commandBus = commandBus
    this.repository = repository
  }

  registerModule() {
    this.commandBus.register('RegisterTimeEntry', new RegisterTimeEntryHandler(this.repository))
  }
};
