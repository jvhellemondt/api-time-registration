import type { EventStore, StoredEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { Db } from 'mongodb'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { createStoredEvent, fail, FieldEquals, invariant, makeStreamKey } from '@jvhellemondt/arts-and-crafts.ts'
import { buildMongoQuery } from '@/infrastructure/database/mongo/buildMongoQuery'
import { mapIdToMongoId } from '@/infrastructure/database/mongo/utils/mapMongoId'
import { SameEntityOnly } from '@/specifications/SameEntityOnly.specification'

export type EventStoreRecord<T> = Omit<StoredEvent<T>, 'id'> & { _id: string }

export const MongoEventStore: (database: Db) => EventStore<TimeEntryEvent> = (database: Db) => {
  const store = 'event_store'

  return {
    async load(streamName: string, aggregateId: string): Promise<TimeEntryEvent[]> {
      const streamKey = makeStreamKey(streamName, aggregateId)
      const specification = new FieldEquals('streamKey', streamKey)
      const storedEvents = await database
        .collection<EventStoreRecord<TimeEntryEvent>>(store)
        .find(buildMongoQuery(specification.toQuery()))
        .toArray()
      return storedEvents
        .map(storedEvent => storedEvent.event)
    },

    async append(streamName: string, events: TimeEntryEvent[]): Promise<void> {
      const aggregateId = events[0].aggregateId
      invariant(
        new SameEntityOnly({ id: aggregateId }).isSatisfiedBy(events.map(event => ({ id: event.aggregateId }))),
        fail(new Error('EventStore::append > Same entity only')),
      )

      const currentStream = await this.load(streamName, aggregateId)
      const eventsToStore = events
        .map(event => createStoredEvent(streamName, currentStream.length + 1, event))
        .map(mapIdToMongoId)
      await database
        .collection<EventStoreRecord<TimeEntryEvent>>(store)
        .insertMany(eventsToStore)
      // await Promise.all(events.map(async event => this.outbox?.enqueue(event)))
    },
  }
}
