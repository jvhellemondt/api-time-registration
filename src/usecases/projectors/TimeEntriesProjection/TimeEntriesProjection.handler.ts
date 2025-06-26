import type { EventBus, ProjectionHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { TimeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'

export class TimeEntriesProjectionHandler implements ProjectionHandler<TimeEntryEvent> {
  constructor(
    private readonly eventBus: EventBus<TimeEntryEvent>,
  ) {}

  start() {
    this.eventBus.subscribe('TimeEntryRegistered', this)
  }

  async handle(_anEvent: ReturnType<typeof TimeEntryRegistered>) {
    throw new Error('Method not implemented.')
  }
}
