import type { CommandBus, Database, EventBus, Module, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from './domain/TimeEntry/TimeEntry.decider'
import type { TimeEntryRepository } from './repositories/TimeEntryRepository/TimeEntry.repository'
import { RegisterTimeEntryHandler } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler.ts'
import { TimeEntriesProjectionHandler } from './usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler'
import { ListTimeEntriesByUserIdHandler } from './usecases/queries/ListTimeEntries/ListTimeEntries.handler'

export class TimeRegistrationModule implements Module {
  constructor(
    private readonly repository: TimeEntryRepository,
    private readonly database: Database,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus<TimeEntryEvent>,
  ) {
  }

  registerModule() {
    this.commandBus.register('RegisterTimeEntry', new RegisterTimeEntryHandler(this.repository))

    new TimeEntriesProjectionHandler(this.eventBus, this.database).start()

    this.queryBus.register('ListTimeEntriesByUserId', new ListTimeEntriesByUserIdHandler(TimeEntriesProjectionHandler.tableName, this.database))
  }
};
