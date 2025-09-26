import type { Database, EventStore, StoredEvent } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { UseCollection } from '@modules/infrastructure/database/in-memory/useCollection.ts'
import type { TimeRegistrationModule } from '@modules/TimeRegistration.module.ts'
import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { SimpleDatabase, SimpleEventStore } from '@arts-n-crafts/ts'
import { TimeEntryRepository } from '@modules/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import { ListTimeEntriesInMemoryDirective } from '@modules/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import { useCollection } from '@modules/infrastructure/database/in-memory/useCollection.ts'
import { symEventStore, symListTimeEntriesDirective, symRepository } from '@modules/TimeRegistration.module.ts'
import { listTimeEntriesByUserIdPayload } from '@modules/usecases/queries/ListTimeEntries/ListTimeEntries.ports.ts'
import fc from 'fast-check'
import TimeEntryApi from '../../TimeEntry.ts'

describe('request.GET /list-time-entries', () => {
  let database: Database<TimeEntryModel>
  let eventsDb: Database<StoredEvent<TimeEntryEvent>>
  let eventStore: EventStore<TimeEntryEvent>
  let collection: UseCollection<TimeEntryModel>
  let module: TimeRegistrationModule
  let server: ReturnType<typeof TimeEntryApi>

  beforeAll(async () => {
    database = new SimpleDatabase()
    eventsDb = new SimpleDatabase<StoredEvent<TimeEntryEvent>>()
    eventStore = new SimpleEventStore<TimeEntryEvent>(eventsDb)
    collection = useCollection(database, 'time_entries')
    module = {
      [symEventStore]: eventStore,
      [symRepository]: new TimeEntryRepository(eventStore),
      [symListTimeEntriesDirective]: new ListTimeEntriesInMemoryDirective(collection),
    }
    server = TimeEntryApi(module)
  })

  it('lists time entries or rejects invalid payloads', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.oneof(fc.string({ minLength: 0, maxLength: 50 }), fc.constant(''), fc.constant('invalid-uuid'), fc.uuid()),
        }),
        async (payload) => {
          const payloadParseResult = listTimeEntriesByUserIdPayload.safeParse(payload)
          const isValidPayload = payloadParseResult.success

          const response = await server.request('list-time-entries', {
            method: 'GET',
            headers: new Headers({
              'Content-Type': 'application/json',
              'User-Id': payload.userId,
            }),
          })

          if (isValidPayload) {
            expect(response.status).toBe(200)
            expect(await response.json()).toEqual([])
          }
          else {
            expect(response.status).toBe(400)
          }
        },
      ),
      { numRuns: 1000, verbose: false },
    )
  })
})
