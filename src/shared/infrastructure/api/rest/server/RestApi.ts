import { trafficLoggerMiddleware } from '@shared/infrastructure/api/rest/middleware/trafficLogger.middleware.ts'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

export default function RestApi() {
  return new Hono()
    .use(cors())
    .use(trafficLoggerMiddleware)

    .get('/health', c => c.text('HEALTH OK'))

    .onError(async (err, c) => {
      return c.json({ error: err.message }, 500)
    })
}
