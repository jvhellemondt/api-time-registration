import type { CommandHandler, Database } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryOutput } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { randomUUID } from 'node:crypto'
import { EventStore, InMemoryDatabase, makeStreamKey } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { beforeAll } from 'vitest'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { registerTimeEntry } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command.ts'
import { RegisterTimeEntryHandler } from './RegisterTimeEntry.handler'

describe('registerTimeEntryHandler', () => {
  let database: Database
  let eventStore: EventStore
  let repository: TimeEntryRepository
  let handler: CommandHandler<'RegisterTimeEntry', RegisterTimeEntryOutput>

  beforeAll(() => {
    database = new InMemoryDatabase()
    eventStore = new EventStore(database)
    repository = new TimeEntryRepository(eventStore)
    handler = new RegisterTimeEntryHandler(repository)
  })

  it('should be defined', () => {
    expect(RegisterTimeEntryHandler).toBeDefined()
  })

  it('should register a time entry', async () => {
    const aggregateId = randomUUID()
    const streamKey = makeStreamKey(repository.streamName, aggregateId)
    const now = new Date()
    const payload: RegisterTimeEntryOutput = {
      userId: randomUUID(),
      startTime: subHours(now, 1).toISOString(),
      endTime: now.toISOString(),
    }
    const command = registerTimeEntry(aggregateId, payload)
    const result = await handler.execute(command)

    const events = await eventStore.load(streamKey)

    expect(result).toStrictEqual({ id: aggregateId })
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('TimeEntryRegistered')
  })
})
