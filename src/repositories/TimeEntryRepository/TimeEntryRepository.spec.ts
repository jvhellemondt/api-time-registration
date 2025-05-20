import type { EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryProps } from '@/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { EventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { subMinutes } from 'date-fns'
import { TimeEntry } from '@/domain/TimeEntry/TimeEntry'
import { TimeEntryRepository } from './TimeEntryRepository'

describe('inMemoryTimeEntryRepository', () => {
  let eventBus: EventBus
  let eventStore: EventStore
  let repository: TimeEntryRepository

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new TimeEntryRepository(eventStore)
  })

  it('should be defined', () => {
    expect(TimeEntryRepository).toBeDefined()
  })

  it('should return an error when loading a non-existent time entry', async () => {
    const aggregateId = randomUUID()
    await expect(() => repository.load(aggregateId)).rejects.toThrow()
  })

  it('should return the aggregate when loading an existing time entry', async () => {
    const aggregateId = randomUUID()
    const userId = randomUUID()
    const props: TimeEntryProps = {
      userId,
      startTime: subMinutes(new Date(), 120),
      endTime: subMinutes(new Date(), 60),
    }
    const aggregate = TimeEntry.create(aggregateId, props)
    repository.store(aggregate)

    const rehydratedAggregate = await repository.load(aggregateId)
    expect(rehydratedAggregate.props).toBe(props)
  })
})
