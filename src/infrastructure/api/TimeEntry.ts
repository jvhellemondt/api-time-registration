import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { randomUUID } from 'node:crypto'
import { Hono } from 'hono'
import { RegisterTimeEntry } from '@/domain/TimeEntry/RegisterTimeEntry.command.ts'
import { RegisterTimeEntryPayload } from '@/usecases/commands/RegisterTimeEntry/ports/inbound.ts'

export default function TimeEntryApi(aCommandBus: CommandBus, _aQueryBus: QueryBus) {
  return new Hono()
    .get('/health', c => c.text('HEALTH OK'))
  // get('/listTimeEntries', async c => new ListTimeEntriesHandler(this.queryBus).handle(c))
    .post('/registerTimeEntry', async (c) => {
      const aBody = await c.req.json()
      const aPayload = RegisterTimeEntryPayload.parse(aBody)
      const aCommand = RegisterTimeEntry(randomUUID(), aPayload)
      const aResult = await aCommandBus.execute(aCommand)
      return c.json({ ...aResult }, 201)
    })
}
