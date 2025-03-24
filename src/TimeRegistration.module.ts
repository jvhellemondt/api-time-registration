import type { CommandBus, EventStore, Module } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryRepository } from './repositories/TimeEntryRepository/TimeEntryRepository'
import { InMemoryTimeEntryRepository } from './repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { RegisterTimeEntryCommand } from './usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { RegisterTimeEntryHandler } from './usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler'

export class TimeRegistrationModule implements Module {
  private readonly repository: TimeEntryRepository
  private readonly eventStore: EventStore
  private readonly commandBus: CommandBus

  constructor(
    eventStore: EventStore,
    commandBus: CommandBus,
  ) {
    this.eventStore = eventStore
    this.commandBus = commandBus
    this.repository = new InMemoryTimeEntryRepository(this.eventStore)
  }

  registerModule() {
    this.commandBus.register(RegisterTimeEntryCommand, new RegisterTimeEntryHandler(this.repository))
  }
};
