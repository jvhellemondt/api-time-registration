import type { TimeEntryProps } from '@/domain/TimeEntry/TimeEntry'
import type { AggregateRoot, EventStore } from '@jvhellemondt/crafts-and-arts.ts'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry'
import { Repository } from '@jvhellemondt/crafts-and-arts.ts'

export class InMemoryTimeEntryRepository extends Repository<TimeEntry> {
  constructor(eventStore: EventStore) {
    super(eventStore)
  }

  async load(aggregateId: string): Promise<AggregateRoot<TimeEntry['props']>> {
    const events = await this.eventStore.loadEvents<TimeEntryProps>(aggregateId)
    const aggregate = TimeEntry.rehydrate(aggregateId, events)
    return aggregate
  }

  async store(aggregate: AggregateRoot<TimeEntry['props']>): Promise<void> {
    await Promise.all(aggregate.uncommittedEvents.map(async event => this.eventStore.store(event)))
    aggregate.markEventsCommitted()
  }
}
