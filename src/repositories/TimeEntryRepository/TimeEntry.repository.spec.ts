import type { Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider'
import { randomUUID } from 'node:crypto'
import { EventStore, InMemoryDatabase } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { timeEntryRegistered } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { TimeEntryRepository } from './TimeEntry.repository'

describe('time-entry repository', () => {
  let database: Database
  let eventStore: EventStore
  let event: TimeEntryEvent
  let repository: TimeEntryRepository

  beforeEach(async () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const startTime = subHours(new Date(), 2).toISOString()
    const endTime = new Date().toISOString()
    event = timeEntryRegistered(aggregateId, { userId, startTime, endTime })
    database = new InMemoryDatabase()
    eventStore = new EventStore(database)
    repository = new TimeEntryRepository(eventStore)
    await repository.store([event])
  })

  it('should be defined', () => {
    expect(TimeEntryRepository).toBeDefined()
  })

  it('should contain the stored events', async () => {
    const state = await repository.load(event.aggregateId)
    expect(state.userId).toBe(event.payload.userId)
    expect(state.startTime).toBe(event.payload.startTime)
    expect(state.endTime).toBe(event.payload.endTime)
  })
})
