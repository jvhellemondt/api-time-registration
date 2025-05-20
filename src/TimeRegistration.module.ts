import type { CommandBus, Database, EventBus, Module, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntry } from './domain/TimeEntry/TimeEntry'
import { RegisterTimeEntryHandler } from './usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler'
import { ListTimeEntriesByUserIdHandler } from './usecases/queries/ListTimeEntriesByUserId/ListTimeEntriesByUserId.handler'
import { AfterTimeEntryRegistered } from './usecases/subscribers/afterTimeEntryRegistered/afterTimeEntryRegistered'

export class TimeRegistrationModule implements Module {
  constructor(
    private readonly repository: Repository<TimeEntry>,
    private readonly database: Database,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {
  }

  registerModule() {
    this.commandBus.register('RegisterTimeEntry', new RegisterTimeEntryHandler(this.repository))
    this.queryBus.register('ListTimeEntriesByUserId', new ListTimeEntriesByUserIdHandler(this.database))

    new AfterTimeEntryRegistered(this.eventBus, this.database).start()
  }
};
