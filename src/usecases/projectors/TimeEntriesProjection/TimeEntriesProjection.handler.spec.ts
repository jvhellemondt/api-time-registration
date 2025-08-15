import type { EventHandler } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { TimeEntriesProjector } from './TimeEntriesProjection.handler'

describe('time-entries projector', () => {
  let projector: EventHandler<TimeEntryEvent>

  beforeEach(() => {
    projector = new TimeEntriesProjector()
  })

  it('should be defined', () => {
    expect(TimeEntriesProjector).toBeDefined()
  })

  it('should implement an EventHandler', async () => {
    expect(projector.start.bind(projector)).toThrow()
    await expect(projector.handle.bind(projector)).rejects.toThrow()
  })
})
