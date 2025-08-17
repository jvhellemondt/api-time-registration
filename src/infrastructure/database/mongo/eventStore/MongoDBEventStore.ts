import type { EventStore, Outbox, StoredEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { Db } from 'mongodb'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { createStoredEvent, fail, FieldEquals, invariant, makeStreamKey } from '@jvhellemondt/arts-and-crafts.ts'
import { buildMongoQuery } from '@/infrastructure/database/mongo/utils/buildMongoQuery'
import { mapIdToMongoId } from '@/infrastructure/database/mongo/utils/mapMongoId'
import { SameEntityOnly } from '@/specifications/SameEntityOnly.specification'

export type EventStoreRecord<T> = Omit<StoredEvent<T>, 'id'> & { _id: string }

export const MongoEventStore: (database: Db, outbox?: Outbox) => EventStore<TimeEntryEvent> = (database: Db, outbox?: Outbox) => {
  return {
    async load(streamName: string, aggregateId: string): Promise<TimeEntryEvent[]> {
      const streamKey = makeStreamKey(streamName, aggregateId)
      const specification = new FieldEquals('streamKey', streamKey)
      const storedEvents = await database
        .collection<EventStoreRecord<TimeEntryEvent>>('event_store')
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
        .collection<EventStoreRecord<TimeEntryEvent>>('event_store')
        .insertMany(eventsToStore)
      await Promise.all(events.map(async event => outbox?.enqueue(event)))
    },
  }
}
