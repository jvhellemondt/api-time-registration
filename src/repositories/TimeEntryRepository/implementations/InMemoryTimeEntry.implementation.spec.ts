import type { EventStore } from '@jvhellemondt/crafts-and-arts.ts'
import { randomUUID } from 'node:crypto'
import { EventBus, InMemoryEventStore } from '@jvhellemondt/crafts-and-arts.ts'
import { InMemoryTimeEntryRepository } from './InMemoryTimeEntry.implementation'

describe('inMemoryTimeEntryRepository', () => {
  let eventBus: EventBus
  let eventStore: EventStore
  let repository: InMemoryTimeEntryRepository

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new InMemoryTimeEntryRepository(eventStore)
  })

  it('should be defined', () => {
    expect(InMemoryTimeEntryRepository).toBeDefined()
  })

  it('should return an error when loading a non-existent time entry', async () => {
    const aggregateId = randomUUID()
    expect(() => repository.load(aggregateId)).rejects.toThrow()
  })
})
