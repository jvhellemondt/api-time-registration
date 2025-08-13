import type { CommandBus, Database, EventBus, EventStore, Outbox, OutboxWorker, QueryBus, Repository } from '@jvhellemondt/arts-and-crafts.ts'
import type { TimeEntryEvent, TimeEntryModel } from '@/domain/TimeEntry/TimeEntry.decider'
import { GenericEventStore, InMemoryCommandBus, InMemoryDatabase, InMemoryEventBus, InMemoryOutbox, InMemoryOutboxWorker, InMemoryQueryBus, ScenarioTest } from '@jvhellemondt/arts-and-crafts.ts'
import { subHours } from 'date-fns'
import { v7 as uuidv7 } from 'uuid'
import { createTimeEntryRegisteredEvent } from '@/domain/TimeEntry/TimeEntryRegistered.event'
import { TimeEntryRepository } from '@/repositories/TimeEntryRepository/TimeEntry.repository'
import { TimeRegistrationModule } from '@/TimeRegistration.module'
import { createRegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'

describe('scenario test: register time entries', () => {
  const id = uuidv7()
  let database: Database
  let eventStore: EventStore
  let eventBus: EventBus
  let outbox: Outbox
  let commandBus: CommandBus
  let queryBus: QueryBus
  let repository: Repository<TimeEntryModel, TimeEntryEvent>
  let outboxWorker: OutboxWorker
  let scenarioTest: ScenarioTest<TimeEntryModel, TimeEntryEvent>

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

  it('should have published the create command, as an event, in the then step', async () => {
    const command = createRegisterTimeEntryCommand(id, {
      userId: '01981dd1-2567-720c-9da6-a33e79275bb1',
      startTime: subHours(new Date(), 2).toISOString(),
      endTime: new Date().toISOString(),
    })
    const event = createTimeEntryRegisteredEvent(command.aggregateId, command.payload, command.metadata)

    await scenarioTest
      .when(command)
      .then(event)
  })
})
