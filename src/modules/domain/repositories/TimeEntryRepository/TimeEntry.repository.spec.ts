import type { Database, EventStore, StoredEvent, WithIdentifier } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import { SimpleDatabase, SimpleEventStore } from '@arts-n-crafts/ts'
import { createTimeEntryRegisteredEvent } from '@modules/domain/TimeEntry/TimeEntryRegistered.event.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { TimeEntryRepository } from './TimeEntry.repository.ts'

describe('time-entry repository', () => {
  let database: Database<StoredEvent<WithIdentifier<TimeEntryEvent>>>
  let eventStore: EventStore<TimeEntryEvent>
  let event: TimeEntryEvent
  let repository: TimeEntryRepository

  beforeEach(async () => {
    event = createTimeEntryRegisteredEvent(
      uuidv7(),
      { userId: uuidv7(), startTime: subHours(new Date(), 2).toISOString(), endTime: new Date().toISOString() },
    )
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
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

  it('should reject if no events are provided', async () => {
    await expect(repository.store([])).rejects.toThrowError('TimeEntryRepository::store: no events provided')
  })
})
