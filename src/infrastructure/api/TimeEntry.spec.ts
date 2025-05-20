import type { TimeEntryProps } from '@/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { CommandBus, EventBus, InMemoryDatabase, InMemoryEventStore, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntryRepository'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import TimeEntryApi from './TimeEntry'

describe('example', () => {
  let eventBus: EventBus
  let eventStore: InMemoryEventStore
  let commandBus: CommandBus
  let repository: TimeEntryRepository
  let queryBus: QueryBus
  let database: InMemoryDatabase
  let server: TimeEntryApi

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    commandBus = new CommandBus()
    repository = new TimeEntryRepository(eventStore)
    queryBus = new QueryBus()
    database = new InMemoryDatabase()

    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
    server = new TimeEntryApi(commandBus, queryBus)
  })

  it('should have an health endpoint', async () => {
    const res = await server.app.request('health', {
      method: 'GET',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })

    expect(res.status).toBe(200)
    expect(await res.text()).toBe('HEALTH OK')
  })

  it('post register', async () => {
    const res = await server.app.request('register', {
      method: 'POST',
      body: JSON.stringify({ message: 'hello hono' }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    const { id } = await res.json()
    const events = await eventStore.loadEvents(id)

    expect(res.status).toBe(201)
    expect(res.headers.get('X-Custom')).toBe('Thank you')
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('TimeEntryRegistered')
  })

  describe('get list', () => {
    it('should retrieve the time entries', async () => {
      const userId = randomUUID()
      const props: TimeEntryProps = { userId, startTime: subHours(new Date(), 3), endTime: new Date() }
      const event = TimeEntryRegistered(randomUUID(), props)

      await eventBus.publish(event)

      const res = await server.app.request(`list?userId=${userId}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(res.headers.get('X-Custom')).toBe('Thank you')
      expect(data.amount).toBe('1')
      expect(data.items[0].userId).toBe(userId)
    })

    it('should not find any time entries', async () => {
      const props: TimeEntryProps = { userId: randomUUID(), startTime: subHours(new Date(), 3), endTime: new Date() }
      const event = TimeEntryRegistered(randomUUID(), props)
      await eventBus.publish(event)

      const res = await server.app.request(`list?userId=${randomUUID()}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(res.headers.get('X-Custom')).toBe('Thank you')
      expect(data.amount).toBe('0')
      expect(data.items).toStrictEqual([])
    })

    it('should inform the user that the userId is not provided', async () => {
      const res = await server.app.request(`list`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(400)
      expect(await res.text()).toBe('Required query param \'userId\' not provided')
    })

    it('should inform the user that the userId is not in UUID-format', async () => {
      const res = await server.app.request(`list?userId=NOT_UUID`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(400)
      expect(await res.text()).toBe('Required query param \'userId\' not a valid UUID')
    })

    it('should respond with 500 if no time entries are created at all (thus no table)', async () => {
      const res = await server.app.request(`list?userId=${randomUUID()}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      })

      expect(res.status).toBe(500)
      expect(await res.text()).toBe('Unhandled exception')
    })
  })
})
