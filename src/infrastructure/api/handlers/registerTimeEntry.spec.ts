import type {
  CommandBus,
  EventBus,
  EventStore,
  QueryBus,
} from '@jvhellemondt/arts-and-crafts.ts'
import type TimeEntry from '@/infrastructure/api/TimeEntry.ts'
import {

  InMemoryDatabase,
  InMemoryEventBus,
  InMemoryEventStore,
  InMemoryQueryBus,
} from '@jvhellemondt/arts-and-crafts.ts'
import {
  InMemoryCommandBus,
} from '@jvhellemondt/arts-and-crafts.ts/src/infrastructure/CommandBus/implementations/InMemoryCommandBus.ts'
import TimeEntryApi from '@/infrastructure/api/TimeEntry.ts'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntryRepository'
import { TimeRegistrationModule } from '@/TimeRegistration.module'

describe('register time entry', () => {
  let eventBus: EventBus<TimeEntry>
  let eventStore: EventStore<TimeEntry>
  let commandBus: CommandBus
  let repository: TimeEntryRepository
  let queryBus: QueryBus
  let database: InMemoryDatabase
  let server: TimeEntryApi

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore(eventBus)
    commandBus = new InMemoryCommandBus()
    repository = new TimeEntryRepository(eventStore)
    queryBus = new InMemoryQueryBus()
    database = new InMemoryDatabase()

    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
    server = new TimeEntryApi(commandBus, queryBus)
  })

  it('/registerTimeEntry', async () => {
    const res = await server.app.request('registerTimeEntry', {
      method: 'POST',
      body: JSON.stringify({ message: 'hello hono' }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    })
    const { id } = await res.json()
    const events = await eventStore.loadEvents(id)

    expect(res.status).toBe(201)
    expect(res.headers.get('X-Custom')).toBe('Thank you')
    expect(events).toHaveLength(1)
  })
})
