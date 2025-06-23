import type { EventBus, EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { InMemoryEventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { subMinutes } from 'date-fns'
import { Schema } from 'effect'
import { TimeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { registerTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { TimeEntryRepository } from './TimeEntryRepository'

describe('inMemoryTimeEntryRepository', () => {
  let eventBus: EventBus<TimeEntryEvent>
  let eventStore: EventStore<TimeEntryEvent>
  let repository: TimeEntryRepository

  beforeEach(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new TimeEntryRepository(eventStore)
  })

  it('should be defined', () => {
    expect(TimeEntryRepository).toBeDefined()
  })

  it('should not find any past events for non-existent time entry', async () => {
    const aggregateId = randomUUID()
    const events = await repository.load(aggregateId)
    expect(events).toHaveLength(0)
  })

  it('should return the aggregate when loading an existing time entry', async () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const payload = Schema.decodeSync(registerTimeEntryPayload)({
      userId,
      startTime: subMinutes(new Date(), 120).toISOString(),
      endTime: subMinutes(new Date(), 60).toISOString(),
    })
    const writeToStoreEvent = TimeEntryRegistered(aggregateId, payload)

    await repository.store([writeToStoreEvent])

    const readFromStoreEvents = await repository.load(aggregateId)
    expect(readFromStoreEvents).toHaveLength(1)
    expect(readFromStoreEvents[0]).toBe(writeToStoreEvent)
  })
})
