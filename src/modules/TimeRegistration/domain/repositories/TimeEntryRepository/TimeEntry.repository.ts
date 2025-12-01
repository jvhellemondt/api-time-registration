import type { EventStore, Repository } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryEntity } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.entity.ts'
import { TimeEntry } from '@modules/TimeRegistration/domain/TimeEntry/TimeEntry.decider.ts'

export class TimeEntryRepository
implements Repository<TimeEntryEvent, Promise<TimeEntryEntity>> {
  readonly streamName = 'time-entry'

  constructor(
    private readonly eventStore: EventStore<TimeEntryEvent>,
  ) {
  }

  async load(aggregateId: string): Promise<TimeEntryEntity> {
    const pastEvents = await this.eventStore.load(this.streamName, aggregateId)
    return pastEvents.reduce(TimeEntry.evolve, TimeEntry.initialState(aggregateId))
  }

  async store(events: TimeEntryEvent[]): Promise<void> {
    if (!events.length)
      return Promise.reject(new Error('TimeEntryRepository::store: no events provided'))

    await Promise.all(
      events.map(
        async event => this.eventStore.append(this.streamName, [event]),
      ),
    )
  }
}
