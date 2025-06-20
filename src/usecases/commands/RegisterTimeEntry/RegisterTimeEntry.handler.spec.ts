import { randomUUID } from 'node:crypto'
import { CommandBus, EventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { isUUID } from 'class-validator'
import { subDays } from 'date-fns'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntryRepository'
import { RegisterTimeEntry } from '../../../domain/TimeEntry/RegisterTimeEntry.command.ts'
import { RegisterTimeEntryHandler } from './RegisterTimeEntry.handler'

describe('registerTimeEntryHandler', () => {
  it('should be defined', () => {
    expect(RegisterTimeEntryHandler).toBeDefined()
  })

  it('should store the aggregate and return the id of the created time entry', async () => {
    // arrange
    const eventBus = new EventBus()
    const eventStore = new InMemoryEventStore(eventBus)
    const repository = new TimeEntryRepository(eventStore)
    const handler = new RegisterTimeEntryHandler(repository)
    const commandBus = new CommandBus()
    commandBus.register('RegisterTimeEntry', handler)

    const aggregateId = randomUUID()
    const userId = randomUUID()
    const endTime = new Date()
    const startTime = subDays(endTime, 3)

    const command = RegisterTimeEntry(aggregateId, { userId, startTime, endTime })

    // act
    const result = await handler.execute(command)
    const events = await eventStore.loadEvents(result.id)

    // assert
    expect(isUUID(result.id)).toBeTruthy()
    expect(events).toHaveLength(1)
  })
})
