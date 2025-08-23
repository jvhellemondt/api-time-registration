import type { Database, EventStore, StoredEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import type { UseCollection } from '@/infrastructure/database/in-memory/useCollection'
import type { TimeRegistrationModule } from '@/TimeRegistration.module'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { SimpleDatabase, SimpleEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { isValid, toDate } from 'date-fns'
import fc from 'fast-check'
import { TimeEntryRepository } from '@/domain/repositories/TimeEntryRepository/TimeEntry.repository'
import { ListTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive'
import { useCollection } from '@/infrastructure/database/in-memory/useCollection'
import { symEventStore, symListTimeEntriesDirective, symRepository } from '@/TimeRegistration.module'
import { registerTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import TimeEntryApi from '../../TimeEntry'

describe('request.POST /register-time-entry', () => {
  let database: Database<TimeEntryModel>
  let eventStore: EventStore<TimeEntryEvent>
  let collection: UseCollection<TimeEntryModel>
  let module: TimeRegistrationModule
  let server: ReturnType<typeof TimeEntryApi>

  beforeEach(() => {
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

  it('creates time entries or rejects invalid payloads', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          userId: fc.oneof(fc.string({ minLength: 0, maxLength: 50 }), fc.constant(''), fc.constant('invalid-uuid'), fc.uuid()),
          startTime: fc.oneof(
            fc.date(),
            fc.string({ minLength: 0, maxLength: 50 }),
          ),
          endTime: fc.oneof(
            fc.date(),
            fc.string({ minLength: 0, maxLength: 50 }),
          ),
        }),
        async (payload) => {
          const body = {
            startTime: isValid(payload.startTime) ? toDate(payload.startTime).toISOString() : payload.startTime,
            endTime: isValid(payload.endTime) ? toDate(payload.endTime).toISOString() : payload.endTime,
          }

          const payloadParseResult = registerTimeEntryCommandPayload.safeParse({ userId: payload.userId, ...body })
          const isValidPayload = payloadParseResult.success

          const response = await server.request('register-time-entry', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'User-Id': payload.userId,
            }),
            body: JSON.stringify(body),
          })

          if (isValidPayload) {
            expect(response.status).toBe(201)
            expect(await response.json()).toEqual(
              expect.objectContaining({
                // eslint-disable-next-line ts/no-unsafe-assignment
                id: expect.any(String),
              }),
            )
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
