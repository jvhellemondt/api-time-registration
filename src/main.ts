/* eslint-disable no-console */
import process from 'node:process'
import { serve } from 'bun'
import { Hono } from 'hono'
import TimeEntryApi from './infrastructure/api/TimeEntry'
import { timeRegistrationModule } from './TimeRegistration.module'

async function bootstrap() {
  const app = new Hono()
  const module = await timeRegistrationModule()
  const api = TimeEntryApi(module)

  return app
    .route('/', api)
}

bootstrap()
  .then(app => serve({ fetch: app.fetch }))
  .then(() => console.log(`Server started. Running on http://${process.env.HOST}:${process.env.PORT}`))
  .catch(err => console.error('Error starting server:', err))
