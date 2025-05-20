import { CommandBus, EventBus, InMemoryDatabase, InMemoryEventStore, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import { seedTimeEntries } from '@/infrastructure/api/seeds/TimeEntries.seed'
import TimeEntryApi from '@/infrastructure/api/TimeEntry'
import { InMemoryTimeEntryRepository } from '@/repositories/TimeEntryRepository/implementations/InMemoryTimeEntry.implementation'
import { TimeRegistrationModule } from '@/TimeRegistration.module'

const eventBus = new EventBus()
const commandBus = new CommandBus()
const queryBus = new QueryBus()
const eventStore = new InMemoryEventStore(eventBus)
const repository = new InMemoryTimeEntryRepository(eventStore)
const database = new InMemoryDatabase()

const timeRegistrationModule = new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus)
timeRegistrationModule.registerModule()

const timeEntryApi = new TimeEntryApi(commandBus, queryBus)

// eslint-disable-next-line antfu/no-top-level-await
await seedTimeEntries(eventBus)

const server = new Hono()
  .route('time-entry/', timeEntryApi.app)

export default server
