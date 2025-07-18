import type { CommandBus, Database, EventBus, EventStore, Outbox, OutboxWorker, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent, TimeEntryState } from '@/domain/TimeEntry/TimeEntry.decider'
import type { TimeEntryModel } from '@/usecases/projectors/TimeEntriesProjection/TimeEntriesProjection.ports'
import { GenericEventStore, InMemoryCommandBus, InMemoryDatabase, InMemoryEventBus, InMemoryOutbox, InMemoryOutboxWorker, InMemoryQueryBus, ScenarioTest } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import { createRegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { createListTimeEntriesByUserIdQuery } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.query'

describe('scenario test: list time entries', () => {
  vi.useFakeTimers()

  const id = uuidv7()
  let database: Database
  let eventStore: EventStore
  let eventBus: EventBus
  let outbox: Outbox
  let commandBus: CommandBus
  let queryBus: QueryBus
  let repository: Repository<TimeEntryState, TimeEntryEvent>
  let outboxWorker: OutboxWorker
  let scenarioTest: ScenarioTest<TimeEntryState, TimeEntryEvent>

  beforeEach(() => {
    database = new InMemoryDatabase()
    eventBus = new InMemoryEventBus()
    outbox = new InMemoryOutbox()
    eventStore = new GenericEventStore(database, { outbox })
    commandBus = new InMemoryCommandBus()
    queryBus = new InMemoryQueryBus()
    outboxWorker = new InMemoryOutboxWorker(outbox, eventBus)
    repository = new TimeEntryRepository(eventStore)

    scenarioTest = new ScenarioTest(repository.streamName, eventBus, eventStore, commandBus, queryBus, repository, outboxWorker)
    new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus).registerModule()
  })

  it.skip('should have a registered time entry and list it', async () => {
    const command = createRegisterTimeEntryCommand(id, {
      userId: '01981dd1-2567-720c-9da6-a33e79275bb1',
      startTime: subHours(new Date(), 2).toISOString(),
      endTime: new Date().toISOString(),
    })
    const event = createTimeEntryRegisteredEvent(command.aggregateId, command.payload, command.metadata)
    const query = createListTimeEntriesByUserIdQuery({ userId: command.aggregateId })
    const result: TimeEntryModel[] = [{
      id: command.aggregateId,
      userId: command.payload.userId,
      startTime: command.payload.startTime,
      endTime: command.payload.endTime,
    }]

    outboxWorker.start(1)

    scenarioTest.given(event)
    scenarioTest.when(query)

    await vi.advanceTimersByTimeAsync(1)

    await scenarioTest.then(result)
  })
})
