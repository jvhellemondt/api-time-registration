import type { Database, EventBus, ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { timeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { Operation } from '@jvhellemondt/arts-and-crafts.ts'

export class TimeEntriesProjectionHandler implements ProjectionHandler<TimeEntryEvent> {
  static readonly tableName = 'time_entries'

  constructor(
    private readonly eventBus: EventBus<TimeEntryEvent>,
    private readonly database: Database,
  ) {}

  start() {
    this.eventBus.subscribe('TimeEntryRegistered', this)
  }

  async handle(anEvent: ReturnType<typeof timeEntryRegistered>) {
    const payload = { id: anEvent.aggregateId, user_id: anEvent.payload.userId, start_time: anEvent.payload.startTime, end_time: anEvent.payload.endTime }
    await this.database.execute(TimeEntriesProjectionHandler.tableName, { operation: Operation.CREATE, payload })
  }
}
