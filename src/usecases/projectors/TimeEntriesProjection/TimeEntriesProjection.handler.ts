import type { EventBus, EventHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { StoreTimeEntriesDirectivePort, TimeEntryModel } from './TimeEntriesProjection.ports'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'

export class TimeEntriesProjector implements EventHandler<TimeEntryEvent> {
  constructor(
    private readonly directive: StoreTimeEntriesDirectivePort,
  ) { }

  async handle(anEvent: TimeEntryEvent): Promise<void> {
    const model: TimeEntryModel = {
      id: anEvent.aggregateId,
      userId: anEvent.payload.userId,
      startTime: anEvent.payload.startTime,
      endTime: anEvent.payload.endTime,
    }
    await this.directive.execute(model)
  }

  start(eventBus: EventBus<TimeEntryEvent>): void {
    eventBus.subscribe('TimeEntryRegistered', this)
  }
}
