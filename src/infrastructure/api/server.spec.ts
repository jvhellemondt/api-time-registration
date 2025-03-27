import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'
import { commandBus, eventStore } from '@/main'
import Server from './server'

describe('example', () => {
  it('post /register-time-entry', async () => {
    const server = new Server(commandBus)
    const res = await server.app.request('/register-time-entry', {
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
