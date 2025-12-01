import type { Database, EventStore, StoredEvent } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { SimpleDatabase, SimpleEventStore } from '@arts-n-crafts/ts'
import { TimeEntryRepository } from '@modules/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import { ListTimeEntriesInMemoryDirective } from '@modules/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import {
  StoreTimeEntriesInMemoryDirective,
} from '@modules/infrastructure/database/in-memory/directives/StoreTimeEntries/StoreTimeEntries.in-memory.directive.ts'
import { EventBus } from '@modules/infrastructure/eventBus/EventBus.ts'
import { Outbox } from '@modules/infrastructure/outbox/Outbox.ts'
import { OutboxWorker } from '@modules/infrastructure/outbox/OutboxWorker.ts'
import { registerTimeEntryCommandPayload } from '@modules/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports.ts'
import {
  TimeEntriesProjector,
} from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler.ts'
import { isValid, toDate } from 'date-fns'
import fc from 'fast-check'
import TimeEntryApi from '../../TimeEntry.ts'

describe('request.POST /register-time-entry', () => {
  const stream = 'time_entries'
  let database: Database<TimeEntryModel>
  let eventsDb: Database<StoredEvent<TimeEntryEvent>>
  let eventStore: EventStore<TimeEntryEvent>
  let server: ReturnType<typeof TimeEntryApi>

  beforeAll(async () => {
    database = new SimpleDatabase()
    eventsDb = new SimpleDatabase<StoredEvent<TimeEntryEvent>>()
    eventStore = new SimpleEventStore<TimeEntryEvent>(eventsDb)
    const eventBus = new EventBus()
    const outbox = new Outbox()
    const outboxWorker = new OutboxWorker(outbox, eventBus, stream)
    outboxWorker.start(250)

    eventBus.subscribe(stream, new TimeEntriesProjector(new StoreTimeEntriesInMemoryDirective(stream, database)))
    const repository = new TimeEntryRepository(eventStore)
    const listTimeEntriesDirective = new ListTimeEntriesInMemoryDirective(stream, database)
    server = TimeEntryApi({ listTimeEntriesDirective, repository })
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
            startTime: isValid(payload.startTime) ? toDate(payload.startTime).getTime() : payload.startTime,
            endTime: isValid(payload.endTime) ? toDate(payload.endTime).getTime() : payload.endTime,
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
