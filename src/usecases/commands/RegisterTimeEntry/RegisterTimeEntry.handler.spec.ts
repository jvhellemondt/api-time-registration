import type { CommandHandler, EventBus, EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { randomUUID } from 'node:crypto'
import { InMemoryEventBus, InMemoryEventStore, InMemoryRepository } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { beforeAll } from 'vitest'
import { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
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

  it('should register a time entry', async () => {
    const aggregateId = randomUUID()
    const now = new Date()
    const payload: RegisterTimeEntryOutput = {
      userId: randomUUID(),
      startTime: subHours(now, 1).toISOString(),
      endTime: now.toISOString(),
    }
    const command = RegisterTimeEntry(aggregateId, payload)
    const result = await handler.execute(command)

    const events = await eventStore.loadEvents(aggregateId)

    expect(result).toStrictEqual({ id: aggregateId })
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('TimeEntryRegistered')
  })
})
