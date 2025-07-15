import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { Hono } from 'hono'
import { RegisterTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'
import { registerTimeEntry } from '@/usecases/commands/RegisterTimeEntry/RegisterTimeEntry.command'
import { listTimeEntriesByUserId } from '@/usecases/queries/ListTimeEntries/ListTimeEntries.query'
import { listTimeEntriesByUserIdPayload } from '@/usecases/queries/ListTimeEntries/ports/inbound'

export default function TimeEntryApi(aCommandBus: CommandBus, aQueryBus: QueryBus) {
  return new Hono()
    .get('/listTimeEntries/:userId', async (c) => {
      const anUserId = c.req.param('userId')
      const aPayload = listTimeEntriesByUserIdPayload.parse({ userId: anUserId })
      const aQuery = listTimeEntriesByUserId(aPayload)
      const aResult = await aQueryBus.execute(aQuery)
      // @ts-expect-error queryBus execute should be generic
      return c.json(aResult, 200)
    })
    .post('/registerTimeEntry', async (c) => {
      const aBody = await c.req.json()
      const aPayload = RegisterTimeEntryPayload.parse(aBody)
      const aCommand = registerTimeEntry(randomUUID(), aPayload)
      const aResult = await aCommandBus.execute(aCommand)
      return c.json({ ...aResult }, 201)
    })
}
