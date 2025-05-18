import type { Database, EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntry } from '@/TimeEntries/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { CommandBus, EventBus, InMemoryDatabase, InMemoryEventStore, QueryBus, ScenarioTest } from '@jvhellemondt/arts-and-crafts.ts'
import { subMinutes } from 'date-fns'
import { TimeEntryRegistered } from '@/TimeEntries/domain/events/TimeEntryRegistered.event'
import { InMemoryTimeEntryRepository } from '@/TimeEntries/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from '@/TimeEntries/TimeRegistration.module'
import { RegisterTimeEntry } from '@/TimeEntries/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'

describe('scenario test', () => {
  const id = randomUUID()
  let eventBus: EventBus
  let repository: Repository<TimeEntry>
  let database: Database
  let queryBus: QueryBus
  let eventStore: EventStore
  let commandBus: CommandBus
  let scenarioTest: ScenarioTest

  beforeEach(() => {
    eventBus = new EventBus()
    database = new InMemoryDatabase()
    eventStore = new InMemoryEventStore(eventBus)
    repository = new InMemoryTimeEntryRepository(eventStore)
    commandBus = new CommandBus()
    queryBus = new QueryBus()
    scenarioTest = new ScenarioTest(eventStore, eventBus, commandBus, queryBus)
    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
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
          RegisterTimeEntry(id, payload),
        )
        .then(
          TimeEntryRegistered(id, payload),
        )
    })
  })
})
