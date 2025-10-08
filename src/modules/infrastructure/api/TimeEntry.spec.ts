import type { CreateStatement, Database, StoredEvent } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { TimeRegistrationModule } from '@modules/TimeRegistration.module.ts'
import type { TimeEntryModel } from '@modules/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports.ts'
import { Operation, SimpleDatabase, SimpleEventStore } from '@arts-n-crafts/ts'
import { TimeEntryRepository } from '@modules/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import { ListTimeEntriesInMemoryDirective } from '@modules/infrastructure/database/in-memory/directives/ListTimeEntries/ListTimeEntries.in-memory.directive.ts'
import { mapTimeEntryModelToListTimeEntriesItemMapper } from '@modules/mappers/mapTimeEntryModelToListTimeEntriesItem.mapper.ts'
import { symEventStore, symListTimeEntriesDirective, symRepository } from '@modules/TimeRegistration.module.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { useCollection } from '../database/in-memory/useCollection.ts'
import TimeEntryApi from './TimeEntry.ts'

describe('time-entry api', () => {
  const database: Database<TimeEntryModel> = new SimpleDatabase()
  const eventsDb = new SimpleDatabase<StoredEvent<TimeEntryEvent>>()
  const eventStore = new SimpleEventStore<TimeEntryEvent>(eventsDb)
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

  describe('endpoint /register-time-entry', () => {
    it('should register a time entry', async () => {
      const body = JSON.stringify({
        startTime: subHours(now, 1).getTime(),
        endTime: now.getTime(),
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
      { __scenario: 'MISSING_UUID', payload: { userId: '', startTime: subHours(now, 1).getTime(), endTime: now.getTime() } },
      { __scenario: 'MISSING_START_TIME', payload: { userId: uuidv7(), startTime: '', endTime: now.getTime() } },
      { __scenario: 'MISSING_END_TIME', payload: { userId: uuidv7(), startTime: subHours(now, 1).getTime(), endTime: '' } },
      { __scenario: 'MISSING_ALL_FIELDS', payload: { userId: '', startTime: '', endTime: '' } },
      { __scenario: 'INVALID_UUID', payload: { userId: 'invalid-uuid-id', startTime: subHours(now, 1).getTime(), endTime: now.getTime() } },
      { __scenario: 'INVALID_START_TIME', payload: { userId: uuidv7(), startTime: subHours(now, 1).toTimeString(), endTime: now.getTime() } },
      { __scenario: 'INVALID_END_TIME', payload: { userId: uuidv7(), startTime: subHours(now, 1).getTime(), endTime: now.toUTCString() } },
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
      { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime(), minutes: 120 },
      { id: uuidv7(), userId: users.Elon.id, startTime: subHours(new Date(), 3).getTime(), endTime: subHours(new Date(), 2).getTime(), minutes: 60 },
      { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 2).getTime(), endTime: new Date().getTime(), minutes: 120 },
      { id: uuidv7(), userId: users.Jeff.id, startTime: subHours(new Date(), 6).getTime(), endTime: subHours(new Date(), 2).getTime(), minutes: 240 },
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
      expect(result).toStrictEqual(
        documents
          .filter(document => document.userId === user.id)
          .map(mapTimeEntryModelToListTimeEntriesItemMapper),
      )
    })

    it.each([
      { __scenario: 'MISSING_UUID', payload: { userId: '' } },
      { __scenario: 'INVALID_UUID', payload: { userId: 'invalid-uuid-id' } },
    ])('should return a validation error for $__scenario', async ({ payload: { userId } }) => {
      const res = await server.request('list-time-entries', {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json', 'User-Id': userId }),
      })
      expect(res.status).toBe(400)
    })
  })
})
