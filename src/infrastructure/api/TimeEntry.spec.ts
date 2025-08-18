import type { CreateStatement, Database, StoredEvent } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeRegistrationModule } from '@/TimeRegistration.module'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { Operation, SimpleDatabase, SimpleEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { ListTimeEntriesInMemoryDirective } from '@/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { symEventStore, symListTimeEntriesDirective, symRepository } from '@/TimeRegistration.module'
import { useCollection } from '../database/in-memory/useCollection'
import TimeEntryApi from './TimeEntry'

describe('time-entry api', () => {
  const database: Database<TimeEntryModel> = new SimpleDatabase()
  const eventStore = new SimpleEventStore(new SimpleDatabase<StoredEvent<TimeEntryEvent>>())
  const collection = useCollection(database, 'time_entries')
  const module: TimeRegistrationModule = {
    [symEventStore]: eventStore,
    [symRepository]: new TimeEntryRepository(eventStore),
    [symListTimeEntriesDirective]: new ListTimeEntriesInMemoryDirective(collection),
  }
  const now = new Date()
  let server: ReturnType<typeof TimeEntryApi>

  beforeEach(() => {
    server = TimeEntryApi(module)
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

  describe('catchAll error', () => {
    it('should trigger the onError handler and return a 500 status', async () => {
      server = TimeEntryApi({} as typeof module)
      const res = await server.request('/list-time-entries')
      expect(res.status).toBe(500)
    })
  })

  describe('endpoint /register-time-entry', () => {
    it('should register a time entry', async () => {
      const body = JSON.stringify({
        startTime: subHours(now, 1).toISOString(),
        endTime: now.toISOString(),
      })
      const res = await server.request('register-time-entry', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', 'User-Id': uuidv7() }),
        body,
      })
      const { id } = await res.json() as { id: string }
      const events = await eventStore.load(module[symRepository].streamName, id)

      expect(res.status).toBe(201)
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('TimeEntryRegistered')
      expect(id).toBeDefined()
    })

    it.each([
      { __scenario: 'MISSING_UUID', payload: { userId: '', startTime: subHours(now, 1).toISOString(), endTime: now.toISOString() } },
      { __scenario: 'MISSING_START_TIME', payload: { userId: uuidv7(), startTime: '', endTime: now.toISOString() } },
      { __scenario: 'MISSING_END_TIME', payload: { userId: uuidv7(), startTime: subHours(now, 1).toISOString(), endTime: '' } },
      { __scenario: 'MISSING_ALL_FIELDS', payload: { userId: '', startTime: '', endTime: '' } },
      { __scenario: 'INVALID_UUID', payload: { userId: 'invalid-uuid-id', startTime: subHours(now, 1).toISOString(), endTime: now.toISOString() } },
      { __scenario: 'INVALID_START_TIME', payload: { userId: uuidv7(), startTime: subHours(now, 1).toTimeString(), endTime: now.toISOString() } },
      { __scenario: 'INVALID_END_TIME', payload: { userId: uuidv7(), startTime: subHours(now, 1).toISOString(), endTime: now.toUTCString() } },
    ])('should return a validation error for $__scenario', async ({ payload: { userId, startTime, endTime } }) => {
      const res = await server.request('register-time-entry', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json', 'User-Id': userId }),
        body: JSON.stringify({ startTime, endTime }),
      })
      expect(res.status).toBe(400)
    })
  })

  describe('endpoint /list-time-entries', () => {
    const users = {
      Elon: { id: uuidv7(), name: 'Elon Musk' },
      Jeff: { id: uuidv7(), name: 'Jeff Bezos' },
    }
    const documents: TimeEntryModel[] = [
      { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
      { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 3).toISOString(), endTime: subHours(new Date(), 2).toISOString() },
      { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
      { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 6).toISOString(), endTime: subHours(new Date(), 2).toISOString() },
    ]

    beforeAll(async () => {
      await Promise.all(documents.map(async (document) => {
        const statement: CreateStatement<TimeEntryModel> = { operation: Operation.CREATE, payload: document }
        await database.execute('time_entries', statement)
      }))
    })

    it.each([
      users.Elon,
      users.Jeff,
    ])('should get the time entries for $name', async (user) => {
      const res = await server.request(`list-time-entries`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          'User-Id': user.id,
        }),
      })
      const result = await res.json() as Record<string, unknown>[]

      expect(res.status).toBe(200)
      expect(result).toStrictEqual(documents.filter(document => document.userId === user.id))
    })
  })
})
