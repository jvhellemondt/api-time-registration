import type { CommandBus, EventBus, EventStore, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { randomUUID } from 'node:crypto'
import {
  InMemoryCommandBus,
  InMemoryDatabase,
  InMemoryEventBus,
  InMemoryEventStore,
  InMemoryQueryBus,
  InMemoryRepository,
} from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import TimeEntryApi from './TimeEntry'

describe('example', () => {
  let eventBus: EventBus<TimeEntryEvent>
  let commandBus: CommandBus
  let eventStore: EventStore<TimeEntryEvent>
  let repository: Repository<TimeEntryEvent>
  let queryBus: QueryBus
  let database: InMemoryDatabase
  let server: ReturnType<typeof TimeEntryApi>

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore(eventBus)
    commandBus = new InMemoryCommandBus()
    repository = new InMemoryRepository<TimeEntryEvent>(eventStore)
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
      const now = new Date()
      const res = await server.request('registerTimeEntry', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          userId: randomUUID(),
          startTime: subHours(now, 1).toISOString(),
          endTime: now.toISOString(),
        }),
      })
      const { id } = await res.json()
      const events = await eventStore.loadEvents(id)

      expect(res.status).toBe(201)
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('TimeEntryRegistered')
      expect(id).toBeDefined()
    })
  })
})
