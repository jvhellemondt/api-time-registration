import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'
import { InMemoryTimeEntryRepository } from '@/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import { CommandBus, EventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import TimeEntryApi from './TimeEntry'

describe('example', () => {
  it('post time-entry/register', async () => {
    const eventBus = new EventBus()
    const eventStore = new InMemoryEventStore(eventBus)
    const commandBus = new CommandBus()
    const repository = new InMemoryTimeEntryRepository(eventStore)
    const timeRegistrationModule = new TimeRegistrationModule(eventStore, commandBus, repository)

    timeRegistrationModule.registerModule()

    const server = new TimeEntryApi(commandBus)
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
    expect(events[0]).toBeInstanceOf(TimeEntryRegistered)
  })
})
