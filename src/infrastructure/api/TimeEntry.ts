import type { TimeRegistrationModule } from '@/TimeRegistration.module'
import { Hono } from 'hono'
import { v7 as uuidv7 } from 'uuid'
import { symListTimeEntriesDirective, symRepository } from '@/TimeRegistration.module'
import { createRegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { RegisterTimeEntryHandler } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.handler'
import { registerTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { ListTimeEntriesByUserIdHandler } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.handler'
import { listTimeEntriesByUserIdPayload } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.ports'
import { createListTimeEntriesByUserIdQuery } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.query'

export default function TimeEntryApi(module: TimeRegistrationModule) {
  return new Hono()
    .get('/health', c => c.text('HEALTH OK'))

    .get('/list-time-entries', async (c) => {
      const anUserId = c.req.header('User-Id')
      const aPayload = listTimeEntriesByUserIdPayload.parse({ userId: anUserId })
      const aQuery = createListTimeEntriesByUserIdQuery(aPayload)
      const anHandler = new ListTimeEntriesByUserIdHandler(module[symListTimeEntriesDirective])
      const aResult = await anHandler.execute(aQuery)
      return c.json(aResult, 200)
    })

    .post('/register-time-entry', async (c) => {
      const anUserId = c.req.header('User-Id')
      const aBody = await c.req.json <{ startTime: string, endTime: string }>()
      const aPayload = registerTimeEntryCommandPayload.parse({ userId: anUserId, ...aBody })
      const aCommand = createRegisterTimeEntryCommand(uuidv7(), aPayload)
      const anHandler = new RegisterTimeEntryHandler(module[symRepository])
      const aResult = await anHandler.execute(aCommand)
      return c.json({ ...aResult }, 201)
    })
}
