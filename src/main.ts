/* eslint-disable no-console */
import process from 'node:process'
import { getClient } from '@modules/infrastructure/database/mongo'
import { MongoEventStore } from '@modules/infrastructure/database/mongo/eventStore/MongoDBEventStore.ts'
import { Outbox } from '@modules/infrastructure/outbox/Outbox.ts'
import { TimeEntryModule } from '@modules/TimeRegistration.module.ts'
import RestApi from '@shared/infrastructure/api/rest/server/RestApi.ts'
import { serve } from 'bun'

async function bootstrap() {
  const client = await getClient()
  const database = client.db()
  const outbox = new Outbox()
  const eventStore = MongoEventStore(database, outbox)

  const app = RestApi()
  const timeEntryModule = new TimeEntryModule(database, eventStore, outbox)

  return app
    .route('/', timeEntryModule.router)
}

bootstrap()
  .then(app => serve({ fetch: app.fetch }))
  .then(() => console.log(`Server started. Running on http://${process.env.HOST}:${process.env.PORT}`))
  .catch(err => console.error('Error starting server:', err))
