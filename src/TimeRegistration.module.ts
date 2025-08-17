import type { EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import type { MongoRecord } from './infrastructure/database/mongo/MongoRecord'
import type { TimeEntryModel } from './usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import type { ListTimeEntriesDirectivePort } from './usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import { ListTimeEntriesDirective } from '@/infrastructure/database/mongo/directives/ListTimeEntries/ListTimeEntries.directive'
import { MongoEventStore } from '@/infrastructure/database/mongo/eventStore/MongoDBEventStore'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { getClient } from './infrastructure/database/mongo'
import { StoreTimeEntriesDirective } from './infrastructure/database/mongo/directives/StoreTimeEntries/StoreTimeEntries.directive'
import { useCollection } from './infrastructure/database/mongo/useCollection'
import { EventBus } from './infrastructure/eventBus/EventBus'
import { Outbox } from './infrastructure/outbox/Outbox'
import { OutboxWorker } from './infrastructure/outbox/OutboxWorker'
import { TimeEntriesProjector } from './usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler'

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
  const client = await getClient()
  const database = client.db()
  const outbox = new Outbox()
  const eventStore = MongoEventStore(database, outbox)

  const eventBus = new EventBus()
  const outboxWorker = new OutboxWorker(outbox, eventBus)
  outboxWorker.start(250)

  const timeEntriesCollection = useCollection(database)<MongoRecord<TimeEntryModel>>('time_entries')
  new TimeEntriesProjector(new StoreTimeEntriesDirective(timeEntriesCollection)).start(eventBus)

  return {
    [symEventStore]: eventStore,
    [symRepository]: new TimeEntryRepository(eventStore),
    [symListTimeEntriesDirective]: new ListTimeEntriesDirective(timeEntriesCollection),
  }
}
