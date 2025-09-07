import type { EventBus, EventHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { StoreTimeEntriesDirectivePort } from './TimeEntriesProjection.ports.ts'
import { differenceInMinutes } from 'date-fns'
import { timeEntryModel } from './TimeEntriesProjection.ports.ts'

export class TimeEntriesProjector implements EventHandler<TimeEntryEvent> {
  constructor(
    private readonly directive: StoreTimeEntriesDirectivePort,
  ) { }

  async handle(anEvent: TimeEntryEvent): Promise<void> {
    switch (anEvent.type) {
      case 'TimeEntryRegistered': {
        const model = timeEntryModel.parse({
          id: anEvent.aggregateId,
          userId: anEvent.payload.userId,
          startTime: anEvent.payload.startTime,
          endTime: anEvent.payload.endTime,
          minutes: differenceInMinutes(new Date(anEvent.payload.endTime), new Date(anEvent.payload.startTime)),
        })
        await this.directive.execute(model)
      }
    }
  }

  start(eventBus: EventBus<TimeEntryEvent>): void {
    eventBus.subscribe('TimeEntryRegistered', this)
  }
}
