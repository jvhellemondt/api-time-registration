import type { EventBus, EventHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'

export class TimeEntriesProjector implements EventHandler<TimeEntryEvent> {
  async handle(this: void, anEvent: TimeEntryEvent): Promise<void> {
    throw new Error('Method not implemented.')
  }

  start(eventBus: EventBus<TimeEntryEvent>): void {
    eventBus.subscribe('TimeEntryRegisteredEvent', this)
  }
}
