import type { EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.ts'

export class TimeEntryRepository implements Repository<TimeEntryEvent> {
  constructor(
    private readonly eventStore: EventStore<TimeEntryEvent>,
  ) {
  }

  async load(aggregateId: string): Promise<TimeEntryEvent[]> {
    return this.eventStore.loadEvents(aggregateId)
  }

  async store(events: TimeEntryEvent[]): Promise<void> {
    await Promise.all(
      events.map(
        async event => this.eventStore.store(event),
      ),
    )
  }
}
