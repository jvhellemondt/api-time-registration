import type { EventBus, EventHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'

export class TimeEntriesProjector implements EventHandler<TimeEntryEvent> {
  async handle(this: void, anEvent: TimeEntryEvent): Promise<void> {
    throw new Error('Method not implemented.')
  }

  start(this: void, eventBus: EventBus<TimeEntryEvent>): void {
    throw new Error('Method not implemented.')
  }
}
