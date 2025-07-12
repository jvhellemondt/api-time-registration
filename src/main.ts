import { InMemoryCommandBus, InMemoryDatabase, InMemoryEventBus, InMemoryEventStore, InMemoryQueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import { TimeRegistrationModule } from '@/TimeRegistration.module.ts'
import TimeEntryApi from './infrastructure/api/TimeEntry'
import { TimeEntryRepository } from './repositories/TimeEntryRepository/TimeEntry.repository'

const eventBus = new InMemoryEventBus()
const eventStore = new InMemoryEventStore()
const repository = new TimeEntryRepository(eventStore)
const database = new InMemoryDatabase()
const commandBus = new InMemoryCommandBus()
const queryBus = new InMemoryQueryBus()

const timeRegistrationModule = new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus)
timeRegistrationModule.registerModule()

const timeEntryApi = TimeEntryApi(commandBus, queryBus)
const server = new Hono()
  .route('', timeEntryApi)

export default server
