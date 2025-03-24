import type { EventStore } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'
import { TimeRegistrationModule } from '@/TimeRegistration.module.ts'
import { CommandBus, EventBus, InMemoryEventStore, QueryBus, ScenarioTest } from '@jvhellemondt/arts-and-crafts.ts'
import { subMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterTimeEntryCommand } from './RegisterTimeEntry.command'

describe('scenario test', () => {
  const id = randomUUID()
  let eventBus: EventBus
  let queryBus: QueryBus
  let eventStore: EventStore
  let commandBus: CommandBus
  let scenarioTest: ScenarioTest

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    commandBus = new CommandBus()
    queryBus = new QueryBus()
    scenarioTest = new ScenarioTest(eventStore, eventBus, commandBus, queryBus)
    new TimeRegistrationModule(eventStore, commandBus).registerModule()
  })

  it('should be defined', async () => {
    expect(ScenarioTest).toBeDefined()
  })

  describe('Time Entry Registration', () => {
    it('should register a time entry', async () => {
      const userId = randomUUID()
      const endTime = new Date()
      const startTime = subMinutes(endTime, 135)
      const payload = { userId, startTime, endTime }

      await scenarioTest
        .when(
          new RegisterTimeEntryCommand(id, payload),
        )
        .then(new TimeEntryRegistered(id, payload))
    })
  })
})
