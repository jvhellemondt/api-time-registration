import type { DomainEvent, EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent, TimeEntryState } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import { makeStreamKey } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry.decider.ts'

export class TimeEntryRepository
implements Repository<TimeEntryState, TimeEntryEvent> {
  readonly streamName = 'time-entry'

  constructor(
    private readonly eventStore: EventStore,
  ) {
  }

  async load(aggregateId: string): Promise<TimeEntryState> {
    const pastEvents = await this.eventStore.load<TimeEntryEvent>(
      makeStreamKey(this.streamName, aggregateId),
    )
    return pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(aggregateId))
  }

  async store<TEvent extends DomainEvent<TEvent['payload']> = TimeEntryEvent>(events: TEvent[]): Promise<void> {
    await Promise.all(
      events.map(
        async event => this.eventStore.append(
          makeStreamKey(this.streamName, event.aggregateId),
          [event],
        ),
      ),
    )
  }
}
