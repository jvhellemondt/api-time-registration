import type { Statement } from '@jvhellemondt/arts-and-crafts.ts'
import { InMemoryCommandBus, InMemoryEventBus, InMemoryEventStore, InMemoryQueryBus, Operation } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUIDv7, serve } from 'bun'
import { Hono } from 'hono'
import { TimeRegistrationModule } from '@/TimeRegistration.module.ts'
import TimeEntryApi from './infrastructure/api/TimeEntry'
import { MongoDatabase } from './infrastructure/database/Mongodb.client'
import { TimeEntryRepository } from './repositories/TimeEntryRepository/TimeEntry.repository'

async function bootstrap() {
  const app = new Hono()

  const eventBus = new InMemoryEventBus()
  const eventStore = new InMemoryEventStore()
  const repository = new TimeEntryRepository(eventStore)

  const database = await MongoDatabase.connect()
  const commandBus = new InMemoryCommandBus()
  const queryBus = new InMemoryQueryBus()

  const stmt: Statement = { operation: Operation.CREATE, payload: { id: randomUUIDv7(), userId: randomUUIDv7(), projectId: randomUUIDv7() } }
  await database.execute('test', stmt)

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
    .get('/health', c => c.text('HEALTH OK'))
    .route('/', api)
}

bootstrap()
  .then(app => serve({ fetch: app.fetch }))
  .then(() => console.log('Server started'))
  .catch(err => console.error('Error starting server:', err))
