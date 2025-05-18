import { CommandBus, EventBus, InMemoryDatabase, InMemoryEventStore, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { InMemoryTimeEntryRepository } from '@/TimeEntries/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from '@/TimeEntries/TimeRegistration.module'
import TimeEntryApi from './TimeEntry'

describe('example', () => {
  it('post time-entry/register', async () => {
    const eventBus = new EventBus()
    const eventStore = new InMemoryEventStore(eventBus)
    const commandBus = new CommandBus()
    const repository = new InMemoryTimeEntryRepository(eventStore)
    const queryBus = new QueryBus()
    const database = new InMemoryDatabase()
    const timeRegistrationModule = new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus)

    timeRegistrationModule.registerModule()

    const server = new TimeEntryApi(commandBus)
    const res = await server.app.request('time-entry/register', {
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
})
