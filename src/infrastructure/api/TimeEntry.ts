import type { CommandBus, QueryBus } from '@jvhellemondt/arts-and-crafts.ts'
import { Hono } from 'hono'

export default function TimeEntryApi(_commandBus: CommandBus, _queryBus: QueryBus) {
  const app = new Hono()
  app
    .get('/health', c => c.text('HEALTH OK'))
  // get('/listTimeEntries', async c => new ListTimeEntriesHandler(this.queryBus).handle(c))
  // post('/registerTimeEntry', async c => new RegisterTimeEntryHandler(this.commandBus).handle(c))

  return app
}
