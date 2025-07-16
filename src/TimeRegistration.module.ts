import type { CommandBus, Database, EventBus, Module, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent, TimeEntryState } from './domain/TimeEntry/TimeEntry.decider'
import { RegisterTimeEntryHandler } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler.ts'
import { ListTimeEntriesQuery } from './infrastructure/queryAdapters/ListTimeEntriesQuery'
import { TimeEntriesProjectionHandler } from './usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler'
import { ListTimeEntriesByUserIdHandler } from './usecases/queries/ListTimeEntries/ListTimeEntries.handler'

export class TimeRegistrationModule implements Module {
  constructor(
    private readonly repository: Repository<TimeEntryState, TimeEntryEvent>,
    private readonly database: Database,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {
  }

  registerModule() {
    this.commandBus.register('RegisterTimeEntry', new RegisterTimeEntryHandler(this.repository))

    new TimeEntriesProjectionHandler(this.eventBus, this.database).start()

    const listTimeEntriesQuery = new ListTimeEntriesQuery(TimeEntriesProjectionHandler.tableName, this.database)
    this.queryBus.register('ListTimeEntriesByUserId', new ListTimeEntriesByUserIdHandler(listTimeEntriesQuery))
  }
};
