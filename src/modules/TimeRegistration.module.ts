import type { EventStore } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { MongoRecord } from '@modules/infrastructure/database/mongo/MongoRecord.ts'
import type { TimeEntryModel } from './usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import type { ListTimeEntriesDirectivePort } from './usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import { TimeEntryRepository } from '@modules/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import { getClient } from '@modules/infrastructure/database/mongo'
import { ListTimeEntriesDirective } from '@modules/infrastructure/database/mongo/directives/ListTimeEntries/ListTimeEntries.directive.ts'
import { StoreTimeEntriesDirective } from '@modules/infrastructure/database/mongo/directives/StoreTimeEntries/StoreTimeEntries.directive.ts'
import { MongoEventStore } from '@modules/infrastructure/database/mongo/eventStore/MongoDBEventStore.ts'
import { useCollection } from '@modules/infrastructure/database/mongo/useCollection.ts'
import { InMemoryOutbox } from '@modules/infrastructure/eventBus/pulsar/InMemoryOutbox.ts'
import { PulsarEventBus } from '@modules/infrastructure/eventBus/pulsar/Pulsar.EventBus.ts'
import { PulsarEventConsumer } from '@modules/infrastructure/eventBus/pulsar/Pulsar.EventConsumer.ts'
import { PulsarEventProducer } from '@modules/infrastructure/eventBus/pulsar/Pulsar.EventProducer.ts'
import { Outbox } from '@modules/infrastructure/outbox/Outbox.ts'
import { OutboxWorker } from '@modules/infrastructure/outbox/OutboxWorker.ts'
import { TimeEntriesProjector } from './usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler.ts'

export const symDatabase = Symbol('Database')
export const symRepository = Symbol('Repository')
export const symEventStore = Symbol('EventStore')
export const symListTimeEntriesDirective = Symbol('ListTimeEntriesDirective')

export interface TimeRegistrationModule {
  [symEventStore]: EventStore<TimeEntryEvent>
  [symRepository]: TimeEntryRepository
  [symListTimeEntriesDirective]: ListTimeEntriesDirectivePort
}

export async function timeRegistrationModule(): Promise<TimeRegistrationModule> {
  const stream = 'time_entries'
  const client = await getClient()
  const database = client.db()
  const outbox = new Outbox()
  const eventStore = MongoEventStore(database, outbox)

  const eventBusOutbox = new InMemoryOutbox<TimeEntryEvent>()
  const broker = 'localhost:8080'
  const eventProducer = new PulsarEventProducer(`http://${broker}`)
  const eventConsumer = new PulsarEventConsumer(`ws://${broker}`, stream, eventBusOutbox)
  await eventConsumer.connect()
  eventConsumer.start(500)
  const eventBus = new PulsarEventBus(eventProducer, eventConsumer)

  const outboxWorker = new OutboxWorker(outbox, eventBus, stream)
  outboxWorker.start(250)

  const timeEntriesCollection = useCollection(database)<MongoRecord<TimeEntryModel>>(stream)
  eventBus.subscribe(stream, new TimeEntriesProjector(new StoreTimeEntriesDirective(timeEntriesCollection)))

  return {
    [symEventStore]: eventStore,
    [symRepository]: new TimeEntryRepository(eventStore),
    [symListTimeEntriesDirective]: new ListTimeEntriesDirective(timeEntriesCollection),
  }
}
