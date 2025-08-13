import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import type { RegisterTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { Hono } from 'hono'
import { v7 as uuidv7 } from 'uuid'
import { createRegisterTimeEntryCommand } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { registerTimeEntryCommandPayload } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.ports'
import { createListTimeEntriesByUserIdQuery } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from '@/usecases/queries/ListTimeEntries/ports/inbound'

export default function TimeEntryApi() {
  return new Hono()
    .get('/health', c => c.text('HEALTH OK'))
    .get('/list-time-entries', async (c) => {
      const anUserId = '01981dd1-2567-720c-9da6-a33e79275bb1'
      const aPayload = listTimeEntriesByUserIdPayload.parse({ userId: anUserId })
      const aQuery = createListTimeEntriesByUserIdQuery(aPayload)
      
      const aResult = await aQueryBus.execute(aQuery)
      // @ts-expect-error queryBus execute should be generic
      return c.json(aResult, 200)
    })
    .post('/register-time-entry', async (c) => {
      const aBody = await c.req.json<RegisterTimeEntryCommandPayload>()
      const aPayload = registerTimeEntryCommandPayload.parse(aBody)
      const aCommand = createRegisterTimeEntryCommand(uuidv7(), aPayload)
      const aResult = await aCommandBus.execute(aCommand)
      return c.json({ ...aResult }, 201)
    })
}
