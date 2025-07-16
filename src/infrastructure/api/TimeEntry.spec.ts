import type { CommandBus, Database, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import {
  EventStore,
  InMemoryCommandBus,
  InMemoryDatabase,
  InMemoryEventBus,
  InMemoryQueryBus,
  makeStreamKey,
  Operation,
} from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import { TimeEntriesProjectionHandler } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.handler'
import TimeEntryApi from './TimeEntry'

describe('example', () => {
  const userId = randomUUID()
  const now = new Date()
  const eventBus = new InMemoryEventBus()
  let database: Database
  let eventStore: EventStore
  let repository: TimeEntryRepository

  let commandBus: CommandBus
  let queryBus: QueryBus
  let server: ReturnType<typeof TimeEntryApi>

  beforeEach(() => {
    database = new InMemoryDatabase()
    eventStore = new EventStore(database)
    commandBus = new InMemoryCommandBus()
    repository = new TimeEntryRepository(eventStore)
    queryBus = new InMemoryQueryBus()
    database = new InMemoryDatabase()

    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
    server = TimeEntryApi(commandBus, queryBus)
  })

  describe('endpoint /health', () => {
    it('should have an health endpoint', async () => {
      const res = await server.request('health', {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(200)
      expect(await res.text()).toBe('HEALTH OK')
    })
  })

  describe('endpoint /registerTimeEntry', () => {
    it('should register a time entry', async () => {
      const res = await server.request('registerTimeEntry', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          userId,
          startTime: subHours(now, 1).toISOString(),
          endTime: now.toISOString(),
        }),
      })
      const { id } = await res.json()
      const streamKey = makeStreamKey(repository.streamName, id)
      const events = await eventStore.load(streamKey)

      expect(res.status).toBe(201)
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('TimeEntryRegistered')
      expect(id).toBeDefined()
    })
  })

  describe('endpoint /listTimeEntries/:userId', () => {
    const records = [
      { id: randomUUID(), userId, startTime: subHours(now, 1).toISOString(), endTime: now.toISOString() },
      { id: randomUUID(), userId, startTime: subHours(now, 2).toISOString(), endTime: subHours(now, 1).toISOString() },
      { id: randomUUID(), userId, startTime: subHours(now, 3).toISOString(), endTime: subHours(now, 2).toISOString() },
      { id: randomUUID(), userId, startTime: subHours(now, 4).toISOString(), endTime: subHours(now, 3).toISOString() },
    ]
    beforeEach(async () => {
      await Promise.all(records.map(payload =>
        database.execute(TimeEntriesProjectionHandler.tableName, { operation: Operation.CREATE, payload })))
    })

    it('should register a time entry', async () => {
      const res = await server.request(`listTimeEntries/${userId}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const result = await res.json()

      expect(res.status).toBe(200)
      expect(result).toStrictEqual(records)
    })
  })
})
