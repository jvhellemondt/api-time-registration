/* eslint-disable no-console */
import process from 'node:process'
import TimeEntryApi from '@modules/infrastructure/api/TimeEntry.ts'
import { timeRegistrationModule } from '@modules/TimeRegistration.module.ts'
import RestApi from '@shared/infrastructure/api/rest/server/RestApi.ts'
import { serve } from 'bun'

async function bootstrap() {
  const app = RestApi()

  const module = await timeRegistrationModule()
  const timeEntryRoutes = TimeEntryApi(module)

  return app
    .route('/', timeEntryRoutes)
}

bootstrap()
  .then(app => serve({ fetch: app.fetch }))
  .then(() => console.log(`Server started. Running on http://${process.env.HOST}:${process.env.PORT}`))
  .catch(err => console.error('Error starting server:', err))
