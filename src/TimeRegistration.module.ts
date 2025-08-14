import type { EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { ListTimeEntriesDirectivePort } from '@/usecases/queries/ListTimeEntries/ports/directive'
import { ListTimeEntriesDirective } from '@/infrastructure/database/mongo/directives/ListTimeEntries/ListTimeEntries.directive'
import { MongoEventStore } from '@/infrastructure/database/mongo/eventStore/MongoDBEventStore'
import { getClient } from '@/infrastructure/database/mongo/Mongodb.client'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'

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
  const eventStore = MongoEventStore(database)

  return {
    [symEventStore]: eventStore,
    [symRepository]: new TimeEntryRepository(eventStore),
    [symListTimeEntriesDirective]: new ListTimeEntriesDirective('time_entries', database),
  }
}
