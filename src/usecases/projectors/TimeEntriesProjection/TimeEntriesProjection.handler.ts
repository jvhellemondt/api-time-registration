import type { Database, EventBus, ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryModel } from './TimeEntriesProjection.ports'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { TimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'

export class TimeEntriesProjectionHandler implements ProjectionHandler<TimeEntryEvent> {
  static readonly tableName = 'time_entries'

  constructor(
    private readonly eventBus: EventBus,
    private readonly database: Database,
  ) {}

  start() {
    this.eventBus.subscribe('TimeEntryRegistered', this)
  }

  async handle(anEvent: TimeEntryRegisteredEvent) {
    const payload: TimeEntryModel = { id: anEvent.aggregateId, userId: anEvent.payload.userId, startTime: anEvent.payload.startTime, endTime: anEvent.payload.endTime }
    await this.database.execute(TimeEntriesProjectionHandler.tableName, { operation: Operation.CREATE, payload })
  }
}
