import type { Command, CommandHandler, Database, EventStore, StoredEvent, WithIdentifier } from '@arts-n-crafts/ts'
import type { TimeEntryEvent } from '@modules/domain/TimeEntry/TimeEntry.decider.ts'
import type { RegisterTimeEntryCommandPayload } from './RegisterTimeEntry.ports.ts'
import { SimpleDatabase, SimpleEventStore } from '@arts-n-crafts/ts'
import { TimeEntryRepository } from '@modules/domain/repositories/TimeEntryRepository/TimeEntry.repository.ts'
import { createRegisterTimeEntryCommand } from '@modules/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { beforeAll } from 'vitest'
import { RegisterTimeEntryHandler } from './RegisterTimeEntry.handler.ts'

describe('registerTimeEntryHandler', () => {
  let database: Database<StoredEvent<TimeEntryEvent>>
  let eventStore: EventStore<TimeEntryEvent>
  let repository: TimeEntryRepository
  let handler: CommandHandler<Command<'RegisterTimeEntry', RegisterTimeEntryCommandPayload>, Promise<WithIdentifier>>

  beforeAll(() => {
    database = new SimpleDatabase()
    eventStore = new SimpleEventStore(database)
    repository = new TimeEntryRepository(eventStore)
    handler = new RegisterTimeEntryHandler(repository)
  })

  it('should be defined', () => {
    expect(RegisterTimeEntryHandler).toBeDefined()
  })

  it('should register a time entry', async () => {
    const aggregateId = uuidv7()
    const now = new Date()
    const payload: RegisterTimeEntryCommandPayload = {
      userId: uuidv7(),
      startTime: subHours(now, 1).toISOString(),
      endTime: now.toISOString(),
    }
    const command = createRegisterTimeEntryCommand(aggregateId, payload)
    const result = await handler.execute(command)

    const events = await eventStore.load(repository.streamName, aggregateId)

    expect(result).toStrictEqual({ id: aggregateId })
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('TimeEntryRegistered')
  })
})
