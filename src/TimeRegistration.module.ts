import type { CommandBus, Database, EventBus, Module, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from './domain/TimeEntry/TimeEntry.decider'
import { RegisterTimeEntryHandler } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler.ts'

export class TimeRegistrationModule implements Module {
  constructor(
    private readonly repository: Repository<TimeEntryEvent>,
    private readonly database: Database,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus<TimeEntryEvent>,
  ) {
  }

  registerModule() {
    this.commandBus.register('RegisterTimeEntry', new RegisterTimeEntryHandler(this.repository))
  }
};
