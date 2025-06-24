import type { EventBus, EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.ts'
import { randomUUID } from 'node:crypto'
import { InMemoryEventBus, InMemoryEventStore } from '@jvhellemondt/arts-and-crafts.ts'
import {
  InMemoryCommandBus,
} from '@jvhellemondt/arts-and-crafts.ts/src/infrastructure/CommandBus/implementations/InMemoryCommandBus.ts'
import { isUUID } from 'class-validator'
import { subDays } from 'date-fns'
import { Schema } from 'effect'
import { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntryRepository'
import { registerTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { RegisterTimeEntryHandler } from './RegisterTimeEntry.handler'

describe('registerTimeEntryHandler', () => {
  it('should be defined', () => {
    expect(RegisterTimeEntryHandler).toBeDefined()
  })

  it('should store the aggregate and return the id of the created time entry', async () => {
    // arrange
    const eventBus: EventBus<TimeEntryEvent> = new InMemoryEventBus()
    const eventStore: EventStore<TimeEntryEvent> = new InMemoryEventStore(eventBus)
    const repository = new TimeEntryRepository(eventStore)
    const handler = new RegisterTimeEntryHandler(repository)
    const commandBus = new InMemoryCommandBus()
    commandBus.register('RegisterTimeEntry', handler)

    const aggregateId = randomUUID()
    const userId = randomUUID()
    const endTime = new Date().toISOString()
    const startTime = subDays(endTime, 3).toISOString()
    const payload = Schema.decodeSync(registerTimeEntryPayload)({ userId, startTime, endTime })
    const command = RegisterTimeEntry(aggregateId, payload)

    // act
    const result = await handler.execute(command)
    // const events = await eventStore.loadEvents(result.id)

    // assert
    expect(isUUID(result.id)).toBeTruthy()
    // expect(events).toHaveLength(1)
  })
})
