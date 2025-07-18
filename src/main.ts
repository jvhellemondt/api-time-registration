/* eslint-disable no-console */
import process from 'node:process'
import { GenericEventStore, InMemoryCommandBus, InMemoryEventBus, InMemoryOutbox, InMemoryOutboxWorker, InMemoryQueryBus } from '@jvhellemondt/arts-and-crafts.ts'
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
  const outbox = new InMemoryOutbox()
  const outboxWorker = new InMemoryOutboxWorker(outbox, eventBus)
  const eventStore = new GenericEventStore(database, { outbox })
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

  outboxWorker.start(500)

  const api = TimeEntryApi(commandBus, queryBus)

  return app
    .route('/', api)
}

bootstrap()
  .then(app => serve({ fetch: app.fetch }))
  .then(() => console.log(`Server started. Running on http://${process.env.HOST}:${process.env.PORT}`))
  .catch(err => console.error('Error starting server:', err))
