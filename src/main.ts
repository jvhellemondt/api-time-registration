/* eslint-disable no-console */
import { EventStore, InMemoryCommandBus, InMemoryEventBus, InMemoryQueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { serve } from 'bun'
import { Hono } from 'hono'
import { TimeRegistrationModule } from '@/TimeRegistration.module.ts'
import TimeEntryApi from './infrastructure/api/TimeEntry'
import { MongoDatabase } from './infrastructure/database/Mongodb.client'
import { TimeEntryRepository } from './repositories/TimeEntryRepository/TimeEntry.repository'

async function bootstrap() {
  const app = new Hono()

  const database = await MongoDatabase.connect()
  const eventBus = new InMemoryEventBus()
  const eventStore = new EventStore(database)
  const repository = new TimeEntryRepository(eventStore)

  const commandBus = new InMemoryCommandBus()
  const queryBus = new InMemoryQueryBus()

  const timeRegistrationModule = new TimeRegistrationModule(
    repository,
    database,
    commandBus,
    queryBus,
    eventBus,
  )
  timeRegistrationModule.registerModule()

  const api = TimeEntryApi(commandBus, queryBus)

  return app
    .route('/', api)
}

bootstrap()
  .then(app => serve({ fetch: app.fetch }))
  .then(() => console.log('Server started'))
  .catch(err => console.error('Error starting server:', err))
