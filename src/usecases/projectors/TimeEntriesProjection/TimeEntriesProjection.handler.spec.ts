import type { EventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { randomUUID } from 'node:crypto'
import { InMemoryEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import { TimeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { TimeEntriesProjectionHandler } from './TimeEntriesProjection.handler'

describe('afterTimeEntryRegisteredHandler', () => {
  let eventBus: EventBus<TimeEntryEvent>

  beforeAll(() => {
    eventBus = new InMemoryEventBus()
  })

  it('should be defined', () => {
    expect(TimeEntriesProjectionHandler).toBeDefined()
  })

  it('should implement the projection handler interface', () => {
    const handler = new TimeEntriesProjectionHandler(eventBus)
    expect(() => handler.handle({} as any)).rejects.toThrow()
  })

  it('should subscribe to the time entry registered event', async () => {
    const handler = new TimeEntriesProjectionHandler(eventBus)
    handler.start()
    const event = TimeEntryRegistered(randomUUID(), { userId: randomUUID(), startTime: new Date().toISOString(), endTime: new Date().toISOString() })
    await expect(() => eventBus.publish(event)).rejects.toThrow()
  })
})
