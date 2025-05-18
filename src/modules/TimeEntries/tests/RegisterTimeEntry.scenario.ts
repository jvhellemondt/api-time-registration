import type { TimeEntry } from '@/TimeEntries/domain/TimeEntry/TimeEntry'
import type { EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { TimeEntryRegistered } from '@/TimeEntries/domain/events/TimeEntryRegistered.event'
import { InMemoryTimeEntryRepository } from '@/TimeEntries/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from '@/TimeEntries/TimeRegistration.module'
import { RegisterTimeEntryCommand } from '@/TimeEntries/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { CommandBus, EventBus, InMemoryEventStore, QueryBus, ScenarioTest } from '@jvhellemondt/arts-and-crafts.ts'
import { subMinutes } from 'date-fns'
import { beforeEach, describe, expect, it } from 'vitest'

describe('scenario test', () => {
  const id = randomUUID()
  let eventBus: EventBus
  let repository: Repository<TimeEntry>
  let queryBus: QueryBus
  let eventStore: EventStore
  let commandBus: CommandBus
  let scenarioTest: ScenarioTest

  beforeEach(() => {
    eventBus = new EventBus()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new InMemoryTimeEntryRepository(eventStore)
    commandBus = new CommandBus()
    queryBus = new QueryBus()
    scenarioTest = new ScenarioTest(eventStore, eventBus, commandBus, queryBus)
    new TimeRegistrationModule(eventStore, commandBus, repository).registerModule()
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
