import type { DomainEvent, EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import { makeStreamKey } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry.decider.ts'

export class TimeEntryRepository
implements Repository {
  static readonly streamName = 'time-entry'
  private readonly evolveFn = TimeEntry.evolve
  private readonly initialState = TimeEntry.initialState

  constructor(
    private readonly eventStore: EventStore,
  ) {
  }

  async load(aggregateId: string): Promise<ReturnType<typeof this.evolveFn>> {
    const pastEvents = await this.eventStore.load<TimeEntryEvent>(
      makeStreamKey(TimeEntryRepository.streamName, aggregateId),
    )
    return pastEvents.reduce(this.evolveFn, this.initialState(aggregateId))
  }

  async store<TEvent extends DomainEvent<TEvent['payload']> = TimeEntryEvent>(events: TEvent[]): Promise<void> {
    await Promise.all(
      events.map(
        async event => this.eventStore.append(
          makeStreamKey(TimeEntryRepository.streamName, event.aggregateId),
          [event],
        ),
      ),
    )
  }
}
