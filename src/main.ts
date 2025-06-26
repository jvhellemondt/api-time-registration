import type { TimeEntryEvent } from '@/domain/TimeEntry/TimeEntry.decider.ts'
import { InMemoryCommandBus, InMemoryDatabase, InMemoryEventBus, InMemoryEventStore, InMemoryQueryBus, InMemoryRepository } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'
import { TimeRegistrationModule } from '@/TimeRegistration.module.ts'
import TimeEntryApi from './infrastructure/api/TimeEntry'

const eventBus = new InMemoryEventBus()
const eventStore = new InMemoryEventStore<TimeEntryEvent>(eventBus)
const repository = new InMemoryRepository<TimeEntryEvent>(eventStore)
const database = new InMemoryDatabase()
const commandBus = new InMemoryCommandBus()
const queryBus = new InMemoryQueryBus()

const timeRegistrationModule = new TimeRegistrationModule(repository, database, commandBus, queryBus, eventBus)
timeRegistrationModule.registerModule()

const timeEntryApi = TimeEntryApi(commandBus, queryBus)
const server = new Hono()
  .route('', timeEntryApi)

export default server
