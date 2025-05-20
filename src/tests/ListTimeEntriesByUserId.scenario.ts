import type { Database, EventStore, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntry } from '@/domain/TimeEntry/TimeEntry'
import { randomUUID } from 'node:crypto'
import { CommandBus, EventBus, InMemoryDatabase, InMemoryEventStore, QueryBus, ScenarioTest } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { TimeEntryRegistered } from '@/domain/events/TimeEntryRegistered.event'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntryRepository'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import { ListTimeEntriesByUserId } from '../usecases/queries/ListTimeEntriesByUserId/ListTimeEntriesByUserId.query'

describe('scenario test: ListTimeEntriesByUserId', () => {
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
    repository = new TimeEntryRepository(eventStore)
    commandBus = new CommandBus()
    queryBus = new QueryBus()
    scenarioTest = new ScenarioTest(eventStore, eventBus, commandBus, queryBus)
    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
  })

  it('should be defined', async () => {
    expect(ScenarioTest).toBeDefined()
  })

  describe('List Time Entries By User Id', () => {
    it('should retrieve users\' time entries', async () => {
      const userFoo = { name: 'foo', id: randomUUID() }
      const userBar = { name: 'bar', id: randomUUID() }
      const endTime = new Date()
      const startTime = subHours(endTime, 3)
      const aggregateIds = Array.from({ length: 6 }).map(() => randomUUID())

      await scenarioTest
        .given(
          TimeEntryRegistered(aggregateIds[0], { userId: userFoo.id, startTime, endTime }),
          TimeEntryRegistered(aggregateIds[1], { userId: userFoo.id, startTime, endTime }),
          TimeEntryRegistered(aggregateIds[2], { userId: userFoo.id, startTime, endTime }),
          TimeEntryRegistered(aggregateIds[3], { userId: userFoo.id, startTime, endTime }),
          TimeEntryRegistered(aggregateIds[4], { userId: userBar.id, startTime, endTime }),
          TimeEntryRegistered(aggregateIds[5], { userId: userBar.id, startTime, endTime }),
        )
        .when(
          ListTimeEntriesByUserId({ userId: userFoo.id }),
        )
        .then([
          { id: aggregateIds[0], userId: userFoo.id, startTime, endTime },
          { id: aggregateIds[1], userId: userFoo.id, startTime, endTime },
          { id: aggregateIds[2], userId: userFoo.id, startTime, endTime },
          { id: aggregateIds[3], userId: userFoo.id, startTime, endTime },
        ])
    })
  })
})
