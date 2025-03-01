import { randomUUID } from 'node:crypto'
import { InMemoryTimeEntryRepository } from '@/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { CommandBus, EventBus, InMemoryEventStore } from '@jvhellemondt/crafts-and-arts.ts'
import { subDays } from 'date-fns'
import { RegisterTimeEntryCommand } from './RegisterTimeEntry.command'
import { RegisterTimeEntryHandler } from './RegisterTimeEntry.handler'

describe('registerTimeEntryHandler', () => {
  it('should be defined', () => {
    expect(RegisterTimeEntryHandler).toBeDefined()
  })

  it('should return a "not implemented" error upon execution', async () => {
    // arrange
    const eventBus = new EventBus()
    const eventStore = new InMemoryEventStore(eventBus)
    const repository = new InMemoryTimeEntryRepository(eventStore)
    const handler = new RegisterTimeEntryHandler(repository)
    const commandBus = new CommandBus()
    commandBus.register(RegisterTimeEntryCommand, handler)

    const userId = randomUUID()
    const endTime = new Date()
    const startTime = subDays(endTime, 3)

    const command = new RegisterTimeEntryCommand({ userId, startTime, endTime })

    // act
    const execute = () => handler.execute(command)

    // assert
    expect(execute).rejects.toThrow()
  })
})
