import type { EventHandler, EventBus as IEventBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { EventBus } from '@/infrastructure/eventBus/EventBus'
import { TimeEntriesProjector } from './TimeEntriesProjection.handler'

describe('time-entries projector', () => {
  let eventBus: IEventBus<TimeEntryEvent>
  let projector: EventHandler<TimeEntryEvent>

  beforeEach(() => {
    eventBus = new EventBus()
    projector = new TimeEntriesProjector()
  })

  it('should be defined', () => {
    expect(TimeEntriesProjector).toBeDefined()
  })

  it('should subscribe to the eventBus', () => {
    expect(() => projector.start(eventBus)).not.toThrow()
  })

  it('should implement an EventHandler', async () => {
    await expect(projector.handle.bind(projector)).rejects.toThrow()
  })
})
