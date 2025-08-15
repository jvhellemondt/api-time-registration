import type { EventStore, Repository, WithIdentifier } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryEntity } from '@/domain/TimeEntry/TimeEntry.entity'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry.decider.ts'

export class TimeEntryRepository
implements Repository<TimeEntryEvent, TimeEntryEntity, WithIdentifier> {
  readonly streamName = 'time-entry'

  constructor(
    private readonly eventStore: EventStore<TimeEntryEvent>,
  ) {
  }

  async load(aggregateId: string): Promise<TimeEntryEntity> {
    const pastEvents = await this.eventStore.load(this.streamName, aggregateId)
    return pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(aggregateId))
  }

  async store(events: TimeEntryEvent[]): Promise<WithIdentifier> {
    if (!events.length)
      return Promise.reject(new Error('TimeEntryRepository::store: no events provided'))

    await Promise.all(
      events.map(
        async event => this.eventStore.append(this.streamName, [event]),
      ),
    )
    return { id: events[0].aggregateId }
  }
}
