import type { Database, EventStore, StoredEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { UseCollection } from '@/infrastructure/database/in-memory/useCollection'
import type { TimeRegistrationModule } from '@/TimeRegistration.module'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { SimpleDatabase, SimpleEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import fc from 'fast-check'
import { ListTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive'
import { useCollection } from '@/infrastructure/database/in-memory/useCollection'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { symEventStore, symListTimeEntriesDirective, symRepository } from '@/TimeRegistration.module'
import { listTimeEntriesByUserIdPayload } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import TimeEntryApi from '../../TimeEntry'

describe('request.GET /list-time-entries', () => {
  let database: Database<TimeEntryModel>
  let eventStore: EventStore<TimeEntryEvent>
  let collection: UseCollection<TimeEntryModel>
  let module: TimeRegistrationModule
  let server: ReturnType<typeof TimeEntryApi>

  beforeAll(async () => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(new SimpleDatabase<StoredEvent<TimeEntryEvent>>())
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
