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
    const validPayload = fc.record({
      userId: fc.uuid(),
      startTime: fc.date().map(d => d.toISOString()),
      endTime: fc.date().map(d => d.toISOString()),
    })
    const invalidPayload = fc.record({
      userId: fc.oneof(fc.string({ minLength: 0, maxLength: 50 }), fc.constant(''), fc.constant('invalid-uuid')),
      startTime: fc.oneof(
        fc.date().map(d => d.toISOString()),
        fc.string({ minLength: 0, maxLength: 50 }),
      ),
      endTime: fc.oneof(
        fc.date().map(d => d.toISOString()),
        fc.string({ minLength: 0, maxLength: 50 }),
      ),
    })

    await fc.assert(
      fc.asyncProperty(
        fc.oneof(validPayload, invalidPayload),
        async (payload) => {
          const payloadParseResult = registerTimeEntryCommandPayload.safeParse(payload)
          const isValidPayload = payloadParseResult.success

          const body = JSON.stringify({
            startTime: payload.startTime,
            endTime: payload.endTime,
          })

          const response = await server.request('register-time-entry', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'User-Id': payload.userId,
            }),
            body,
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
            console.log({ isValidPayload, payload, body, response, zodErr: payloadParseResult.error })
            expect(response.status).toBe(400)
          }
        },
      ),
      { numRuns: 10000, verbose: true },
    )
  })
})
