import type { CommandHandler, EventBus, EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { InMemoryEventBus, InMemoryEventStore, InMemoryRepository } from '@jvhellemondt/arts-and-crafts.ts'
import { beforeAll } from 'vitest'
import { RegisterTimeEntryHandler } from './RegisterTimeEntry.handler'

describe('registerTimeEntryHandler', () => {
  let eventBus: EventBus<TimeEntryEvent>
  let eventStore: EventStore<TimeEntryEvent>
  let repository: Repository<TimeEntryEvent>
  let handler: CommandHandler<'RegisterTimeEntry', RegisterTimeEntryOutput>

  beforeAll(() => {
    eventBus = new InMemoryEventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new InMemoryRepository<TimeEntryEvent>(eventStore)
    handler = new RegisterTimeEntryHandler(repository)
  })

  it('should be defined', () => {
    expect(RegisterTimeEntryHandler).toBeDefined()
  })

  it('should have an execute method', () => {
    expect(handler.execute).toThrow()
  })
})
