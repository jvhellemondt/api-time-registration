import type { TimeRegistrationModule } from '@/TimeRegistration.module'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { v7 as uuidv7 } from 'uuid'
import { trafficLoggerMiddleware } from '@/infrastructure/api/middleware/trafficLogger.middleware.ts'
import { symListTimeEntriesDirective, symRepository } from '@/TimeRegistration.module'
import { createRegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { RegisterTimeEntryHandler } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler'
import { registerTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { ListTimeEntriesByUserIdHandler } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.handler'
import { listTimeEntriesByUserIdPayload } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import { createListTimeEntriesByUserIdQuery } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.query'

export default function TimeEntryApi(module: TimeRegistrationModule) {
  return new Hono()
    .use(cors())
    .use(trafficLoggerMiddleware)

    .get('/health', c => c.text('HEALTH OK'))

    .get('/list-time-entries', async (c) => {
      const anUserId = c.req.header('User-Id')
      const aPayloadParseResult = listTimeEntriesByUserIdPayload.safeParse({ userId: anUserId })
      if (aPayloadParseResult.error) {
        return c.json({ error: aPayloadParseResult.error.message }, 400)
      }
      const aQuery = createListTimeEntriesByUserIdQuery(aPayloadParseResult.data)
      const anHandler = new ListTimeEntriesByUserIdHandler(module[symListTimeEntriesDirective])
      const aResult = await anHandler.execute(aQuery)
      return c.json(aResult, 200)
    })

    .post('/register-time-entry', async (c) => {
      const anUserId = c.req.header('User-Id')
      const aBody = await c.req.json <{ startTime: string, endTime: string }>()
      const aPayloadParseResult = registerTimeEntryCommandPayload.safeParse({ userId: anUserId, ...aBody })
      if (aPayloadParseResult.error) {
        return c.json({ error: aPayloadParseResult.error.message }, 400)
      }

      const aCommand = createRegisterTimeEntryCommand(uuidv7(), aPayloadParseResult.data)
      const anHandler = new RegisterTimeEntryHandler(module[symRepository])
      const aResult = await anHandler.execute(aCommand)
      return c.json({ ...aResult }, 201)
    })

    .onError(async (err, c) => {
      return c.json({ error: err.message }, 500)
    })
}
